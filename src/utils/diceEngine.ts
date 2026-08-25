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

  // Geometria compartilhada D10
  private d10Geometry: THREE.BufferGeometry
  private d10Shape: CANNON.ConvexPolyhedron
  private d10FaceNormals: { value: number; localNormal: THREE.Vector3 }[]

  constructor(options: DiceEngineOptions) {
    this.canvas = options.canvas
    this.onSettleCallback = options.onSettle

    // Configuração de Three.js Scene
    this.scene = new THREE.Scene()

    // Câmera com ângulo cinematográfico de cima para baixo
    const width = this.canvas.clientWidth || window.innerWidth
    const height = this.canvas.clientHeight || window.innerHeight
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    this.camera.position.set(0, 18, 12)
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
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Luzes dramáticas / góticas
    this.setupLighting()

    // Configuração de Cannon.js World
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -35, 0) // Gravidade ágil e pesada
    })
    this.world.defaultContactMaterial.friction = 0.3
    this.world.defaultContactMaterial.restitution = 0.55 // Quique gostoso

    // Limites de mesa (Piso e 4 paredes invisíveis)
    this.setupBoundaries()

    // Inicialização da Geometria do D10
    const { geometry, shape, faceNormals } = this.buildD10GeometryAndPhysics()
    this.d10Geometry = geometry
    this.d10Shape = shape
    this.d10FaceNormals = faceNormals

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
    const vol = Math.min(Math.max((velocity - 1) / 15, 0.05), 0.4)
    if (vol <= 0.05) return

    try {
      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()
      const filter = this.audioCtx.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(140 + Math.random() * 80, this.audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.06)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800 + Math.random() * 400, this.audioCtx.currentTime)

      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.07)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.audioCtx.destination)

      osc.start()
      osc.stop(this.audioCtx.currentTime + 0.07)
    } catch {
      // Audio fallback silencioso
    }
  }

  private setupLighting() {
    // Luz ambiente suave
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    this.scene.add(ambientLight)

    // Luz principal com sombras
    const dirLight = new THREE.DirectionalLight(0xfff2e6, 1.8)
    dirLight.position.set(10, 25, 12)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    dirLight.shadow.camera.near = 0.5
    dirLight.shadow.camera.far = 50
    dirLight.shadow.camera.left = -15
    dirLight.shadow.camera.right = 15
    dirLight.shadow.camera.top = 15
    dirLight.shadow.camera.bottom = -15
    dirLight.shadow.radius = 2
    this.scene.add(dirLight)

    // Luz de preenchimento carmesim / gótica
    const redLight = new THREE.DirectionalLight(0xaa2233, 0.8)
    redLight.position.set(-12, 10, -8)
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
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.4 })
    const floorMesh = new THREE.Mesh(floorGeo, floorMat)
    floorMesh.rotation.x = -Math.PI / 2
    floorMesh.receiveShadow = true
    this.scene.add(floorMesh)

    // Paredes invisíveis ao redor da tela (para os dados não saírem da visualização)
    const wallHalfWidth = 14
    const wallHalfHeight = 10
    const wallHeight = 20

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
   * Constrói o D10 (Trapezoedro Pentagonal) matematicamente
   */
  private buildD10GeometryAndPhysics() {
    const scale = 1.3
    const h = 1.5 * scale
    const r = 1.6 * scale
    const h0 = 0.22 * scale

    // 12 Vértices do D10
    const vertices: THREE.Vector3[] = []
    // 0: Apex Superior
    vertices.push(new THREE.Vector3(0, h, 0))
    // 1: Apex Inferior
    vertices.push(new THREE.Vector3(0, -h, 0))

    // 10 Vértices do Equador (alternando ligeiramente acima e abaixo do plano central)
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5
      const y = i % 2 === 0 ? h0 : -h0
      const x = r * Math.cos(angle)
      const z = r * Math.sin(angle)
      vertices.push(new THREE.Vector3(x, y, z))
    }

    // Índices de vértices no equador são 2 .. 11
    // As 10 faces são papagaios (kites) quadriláteros formados por 2 triângulos cada:
    // Valores de 1 a 10 atribuídos às 10 faces
    // Padrão oposto V5/D10: a soma das faces opostas é 11 (1 oposto a 10, 2 oposto a 9, etc)
    const upperKiteIndices = [
      { face: 10, vTop: 0, vLeft: 11, vCenter: 2, vRight: 3 },
      { face: 2,  vTop: 0, vLeft: 3,  vCenter: 4, vRight: 5 },
      { face: 8,  vTop: 0, vLeft: 5,  vCenter: 6, vRight: 7 },
      { face: 4,  vTop: 0, vLeft: 7,  vCenter: 8, vRight: 9 },
      { face: 6,  vTop: 0, vLeft: 9,  vCenter: 10, vRight: 11 }
    ]

    const lowerKiteIndices = [
      { face: 1, vBot: 1, vLeft: 2,  vCenter: 3, vRight: 4 },
      { face: 9, vBot: 1, vLeft: 4,  vCenter: 5, vRight: 6 },
      { face: 3, vBot: 1, vLeft: 6,  vCenter: 7, vRight: 8 },
      { face: 7, vBot: 1, vLeft: 8,  vCenter: 9, vRight: 10 },
      { face: 5, vBot: 1, vLeft: 10, vCenter: 11, vRight: 2 }
    ]

    const positions: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const faceNormalsList: { value: number; localNormal: THREE.Vector3 }[] = []

    // Auxiliar para adicionar um kite quadrilátero com textura mapeada
    const addKite = (value: number, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, p4: THREE.Vector3) => {
      // Dois triângulos: (p1, p2, p3) e (p1, p3, p4)
      const vA = new THREE.Vector3().subVectors(p2, p1)
      const vB = new THREE.Vector3().subVectors(p4, p1)
      const norm = new THREE.Vector3().crossVectors(vA, vB).normalize()

      // Inverter se normal estiver apontando para dentro
      const center = new THREE.Vector3().add(p1).add(p2).add(p3).add(p4).multiplyScalar(0.25)
      if (norm.dot(center) < 0) norm.negate()

      faceNormalsList.push({ value, localNormal: norm.clone() })

      // Triângulo 1: p1, p2, p3
      positions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      uvs.push(0.5, 1.0, 0.0, 0.5, 0.5, 0.0)

      // Triângulo 2: p1, p3, p4
      positions.push(p1.x, p1.y, p1.z, p3.x, p3.y, p3.z, p4.x, p4.y, p4.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      uvs.push(0.5, 1.0, 0.5, 0.0, 1.0, 0.5)
    }

    // Processar faces superiores
    for (const kite of upperKiteIndices) {
      const pTop = vertices[kite.vTop]
      const pLeft = vertices[kite.vLeft]
      const pCenter = vertices[kite.vCenter]
      const pRight = vertices[kite.vRight]
      addKite(kite.face, pTop, pLeft, pCenter, pRight)
    }

    // Processar faces inferiores
    for (const kite of lowerKiteIndices) {
      const pBot = vertices[kite.vBot]
      const pLeft = vertices[kite.vLeft]
      const pCenter = vertices[kite.vCenter]
      const pRight = vertices[kite.vRight]
      addKite(kite.face, pBot, pRight, pCenter, pLeft)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

    // Cannon.js ConvexPolyhedron para colisão física precisa
    const cannonPoints = vertices.map(v => new CANNON.Vec3(v.x, v.y, v.z))
    const cannonFaces: number[][] = []

    // 5 faces superiores quadriláteras
    for (const k of upperKiteIndices) {
      cannonFaces.push([k.vTop, k.vLeft, k.vCenter, k.vRight])
    }
    // 5 faces inferiores quadriláteras
    for (const k of lowerKiteIndices) {
      cannonFaces.push([k.vBot, k.vRight, k.vCenter, k.vLeft])
    }

    const shape = new CANNON.ConvexPolyhedron({
      vertices: cannonPoints,
      faces: cannonFaces
    })

    return { geometry, shape, faceNormals: faceNormalsList }
  }

  /**
   * Gera a textura de face de dado com estilo gótico de Vampiro V5
   */
  private createDiceMaterial(type: 'regular' | 'hunger'): THREE.Material[] | THREE.Material {
    // Textura de canvas procedural de alta definição
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Fundo do dado
    if (type === 'regular') {
      // Preto Ônix com bordas marmorizadas escuras
      const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250)
      grad.addColorStop(0, '#1c1b22')
      grad.addColorStop(0.7, '#111015')
      grad.addColorStop(1, '#050508')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 512, 512)

      // Borda decorativa dourada sutil
      ctx.strokeStyle = '#c5a059'
      ctx.lineWidth = 14
      ctx.strokeRect(20, 20, 472, 472)
    } else {
      // Vermelho Carmesim Sangue / Fome
      const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 250)
      grad.addColorStop(0, '#a31010')
      grad.addColorStop(0.7, '#6b0000')
      grad.addColorStop(1, '#3a0000')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 512, 512)

      // Borda avermelhada viva
      ctx.strokeStyle = '#ff3b3b'
      ctx.lineWidth = 14
      ctx.strokeRect(20, 20, 472, 472)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.anisotropy = 4

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: type === 'regular' ? 0.25 : 0.35,
      metalness: type === 'regular' ? 0.4 : 0.2,
      bumpScale: 0.05
    })
  }

  /**
   * Cria os números/símbolos projetados em 3D ou Canvas em cada face
   */
  private createNumberOverlayCanvas(value: number, type: 'regular' | 'hunger'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, 256, 256)

    // Fundo do kite
    if (type === 'regular') {
      ctx.fillStyle = '#16151a'
      ctx.beginPath()
      ctx.moveTo(128, 10)
      ctx.lineTo(240, 110)
      ctx.lineTo(128, 240)
      ctx.lineTo(16, 110)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = '#d4af37'
      ctx.lineWidth = 6
      ctx.stroke()

      // Tipografia Dourada
      ctx.fillStyle = '#ffd700'
    } else {
      // Hunger
      ctx.fillStyle = '#780a0a'
      ctx.beginPath()
      ctx.moveTo(128, 10)
      ctx.lineTo(240, 110)
      ctx.lineTo(128, 240)
      ctx.lineTo(16, 110)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = '#ff4d4d'
      ctx.lineWidth = 6
      ctx.stroke()

      // Tipografia Branca / Vermelha
      ctx.fillStyle = '#ffffff'
    }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'bold 88px "Cinzel", "Times New Roman", serif'

    if (value === 10) {
      if (type === 'hunger') {
        ctx.fillStyle = '#ff3333'
        ctx.fillText('10☥', 128, 130)
      } else {
        ctx.fillText('10', 128, 130)
      }
    } else if (value === 1 && type === 'hunger') {
      ctx.fillStyle = '#ff1111'
      ctx.font = 'bold 96px serif'
      ctx.fillText('1☠', 128, 130)
    } else {
      ctx.fillText(value.toString(), 128, 130)
    }

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }

  /**
   * Lança uma nova parada de dados (Dados Normais + Dados de Fome)
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

    // Criar material base
    const material = this.createDiceMaterial(type)
    const mesh = new THREE.Mesh(this.d10Geometry.clone(), material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Adicionar sprites/texturas nas 10 faces para visualização cristalina do número
    for (const fn of this.d10FaceNormals) {
      const numberTex = this.createNumberOverlayCanvas(fn.value, type)
      const spriteMat = new THREE.SpriteMaterial({
        map: numberTex,
        transparent: true,
        depthTest: true
      })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.scale.set(1.4, 1.4, 1.4)
      const offsetPos = fn.localNormal.clone().multiplyScalar(0.72)
      sprite.position.copy(offsetPos)
      mesh.add(sprite)
    }

    this.scene.add(mesh)

    // Criar Corpo Rígido no Cannon-es
    const body = new CANNON.Body({
      mass: 1.5,
      shape: this.d10Shape,
      linearDamping: 0.15,
      angularDamping: 0.15
    })

    // Posição inicial: caindo do alto com espalhamento circular
    const angle = (index / Math.max(total, 1)) * Math.PI * 2
    const spreadRadius = Math.min(2 + total * 0.4, 6)
    const startX = Math.cos(angle) * spreadRadius + (Math.random() - 0.5) * 1.5
    const startZ = Math.sin(angle) * spreadRadius + (Math.random() - 0.5) * 1.5 + 4
    const startY = 12 + Math.random() * 4 + index * 0.3

    body.position.set(startX, startY, startZ)

    // Impulso inicial em direção ao centro da mesa
    const forceX = -startX * (2.5 + Math.random() * 2)
    const forceZ = -(startZ - 2) * (2.5 + Math.random() * 2)
    const forceY = -(8 + Math.random() * 6)
    body.velocity.set(forceX, forceY, forceZ)

    // Torque / Rotação angular violenta para rolar de forma realista
    body.angularVelocity.set(
      (Math.random() - 0.5) * 45,
      (Math.random() - 0.5) * 45,
      (Math.random() - 0.5) * 45
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
   * Calcula qual face está apontando para cima (em direção ao eixo Y positivo do mundo)
   */
  private getUpwardFace(die: ActiveDie): number {
    const worldUp = new THREE.Vector3(0, 1, 0)
    let bestValue = 1
    let maxDot = -Infinity

    // Obter rotação atual do dado
    const dieQuat = die.mesh.quaternion

    for (const fn of die.faceNormals) {
      // Transformar normal local da face para o espaço do mundo
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
   * Limpa todos os dados da mesa
   */
  public clearDice() {
    for (const die of this.dice) {
      this.scene.remove(die.mesh)
      die.mesh.geometry.dispose()
      if (Array.isArray(die.mesh.material)) {
        die.mesh.material.forEach(m => m.dispose())
      } else {
        die.mesh.material.dispose()
      }
      this.world.removeBody(die.body)
    }
    this.dice = []
    this.isRolling = false
  }

  private animate() {
    this.animFrameId = requestAnimationFrame(this.animate)

    // Avançar física do Cannon-es
    this.world.step(1 / 60)

    let allSettled = this.dice.length > 0

    // Sincronizar malhas Three.js com os corpos Cannon-es
    for (const die of this.dice) {
      die.mesh.position.copy(die.body.position as any)
      die.mesh.quaternion.copy(die.body.quaternion as any)

      // Checar se o dado parou de se mover
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

    // Se todos pararam e estávamos rolando, disparar callback de resultado!
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
    this.renderer.dispose()
  }
}
