// important to continue this project => https://github.com/mrdoob/three.js/issues/8248
// add material on gltf

import './style.css'
import './app/main.js'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// custom module
import { scene } from './app/scene'


const canvas = document.querySelector('canvas.webgl')

const ambientLight = new THREE.AmbientLight('#4a4a4a', 1)
scene.add(ambientLight)

const spotLight = new THREE.SpotLight( 0xffffee, 20 );
spotLight.position.set( -0.5, 0, 1 );
spotLight.position.multiplyScalar( 700 );
scene.add( spotLight );
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
spotLight.shadow.camera.near = 200;
spotLight.shadow.camera.far = 1500;
spotLight.shadow.camera.fov = 40;
spotLight.shadow.bias = - 0.005;

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        // L - R // U - D // F - B //
camera.position.set(0, 0, 5)
scene.add(camera)



const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: "high-performance",
	antialias: false,
	stencil: false,
	depth: false
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const controls = new OrbitControls(camera, renderer.domElement)

function tick() {
    renderer.render( scene, camera );
    window.requestAnimationFrame(tick)
}
controls.update()
tick()


function fragmentShader() {
    return `
    uniform vec3 colorA; 
    uniform vec3 colorB; 
    varying vec3 vUv;

    void main() {
        gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
    }
`
}

function vertexShader() {
    return `
    varying vec3 vUv; 

    void main() {
        vUv = position; 
    
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition; 
    }
    `
}

function addExperimentalCube() {
    let uniforms = {
            colorB: {type: 'vec3', value: new THREE.Color(0xACB6E5)},
            colorA: {type: 'vec3', value: new THREE.Color(0x74ebd5)}
    }
    let geometry = new THREE.SphereGeometry(1, 10, 10)
    let a = new THREE.BufferGeometry()
    let material =  new THREE.ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: fragmentShader(),
        vertexShader: vertexShader(),
        wireframe: true
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = 2
    scene.add(mesh)
}

addExperimentalCube()
