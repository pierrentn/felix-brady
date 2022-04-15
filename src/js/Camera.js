import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Experience from "./Experience";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;
    this.ui = this.debug.ui;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.scroll = this.experience.scroll;

    this.debugObject = {
      cameraMode: "classic",
      cameraFov: 110,
      baseCameraZ: 0.5,
    };

    this.setInstance();
    this.calcVisibleSize();
    if (this.debugObject.cameraMode === "debug") this.setControls();
    if (this.debug.active) this.setDebug();
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
    this.instance.position.set(0, 0, this.debugObject.baseCameraZ);
    this.scene.add(this.instance);
  }

  calcVisibleSize() {
    this.visibleSize = {};
    let depth = -1;

    //https://discourse.threejs.org/t/functions-to-calculate-the-visible-width-height-at-a-given-z-depth-from-a-perspective-camera/269
    this.visibleSize.height = this.calcHeight(depth);
    this.visibleSize.width = this.calcWidth();
  }

  calcHeight(depth) {
    // compensate for cameras not positioned at z=0
    const cameraOffset = this.instance.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = (this.instance.fov * Math.PI) / 180;

    // Math.abs to ensure the result is always positive
    return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
  }

  calcWidth() {
    const height = this.visibleSize.height;
    return height * this.instance.aspect;
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

    if (
      this.debugObject.cameraMode &&
      this.debugObject.cameraMode === "classic"
    )
      this.instance.position.z =
        this.scroll.delayedScrollTop + this.debugObject.baseCameraZ;
    if (this.debugPara)
      this.debugPara.innerText = this.instance.position.z.toFixed(2);
  }
}
