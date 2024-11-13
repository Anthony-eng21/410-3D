import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/Addons.js";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import Stats from "three/examples/jsm/libs/stats.module.js";

import { SidebarManager } from "./Sidebar";
const sidebarManager = new SidebarManager();

// configuration
import { deviceConfigurations } from "./deviceConfig";
// Constants and device detection
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

// play with this value. maybe set this in each device object in the config if it gets hairy.
const zCloseness = isMobile ? 1.3 : 1.2;

const INITIAL_CAMERA_POSITION = new THREE.Vector3(-0.2, 0.72, zCloseness);
const INITIAL_CAMERA_TARGET = new THREE.Vector3(0, 0, 0);
const DURATION = 1500; //Duration of animation(s)

// Performance monitoring (Development)
const stats = new Stats();
document.body.appendChild(stats.dom);

let isPopupOpen = false;
let isLoading = true;

// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Routing
 * "Routing" logic (just a hash like the videoplayer project)
 * Real shotty implementation of this.
 * Definitely something to refactor in the future and use some
 * client side routing library once / if we have a bunch of these
 */

/**
 * Future implementaion ideas:
 * - Add a slider to toggle between deviceConfiguration device object items.
 */

// This helps clear and free up memory between toggling between
// device objects in the url this clears all meshes (including our model. except loaderCubeMesh)
// and css2dobjects (labels)
function clearScene() {
  const objectsToRemove = [];

  // Find all meshes and annotations except the loading spinner
  scene.traverse((object) => {
    // Skip the loading spinner mesh
    if (object === loaderCubeMesh) {
      return;
    }

    // Clear everything else that's a mesh or CSS2D object
    if (object.isMesh || object instanceof CSS2DObject) {
      objectsToRemove.push(object);
    }
  });

  // Remove objects and dispose of their resources
  objectsToRemove.forEach((object) => {
    if (object.geometry) object.geometry.dispose();
    if (object.material) {
      if (object.material.map) object.material.map.dispose();
      object.material.dispose();
    }
    if (object.parent) {
      object.parent.remove(object);
    }
  });
  if (sidebarManager.isVisible()) {
    sidebarManager.hide();
  }

  // Reset camera and controls to initial position
  camera.position.copy(INITIAL_CAMERA_POSITION);
  controls.target.copy(INITIAL_CAMERA_TARGET);
  camera.updateProjectionMatrix();
  controls.update();

  // Add loading cube back to scene
  if (!scene.children.includes(loaderCubeMesh)) {
    scene.add(loaderCubeMesh);
    loaderCubeMesh.position.copy(INITIAL_CAMERA_TARGET);
  }
  closeAnimation();
}

let deviceId = null;

function handleHashChange() {
  deviceId = window.location.hash.slice(1); // Removes the # from hash
  if (deviceId && deviceConfigurations[deviceId]) {
    // clear previous model and it's annotations in our scene on hash change
    clearScene();
    // load model and its annotations specific to our configuration id in the url's hash
    const currentConfig = deviceConfigurations[deviceId];
    loadModel(currentConfig);
  } else if (Object.keys(deviceConfigurations.length > 0)) {
    //
    const firstId = Object.keys(deviceConfigurations)[0];
    window.location.hash = firstId;
  }
}

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleHashChange);

/**
 * Lights (for loading state)
 * optimized settings
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(isMobile ? 512 : 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.bias = -0.001;
directionalLight.shadow.normalBias = 0.1;
directionalLight.position.set(-5, 5, 5);
scene.add(directionalLight);

/**
 * "Loading" elements
 */

const cubeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const cubeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  wireframeLinewidth: 3,
});

const loaderCubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
loaderCubeMesh.position.copy(INITIAL_CAMERA_TARGET); // same target as the model

loaderCubeMesh.rotation.set(60, 0, 0);
scene.add(loaderCubeMesh);

/**
 * Glb model
 */
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader); // this will compress the asset(s) in a separate thread.

