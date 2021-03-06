import Experience from "../Experience";
import EventEmitter from "./EventEmitter";
import { lerp } from "./Maths.js";

export default class Mouse extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.sizes = this.experience.sizes;

    this.debugObject = {
      lerpIntensity: 0.05,
    };
    this.mousePos = { x: 0, y: 0 };
    this.delayedMousePos = { x: 0, y: 0 };
    this.mouseRotation = { x: 0, y: 0 };

    window.addEventListener("mousemove", (e) => this.setMouse(e));
    if (this.debug.active) this.setDebug();
  }

  setDebug() {
    this.debugFolder = this.debug.ui.addFolder("Mouse");
    this.debugFolder.close();
    this.debugFolder.add(this.debugObject, "lerpIntensity", 0, 0.5);
  }

  setMouse(e) {
    this.mousePos.x = e.clientX / (this.sizes.width / 2) - 1;
    this.mousePos.y = e.clientY / (this.sizes.height / 2) - 1;
  }

  update() {
    this.delayedMousePos.x = lerp(
      this.delayedMousePos.x,
      this.mousePos.x,
      this.debugObject.lerpIntensity
    );
    this.delayedMousePos.y = lerp(
      this.delayedMousePos.y,
      this.mousePos.y,
      this.debugObject.lerpIntensity
    );
    this.mouseRotation.x = this.delayedMousePos.y * -1 * 0.35;
    this.mouseRotation.y = this.delayedMousePos.x * -1 * 0.35;
  }
}
