import Experience from "../Experience";
import EventEmitter from "./EventEmitter";
import { lerp } from "./Maths.js";

export default class Mouse extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();
    this.sizes = this.experience.sizes;

    this.mousePos = { x: 0, y: 0 };
    this.delayedMousePos = { x: 0, y: 0 };

    window.addEventListener("mousemove", (e) => this.setMouse(e));
  }

  setMouse(e) {
    this.mousePos.x = e.clientX / (this.sizes.width / 2) - 1;
    this.mousePos.y = e.clientY / (this.sizes.height / 2) - 1;
  }

  update() {
    this.delayedMousePos.x = lerp(
      this.delayedMousePos.x,
      this.mousePos.x,
      0.05
    );
    this.delayedMousePos.y = lerp(
      this.delayedMousePos.y,
      this.mousePos.y,
      0.05
    );
  }
}
