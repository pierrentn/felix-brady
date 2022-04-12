import * as THREE from "three";

import Sizes from "./Utils/Sizes";
import Mouse from "./Utils/Mouse";
import Time from "./Utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./World/World";
import Ressources from "./Utils/Ressources";
import Scroll from "./Utils/Scroll";
import sources from "./manifest";
import Debug from "./Utils/Debug";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) return instance;
    instance = this;

    window.experience = this;

    this.canvas = canvas;

    this.debug = new Debug();
    this.sizes = new Sizes();
    this.mouse = new Mouse();
    this.scroll = new Scroll();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.ressources = new Ressources(sources);
    this.camera = new Camera();
    this.camera.resize();
    this.renderer = new Renderer();
    this.world = new World();

    this.sizes.on("resize", () => this.resize());
    this.time.on("tick", () => this.update());
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    if (this.debug.active) this.debug.statsBegin();
    this.mouse.update();
    this.camera.update();
    this.world.update();
    this.renderer.update();
    if (this.debug.active) this.debug.statsEnd();
  }
}
