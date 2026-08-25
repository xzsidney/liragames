import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export interface DieRollResult {
  id: string
  type: 'regular' | 'hunger'
  value: number
  isSuccess: boolean
  isCrit: boolean
  isBestialFailure: boolean
}

export interface DiceEngineOptions {
  canvas: HTMLCanvasElement
  onSettle?: (results: DieRollResult[]) => void
}

export interface ActiveDie {
  id: string
  type: 'regular' | 'hunger'
  mesh: THREE.Mesh
  body: CANNON.Body
  faceNormals: { value: number; normal: THREE.Vector3 }[]
  settled: boolean
  finalValue?: number
}

export class Dice3DEngine {
  private canvas: HTMLCanvasElement
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer
  private world: CANNON.World
  private dice: ActiveDie[] = []
  private isRolling = false
  private animFrameId: number | null = null
  private onSettleCallback?: (results: DieRollResult[]) => void
  private audioCtx: AudioContext | null = null

  // Geometria e Física D10
  private d10Geometry: THREE.BufferGeometry
  private d10Shape: CANNON.ConvexPolyhedron
  private d10FaceNormals: { value: number; localNormal: THREE.Vector3 }[]

  // Materiais texturizados compartilhados
  private regularMaterial: THREE.MeshStandardMaterial
  private hungerMaterial: THREE.MeshStandardMaterial

