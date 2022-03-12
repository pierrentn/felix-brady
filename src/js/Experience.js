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
    this.canvas = canvas;
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.clock = new THREE.Clock();

    // Camera
    this.cameraFov = 100;
    this.cameraZOffset = 1;
    this.cameraZPosition = this.cameraZOffset;

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

    this.projectsMesh = [];

    this.init();
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();

    this.createGroup();
    this.loadTextures();

    this.initListeners();

    this.loop();
  }

  initScene() {
    this.scene = new Scene();
  }

  initCamera() {
    this.camera = new PerspectiveCamera(
      100,
      this.sizes.width / this.sizes.height,
      0.1,
      this.cameraFov
    );
    this.camera.position.set(0, 0, this.cameraZOffset);
    this.scene.add(this.camera);
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
    Object.entries(projectsThumb).forEach((img, i) => {
      textureLoader.load(img, (texture) => {
        const width = texture.source.data.naturalWidth;
        const height = texture.source.data.naturalHeight;
        const projectsThumb = { texture, width, height };

        this.createMesh(projectsThumb, i);
      });
    });
  }

  createGroup() {
    this.projectsGroup = new THREE.Group();
    this.scene.add(this.projectsGroup);
  }

  createMesh(thumb, index) {
    const aspect = thumb.width / thumb.height;

    const planeGeometry = new THREE.PlaneGeometry(aspect, 1, 20, 20);
    const planeMaterial = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      // wireframe: true,
      uniforms: {
        uTexture: { value: thumb.texture },
        uOpacity: { value: index == 0 ? 1 : 0.0 },
        uTime: { value: 0 },
        uShift: { value: 0 },
      },
    });
    const newMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    // newMesh.material.map = thumb.texture;
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
    this.projectsGroup.add(newMesh);

    this.projectsMesh.push(newMesh);
  }

  loop() {
    const elapsedTime = this.clock.getElapsedTime();
    this.scrollTopDelayed = lerp(this.scrollTopDelayed, this.scrollTop, 0.1);
    this.shiftTop =
      Math.round(this.scrollTop) - Math.round(this.scrollTopDelayed);

    if (this.projectsMesh.length) {
      this.projectsMesh.forEach((mesh, i) => {
        mesh.material.uniforms.uTime.value = elapsedTime;
        mesh.material.uniforms.uShift.value = this.shiftTop;
        // console.log(mesh.material.uniforms.uTime.value);
        if (this.currentImg == i - 1) {
          mesh.material.uniforms.uOpacity.value =
            Math.abs(this.cameraZPosition - 0.5 - (this.cameraZOffset - 0.5)) %
            1;
          // console.log(
          //   i,
          //   Math.abs(cameraZPosition - 0.5 - (cameraZOffset - 0.5)) % 1
          // );
        }
      });
    }

    // projectsGroup.position.y = 0.1 * mousePos.y;
    // projectsGroup.position.x = 0.1 * mousePos.x;
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
    });
  }

  initWheel() {
    window.addEventListener("wheel", (e) => {
      // scrollTop = window.scrollY;
      this.scrollTop += e.deltaY;
      this.scrollTop = this.scrollTop <= 0 ? 0 : this.scrollTop;
      console.log(this.scrollTop);
      this.currentImg = Math.trunc(this.scrollTop / window.innerHeight);
      // console.log(currentImg);
      // console.log(cameraZOffset + -1 * (this.scrollTop / window.innerHeight));
      this.cameraZPosition =
        this.cameraZOffset + -1 * (this.scrollTop / window.innerHeight);
      this.camera.position.z = this.cameraZPosition;
    });
  }

  initMousemove() {
    window.addEventListener("mousemove", (e) => {
      this.mousePos.x = e.clientX / (this.sizes.width / 2) - 1;
      this.mousePos.y = e.clientY / (this.sizes.width / 2) - 1;
    });
  }
}
