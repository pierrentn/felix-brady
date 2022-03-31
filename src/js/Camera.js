import * as THREE from "three";

import Experience from "./Experience";
import { lerp } from "./Utils/Maths";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.scroll = this.experience.scroll.instance;

    this.cameraFov = 110;
    this.scrollTop = 0;
    this.delayedScrollTop = 0;

    this.setInstance();
    this.scroll.on((e) => {
      this.updatePosition(e);
    });
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      this.cameraFov,
      this.sizes.width / this.sizes.height,
      0.001,
      100
    );
    this.instance.position.set(0, 0, 0);
    this.scene.add(this.instance);
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
    this.delayedScrollTop = lerp(this.delayedScrollTop, this.scrollTop, 0.1);
    this.instance.position.z = this.delayedScrollTop;
  }
}
