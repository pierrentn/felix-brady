import GUI from "lil-gui";
import * as THREE from "three";
import { Scene, PerspectiveCamera } from "three";
import gsap from "gsap";

//Shaders
import fragment from "/src/shaders/frag.glsl?raw";
import vertex from "/src/shaders/vert.glsl?raw";

import projectsThumb from "./manifest.json";

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

export default class Experience {
  constructor(canvas) {
    this.debug = false;
    this.gui = new GUI();
    this.debugObject = {
      enableOpacity: true,
      enableFadeIn: true,
      apparitionDistance: 2.5,
    };

    this.gui.add(this.debugObject, "enableOpacity");
    this.gui.add(this.debugObject, "enableFadeIn");

    this.texturesArray = Object.entries(projectsThumb);

    this.canvas = canvas;
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.clock = new THREE.Clock();

    // Camera
    this.cameraFov = 110;
    this.cameraZPosition = 0;

    this.currentImg = 0;

    // Mouse
    this.mousePos = {
      x: 0,
      y: 0,
    };

    // Scroll
    this.shiftTop = 0;
    this.scrollTop = 0;
    this.scrollTopDelayed = 0;
    this.maxDeltaY = 75;

    this.projectsMesh = [];
    this.projectsLoaded = false;
    this.projectsScaleFactor = 1.3;

    this.init();
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.setSizeOfView();
    this.createGroup();
    this.loadTextures();

    this.initListeners();

    // this.initDebugPlane();

    this.loop();
  }

