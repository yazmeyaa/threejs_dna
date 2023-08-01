import { Scene, WebGLRenderer, PerspectiveCamera, Clock, Group, MeshBasicMaterial, Mesh, SphereGeometry, LineCurve3, TubeGeometry } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

class DNA {

    renderer: WebGLRenderer
    scene: Scene
    camera: PerspectiveCamera
    clock: Clock
    DNAGroup: Group

    constructor(canvas: HTMLCanvasElement) {
        const clock = new Clock()
        this.clock = clock

        const renderer = new WebGLRenderer({
            canvas: canvas
        })
        this.renderer = renderer
        renderer.setSize(window.innerWidth, window.innerHeight)

        const scene = new Scene()
        this.scene = scene

        const dna = this.generateDNAGroup()
        this.DNAGroup = dna
        dna.position.y = -2.4
        scene.add(dna)


        const { width, height } = renderer.domElement
        const camera = new PerspectiveCamera(45, width / height)
        camera.position.set(7, 0, 0)
        camera.lookAt(0, 0, 0)
        this.camera = camera

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableZoom = false
        controls.enablePan = false
        controls.update();


        this.animate()
    }

    private generateDNAGroup = (): Group => {
        const group = new Group()
        const pointsA: Mesh[] = []
        const pointsB: Mesh[] = []
        const pointsConnectLines: Mesh[] = []
        const spinLines: Mesh[] = [
            ...this.generateTubeFromMeshes(pointsA),
            ...this.generateTubeFromMeshes(pointsB)
        ]

        const POINTS_PER_SPIN = 30;
        const SPIN_HEIGHT = 5
        const SINGLE_POINT_HEIGHT = SPIN_HEIGHT / POINTS_PER_SPIN
        const SINGLE_POINT_RADIUS = 0.03

        const SEGMENTS_COUNT = 1
        const SPIN_RADIUS = 0.3

        const pointColors = [0x0a35a3, 0x0aa321, 0xa30a0a, 0xa0a30a]

        for (let segment = 0; segment < SEGMENTS_COUNT; segment++) {
            for (let pointIdx = 0; pointIdx < POINTS_PER_SPIN; pointIdx++) {
                const pointGeometry = new SphereGeometry(SINGLE_POINT_RADIUS)
                const pointMaterial = new MeshBasicMaterial({
                    color: pointColors[pointIdx % 4]
                })
                const point = new Mesh(pointGeometry, pointMaterial)

                point.position.x = SPIN_RADIUS * Math.sin((360 / POINTS_PER_SPIN) * pointIdx)
                point.position.z = SPIN_RADIUS * Math.cos((360 / POINTS_PER_SPIN) * pointIdx)
                point.position.y = (SPIN_HEIGHT * segment) + (SINGLE_POINT_HEIGHT * pointIdx)

                pointsA.push(point)
            }
        }

        for (let segment = 0; segment < SEGMENTS_COUNT; segment++) {
            for (let pointIdx = 0; pointIdx < POINTS_PER_SPIN; pointIdx++) {
                const pointGeometry = new SphereGeometry(SINGLE_POINT_RADIUS)
                const pointMaterial = new MeshBasicMaterial({
                    color: pointColors[3 - pointIdx % 4]
                })
                const point = new Mesh(pointGeometry, pointMaterial)

                const currentAngle = (360 / POINTS_PER_SPIN) * pointIdx
                point.position.x = SPIN_RADIUS * Math.cos(180 - currentAngle)
                point.position.z = SPIN_RADIUS * Math.sin(180 - currentAngle)
                point.position.y = ((SPIN_HEIGHT * segment) + (SINGLE_POINT_HEIGHT * pointIdx))

                pointsB.push(point)
            }
        }

        for (let i = 0; i < pointsA.length; i++) {
            const current = pointsA[i]
            const next = pointsB[i]
            if (!next) break;

            const curve = new LineCurve3(current.position, next.position)
            const tubeGeometry = new TubeGeometry(curve, 12, 0.01)
            const tubeMaterial = new MeshBasicMaterial({
                color: 0x248aff
            })
            const tube = new Mesh(tubeGeometry, tubeMaterial)
            pointsConnectLines.push(tube)
        }

        for (let i = 0; i < pointsA.length; i++) {
            const current = pointsA[i]
            const next = pointsA[i + 1]
            if (!next) break;

            const curve = new LineCurve3(current.position, next.position)
            const tubeGeometry = new TubeGeometry(curve, 12, 0.01)
            const tubeMaterial = new MeshBasicMaterial({
                color: 0x54a4ff
            })
            const tube = new Mesh(tubeGeometry, tubeMaterial)
            spinLines.push(tube)
        }

        for (let i = 0; i < pointsB.length; i++) {
            const current = pointsB[i]
            const next = pointsB[i + 1]
            if (!next) break;

            const curve = new LineCurve3(current.position, next.position)
            const tubeGeometry = new TubeGeometry(curve, 12, 0.01)
            const tubeMaterial = new MeshBasicMaterial({
                color: 0x54a4ff
            })
            const tube = new Mesh(tubeGeometry, tubeMaterial)
            spinLines.push(tube)
        }

        group.add(...pointsA, ...pointsB, ...pointsConnectLines, ...spinLines)

        console.log(pointsA)
        return group
    }

    generateTubeFromMeshes(meshArr: Mesh[]) {
        const tube: Mesh[] = []
        for (let i = 0; i < meshArr.length; i++) {
            const current = meshArr[i]
            const next = meshArr[i + 1]
            if (!next) break;

            const curve = new LineCurve3(current.position, next.position)
            const tubeGeometry = new TubeGeometry(curve, 12, 0.01)
            const tubeMaterial = new MeshBasicMaterial({
                color: 0x54a4ff
            })
            tube.push(new Mesh(tubeGeometry, tubeMaterial))
        }
        return tube
    }

    animate = () => {
        this.renderer.render(this.scene, this.camera)
        const delta = this.clock.getDelta()

        this.DNAGroup.rotateY(delta * Math.PI / 2) //90 deg/s
        window.requestAnimationFrame(this.animate)
    }

}


export { DNA }
