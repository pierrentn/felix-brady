import GUI from "lil-gui";
import Stats from "stats.js";
import * as THREE from "three";
import { Scene, PerspectiveCamera } from "three";
import gsap from "gsap";

//Classes
import Project from "./Old_Project";

import projectsThumb from "./manifest";
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

export default class Experience {
  constructor(canvas) {
    this.gui = new GUI();
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
    // this.gui.close();
    this.debugObject = {
      enableFadeOut: true,
      enableFadeIn: true,
      enableCircleMovement: true,
      // apparitionDistance: 2.5,
      disparitionDistance: 0.75,
      maxScrollSpeed: 75,
      progress: 1,
      blurX: 7,
      blurY: -7,
    };
    this.debug = false;
    //TODO Not working
    this.gui.add(this.debugObject, "enableFadeOut");
    this.gui.add(this.debugObject, "enableFadeIn");
    this.gui.add(this.debugObject, "enableCircleMovement");
    this.gui.add(this.debugObject, "progress", 0, 1).onChange(() => {
      this.projectsMesh.forEach((mesh) => {
        mesh.mesh.material.uniforms.uProgress.value = this.debugObject.progress;
      });
    });
    this.gui.add(this.debugObject, "blurX", -16, 16).onChange(() => {
      this.projectsMesh.forEach((mesh) => {
        mesh.mesh.material.uniforms.uBlurX.value = this.debugObject.blurX;
      });
    });
    this.gui.add(this.debugObject, "blurY", -16, 16).onChange(() => {
      this.projectsMesh.forEach((mesh) => {
        mesh.mesh.material.uniforms.uBlurY.value = this.debugObject.blurY;
      });
    });

    this.texturesArray = Object.values(projectsThumb);
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
    this.maxDeltaY = this.debugObject.maxScrollSpeed;
    this.gui
      .add(this.debugObject, "maxScrollSpeed", 30, 200)
      .onChange(() => (this.maxDeltaY = this.debugObject.maxScrollSpeed));

    this.projectsMesh = [];
    this.projectsLoaded = false;
    // this.projectsScaleFactor = 1.3;

    //Gallery params
    // this.apparitionDistance = this.debugObject.apparitionDistance;
    // this.gui
    //   .add(this.debugObject, "apparitionDistance", 0.1, 4)
    //   .onChange(
    //     () => (this.apparitionDistance = this.debugObject.apparitionDistance)
    //   );
    // this.disparitionDistance = this.debugObject.disparitionDistance;
    // this.gui
    //   .add(this.debugObject, "disparitionDistance", 0.1, 4)
    //   .onChange(
    //     () => (this.disparitionDistance = this.debugObject.disparitionDistance)
    //   );

    this.init();
  }

  init() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initPostProcessing();
    this.setSizeOfView();
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

  initPostProcessing() {}

  loadTextures() {
    const textureLoader = new THREE.TextureLoader();
    this.texturesArray.forEach((img, i) => {
      textureLoader.load(img, (texture) => {
        texture.minFilter = THREE.minFilter;
        texture.magFilter = THREE.LinearFilter;

        const width = texture.source.data.naturalWidth;
        const height = texture.source.data.naturalHeight;
        const projectsThumb = { texture, width, height };

        this.projectsMesh[i] = new Project(
          projectsThumb,
          i,
          img,
          this.projectsGroup,
          this.projectsMesh,
          this.camera,
          this.debugObject
        );
      });
    });
  }

  createGroup() {
    this.projectsGroup = new THREE.Group();
    this.scene.add(this.projectsGroup);
  }

  loop() {
    this.stats.begin();

    const elapsedTime = this.clock.getElapsedTime();

    // Update scroll
    this.scrollTopDelayed = lerp(this.scrollTopDelayed, this.scrollTop, 0.1);
    this.shiftTop =
      Math.round(this.scrollTop) - Math.round(this.scrollTopDelayed);
    // console.log(this.scrollTopDelayed, this.scrollTop);
    this.camera.position.z = -1 * (this.scrollTopDelayed / window.innerHeight);

    // Update individual project
    // ! REMOVE FALSE
    if (this.projectsMesh.length == this.texturesArray.length) {
      this.projectsMesh.forEach((project) => {
        // this.updateMesh(mesh, i, elapsedTime);
        project.update(elapsedTime, this.shiftTop);
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

    this.stats.end();

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
      if (e.deltaY < 0) {
        this.scrollDir = -1;
        this.scrollTop += Math.max(e.deltaY, this.maxDeltaY * this.scrollDir);
      } else {
        this.scrollDir = 1;
        this.scrollTop += Math.min(e.deltaY, this.maxDeltaY * this.scrollDir);
      }

      this.scrollTop = this.scrollTop <= 0 ? 0 : this.scrollTop;
      this.currentImg = Math.trunc(this.scrollTop / window.innerHeight);
      this.cameraZPosition = -1 * (this.scrollTop / window.innerHeight);
    });
  }

  initMousemove() {
    window.addEventListener("mousemove", (e) => {
      this.mousePos.x = e.clientX / (this.sizes.width / 2) - 1;
      this.mousePos.y = e.clientY / (this.sizes.height / 2) - 1;
    });
  }
}
