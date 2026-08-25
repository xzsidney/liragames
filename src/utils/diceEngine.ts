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

interface FaceData {
  value: number
  normal: THREE.Vector3
}

export interface ActiveDie {
  id: string
  type: 'regular' | 'hunger'
  mesh: THREE.Mesh
  body: CANNON.Body
  faceNormals: FaceData[]
  settled: boolean
  finalValue?: number
  floatingBadge?: THREE.Sprite
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

  // Geometria e Física D10 Monolítica (Multi-material com 10 grupos)
  private d10Geometry: THREE.BufferGeometry
  private d10Shape: CANNON.ConvexPolyhedron
  private d10FaceNormals: FaceData[] = []

  // Materiais das 10 Faces
  private regularMaterials: THREE.MeshStandardMaterial[] = []
  private hungerMaterials: THREE.MeshStandardMaterial[] = []

  constructor(options: DiceEngineOptions) {
    this.canvas = options.canvas
    this.onSettleCallback = options.onSettle

    // Configuração de Three.js Scene
    this.scene = new THREE.Scene()

    // Câmera com perspectiva de cima
    const width = this.canvas.clientWidth || window.innerWidth
    const height = this.canvas.clientHeight || window.innerHeight
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    this.camera.position.set(0, 24, 15)
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

    this.setupLighting()

    // Física Cannon-es
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -36, 0)
    })
    this.world.defaultContactMaterial.friction = 0.35
    this.world.defaultContactMaterial.restitution = 0.5

    this.setupBoundaries()

    // Ordem das 10 faces (5 superiores, 5 inferiores)
    const faceValues = [10, 2, 8, 4, 6, 1, 9, 3, 7, 5]

    // Construção da Geometria Monolítica do D10 com Projeção Conforme
    const { geometry, shape, normals, textPositions } = this.buildD10GeometryAndPhysics(faceValues)
    this.d10Geometry = geometry
    this.d10Shape = shape
    this.d10FaceNormals = normals

    // Criar materiais das 10 faces com alinhamento milimétrico
    this.regularMaterials = faceValues.map((v, i) => this.createFaceMaterial(v, 'regular', textPositions[i]))
    this.hungerMaterials = faceValues.map((v, i) => this.createFaceMaterial(v, 'hunger', textPositions[i]))

    // Loop
    this.animate = this.animate.bind(this)
    this.animate()

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
    const vol = Math.min(Math.max((velocity - 1) / 14, 0.05), 0.35)
    if (vol <= 0.05) return

    try {
      const osc = this.audioCtx.createOscillator()
      const gain = this.audioCtx.createGain()
      const filter = this.audioCtx.createBiquadFilter()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(150 + Math.random() * 90, this.audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(35, this.audioCtx.currentTime + 0.06)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(950 + Math.random() * 500, this.audioCtx.currentTime)

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95)
    this.scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 2.2)
    dirLight.position.set(14, 30, 16)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024
    dirLight.shadow.camera.near = 0.5
    dirLight.shadow.camera.far = 60
    dirLight.shadow.camera.left = -16
    dirLight.shadow.camera.right = 16
    dirLight.shadow.camera.top = 16
    dirLight.shadow.camera.bottom = -16
    this.scene.add(dirLight)

    const gothicRed = new THREE.DirectionalLight(0xcc2233, 1.2)
    gothicRed.position.set(-15, 12, -10)
    this.scene.add(gothicRed)
  }

  private setupBoundaries() {
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({ mass: 0, shape: floorShape })
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    this.world.addBody(floorBody)

    const floorGeo = new THREE.PlaneGeometry(60, 60)
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.45 })
    const floorMesh = new THREE.Mesh(floorGeo, floorMat)
    floorMesh.rotation.x = -Math.PI / 2
    floorMesh.receiveShadow = true
    this.scene.add(floorMesh)

    const wallHalfWidth = 14
    const wallHalfHeight = 10
    const wallHeight = 25

    const createWall = (x: number, y: number, z: number, q: CANNON.Quaternion) => {
      const wallShape = new CANNON.Plane()
      const wallBody = new CANNON.Body({ mass: 0, shape: wallShape, position: new CANNON.Vec3(x, y, z) })
      wallBody.quaternion.copy(q)
      this.world.addBody(wallBody)
    }

    const qNorth = new CANNON.Quaternion()
    createWall(0, wallHeight / 2, -wallHalfHeight, qNorth)

    const qSouth = new CANNON.Quaternion()
    qSouth.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI)
    createWall(0, wallHeight / 2, wallHalfHeight, qSouth)

    const qEast = new CANNON.Quaternion()
    qEast.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2)
    createWall(wallHalfWidth, wallHeight / 2, 0, qEast)

    const qWest = new CANNON.Quaternion()
    qWest.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2)
    createWall(-wallHalfWidth, wallHeight / 2, 0, qWest)
  }

  /**
   * Constrói a geometria 3D do D10 com Projeção Conforme (Zero Distorção UV)
   */
  private buildD10GeometryAndPhysics(faceValues: number[]) {
    const scale = 1.35
    const h = 1.5 * scale
    const r = 1.55 * scale
    const h0 = 0.24 * scale

    // 12 Vértices
    const vertices: THREE.Vector3[] = []
    vertices.push(new THREE.Vector3(0, h, 0))   // 0: Apex Superior
    vertices.push(new THREE.Vector3(0, -h, 0))  // 1: Apex Inferior

    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI) / 5
      const y = i % 2 === 0 ? h0 : -h0
      const x = r * Math.cos(angle)
      const z = r * Math.sin(angle)
      vertices.push(new THREE.Vector3(x, y, z))
    }

    const upperKites = [
      { vApex: 0, vLeft: 11, vCenter: 2, vRight: 3 },
      { vApex: 0, vLeft: 3,  vCenter: 4, vRight: 5 },
      { vApex: 0, vLeft: 5,  vCenter: 6, vRight: 7 },
      { vApex: 0, vLeft: 7,  vCenter: 8, vRight: 9 },
      { vApex: 0, vLeft: 9,  vCenter: 10, vRight: 11 }
    ]

    const lowerKites = [
      { vApex: 1, vLeft: 2,  vCenter: 3, vRight: 4 },
      { vApex: 1, vLeft: 4,  vCenter: 5, vRight: 6 },
      { vApex: 1, vLeft: 6,  vCenter: 7, vRight: 8 },
      { vApex: 1, vLeft: 8,  vCenter: 9, vRight: 10 },
      { vApex: 1, vLeft: 10, vCenter: 11, vRight: 2 }
    ]

    const positions: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const faceNormalsList: FaceData[] = []
    const cannonFaces: number[][] = []
    const textPositions: { x: number; y: number; kitePoly: number[][] }[] = []

    const geometry = new THREE.BufferGeometry()

    let faceIndex = 0

    // Processador com Projeção Conforme Planar Exata
    const addKiteFace = (
      val: number,
      pApex: THREE.Vector3,
      pLeft: THREE.Vector3,
      pCenter: THREE.Vector3,
      pRight: THREE.Vector3,
      cannonIndices: number[]
    ) => {
      // Vetor Normal da Face
      const vA = new THREE.Vector3().subVectors(pLeft, pApex)
      const vB = new THREE.Vector3().subVectors(pRight, pApex)
      let norm = new THREE.Vector3().crossVectors(vA, vB).normalize()

      const fCenter = new THREE.Vector3().add(pApex).add(pLeft).add(pCenter).add(pRight).multiplyScalar(0.25)
      if (norm.dot(fCenter) < 0) norm.negate()

      faceNormalsList.push({ value: val, normal: norm.clone() })

      // Eixo Y no plano da face (do Centro em direção ao Apex)
      const axisY = new THREE.Vector3().subVectors(pApex, pCenter).normalize()
      // Eixo X no plano da face (da Esquerda para a Direita)
      const axisX = new THREE.Vector3().crossVectors(axisY, norm).normalize()
      if (axisX.dot(new THREE.Vector3().subVectors(pRight, pLeft)) < 0) {
        axisX.negate()
      }

      // Projetar os 4 vértices no plano 2D local
      const proj = (p: THREE.Vector3) => {
        const d = new THREE.Vector3().subVectors(p, fCenter)
        return { x: d.dot(axisX), y: d.dot(axisY) }
      }

      const ptApex = proj(pApex)
      const ptLeft = proj(pLeft)
      const ptCenter = proj(pCenter)
      const ptRight = proj(pRight)

      // Bounding box da face
      const minX = Math.min(ptApex.x, ptLeft.x, ptCenter.x, ptRight.x)
      const maxX = Math.max(ptApex.x, ptLeft.x, ptCenter.x, ptRight.x)
      const minY = Math.min(ptApex.y, ptLeft.y, ptCenter.y, ptRight.y)
      const maxY = Math.max(ptApex.y, ptLeft.y, ptCenter.y, ptRight.y)

      const spanX = (maxX - minX) * 1.12
      const spanY = (maxY - minY) * 1.12
      const midX = (minX + maxX) / 2
      const midY = (minY + maxY) / 2

      // Função de mapeamento Conforme para UV [0..1]
      const toUV = (pt: { x: number; y: number }) => {
        const u = (pt.x - midX) / spanX + 0.5
        const v = (pt.y - midY) / spanY + 0.5
        return [u, v]
      }

      const uvA = toUV(ptApex)
      const uvL = toUV(ptLeft)
      const uvC = toUV(ptCenter)
      const uvR = toUV(ptRight)

      // Salvar posição do centróide no canvas 512x512 para desenhar o texto exatamente no centro
      const canvasPt = (uv: number[]) => [uv[0] * 512, (1 - uv[1]) * 512]
      textPositions.push({
        x: 256,
        y: 256,
        kitePoly: [canvasPt(uvA), canvasPt(uvR), canvasPt(uvC), canvasPt(uvL)]
      })

      const startVertex = positions.length / 3

      // Triângulo 1 (Apex, Left, Center)
      positions.push(pApex.x, pApex.y, pApex.z, pLeft.x, pLeft.y, pLeft.z, pCenter.x, pCenter.y, pCenter.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      uvs.push(uvA[0], uvA[1], uvL[0], uvL[1], uvC[0], uvC[1])

      // Triângulo 2 (Apex, Center, Right)
      positions.push(pApex.x, pApex.y, pApex.z, pCenter.x, pCenter.y, pCenter.z, pRight.x, pRight.y, pRight.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      uvs.push(uvA[0], uvA[1], uvC[0], uvC[1], uvR[0], uvR[1])

      geometry.addGroup(startVertex, 6, faceIndex)
      cannonFaces.push(cannonIndices)
      faceIndex++
    }

    // 1. Faces Superiores
    for (let i = 0; i < upperKites.length; i++) {
      const k = upperKites[i]
      addKiteFace(
        faceValues[i],
        vertices[k.vApex],
        vertices[k.vLeft],
        vertices[k.vCenter],
        vertices[k.vRight],
        [k.vApex, k.vRight, k.vCenter, k.vLeft]
      )
    }

    // 2. Faces Inferiores
    for (let i = 0; i < lowerKites.length; i++) {
      const k = lowerKites[i]
      addKiteFace(
        faceValues[i + 5],
        vertices[k.vApex],
        vertices[k.vRight],
        vertices[k.vCenter],
        vertices[k.vLeft],
        [k.vApex, k.vLeft, k.vCenter, k.vRight]
      )
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

    const cannonPoints = vertices.map(v => new CANNON.Vec3(v.x, v.y, v.z))
    const shape = new CANNON.ConvexPolyhedron({
      vertices: cannonPoints,
      faces: cannonFaces
    })

    return { geometry, shape, normals: faceNormalsList, textPositions }
  }

  /**
   * Gera a textura de uma face desenhando o polígono e o texto perfeitamente centralizados
   */
  private createFaceMaterial(
    value: number,
    type: 'regular' | 'hunger',
    meta: { x: number; y: number; kitePoly: number[][] }
  ): THREE.MeshStandardMaterial {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    ctx.save()

    // 1. Fundo da Face
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250)
    if (type === 'regular') {
      grad.addColorStop(0, '#26252e')
      grad.addColorStop(0.65, '#14131a')
      grad.addColorStop(1, '#09080d')
    } else {
      grad.addColorStop(0, '#a81313')
      grad.addColorStop(0.65, '#6e0000')
      grad.addColorStop(1, '#3b0000')
    }
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 512)

    // 2. Traçado do Losango Conforme Exato
    if (meta.kitePoly && meta.kitePoly.length === 4) {
      ctx.beginPath()
      ctx.moveTo(meta.kitePoly[0][0], meta.kitePoly[0][1])
      ctx.lineTo(meta.kitePoly[1][0], meta.kitePoly[1][1])
      ctx.lineTo(meta.kitePoly[2][0], meta.kitePoly[2][1])
      ctx.lineTo(meta.kitePoly[3][0], meta.kitePoly[3][1])
      ctx.closePath()

      ctx.strokeStyle = type === 'regular' ? '#d4af37' : '#ff4444'
      ctx.lineWidth = 14
      ctx.stroke()

      // Borda Interna Fina
      ctx.strokeStyle = type === 'regular' ? 'rgba(212, 175, 55, 0.45)' : 'rgba(255, 120, 120, 0.45)'
      ctx.lineWidth = 4
      ctx.stroke()
    }

    // 3. Tipografia Cinzel Nítida e Proporcional
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)'
    ctx.shadowBlur = 12
    ctx.shadowOffsetY = 4

    const tx = meta.x
    const ty = meta.y

    if (type === 'regular') {
      ctx.fillStyle = '#ffdf66'
      ctx.font = 'bold 150px "Cinzel", "Georgia", serif'

      if (value === 10) {
        ctx.font = 'bold 125px "Cinzel", "Georgia", serif'
        ctx.fillText('10☥', tx, ty)
      } else {
        ctx.fillText(value.toString(), tx, ty)
      }
    } else {
      // Hunger Dice
      if (value === 10) {
        ctx.fillStyle = '#ff6b6b'
        ctx.font = 'bold 125px "Cinzel", "Georgia", serif'
        ctx.fillText('10☥', tx, ty)
      } else if (value === 1) {
        ctx.fillStyle = '#ff2222'
        ctx.font = 'bold 150px serif'
        ctx.fillText('1☠', tx, ty)
      } else if (value >= 6) {
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 150px "Cinzel", "Georgia", serif'
        ctx.fillText(value.toString(), tx, ty)
      } else {
        ctx.fillStyle = 'rgba(255, 210, 210, 0.75)'
        ctx.font = 'bold 150px "Cinzel", "Georgia", serif'
        ctx.fillText(value.toString(), tx, ty)
      }
    }

    ctx.restore()

    const texture = new THREE.CanvasTexture(canvas)
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.anisotropy = 4

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: type === 'regular' ? 0.22 : 0.28,
      metalness: type === 'regular' ? 0.35 : 0.15
    })
  }

  /**
   * Cria um Badge Flutuante em 3D sobre o dado quando ele para
   */
  private createFloatingBadge(value: number, type: 'regular' | 'hunger'): THREE.Sprite {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, 256, 256)

    // Círculo com brilho
    const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120)
    if (type === 'regular') {
      grad.addColorStop(0, value >= 6 ? 'rgba(30, 28, 38, 0.95)' : 'rgba(18, 18, 22, 0.9)')
      grad.addColorStop(1, 'rgba(10, 10, 14, 0.85)')
    } else {
      grad.addColorStop(0, value === 1 ? 'rgba(120, 10, 10, 0.95)' : 'rgba(90, 8, 8, 0.95)')
      grad.addColorStop(1, 'rgba(45, 4, 4, 0.85)')
    }

    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(128, 128, 110, 0, Math.PI * 2)
    ctx.fill()

    // Borda
    ctx.strokeStyle = type === 'regular' 
      ? (value === 10 ? '#ffd700' : value >= 6 ? '#d4af37' : '#666677')
      : (value === 10 ? '#ff4d4d' : value === 1 ? '#ff1111' : '#ff6666')
    ctx.lineWidth = 10
    ctx.stroke()

    // Texto
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = 'bold 110px "Cinzel", serif'
    ctx.fillStyle = type === 'regular' 
      ? (value >= 6 ? '#ffd700' : '#888899')
      : (value === 1 ? '#ff3333' : '#ffffff')

    if (value === 10) {
      ctx.fillText('10☥', 128, 132)
    } else if (value === 1 && type === 'hunger') {
      ctx.font = 'bold 115px serif'
      ctx.fillText('1☠', 128, 132)
    } else {
      ctx.fillText(value.toString(), 128, 132)
    }

    const texture = new THREE.CanvasTexture(canvas)
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    })
    const sprite = new THREE.Sprite(spriteMat)
    sprite.scale.set(2.2, 2.2, 2.2)
    return sprite
  }

  public rollDice(regularCount: number, hungerCount: number) {
    this.initAudio()
    this.clearDice()

    this.isRolling = true
    const totalDice = regularCount + hungerCount
    const diceList: ActiveDie[] = []

    let index = 0

    for (let i = 0; i < regularCount; i++) {
      const die = this.spawnDie('regular', index++, totalDice)
      diceList.push(die)
    }

    for (let i = 0; i < hungerCount; i++) {
      const die = this.spawnDie('hunger', index++, totalDice)
      diceList.push(die)
    }

    this.dice = diceList
  }

  private spawnDie(type: 'regular' | 'hunger', index: number, total: number): ActiveDie {
    const id = `die_${Date.now()}_${index}`

    const materials = type === 'regular' ? this.regularMaterials : this.hungerMaterials
    const mesh = new THREE.Mesh(this.d10Geometry, materials)
    mesh.castShadow = true
    mesh.receiveShadow = true
    this.scene.add(mesh)

    const body = new CANNON.Body({
      mass: 1.5,
      shape: this.d10Shape,
      linearDamping: 0.15,
      angularDamping: 0.15
    })

    const angle = (index / Math.max(total, 1)) * Math.PI * 2
    const spreadRadius = Math.min(1.5 + total * 0.35, 5.5)
    const startX = Math.cos(angle) * spreadRadius + (Math.random() - 0.5) * 1.5
    const startZ = Math.sin(angle) * spreadRadius + (Math.random() - 0.5) * 1.5 + 3
    const startY = 11 + Math.random() * 3 + index * 0.25

    body.position.set(startX, startY, startZ)

    const forceX = -startX * (2.2 + Math.random() * 2)
    const forceZ = -(startZ - 1.5) * (2.2 + Math.random() * 2)
    const forceY = -(9 + Math.random() * 5)
    body.velocity.set(forceX, forceY, forceZ)

    body.angularVelocity.set(
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 40
    )

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
      faceNormals: this.d10FaceNormals,
      settled: false
    }
  }

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

  public clearDice() {
    for (const die of this.dice) {
      if (die.floatingBadge) {
        this.scene.remove(die.floatingBadge)
        die.floatingBadge.material.dispose()
      }
      this.scene.remove(die.mesh)
      this.world.removeBody(die.body)
    }
    this.dice = []
    this.isRolling = false
  }

  private animate() {
    this.animFrameId = requestAnimationFrame(this.animate)

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

          // Criar badge flutuante acima do dado
          const badge = this.createFloatingBadge(die.finalValue, die.type)
          badge.position.set(
            die.mesh.position.x,
            die.mesh.position.y + 2.4,
            die.mesh.position.z
          )
          this.scene.add(badge)
          die.floatingBadge = badge
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
    this.regularMaterials.forEach(m => m.dispose())
    this.hungerMaterials.forEach(m => m.dispose())
    this.renderer.dispose()
  }
}
