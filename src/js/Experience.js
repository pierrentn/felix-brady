import * as THREE from "three";

import Sizes from "./Utils/Sizes";
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
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.ressources = new Ressources(sources);
    this.scroll = new Scroll();
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
    this.renderer.update();
    this.world.update();
    if (this.debug.active) this.debug.update();
  }
}
