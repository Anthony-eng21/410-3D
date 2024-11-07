import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {
 CSS2DRenderer,
 CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import GUI from "lil-gui";

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
 new THREE.PlaneGeometry(20, 20, 5, 5),
 new THREE.MeshStandardMaterial({
   color: "#444444",
   side: THREE.DoubleSide,
   metalness: 0,
   roughness: 0.5,
 }),
);
floor.receiveShadow = true;
floor.rotation.x = Math.PI * -0.5;
floor.position.y = 0.0;
floor.position.z = -2;
scene.add(floor);

/**
* Lights
*/
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(-5, 5, 5);
scene.add(directionalLight);

/**
* Glb model
*/
const gltfLoader = new GLTFLoader();

gltfLoader.load(
 "/models/Devices/ControlByWeb_1.glb",
 (gltf) => {
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
         child.material.precision = "highp";
         // If the model has textures
         if (child.material.map) {
           child.material.map.anisotropy =
             renderer.capabilities.getMaxAnisotropy();
           child.material.map.minFilter = THREE.LinearFilter;
           child.material.map.magFilter = THREE.LinearFilter;
         }
         if (child.layers) {
           child.layers.enableAll();
         }
       }

       // Get world position for label placement
       const worldPos = new THREE.Vector3();
       child.getWorldPosition(worldPos);
       
       const label = createLabel("1", "Part Description");
       label.position.copy(worldPos);
       scene.add(label);
       child.userData.label = label;
     }
   });

   const axesHelper = new THREE.AxesHelper(1.4);

   // Calculate the center point of the model
   const box = new THREE.Box3().setFromObject(gltf.scene);
   const center = box.getCenter(new THREE.Vector3());

   // Add all model parts to the scene
   while (gltf.scene.children.length) {
     scene.add(gltf.scene.children[0]);
   }

   console.log("loaded");
   // Set the orbital controls to rotate around the model's center
   controls.target.copy(center);
   // Update the controls to apply the new target
   controls.update();
 },
 (onprogress) => {
   onprogress.preventDefault();
   // Loading State
   // TODO Define function to invoke for loading state.
   console.log("loading");
 },
);

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

 // Update renderers
 renderer.setSize(sizes.width, sizes.height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 labelRenderer.setSize(sizes.width, sizes.height);
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
camera.position.set(-0.4, 0.75, 1.3); // initial view
scene.add(camera);

/**
* Renderer
*/
const renderer = new THREE.WebGLRenderer({
 canvas: canvas,
 antialias: true,
 precision: "highp",
 powerPreference: "high-performance",
});

renderer.setClearColor("#979392"); // important for fog.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

/**
* Annotations and pop ups.
* CSS2DRenderer & objects
*/
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.left = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
canvas.parentElement.appendChild(labelRenderer.domElement);

// Controls - using main canvas for better orbit control
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Helper function to create labels with popups
function createLabel(name, content) {
   const div = document.createElement("div");
   div.className = "label-container";
   
   // Create the marker (always visible)
   const marker = document.createElement("div");
   marker.className = "marker";
   marker.textContent = name;

   // Create the popup (hidden by default)
   const popup = document.createElement("div");
   popup.className = "popup";
   popup.textContent = content;
   popup.style.display = "none";

   // Add click handler to marker only
   marker.addEventListener('click', (event) => {
       event.stopPropagation();
       const currentDisplay = popup.style.display;
       popup.style.display = currentDisplay === "none" ? "block" : "none";
   });

   div.appendChild(marker);
   div.appendChild(popup);

   return new CSS2DObject(div);
}

/**
* THREE.Fog
*/
const fog = new THREE.Fog("#ccc", 1, 15);
//activate the fog with the scenes' fog property
scene.fog = fog;

/**
* Animate
*/
const clock = new THREE.Clock();
let previousTime = 0;

// Helper function to update label scales based on camera distance
function updateLabelScales() {
   scene.traverse((object) => {
       if (object instanceof CSS2DObject) {
           const distance = camera.position.distanceTo(object.position);
           const scale = Math.max(0.2, Math.min(1, 1 / distance));
           object.element.style.transform = `scale(${scale})`;
       }
   });
}

const tick = () => {
 const elapsedTime = clock.getElapsedTime();
 const deltaTime = elapsedTime - previousTime;
 previousTime = elapsedTime;
 
 // Update controls
 controls.update();

 // Update label scaling
 updateLabelScales();

 // Render
 renderer.render(scene, camera);
 labelRenderer.render(scene, camera);
 
 // Call tick again on the next frame
 window.requestAnimationFrame(tick);
};

tick();

/**
* Styles
*/
const style = document.createElement('style');
style.textContent = `
   .label-container {
       position: relative;
       pointer-events: auto;
       transform-origin: center;
   }
   .marker {
       width: 12px;
       height: 12px;
       border-radius: 50%;
       background: white;
       display: flex;
       align-items: center;
       justify-content: center;
       cursor: pointer;
       font-size: 10px;
       pointer-events: auto;
   }
   .popup {
       position: absolute;
       background: rgba(0, 0, 0, 0.8);
       color: white;
       padding: 6px 8px;
       border-radius: 4px;
       transform: translateX(15px);
       white-space: nowrap;
       font-size: 12px;
       pointer-events: none;
       z-index: 1;
   }
`;
document.head.appendChild(style);