async function loadModel(config) {
  try {
    isLoading = true;

    const gltf = await gltfLoader.loadAsync(config.modelPath);
    /**
     * Lighting setup for model(s)
     * Different models require different lighting setups depending on:
     * - Material properties
     * - Geometry complexity
     * - Scale and orientation
     * - Texture properties
     *
     * When a model appears black, it's usually due to:
     * 1. Insufficient light intensity
     * 2. Poor light positioning
     * 3. Lack of ambient lighting
     * 4. Material properties not reflecting light correctly
     *
     * This lighting setup provides:
     * - Brighter ambient light (1.0 intensity vs original 0.8)
     * - Stronger directional light (1.5 vs original 1.0)
     * - Better positioned lights for model illumination
     * - Hemisphere light for balanced ambient lighting
     */

    const newAmbientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(newAmbientLight);

    const newDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    newDirectionalLight.position.set(5, 5, 5);
    newDirectionalLight.castShadow = true;
    scene.add(newDirectionalLight);

    // Add hemisphere light for better overall lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // Remove the floor plane if it exists
    const floor = gltf.scene.getObjectByName("Plane_Baked") ?? "";
    floor ? floor?.removeFromParent() : "";

    // Enhance material quality and add shadows for each mesh in the model
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = 0.7;
          child.material.metalness = 0.3;
          child.material.precision = isMobile ? "mediump" : "highp";

          if (child.material.map) {
            // property .map.anisotropy: https://threejs.org/docs/#api/en/textures/Texture.anisotropy
            // method .getMaxAnisotropy: https://threejs.org/docs/#api/en/renderers/WebGLRenderer.getMaxAnisotropy
            child.material.map.anisotropy = isMobile
              ? 1
              : renderer.capabilities.getMaxAnisotropy();
            child.material.map.minFilter = THREE.LinearFilter;
            child.material.map.magFilter = THREE.LinearFilter;
          }
        }
      }
    });

    // Calculate the center point of the model
    // Box3: https://threejs.org/docs/#api/en/math/Box3
    const box = new THREE.Box3().setFromObject(gltf.scene);
    // box.getCenter(): https://threejs.org/docs/#api/en/math/Box3.getCenter
    // getCenter() calculates: center = (box.min + box.max) / 2
    const center = box.getCenter(new THREE.Vector3());

    // Add Specific Device annotations at correct points
    config.annotationPoints.forEach((point) => {
      const label = createLabel(
        point.name,
        point.heading,
        point.description,
        point.popupDirection || "rightPopup",
        config
      );
      label.position.copy(point.position.clone().add(center));
      // Store original position for occlusion checking
      label.userData.worldPosition = label.position.clone();
      scene.add(label);
    });

    // Add all model parts to the scene
    while (gltf.scene.children.length) {
      scene.add(gltf.scene.children[0]);
    }

    // Set the orbital controls to rotate around the model's center
    controls.target.copy(center);
    // Update INITIAL_CAMERA_TARGET to use the actual center (helps closeAnimation)
    INITIAL_CAMERA_TARGET.copy(center);
    // Update the controls to apply the new target
    controls.update();
  } catch (error) {
    console.error("Error loading model:", error);
  } finally {
    scene.remove(ambientLight); // Remove existing ambient light
    scene.remove(directionalLight); // Remove existing directional light
    isLoading = false;
    dracoLoader.dispose();
    cubeGeometry.dispose(); // free up geometry data from memory
    loaderCubeMesh.removeFromParent(); // remove mesh from its parent (parent = scene)
    // Remove pre existing lights for loading elements
    // new lights are created in loadModels definition
    scene.remove(ambientLight);
    scene.remove(directionalLight);
  }
}

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
  1000
);
camera.position.copy(INITIAL_CAMERA_POSITION);

scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  powerPreference: "low-power",
  precision: "mediump",
});

// renderer.setClearColor("#979392"); // important for fog.
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 2 : 3));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

/**
 * Annotations and pop ups.
 * CSS2DRenderer & objects
 */
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(sizes.width, sizes.height);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.left = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
canvas.parentElement.appendChild(labelRenderer.domElement);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 10;
controls.minDistance = isMobile ? 1.2 : 1;
controls.screenSpacePanning = true;
controls.keys = {
  LEFT: "KeyA",
  UP: "KeyW",
  RIGHT: "KeyD",
  BOTTOM: "KeyS",
};

