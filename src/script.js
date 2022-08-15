// important to continue this project => https://github.com/mrdoob/three.js/issues/8248

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// custom module
import { scene } from './app/scene'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
const canvas = document.querySelector('canvas.webgl')

import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import {Reflector} from 'three/examples/jsm/objects/Reflector.js'


const gltfLoader = new GLTFLoader()

const gltfMaterial = new THREE.MeshStandardMaterial({
    color: '#4cc8cc',
    emissive: '#4cc8cc',
    metalness: 0.2,
})

async function loadGltf() {
    gltfLoader.load(
        '/models/icon.gltf',
    (gltf) => {
        gltf.scene.scale.set(1, 1, 1)
        
        gltf.scene.traverse((child) => {
            if (child) {
                child.material = gltfMaterial
            }
        })
        gltf.scene.material = gltfMaterial
        scene.add(gltf.scene)
        gltf.scene.position.y += 1
        console.log("gltf load")
    }
    )
}
/**
 * Floor
 */

const textureLoader = new THREE.TextureLoader()

const roughnessMap = textureLoader.load('./models/textures/BatteredMetal01_2K_Roughness.png')
const normalMap = textureLoader.load('./models/textures/BatteredMetal01_2K_Normal.png')

const floor = new THREE.PlaneGeometry(10, 10)
const floor_mat = new THREE.MeshStandardMaterial({
    color: '#242424',
    metalness: 0,
    // roughness: 1,
    roughnessMap: roughnessMap,
    normalMap: normalMap,
})

floor.material = floor_mat

const verticalMirror = new Reflector( floor, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x889999
} );

verticalMirror.receiveShadow = true
verticalMirror.rotation.x = - Math.PI * 0.5
scene.add(verticalMirror)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#141414', 1)
scene.add(ambientLight)

const directionalLight = new THREE.SpotLight('#dedede')
directionalLight.power = 0.8
directionalLight.decay = 1
directionalLight.distance = 100
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = 5
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = - 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set( 5, 1, 0)
directionalLight.lookAt
scene.add(directionalLight)

/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-3, 1, 3)
scene.add(camera)
camera.lookAt(floor)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
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

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1,
    0.8,
    0,
)

const renderScene = new RenderPass(scene, camera)
const composer = new EffectComposer(renderer)
composer.addPass(renderScene)

composer.addPass(bloomPass)


function findElementWithTagsComponent(tags) {
    scene.traverse((e) => {
        console.log(e)
    }) 
}


findElementWithTagsComponent('test')

function animation() {

}

const tick = () => {
    controls.update()
    composer.render()

    animation()

    window.requestAnimationFrame(tick)
}

loadGltf()

tick()