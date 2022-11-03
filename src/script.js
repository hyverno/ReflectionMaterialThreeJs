// important to continue this project => https://github.com/mrdoob/three.js/issues/8248
// add material on gltf

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// custom module
import { scene } from './app/scene'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import {Reflector} from 'three/examples/jsm/objects/Reflector.js'

import {SSRPass} from 'three/examples/jsm/postprocessing/SSRPass.js'
import {ReflectorForSSRPass} from 'three/examples/jsm/objects/ReflectorForSSRPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js';

const canvas = document.querySelector('canvas.webgl')

const gltfLoader = new GLTFLoader()
// THREE.MeshStandardMaterial
const gltfMaterial = new THREE.MeshBasicMaterial ({
    color: '#30787a',
    emissive: '#ffffff',
    metalness: 0.2,
})

let gltfELement = null ||undefined

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
        gltf.scene.position.y += 1.5
        gltf.scene.position.x -= 1.5
        console.log("gltf load")
        gltfELement = gltf.scene
        gltfAnimation(gltfELement)
        position = gltfELement.position.y
        }
    )
}

let position

function gltfAnimation(element) {
    if(element, position) {
        gltfELement.position.y = position + Math.sin(Date.now() * 0.001)/4
    } 
    window.requestAnimationFrame(gltfAnimation)
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
    metalness: 0.5,
    roughness: 1,
    roughnessMap: roughnessMap,
    normalMap: normalMap,
})

floor.material = floor_mat

const floor_mesh = new THREE.Mesh(floor, floor_mat)
floor_mesh.receiveShadow = true
floor_mesh.rotation.x = - Math.PI * 0.5
scene.add(floor_mesh)

/**
 * Lights
 */
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
        // L - R // U - D // F - B //
camera.position.set(-1.8, 0.5, 3)
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
    0.4,
    0.4,
    0,
)


const renderScene = new RenderPass(scene, camera)
const composer = new EffectComposer(renderer)
composer.addPass(renderScene)



const ssrPass = new SSRPass( {
    renderer,
    scene,
    camera,
    width: innerWidth,
    height: innerHeight,
    // groundReflector: 
} )

ssrPass.opacity = 1
ssrPass.maxDistance = 1.2
ssrPass.InfiniteThick = true

composer.addPass(ssrPass)
composer.addPass(bloomPass)

const effect2 = new ShaderPass( RGBShiftShader );
effect2.uniforms[ 'amount' ].value = 0.0025;
composer.addPass( effect2 );

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