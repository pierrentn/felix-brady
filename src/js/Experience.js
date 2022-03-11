import * as THREE from "three";
import gsap from "gsap";

//Shaders
import fragment from "/src/shaders/frag.glsl?raw";
import vertex from "/src/shaders/vert.glsl?raw";

//Images
import image1 from "./../../static/project-images/1.jpg";
import image2 from "./../../static/project-images/2.jpg";
import image3 from "./../../static/project-images/3.jpg";
import image4 from "./../../static/project-images/4.jpg";
import image5 from "./../../static/project-images/5.jpg";
const projectsThumb = [image1, image2, image3, image4, image5];

const cameraZOffset = 1;
let cameraZPosition = cameraZOffset;

let currentImg = 0;

const mousePos = {
  x: 0,
  y: 0,
};

/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader();
projectsThumb.forEach((img, i) => {
  textureLoader.load(img, (texture) => {
    const width = texture.source.data.naturalWidth;
    const height = texture.source.data.naturalHeight;
    const projectsThumb = { texture, width, height };

    createMesh(projectsThumb, i);
  });
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

window.addEventListener("scroll", (e) => {
  currentImg = Math.trunc(window.scrollY / window.innerHeight);
  // console.log(currentImg);
  // console.log(cameraZOffset + -1 * (window.scrollY / window.innerHeight));
  cameraZPosition = cameraZOffset + -1 * (window.scrollY / window.innerHeight);
  camera.position.z = cameraZPosition;
});

window.addEventListener("mousemove", (e) => {
  mousePos.x = e.clientX / (sizes.width / 2) - 1;
  mousePos.y = e.clientY / (sizes.width / 2) - 1;
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  100,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, cameraZOffset);
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Meshes
 */

const projectsGroup = new THREE.Group();
scene.add(projectsGroup);
const projectsMesh = [];

const createMesh = (thumb, index) => {
  const aspect = thumb.width / thumb.height;

  const planeGeometry = new THREE.PlaneGeometry(aspect, 1);
  const planeMaterial = new THREE.MeshBasicMaterial();
  const newMesh = new THREE.Mesh(planeGeometry, planeMaterial);

  newMesh.material.map = thumb.texture;
  newMesh.material.transparent = true;
  newMesh.material.opacity = index == 0 ? 1 : 0;

  const xPosition = index % 2 ? -1 : 1;
  // const xPosition = 0;
  const yPosition = (Math.random() * 2 - 1) * 0.1;
  // const yPosition = 0;
  const zPosition = index * -1;

  newMesh.position.set(xPosition, yPosition, zPosition);
  console.log(`z ${index}:`, index * -1);
  newMesh.scale.set(1.3, 1.3, 1.3);
  projectsGroup.add(newMesh);

  projectsMesh.push(newMesh);
};

const debugGeometry = new THREE.PlaneGeometry(1, 1);
const debugMaterial = new THREE.MeshBasicMaterial({
  color: "red",
  wireframe: true,
});
const debugMesh = new THREE.Mesh(debugGeometry, debugMaterial);
debugMesh.position.set(0, 0, 0);
// scene.add(debugMesh);

/**
 * Animation
 */
const clock = new THREE.Clock();

const loop = () => {
  const elapsedTime = clock.getElapsedTime();

  if (projectsMesh.length) {
    projectsMesh.forEach((mesh, i) => {
      if (currentImg == i - 1) {
        mesh.material.opacity =
          Math.abs(cameraZPosition - 0.5 - (cameraZOffset - 0.5)) % 1;
        console.log(
          i,
          Math.abs(cameraZPosition - 0.5 - (cameraZOffset - 0.5)) % 1
        );
      }
    });
  }

  // projectsGroup.position.y = 0.1 * mousePos.y;
  // projectsGroup.position.x = 0.1 * mousePos.x;
  gsap.to(projectsGroup.position, {
    x: 0.1 * mousePos.x,
    y: 0.1 * mousePos.y,
    duration: 1,
    ease: "power4",
  });

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop);
};

loop();
