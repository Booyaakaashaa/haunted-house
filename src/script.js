import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'
import { Sky } from 'three/examples/jsm/Addons.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * House
 */
// Temporary sphere
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial({ roughness: 0.7 })
// );
// scene.add(sphere);

const textureLoader = new THREE.TextureLoader();

const floorAlphaTexture = textureLoader.load("floor/alpha.webp");
const floorColorTexture = textureLoader.load("floor/rocky_terrain_1k/rocky_terrain_diff_1k.webp");
const floorARMTexture = textureLoader.load("floor/rocky_terrain_1k/rocky_terrain_arm_1k.webp");
const floorDisplacementTexture = textureLoader.load("floor/rocky_terrain_1k/rocky_terrain_disp_1k.webp");
const floorNormalTexture = textureLoader.load("floor/rocky_terrain_1k/rocky_terrain_nor_gl_1k.webp");

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8,8);
floorDisplacementTexture.repeat.set(8,8);
floorNormalTexture.repeat.set(8,8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

const wallsColorTexture = textureLoader.load("walls/random_bricks_thick_1k/random_bricks_thick_diff_1k.webp");
wallsColorTexture.colorSpace = THREE.SRGBColorSpace;
const wallsARMTexture = textureLoader.load("walls/random_bricks_thick_1k/random_bricks_thick_arm_1k.webp");
const wallsNormalTexture = textureLoader.load("walls/random_bricks_thick_1k/random_bricks_thick_nor_gl_1k.webp");

wallsColorTexture.repeat.set(3, 2);
wallsARMTexture.repeat.set(3, 2);
wallsNormalTexture.repeat.set(3, 2);

wallsColorTexture.wrapS = THREE.RepeatWrapping;
wallsARMTexture.wrapS = THREE.RepeatWrapping;
wallsNormalTexture.wrapS = THREE.RepeatWrapping;

wallsColorTexture.wrapT = THREE.RepeatWrapping;
wallsARMTexture.wrapT = THREE.RepeatWrapping;
wallsNormalTexture.wrapT = THREE.RepeatWrapping;

const roofColorTexture = textureLoader.load("roof/roof_07_1k/roof_07_diff_1k.webp");
roofColorTexture.colorSpace = THREE.SRGBColorSpace;
const roofARMTexture = textureLoader.load("roof/roof_07_1k/roof_07_arm_1k.webp");
const roofNormalTexture = textureLoader.load("roof/roof_07_1k/roof_07_nor_gl_1k.webp");

roofColorTexture.repeat.set(8, 4);
roofARMTexture.repeat.set(8, 4);
roofNormalTexture.repeat.set(8, 4);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

roofColorTexture.wrapT = THREE.RepeatWrapping;
roofARMTexture.wrapT = THREE.RepeatWrapping;
roofNormalTexture.wrapT = THREE.RepeatWrapping;

const bushColorTexture = textureLoader.load("bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp");
bushColorTexture.colorSpace = THREE.SRGBColorSpace;
const bushARMTexture = textureLoader.load("bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp");
const bushNormalTexture = textureLoader.load("bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp");

const graveColorTexture = textureLoader.load("grave/seaside_rock_1k/seaside_rock_diff_1k.webp");
graveColorTexture.colorSpace = THREE.SRGBColorSpace;
const graveARMTexture = textureLoader.load("grave/seaside_rock_1k/seaside_rock_arm_1k.webp");
const graveNormalTexture = textureLoader.load("grave/seaside_rock_1k/seaside_rock_nor_gl_1k.webp");

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);


const doorAlphaTexture = textureLoader.load('door/alpha.webp');
const doorAmbientOcclusionTexture = textureLoader.load('door/ambientOcclusion.webp');
const doorColorTexture = textureLoader.load('door/color.webp');
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorHeightTexture = textureLoader.load('door/height.webp');
const doorMetalnessTexture = textureLoader.load('door/metalness.webp');
const doorNormalTexture = textureLoader.load('door/normal.webp');
const doorRoughnessTexture = textureLoader.load('door/roughness.webp');

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        transparent: true,
        alphaMap: floorAlphaTexture,
        map: floorColorTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.2,
        displacementBias: -0.08
    })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

gui.add(floor.material, 'displacementBias').min(-10).max(10);


const house = new THREE.Group();
scene.add(house);

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallsColorTexture,
        aoMap: wallsARMTexture,
        roughnessMap: wallsARMTexture,
        metalnessMap: wallsARMTexture,
        normalMap: wallsNormalTexture
    })
);
walls.position.y += 2.5 / 2;
house.add(walls);

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture
    })
);
roof.position.y += 2.5 + 0.75;
roof.rotation.y = Math.PI / 4;
house.add(roof);

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({

        transparent: true,
        alphaMap: doorAlphaTexture,
        map: doorColorTexture,
        aoMap: doorAmbientOcclusionTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04
    })
);
door.position.z = 2.0001;
door.position.y = 1;
// door.rotation.z = Math.PI / 2;
house.add(door);

gui.add(door.material, 'displacementBias').min(-10).max(10).step(0.0001);

const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
    color: '#ccffcc',
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture
});

const bush1 = new THREE.Mesh( bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh( bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh( bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh( bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;
house.add(bush1, bush2, bush3, bush4);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture
});

const graves = new THREE.Group();
scene.add(graves);

for(let i = 0; i < 30; i++) {
    const grave = new THREE.Mesh( graveGeometry, graveMaterial );
    const r = 3 + Math.random() * 4;
    const angle = 2 * Math.PI * Math.random();
    grave.position.set(r * Math.cos(angle), Math.random() * 0.4, r * Math.sin(angle));
    grave.rotation.set((Math.random() - 1/2) * 0.4, (Math.random() - 1/2) * 0.4, (Math.random() - 1/2) * 0.4);
    graves.add(grave);
}
/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#86cdff', 1);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

const doorLight = new THREE.PointLight("#ff7d46", 5);
doorLight.position.set(0, 2.2, 2.5);
scene.add(doorLight);

const ghost1 = new THREE.PointLight('#8800ff', 6);
const ghost2 = new THREE.PointLight('#ff0088', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6);

scene.add(ghost1, ghost2, ghost3);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 4.5;
controls.maxDistance = 12;

controls.addEventListener('change', () => {
  if (camera.position.y < 1) {
    camera.position.y = 1;
  }
});

gui.add(controls, 'maxDistance').min(0).max(50).step(1);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

graves.children.forEach((grave) => {
    grave.castShadow = true;
    grave.receiveShadow = true;
});

directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.bottom = -8;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

const sky = new Sky();
sky.scale.setScalar(100);
sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 3;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.95;
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);
scene.add(sky);

scene.fog = new THREE.FogExp2('#02343f', 0.1);


/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed();

    doorLight.intensity = Math.random() * 6;

    ghost1.position.set(Math.cos(elapsedTime / 2) * 4, Math.sin(elapsedTime / 6), Math.sin(elapsedTime / 2) * 4);

    ghost2.position.set(Math.cos(-elapsedTime / 2) * Math.cos(-elapsedTime * 2.345 / 2) * Math.cos(-elapsedTime * 3.456 / 2) * 7, Math.cos(elapsedTime / 6), Math.sin(elapsedTime / 2) * 7);

    ghost3.position.set(Math.sin(elapsedTime / 2) * Math.sin(elapsedTime * 2.345 / 2) * Math.sin(elapsedTime * 3.456 / 2) * 7, Math.sin(-elapsedTime / 8), Math.cos(-elapsedTime / 2) * 7);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()