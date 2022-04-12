import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Experience from "./Experience";
import { lerp } from "./Utils/Maths";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;
    this.ui = this.debug.ui;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.scroll = this.experience.scroll.instance;

    this.debugObject = {
      cameraMode: "classic",
      cameraFov: 110,
      lerpIntensity: 0.03,
    };

    this.scrollTop = 0;
    this.delayedScrollTop = 0;

    this.setInstance();
    if (this.debugObject.cameraMode === "debug") this.setControls();
    if (this.debug.active) this.setDebug();
    this.scroll.on((e) => {
      this.updatePosition(e);
    });
  }

  setDebug() {
    this.debugPara = document.querySelector(".debug1");
    this.debugFolder = this.ui.addFolder("Camera");
    this.debugFolder.close();
    this.debugFolder
      .add(this.debugObject, "cameraFov", 0, 179)
      .onChange((val) => {
        this.instance.fov = val;
        this.instance.updateProjectionMatrix();
      });
    this.debugFolder.add(this.debugObject, "lerpIntensity", 0.01, 1);
    this.debugFolder
      .add(this.debugObject, "cameraMode", ["classic", "debug"])
      .onChange((val) => this.switchCameraMode(val));
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      this.debugObject.cameraFov,
      this.sizes.width / this.sizes.height,
      0.001,
      100
    );
    this.instance.position.set(0, 0, 0);
    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  switchCameraMode(mode) {
    if (mode === "debug") {
      this.setControls();
    } else {
      this.controls == null;
      this.setInstance();
    }
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  updatePosition(e) {
    this.scrollTop += e.deltaY;
    this.scrollTop = this.scrollTop >= 0 ? 0 : this.scrollTop;
  }

  update() {
    if (this.debugObject.cameraMode && this.debugObject.cameraMode === "debug")
      this.controls.update();

    this.delayedScrollTop = lerp(
      this.delayedScrollTop,
      this.scrollTop,
      this.debugObject.lerpIntensity
    );

    if (
      this.debugObject.cameraMode &&
      this.debugObject.cameraMode === "classic"
    )
      this.instance.position.z = this.delayedScrollTop;
    if (this.debugPara)
      this.debugPara.innerText = this.instance.position.z.toFixed(2);
  }
}
