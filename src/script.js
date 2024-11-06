import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#444444",
    metalness: 0,
    roughness: 0.5,
  }),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0.015;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Glb model
 */

const gltfLoader = new GLTFLoader();

gltfLoader.load("/models/Devices/ControlByWeb_1.glb", (gltf) => {
  // Remove the floor plane if it exists
  const floor = gltf.scene.getObjectByName("Plane_Baked") ?? "";
  floor.removeFromParent();

  // Enhance material quality and add shadows for each mesh in the model
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        // Adjust material properties for better visual quality
        child.material.roughness = 0.7; // Controls how rough/smooth the surface appears
        child.material.metalness = 0.3; // Controls how metallic the surface appears
      }
    }
  });

  // Calculate the center point of the model
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const center = box.getCenter(new THREE.Vector3());

  // Add all model parts to the scene
  while (gltf.scene.children.length) {
    scene.add(gltf.scene.children[0]);
  }

  // Position camera and update controls to frame the model
  camera.position.set(
    1, // X position - positive moves camera right
    0.75, // Y position - positive moves camera up
    1.5, // Z position - positive moves camera back
  );
  // Set the orbital controls to rotate around the model's center
  controls.target.copy(center);
  // Update the controls to apply the new target
  controls.update();
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.set(1, 0.75, 1.5); // Adjusted for better initial view
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.5, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
