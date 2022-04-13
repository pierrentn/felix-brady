import { Clock } from "three";
import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.clock = new Clock();

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    this.elapsed = this.clock.getElapsedTime();

    this.trigger("tick");

    window.requestAnimationFrame(() => this.tick());
  }
}
