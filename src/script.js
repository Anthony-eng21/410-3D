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

// Define annotation points
const annotationPoints = [
  {
    position: new THREE.Vector3(0, 0.4, 1),
    name: "1",
    description: "Top Knob",
  },
  {
    position: new THREE.Vector3(0.2, 0.3, 0),
    name: "2",
    description: "Handle Right",
  },
  {
    position: new THREE.Vector3(-0.2, 0.3, 0),
    name: "3",
    description: "Handle Left",
  },
  {
    position: new THREE.Vector3(0, 0.2, 0),
    name: "4",
    description: "Body",
  },
];

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
      }
    });

    const axesHelper = new THREE.AxesHelper(1.4);

    // Calculate the center point of the model
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());

    // Add annotations at specific points
    annotationPoints.forEach((point) => {
      const label = createLabel(point.name, point.description);
      // Adjust position relative to model center
      label.position.copy(point.position.clone().add(center));
      // Store original position for occlusion checking
      label.userData.worldPosition = label.position.clone();
      scene.add(label);
    });

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
labelRenderer.domElement.style.left = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
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

  marker.addEventListener("click", (event) => {
    event.stopPropagation();
    const currentDisplay = popup.style.display;
    // Hide all other popups first
    document.querySelectorAll(".popup").forEach((p) => {
      p.style.display = "none";
    });
    // Show/hide this popup
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

// Helper function to update labels (scaling and occlusion)
function updateLabels() {
  // Temporary vector for calculations
  const tempV = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();

  scene.traverse((object) => {
    if (object instanceof CSS2DObject) {
      // Get world position of the label
      object.getWorldPosition(tempV);

      // Project point to screen space
      tempV.project(camera);

      // Calculate distance for scaling
      const distance = camera.position.distanceTo(object.position);
      const scale = Math.max(0.2, Math.min(1, 1 / distance));

      // Check if point is behind camera
      if (tempV.z > 1) {
        object.element.style.display = "none";
      } else {
        object.element.style.display = "block";

        // Cast ray from camera to label position to check for occlusion
        raycaster.set(
          camera.position,
          object.position.clone().sub(camera.position).normalize(),
        );

        const intersects = raycaster.intersectObjects(scene.children, true);

        // If there's an intersection before the label, it's occluded
        if (intersects.length > 0 && intersects[0].distance < distance) {
          object.element.style.opacity = "0.3";
        } else {
          object.element.style.opacity = "1";
        }

        // Apply scaling
        object.element.style.transform = `scale(${scale})`;
      }
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
  updateLabels();

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

const style = document.createElement("style");
style.textContent = `
    .label-container {
        position: relative;
        pointer-events: auto;
        transform-origin: center;
        transition: opacity 0.15s ease-in-out;
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
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
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
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
`;
document.head.appendChild(style);

// Optional: Add click listener to close popups when clicking outside
window.addEventListener("click", () => {
  document.querySelectorAll(".popup").forEach((popup) => {
    popup.style.display = "none";
  });
});
