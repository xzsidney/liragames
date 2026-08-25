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
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100)
    this.camera.position.set(0, 22, 14)
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
    // Faces superiores: 10, 2, 8, 4, 6
    // Faces inferiores: 1, 9, 3, 7, 5
    const faceValues = [10, 2, 8, 4, 6, 1, 9, 3, 7, 5]

    // Construção da Geometria Monolítica do D10 com UVs perfeitas
    const { geometry, shape, normals } = this.buildD10GeometryAndPhysics(faceValues)
    this.d10Geometry = geometry
    this.d10Shape = shape
    this.d10FaceNormals = normals

    // Criar materiais das 10 faces
    this.regularMaterials = faceValues.map(v => this.createFaceMaterial(v, 'regular'))
    this.hungerMaterials = faceValues.map(v => this.createFaceMaterial(v, 'hunger'))

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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
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
   * Constrói a geometria 3D do D10 com grupos multi-materiais para cada uma das 10 faces
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

    // Definição das 5 faces superiores e 5 inferiores
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

    const geometry = new THREE.BufferGeometry()

    let faceIndex = 0

    // Coordenadas UV do kite no canvas 512x512
    const uvApex = [0.5, 0.98]
    const uvLeft = [0.03, 0.5]
    const uvCenter = [0.5, 0.02]
    const uvRight = [0.97, 0.5]

    // 1. Processar faces superiores (0 a 4)
    for (let i = 0; i < upperKites.length; i++) {
      const k = upperKites[i]
      const val = faceValues[faceIndex]
      const pApex = vertices[k.vApex]
      const pLeft = vertices[k.vLeft]
      const pCenter = vertices[k.vCenter]
      const pRight = vertices[k.vRight]

      const vA = new THREE.Vector3().subVectors(pLeft, pApex)
      const vB = new THREE.Vector3().subVectors(pRight, pApex)
      let norm = new THREE.Vector3().crossVectors(vA, vB).normalize()

      const fCenter = new THREE.Vector3().add(pApex).add(pLeft).add(pCenter).add(pRight).multiplyScalar(0.25)
      if (norm.dot(fCenter) < 0) norm.negate()

      faceNormalsList.push({ value: val, normal: norm.clone() })

      const startVertex = positions.length / 3

      // Triângulo 1 (Apex, Left, Center)
      positions.push(pApex.x, pApex.y, pApex.z, pLeft.x, pLeft.y, pLeft.z, pCenter.x, pCenter.y, pCenter.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      uvs.push(uvApex[0], uvApex[1], uvLeft[0], uvLeft[1], uvCenter[0], uvCenter[1])

      // Triângulo 2 (Apex, Center, Right)
      positions.push(pApex.x, pApex.y, pApex.z, pCenter.x, pCenter.y, pCenter.z, pRight.x, pRight.y, pRight.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      uvs.push(uvApex[0], uvApex[1], uvCenter[0], uvCenter[1], uvRight[0], uvRight[1])

      // Adicionar grupo de material para esta face
      geometry.addGroup(startVertex, 6, faceIndex)

      cannonFaces.push([k.vApex, k.vRight, k.vCenter, k.vLeft])
      faceIndex++
    }

    // 2. Processar faces inferiores (5 a 9)
    for (let i = 0; i < lowerKites.length; i++) {
      const k = lowerKites[i]
      const val = faceValues[faceIndex]
      const pApex = vertices[k.vApex]
      const pLeft = vertices[k.vLeft]
      const pCenter = vertices[k.vCenter]
      const pRight = vertices[k.vRight]

      const vA = new THREE.Vector3().subVectors(pRight, pApex)
      const vB = new THREE.Vector3().subVectors(pLeft, pApex)
      let norm = new THREE.Vector3().crossVectors(vA, vB).normalize()

      const fCenter = new THREE.Vector3().add(pApex).add(pLeft).add(pCenter).add(pRight).multiplyScalar(0.25)
      if (norm.dot(fCenter) < 0) norm.negate()

      faceNormalsList.push({ value: val, normal: norm.clone() })

      const startVertex = positions.length / 3

      // Triângulo 1 (Apex, Right, Center)
      positions.push(pApex.x, pApex.y, pApex.z, pRight.x, pRight.y, pRight.z, pCenter.x, pCenter.y, pCenter.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      uvs.push(uvApex[0], uvApex[1], uvRight[0], uvRight[1], uvCenter[0], uvCenter[1])

      // Triângulo 2 (Apex, Center, Left)
      positions.push(pApex.x, pApex.y, pApex.z, pCenter.x, pCenter.y, pCenter.z, pLeft.x, pLeft.y, pLeft.z)
      normals.push(norm.x, norm.y, norm.z, norm.x, norm.y, norm.z, norm.x, norm.y, norm.z)
      uvs.push(uvApex[0], uvApex[1], uvCenter[0], uvCenter[1], uvLeft[0], uvLeft[1])

      geometry.addGroup(startVertex, 6, faceIndex)

      cannonFaces.push([k.vApex, k.vLeft, k.vCenter, k.vRight])
      faceIndex++
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

    const cannonPoints = vertices.map(v => new CANNON.Vec3(v.x, v.y, v.z))
    const shape = new CANNON.ConvexPolyhedron({
      vertices: cannonPoints,
      faces: cannonFaces
    })

    return { geometry, shape, normals: faceNormalsList }
  }

  /**
   * Gera a textura de uma face com fundo sombreado, borda metálica e o número perfeitamente gravado
   */
  private createFaceMaterial(value: number, type: 'regular' | 'hunger'): THREE.MeshStandardMaterial {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Formato de pipa (kite) correspondente exatamente aos UVs
    ctx.save()

    // Fundo da face
    const grad = ctx.createRadialGradient(256, 256, 30, 256, 256, 250)
    if (type === 'regular') {
      grad.addColorStop(0, '#24232c')
      grad.addColorStop(0.65, '#131219')
      grad.addColorStop(1, '#08080c')
    } else {
      grad.addColorStop(0, '#9e1111')
      grad.addColorStop(0.65, '#690000')
      grad.addColorStop(1, '#3a0000')
    }
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 512, 512)

    // Borda do kite
    ctx.beginPath()
    ctx.moveTo(256, 12)
    ctx.lineTo(496, 256)
    ctx.lineTo(256, 500)
    ctx.lineTo(16, 256)
    ctx.closePath()

    ctx.strokeStyle = type === 'regular' ? '#d4af37' : '#ff4444'
    ctx.lineWidth = 14
    ctx.stroke()

    // Borda interna decorativa
    ctx.beginPath()
    ctx.moveTo(256, 40)
    ctx.lineTo(468, 256)
    ctx.lineTo(256, 472)
    ctx.lineTo(44, 256)
    ctx.closePath()

    ctx.strokeStyle = type === 'regular' ? 'rgba(212, 175, 55, 0.45)' : 'rgba(255, 120, 120, 0.45)'
    ctx.lineWidth = 4
    ctx.stroke()

    // Tipografia Cinzel
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetY = 4

    if (type === 'regular') {
      ctx.fillStyle = '#ffdf66'
      ctx.font = 'bold 150px "Cinzel", "Georgia", serif'

      if (value === 10) {
        ctx.font = 'bold 125px "Cinzel", "Georgia", serif'
        ctx.fillText('10☥', 256, 256)
      } else {
        ctx.fillText(value.toString(), 256, 256)
      }
    } else {
      // Fome (Hunger Dice)
      if (value === 10) {
        ctx.fillStyle = '#ff6b6b'
        ctx.font = 'bold 125px "Cinzel", "Georgia", serif'
        ctx.fillText('10☥', 256, 256)
      } else if (value === 1) {
        ctx.fillStyle = '#ff2222'
        ctx.font = 'bold 150px serif'
        ctx.fillText('1☠', 256, 256)
      } else if (value >= 6) {
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 150px "Cinzel", "Georgia", serif'
        ctx.fillText(value.toString(), 256, 256)
      } else {
        ctx.fillStyle = 'rgba(255, 210, 210, 0.75)'
        ctx.font = 'bold 150px "Cinzel", "Georgia", serif'
        ctx.fillText(value.toString(), 256, 256)
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

    // Malha monolítica com as 10 texturas integradas
    const materials = type === 'regular' ? this.regularMaterials : this.hungerMaterials
    const mesh = new THREE.Mesh(this.d10Geometry, materials)
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