// Helper function to create labels with popups
function createLabel(name, heading, content, popupDirection, config) {
  const div = document.createElement("div");
  div.className = "label-container";

  const marker = document.createElement("div");
  marker.className = "marker";
  marker.textContent = name;

  const popup = document.createElement("div");
  popup.className = `popup ${popupDirection}`;

  popup.innerHTML = `
    <div class="headingContainer">
    <h4>${heading}</h4>
    </div>
    <p>${content}</p>
  `;
  popup.style.display = "none";

  // Created the CSS2DObject first so we can reference it in the click handler
  const labelObject = new CSS2DObject(div);

  marker.addEventListener("click", (event) => {
    event.stopPropagation();
    const currentDisplay = popup.style.display;

    // Hide all other popups first
    document.querySelectorAll(".popup").forEach((p) => {
      p.style.display = "none";
    });

    // Show/hide this popup
    popup.style.display = currentDisplay === "none" ? "block" : "none";
    isPopupOpen = popup.style.display === "block"; // Set flag based on popup state

    // Move camera to view this annotation
    if (isPopupOpen) {
      /**
       * Sidebar logic
       */
      // Find the annotation data for this marker
      const annotationData = config.annotationPoints.find(
        (point) => point.name === name
      );
      // sidebar doesn't show on mobile, only the annotations do.
      if (!isMobile) {
        sidebarManager.show(annotationData);
      }
      /**
       * Animation Logic (lerp vectors)
       */
      // Get the position of this label
      const labelPosition = labelObject.position.clone();

      // Calculate the direction from the center to the annotation
      const center = controls.target.clone();
      // Math: direction = labelObject.position - center
      const direction = labelPosition.sub(center).normalize();

      // calculate the desired camera distance
      const distance = 0.9;

      // normalized direction and extends it to desired length
      const newCameraPosition = center
        .clone()
        .add(direction.multiplyScalar(distance));

      newCameraPosition.y = 0.62;

      // Store current camera position and target
      const startPosition = camera.position.clone();

      // Animation DURATION in milliseconds
      const startTime = Date.now();

      function animateCamera() {
        // Calculate how far through the animation we are
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / DURATION, 1);

        // Ease function (cubic ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        // Move camera smoothly from start to end position
        // Interpolate camera target. in english: Move the camera's look-at target based on our controls.target
        camera.position.lerpVectors(
          startPosition,
          newCameraPosition,
          easeProgress
        );

        controls.target.copy(center);

        // Update camera and controls
        camera.updateProjectionMatrix();
        controls.update();

        controls.enabled = false; // disable during animation
        // Continue animation if not finished
        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        } else {
          // Re-enable controls after animation
          controls.enabled = true;
        }
      }

      animateCamera();
    } else {
      //
      if (!isMobile) {
        // sidebar doesn't show on mobile, only the annotations do.
        sidebarManager.hide();
      }
      closeAnimation(); // ux: 2nd click closes marker
    }
  });

  div.appendChild(marker);
  div.appendChild(popup);

  return labelObject;
}

function closeAnimation() {
  const startTime = Date.now();
  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();

  controls.enabled = false;

  function animateClose() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / DURATION, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(
      startPosition,
      INITIAL_CAMERA_POSITION,
      easeProgress
    );

    controls.target.lerpVectors(
      startTarget,
      INITIAL_CAMERA_TARGET,
      easeProgress
    );

    camera.updateProjectionMatrix();
    controls.update();

    if (progress < 1) {
      requestAnimationFrame(animateClose);
    } else {
      camera.position.copy(INITIAL_CAMERA_POSITION);
      controls.target.copy(INITIAL_CAMERA_TARGET);
      camera.updateProjectionMatrix();
      controls.update();
      controls.enabled = true;
    }
  }

  animateClose();
}

window.addEventListener("click", () => {
  document.querySelectorAll(".popup").forEach((popup) => {
    if (popup.style.display === "block") {
      popup.style.display = "none";
      isPopupOpen = false;
      sidebarManager.hide(); // bit undecided on this
      closeAnimation();
    }
  });
});

/**
 * THREE.Fog
 */
const fog = new THREE.Fog("#ccc", 1, 15);
//activate the fog with the scenes' fog property
// scene.fog = fog;

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