  initDebugPlane() {
    const geo = new THREE.PlaneBufferGeometry(0.2, 0.2);
    const mat = new THREE.MeshBasicMaterial({ color: "yellow" });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, 0, -1);
    const angle = {
      value: 0,
    };
    this.gui.add(angle, "value", 0, Math.PI * 2 * 5).onChange(() => {
      mesh.position.x = Math.sin(angle.value) * 1;
      mesh.position.y = Math.cos(angle.value) * 1;
    });
    mesh.position.x = Math.sin(angle.value) * 1;
    mesh.position.y = Math.cos(angle.value) * 1;
    this.scene.add(mesh);
  }

  initScene() {
    this.scene = new Scene();
  }

  initCamera() {
    this.camera = new PerspectiveCamera(
      this.cameraFov,
      this.sizes.width / this.sizes.height,
      0.001,
      100
    );
    this.camera.position.set(0, 0, 0);
    this.scene.add(this.camera);
  }

  setSizeOfView() {
    const vFOV = THREE.MathUtils.degToRad(this.cameraFov); // convert vertical fov to radians
    const height = 2 * Math.tan(vFOV / 2); // visible height
    const width = height * (this.sizes.width / this.sizes.height); // visible width

    this.viewSizes = {
      width,
      height,
    };
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      // alpha: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  loadTextures() {
    const textureLoader = new THREE.TextureLoader();
    this.texturesArray.forEach((img, i) => {
      textureLoader.load(img, (texture) => {
        const width = texture.source.data.naturalWidth;
        const height = texture.source.data.naturalHeight;
        const projectsThumb = { texture, width, height };

        this.createMesh(projectsThumb, i, img);
      });
    });
    console.log(this.projectsMesh);
  }

  createGroup() {
    this.projectsGroup = new THREE.Group();
    this.scene.add(this.projectsGroup);
  }

  createMesh(thumb, i, img) {
    // Offset index to make it start at 1
    const index = i + 1;

    const baseAngle = Math.PI / 3;
    const angle = baseAngle + baseAngle * i;
    // console.log(angle);

    const aspect = thumb.width / thumb.height;

    const planeGeometry = new THREE.PlaneGeometry(aspect, 1, 20, 20);
    const planeMaterial = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      // wireframe: true,
      uniforms: {
        uTexture: { value: thumb.texture },
        uFadeIn: { value: 0 },
        uOpacity: { value: 0 },
        uTime: { value: 0 },
        uShift: { value: 0 },
      },
    });
    const newMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    // const xPosition = Math.sin(angle) * Math.random() * 0.3;
    const xPosition = 0;
    // const yPosition = Math.cos(angle) * Math.random() * 0.3;
    const yPosition = 0;
    const zPosition = index * -1;

    newMesh.position.set(xPosition, yPosition, zPosition);
    // console.log(`z ${i}:`, index * -1);
    newMesh.scale.set(
      this.projectsScaleFactor,
      this.projectsScaleFactor,
      this.projectsScaleFactor
    );
    this.projectsGroup.add(newMesh);

    if (this.debug) {
      const debugMaterial = new THREE.MeshBasicMaterial({
        color: index % 2 ? "red" : "green",
        wireframe: true,
      });
      const newDebugMesh = new THREE.Mesh(planeGeometry, debugMaterial);
      this.scene.add(newDebugMesh);
      newDebugMesh.position.set(xPosition, yPosition, zPosition);
      newDebugMesh.scale.set(
        this.projectsScaleFactor,
        this.projectsScaleFactor,
        this.projectsScaleFactor
      );
    }

    this.projectsMesh[i] = { mesh: newMesh, angle };
    if (this.projectsMesh.length == this.texturesArray.length) {
      this.projectsLoaded = true;
    }
  }

  updateMesh({ mesh, angle }, i, elapsedTime) {
    let fadeIn = this.debugObject.enableFadeIn ? 0 : 1;
    let opacity = 1;

    const distance = mesh.position.z - this.camera.position.z;
    mesh.material.uniforms.uTime.value = elapsedTime;
    mesh.material.uniforms.uShift.value = this.shiftTop;

    if (i == 0) {
      document.querySelector(".debug1").innerText = distance;
    }

    if (Math.abs(distance) < 2.5) {
      mesh.position.x = Math.sin(angle) * (1.5 - Math.abs(distance));
      mesh.position.y = Math.cos(angle) * (1.5 - Math.abs(distance));

      if (i == 0) document.querySelector(".debug2").innerText = mesh.position.x;

      // fadeIn = Math.abs(this.cameraZPosition - this.cameraZOffset);
      if (this.debugObject.enableFadeIn) fadeIn = 1 - Math.abs(distance) / 2.5;
      // if (i == 0) console.log(distance.toFixed(2), mesh.position.x, fadeIn, i);

      if (
        distance >= -0.75 &&
        distance <= 0.75 &&
        this.debugObject.enableOpacity
      )
        opacity = Math.abs(distance) / 0.75;
    } else if (distance > 1.5) {
      fadeIn = 1;
    }

    // else if (this.currentImg >= i - 1) {
    // fadeIn = 1;
    // } else {
    // fadeIn = 0;
    // }
    mesh.material.uniforms.uFadeIn.value = fadeIn;
    mesh.material.uniforms.uOpacity.value = opacity;
    // Math.abs(this.projectsMesh[0].position.z - this.camera.position.z)
  }

  loop() {
    const elapsedTime = this.clock.getElapsedTime();

    // Update scroll
    this.scrollTopDelayed = lerp(this.scrollTopDelayed, this.scrollTop, 0.1);
    this.shiftTop =
      Math.round(this.scrollTop) - Math.round(this.scrollTopDelayed);
    // console.log(this.scrollTopDelayed, this.scrollTop);
    this.camera.position.z = -1 * (this.scrollTopDelayed / window.innerHeight);

    // Update individual project
    if (this.projectsLoaded) {
      this.projectsMesh.forEach((mesh, i) => {
        this.updateMesh(mesh, i, elapsedTime);
      });
    }

    // Update projects group
    //TODO Replace with lerp
    gsap.to(this.projectsGroup.position, {
      x: 0.1 * this.mousePos.x,
      y: 0.1 * this.mousePos.y,
      duration: 1,
      ease: "power4",
    });

    // Render
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(() => this.loop());
  }

  initListeners() {
    this.initResize();
    this.initWheel();
    this.initMousemove();
  }

  initResize() {
    window.addEventListener("resize", () => {
      // Update sizes
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Update view sizes
      this.setSizeOfView();
    });
  }

  initWheel() {
    window.addEventListener("wheel", (e) => {
      // this.scrollDir = e.deltaY < 0 ? -1 : 1;
      // this.scrollTop += Math.min(e.deltaY, this.maxDeltaY * this.scrollDir);
      if (e.deltaY < 0) {
        this.scrollDir = -1;
        this.scrollTop += Math.max(e.deltaY, this.maxDeltaY * this.scrollDir);
      } else {
        this.scrollDir = 1;
        this.scrollTop += Math.min(e.deltaY, this.maxDeltaY * this.scrollDir);
      }

      this.scrollTop = this.scrollTop <= 0 ? 0 : this.scrollTop;
      this.currentImg = Math.trunc(this.scrollTop / window.innerHeight);
      // console.log(currentImg);
      this.cameraZPosition = -1 * (this.scrollTop / window.innerHeight);
      // this.camera.position.z = this.cameraZPosition;
      // console.log(this.scrollTop, this.cameraZPosition, this.currentImg);
    });
  }

  initMousemove() {
    window.addEventListener("mousemove", (e) => {
      this.mousePos.x = e.clientX / (this.sizes.width / 2) - 1;
      this.mousePos.y = e.clientY / (this.sizes.height / 2) - 1;
    });
  }
}