  constructor(options: DiceEngineOptions) {
    this.canvas = options.canvas
    this.onSettleCallback = options.onSettle

    // Configuração de Three.js Scene
    this.scene = new THREE.Scene()

    // Câmera com ângulo cinematográfico
    const width = this.canvas.clientWidth || window.innerWidth
    const height = this.canvas.clientHeight || window.innerHeight
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    this.camera.position.set(0, 20, 14)
    this.camera.lookAt(0, 0, 0)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    // Luzes dramáticas / góticas
    this.setupLighting()

    // Configuração de Cannon.js World
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -38, 0)
    })
    this.world.defaultContactMaterial.friction = 0.35
    this.world.defaultContactMaterial.restitution = 0.5

    // Limites de mesa (Piso e 4 paredes invisíveis)
    this.setupBoundaries()

    // Inicialização da Geometria do D10
    const { geometry, shape, faceNormals } = this.buildD10GeometryAndPhysics()
    this.d10Geometry = geometry
    this.d10Shape = shape
    this.d10FaceNormals = faceNormals

    // Criar texturas de alta definição (Atlas UV completo)
    this.regularMaterial = this.buildDiceAtlasMaterial('regular')
    this.hungerMaterial = this.buildDiceAtlasMaterial('hunger')

    // Iniciar loop de animação
    this.animate = this.animate.bind(this)
    this.animate()

    // Listener de redimensionamento
    window.addEventListener('resize', this.onWindowResize.bind(this))
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }

  private playClackSound(velocity: number) {
    if (!this.audioCtx) return
    const vol = Math.min(Math.max((velocity - 1) / 15, 0.05), 0.35)
    if (vol <= 0.05) return

    try {
      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()
      const filter = this.audioCtx.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(160 + Math.random() * 90, this.audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(35, this.audioCtx.currentTime + 0.06)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(900 + Math.random() * 500, this.audioCtx.currentTime)

      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.07)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.audioCtx.destination)

      osc.start()
      osc.stop(this.audioCtx.currentTime + 0.07)
    } catch {
      // Audio fallback
    }
  }

  private setupLighting() {
    // Luz ambiente suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85)
    this.scene.add(ambientLight)

    // Luz principal com sombras
    const dirLight = new THREE.DirectionalLight(0xfff6ea, 2.0)
    dirLight.position.set(12, 28, 14)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    dirLight.shadow.camera.near = 0.5
    dirLight.shadow.camera.far = 60
    dirLight.shadow.camera.left = -16
    dirLight.shadow.camera.right = 16
    dirLight.shadow.camera.top = 16
    dirLight.shadow.camera.bottom = -16
    dirLight.shadow.radius = 1.5
    this.scene.add(dirLight)

    // Luz de preenchimento carmesim / gótica
    const redLight = new THREE.DirectionalLight(0xcc2233, 1.0)
    redLight.position.set(-14, 12, -10)
    this.scene.add(redLight)
  }

  private setupBoundaries() {
    // Piso de feltro / mesa
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({ mass: 0, shape: floorShape })
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    this.world.addBody(floorBody)

    // Three.js Shadow Receiver Plane
    const floorGeo = new THREE.PlaneGeometry(60, 60)
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.45 })
    const floorMesh = new THREE.Mesh(floorGeo, floorMat)
    floorMesh.rotation.x = -Math.PI / 2
    floorMesh.receiveShadow = true
    this.scene.add(floorMesh)

    // Paredes invisíveis ao redor da tela (para os dados não saírem)
    const wallHalfWidth = 14
    const wallHalfHeight = 10
    const wallHeight = 25

    const createWall = (x: number, y: number, z: number, q: CANNON.Quaternion) => {
      const wallShape = new CANNON.Plane()
      const wallBody = new CANNON.Body({ mass: 0, shape: wallShape, position: new CANNON.Vec3(x, y, z) })
      wallBody.quaternion.copy(q)
      this.world.addBody(wallBody)
    }

    // Parede Norte (Z-)
    const qNorth = new CANNON.Quaternion()
    createWall(0, wallHeight / 2, -wallHalfHeight, qNorth)

    // Parede Sul (Z+)
    const qSouth = new CANNON.Quaternion()
    qSouth.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI)
    createWall(0, wallHeight / 2, wallHalfHeight, qSouth)

    // Parede Leste (X+)
    const qEast = new CANNON.Quaternion()
    qEast.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2)
    createWall(wallHalfWidth, wallHeight / 2, 0, qEast)

    // Parede Oeste (X-)
    const qWest = new CANNON.Quaternion()
    qWest.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2)
    createWall(-wallHalfWidth, wallHeight / 2, 0, qWest)
  }

  /**
   * Constrói o D10 com UVs perfeitas mapeadas no Atlas de 10 faces
   */
  private buildD10GeometryAndPhysics() {
    const scale = 1.35
    const h = 1.5 * scale
    const r = 1.55 * scale
    const h0 = 0.24 * scale

    // 12 Vértices do D10
    const vertices: THREE.Vector3[] = []
    // 0: Apex Superior
    vertices.push(new THREE.Vector3(0, h, 0))
    // 1: Apex Inferior
    vertices.push(new THREE.Vector3(0, -h, 0))

    // 10 Vértices do Equador
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5
      const y = i % 2 === 0 ? h0 : -h0
      const x = r * Math.cos(angle)
      const z = r * Math.sin(angle)
      vertices.push(new THREE.Vector3(x, y, z))
    }

    // Definição das 10 faces (5 superiores, 5 inferiores)
    // Padrão oposto V5: 10 oposto a 1, 8 oposto a 3, etc.
    const upperKites = [
      { face: 10, col: 0, row: 0, vTop: 0, vLeft: 11, vCenter: 2, vRight: 3 },
      { face: 2,  col: 1, row: 0, vTop: 0, vLeft: 3,  vCenter: 4, vRight: 5 },
      { face: 8,  col: 2, row: 0, vTop: 0, vLeft: 5,  vCenter: 6, vRight: 7 },
      { face: 4,  col: 3, row: 0, vTop: 0, vLeft: 7,  vCenter: 8, vRight: 9 },
      { face: 6,  col: 4, row: 0, vTop: 0, vLeft: 9,  vCenter: 10, vRight: 11 }
    ]

    const lowerKites = [
      { face: 1, col: 0, row: 1, vBot: 1, vLeft: 2,  vCenter: 3, vRight: 4 },
      { face: 9, col: 1, row: 1, vBot: 1, vLeft: 4,  vCenter: 5, vRight: 6 },
      { face: 3, col: 2, row: 1, vBot: 1, vLeft: 6,  vCenter: 7, vRight: 8 },
      { face: 7, col: 3, row: 1, vBot: 1, vLeft: 8,  vCenter: 9, vRight: 10 },
      { face: 5, col: 4, row: 1, vBot: 1, vLeft: 10, vCenter: 11, vRight: 2 }
    ]

    const positions: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const faceNormalsList: { value: number; localNormal: THREE.Vector3 }[] = []
    const cannonFaces: number[][] = []

    // Helper de UV no Atlas (Grade de 5 colunas x 2 linhas)
    const getUV = (col: number, row: number, localX: number, localY: number) => {
      const u = (col + localX) / 5
      const v = 1 - (row + (1 - localY)) / 2
      return [u, v]
    }

    // Processar Faces Superiores
    for (const kite of upperKites) {
      const pTop = vertices[kite.vTop]
      const pLeft = vertices[kite.vLeft]
      const pCenter = vertices[kite.vCenter]
      const pRight = vertices[kite.vRight]

      // Normal do kite
      const vA = new THREE.Vector3().subVectors(pLeft, pTop)
      const vB = new THREE.Vector3().subVectors(pRight, pTop)
      let norm = new THREE.Vector3().crossVectors(vA, vB).normalize()

      // Garantir que a normal aponte para fora do poliedro
      const faceCenter = new THREE.Vector3().add(pTop).add(pLeft).add(pCenter).add(pRight).multiplyScalar(0.25)
      if (norm.dot(faceCenter) < 0) {
        norm.negate()
      }

      faceNormalsList.push({ value: kite.face, localNormal: norm.clone() })

      // Triângulo 1 (Top, Left, Center)
      positions.push(pTop.x, pTop.y, pTop.z, pLeft.x, pLeft.y, pLeft.z, pCenter.x, pCenter.y, pCenter.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      const uvTop = getUV(kite.col, kite.row, 0.5, 0.98)
      const uvLeft = getUV(kite.col, kite.row, 0.05, 0.5)
      const uvCenter = getUV(kite.col, kite.row, 0.5, 0.02)
      const uvRight = getUV(kite.col, kite.row, 0.95, 0.5)

      uvs.push(uvTop[0], uvTop[1], uvLeft[0], uvLeft[1], uvCenter[0], uvCenter[1])

      // Triângulo 2 (Top, Center, Right)
      positions.push(pTop.x, pTop.y, pTop.z, pCenter.x, pCenter.y, pCenter.z, pRight.x, pRight.y, pRight.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      uvs.push(uvTop[0], uvTop[1], uvCenter[0], uvCenter[1], uvRight[0], uvRight[1])

      // Cannon.js Convex Face (Ordenação CCW para fora)
      cannonFaces.push([kite.vTop, kite.vRight, kite.vCenter, kite.vLeft])
    }

    // Processar Faces Inferiores
    for (const kite of lowerKites) {
      const pBot = vertices[kite.vBot]
      const pLeft = vertices[kite.vLeft]
      const pCenter = vertices[kite.vCenter]
      const pRight = vertices[kite.vRight]

      const vA = new THREE.Vector3().subVectors(pRight, pBot)
      const vB = new THREE.Vector3().subVectors(pLeft, pBot)
      let norm = new THREE.Vector3().crossVectors(vA, vB).normalize()

      const faceCenter = new THREE.Vector3().add(pBot).add(pLeft).add(pCenter).add(pRight).multiplyScalar(0.25)
      if (norm.dot(faceCenter) < 0) {
        norm.negate()
      }

      faceNormalsList.push({ value: kite.face, localNormal: norm.clone() })

      // Triângulo 1 (Bot, Right, Center)
      positions.push(pBot.x, pBot.y, pBot.z, pRight.x, pRight.y, pRight.z, pCenter.x, pCenter.y, pCenter.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      const uvBot = getUV(kite.col, kite.row, 0.5, 0.98)
      const uvRight = getUV(kite.col, kite.row, 0.95, 0.5)
      const uvCenter = getUV(kite.col, kite.row, 0.5, 0.02)
      const uvLeft = getUV(kite.col, kite.row, 0.05, 0.5)

      uvs.push(uvBot[0], uvBot[1], uvRight[0], uvRight[1], uvCenter[0], uvCenter[1])

      // Triângulo 2 (Bot, Center, Left)
      positions.push(pBot.x, pBot.y, pBot.z, pCenter.x, pCenter.y, pCenter.z, pLeft.x, pLeft.y, pLeft.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      uvs.push(uvBot[0], uvBot[1], uvCenter[0], uvCenter[1], uvLeft[0], uvLeft[1])

      // Cannon.js Convex Face (Ordenação CCW para fora)
      cannonFaces.push([kite.vBot, kite.vLeft, kite.vCenter, kite.vRight])
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

    // Cannon.js Convex Body
    const cannonPoints = vertices.map(v => new CANNON.Vec3(v.x, v.y, v.z))
    const shape = new CANNON.ConvexPolyhedron({
      vertices: cannonPoints,
      faces: cannonFaces
    })

    return { geometry, shape, faceNormals: faceNormalsList }
  }

  /**
   * Constrói uma textura Atlas com todas as 10 faces desenhadas perfeitamente
   */
  private buildDiceAtlasMaterial(type: 'regular' | 'hunger'): THREE.MeshStandardMaterial {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    const cellW = 1024 / 5
    const cellH = 512 / 2

    // Preencher fundo geral
    ctx.fillStyle = type === 'regular' ? '#0d0d10' : '#450404'
    ctx.fillRect(0, 0, 1024, 512)

    // Mapa de valores nas 10 células
    const faceMap = [
      [10, 2, 8, 4, 6], // Linha 0 (Faces superiores)
      [1, 9, 3, 7, 5]   // Linha 1 (Faces inferiores)
    ]

    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 5; c++) {
        const val = faceMap[r][c]
        const ox = c * cellW
        const oy = r * cellH

        // Desenhar kite com gradiente
        ctx.save()
        ctx.translate(ox, oy)

        const grad = ctx.createRadialGradient(cellW / 2, cellH / 2, 20, cellW / 2, cellH / 2, cellW * 0.6)
        if (type === 'regular') {
          grad.addColorStop(0, '#222129')
          grad.addColorStop(0.7, '#121117')
          grad.addColorStop(1, '#08080a')
        } else {
          grad.addColorStop(0, '#9e1111')
          grad.addColorStop(0.7, '#6b0000')
          grad.addColorStop(1, '#380000')
        }

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(cellW / 2, 4)
        ctx.lineTo(cellW - 6, cellH / 2)
        ctx.lineTo(cellW / 2, cellH - 4)
        ctx.lineTo(6, cellH / 2)
        ctx.closePath()
        ctx.fill()

        // Borda dourada ou vermelha
        ctx.strokeStyle = type === 'regular' ? '#d4af37' : '#ff4444'
        ctx.lineWidth = 6
        ctx.stroke()

        // Borda interna decorativa
        ctx.strokeStyle = type === 'regular' ? 'rgba(212, 175, 55, 0.4)' : 'rgba(255, 100, 100, 0.4)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(cellW / 2, 16)
        ctx.lineTo(cellW - 18, cellH / 2)
        ctx.lineTo(cellW / 2, cellH - 16)
        ctx.lineTo(18, cellH / 2)
        ctx.closePath()
        ctx.stroke()

        // Tipografia
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = 'bold 74px "Cinzel", "Georgia", serif'

        if (type === 'regular') {
          ctx.fillStyle = '#ffdf66'
          ctx.shadowColor = '#000000'
          ctx.shadowBlur = 6
          if (val === 10) {
            ctx.fillText('10☥', cellW / 2, cellH / 2 + 4)
          } else {
            ctx.fillText(val.toString(), cellW / 2, cellH / 2 + 4)
          }
        } else {
          // Hunger Dice
          ctx.shadowColor = '#000000'
          ctx.shadowBlur = 8
          if (val === 10) {
            ctx.fillStyle = '#ff6b6b'
            ctx.fillText('10☥', cellW / 2, cellH / 2 + 4)
          } else if (val === 1) {
            ctx.fillStyle = '#ff2222'
            ctx.font = 'bold 78px serif'
            ctx.fillText('1☠', cellW / 2, cellH / 2 + 4)
          } else if (val >= 6) {
            ctx.fillStyle = '#ffffff'
            ctx.fillText(val.toString(), cellW / 2, cellH / 2 + 4)
          } else {
            ctx.fillStyle = 'rgba(255, 200, 200, 0.7)'
            ctx.fillText(val.toString(), cellW / 2, cellH / 2 + 4)
          }
        }

        ctx.restore()
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 4

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: type === 'regular' ? 0.3 : 0.35,
      metalness: type === 'regular' ? 0.35 : 0.2
    })
  }

  /**
   * Lança uma nova parada de dados
   */
  public rollDice(regularCount: number, hungerCount: number) {
    this.initAudio()
    this.clearDice()

    this.isRolling = true
    const totalDice = regularCount + hungerCount
    const diceList: ActiveDie[] = []

    let index = 0

    // Criar dados normais
    for (let i = 0; i < regularCount; i++) {
      const die = this.spawnDie('regular', index++, totalDice)
      diceList.push(die)
    }

    // Criar dados de fome
    for (let i = 0; i < hungerCount; i++) {
      const die = this.spawnDie('hunger', index++, totalDice)
      diceList.push(die)
    }

    this.dice = diceList
  }

  private spawnDie(type: 'regular' | 'hunger', index: number, total: number): ActiveDie {
    const id = `die_${Date.now()}_${index}`

    const material = type === 'regular' ? this.regularMaterial : this.hungerMaterial
    const mesh = new THREE.Mesh(this.d10Geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    this.scene.add(mesh)

    // Corpo Rígido no Cannon-es
    const body = new CANNON.Body({
      mass: 1.5,
      shape: this.d10Shape,
      linearDamping: 0.15,
      angularDamping: 0.15
    })

    // Posição inicial: caindo do alto espalhados
    const angle = (index / Math.max(total, 1)) * Math.PI * 2
    const spreadRadius = Math.min(1.5 + total * 0.35, 5.5)
    const startX = Math.cos(angle) * spreadRadius + (Math.random() - 0.5) * 1.5
    const startZ = Math.sin(angle) * spreadRadius + (Math.random() - 0.5) * 1.5 + 3
    const startY = 11 + Math.random() * 3 + index * 0.25

    body.position.set(startX, startY, startZ)

    // Impulso inicial direcionado ao centro
    const forceX = -startX * (2.2 + Math.random() * 2)
    const forceZ = -(startZ - 1.5) * (2.2 + Math.random() * 2)
    const forceY = -(9 + Math.random() * 5)
    body.velocity.set(forceX, forceY, forceZ)

    // Torque / Rotação angular vigorosa
    body.angularVelocity.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40
    )

    // Som de colisão
    body.addEventListener('collide', (event: any) => {
      const relVel = event.contact.getImpactVelocityAlongNormal()
      this.playClackSound(relVel)
    })

    this.world.addBody(body)

    return {
      id,
      type,
      mesh,
      body,
      faceNormals: this.d10FaceNormals.map(fn => ({
        value: fn.value,
        normal: fn.localNormal.clone()
      })),
      settled: false
    }
  }

  /**
   * Identifica a face voltada para cima
   */
  private getUpwardFace(die: ActiveDie): number {
    const worldUp = new THREE.Vector3(0, 1, 0)
    let bestValue = 1
    let maxDot = -Infinity

    const dieQuat = die.mesh.quaternion

    for (const fn of die.faceNormals) {
      const worldNormal = fn.normal.clone().applyQuaternion(dieQuat).normalize()
      const dot = worldNormal.dot(worldUp)

      if (dot > maxDot) {
        maxDot = dot
        bestValue = fn.value
      }
    }

    return bestValue
  }

  /**
   * Limpa os dados da cena
   */
  public clearDice() {
    for (const die of this.dice) {
      this.scene.remove(die.mesh)
      this.world.removeBody(die.body)
    }
    this.dice = []
    this.isRolling = false
  }

  private animate() {
    this.animFrameId = requestAnimationFrame(this.animate)

    // Avançar simulação física
    this.world.step(1 / 60)

    let allSettled = this.dice.length > 0

    for (const die of this.dice) {
      die.mesh.position.copy(die.body.position as any)
      die.mesh.quaternion.copy(die.body.quaternion as any)

      const vel = die.body.velocity.length()
      const angVel = die.body.angularVelocity.length()

      if (vel < 0.12 && angVel < 0.15 && die.body.position.y < 3) {
        if (!die.settled) {
          die.settled = true
          die.finalValue = this.getUpwardFace(die)
        }
      } else {
        allSettled = false
      }
    }

    if (allSettled && this.isRolling) {
      this.isRolling = false
      this.emitResults()
    }

    this.renderer.render(this.scene, this.camera)
  }

  private emitResults() {
    if (!this.onSettleCallback) return

    const results: DieRollResult[] = this.dice.map(d => {
      const val = d.finalValue || this.getUpwardFace(d)
      return {
        id: d.id,
        type: d.type,
        value: val,
        isSuccess: val >= 6,
        isCrit: val === 10,
        isBestialFailure: d.type === 'hunger' && val === 1
      }
    })

    this.onSettleCallback(results)
  }

  private onWindowResize() {
    if (!this.canvas) return
    const width = this.canvas.clientWidth || window.innerWidth
    const height = this.canvas.clientHeight || window.innerHeight
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId)
    }
    window.removeEventListener('resize', this.onWindowResize.bind(this))
    this.clearDice()
    if (this.audioCtx) {
      this.audioCtx.close()
    }
    this.regularMaterial.dispose()
    this.hungerMaterial.dispose()
    this.renderer.dispose()
  }
}