// Helper function to update labels (scaling and occlusion)
// These objects are created once and reused to avoid garbage collection overhead
const frustum = new THREE.Frustum(); // Used to determine if objects are in camera's view
const projScreenMatrix = new THREE.Matrix4(); // Matrix to transform from world to screen space
const tempV = new THREE.Vector3(); // Reusable vector for position calculations
const raycaster = new THREE.Raycaster(); // Used for occlusion checks

let frameCount = 0;
// Only update expensive frustum calculations every N frames
// Higher values = better performance but less smooth culling
const FRUSTUM_UPDATE_FREQUENCY = 10;

/**
 * Updates the visibility and opacity of CSS2D labels based on:
 * 1. Frustum culling (is the label in camera's view?)
 * 2. Distance from camera
 * 3. Occlusion by other objects
 *
 * Optimizations:
 * - Frustum calculations are throttled to run every FRUSTUM_UPDATE_FREQUENCY frames
 * - Occlusion checks only run for nearby labels
 * - Reuses math objects to avoid garbage collection
 */
function updateLabels() {
  frameCount++;

  // The projection matrix transforms 3D coordinates to 2D screen space
  // The matrix multiplication is expensive, so we only do it occasionally
  if (frameCount % FRUSTUM_UPDATE_FREQUENCY === 0) {
    // Combine camera's projection and world matrices to get screen space transform
    projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    // Create a frustum from this matrix - frustum is the 3D volume visible to the camera
    frustum.setFromProjectionMatrix(projScreenMatrix);
  }

  scene.traverse((object) => {
    if (object instanceof CSS2DObject) {
      // Only check if object is in frustum when we've updated the frustum
      // This culls labels that aren't visible to the camera
      if (frameCount % FRUSTUM_UPDATE_FREQUENCY === 0) {
        if (!frustum.containsPoint(object.position)) {
          object.element.style.display = "none";
          return;
        }
      }

      // Get the label's position in world space
      object.getWorldPosition(tempV);
      // Project it to screen space coordinates
      tempV.project(camera);

      // Calculate actual distance to camera for distance-based optimizations
      const distance = camera.position.distanceTo(object.position);

      // Hide labels behind the camera
      if (tempV.z > 1) {
        object.element.style.display = "none";
      } else {
        object.element.style.display = "block";

        // Only perform expensive occlusion checks for nearby labels
        // This saves performance for distant labels that are less important
        if (distance < 3) {
          // Cast a ray from camera to label to check if anything is in the way
          raycaster.set(
            camera.position,
            object.position.clone().sub(camera.position).normalize()
          );
          const intersects = raycaster.intersectObjects(scene.children, true);

          // If something is intersected before we hit the label, fade the label
          object.element.style.opacity =
            intersects.length > 0 && intersects[0].distance < distance
              ? "0.5"
              : "1";
        } else {
          // Distant labels are always fully opaque
          object.element.style.opacity = "1";
        }
      }
    }
  });
}

const tick = () => {
  stats.begin();
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;
  // Update controls
  controls.update();

  // Update label scaling
  frameCount++;
  if (frameCount % FRUSTUM_UPDATE_FREQUENCY === 0) {
    updateLabels();
  }

  // Animation for cube
  loaderCubeMesh.rotation.y = Date.now() * 0.0015;

  // Render
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  stats.end();
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
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 14px;
        pointer-events: auto;
        box-shadow: 0 0 4px rgba(0,0,0,0.5);
        background-color: #024f7d;
        color: #fff;
    }
    .headingContainer {
      margin-bottom: 8px;
    }
    .popup {
        position: absolute;
        background: rgba(2, 79, 125, 0.85);
        color: #fff;
        padding: 6px 8px;
        border-radius: 4px;
        white-space: normal;
        font-size: 16px;
        pointer-events: none;
        z-index: 1;
        width: 250px;
        word-wrap: break-word;
        text-wrap: wrap;
        overflow-wrap: break-word;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .popup.rightPopup {
      transform: translateX(1px);
      left: 100%;
    }

    .popup.leftPopup {
      transform: translateX(-1px);
      right: 100%;
    }
    @media (max-width: 1000px) {
      .popup {
        width: 250px;
      }
    }
    @media(max-width: 480px) {
      .popup {
        width: 150px;
        font-size: 14px;
      }
    }
`;
document.head.appendChild(style);
