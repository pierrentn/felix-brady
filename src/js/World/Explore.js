import * as THREE from "three";
import Experience from "../Experience";
import Project from "./Project";

export default class Explore {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;

    //Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Projects");
      this.debugObject = {
        enableFadeOut: true,
        enableFadeIn: true,
        enableCircleMovement: true,
        // apparitionDistance: 2.5,
        disparitionDistance: 0.75,
        // maxScrollSpeed: 75,
        progress: 1,
        blurX: 7,
        blurY: -7,
      };
    }

    this.setGroup();
  }

  setGroup() {
    this.group = new THREE.Group();
    this.projects = [];
    this.scene.add(this.group);
  }

  setProjects() {
    this.ressources.items.forEach((item) => {
      this.projects.push(new Project(item, this));
    });
  }

  update() {
    if (this.projects.length) {
      this.projects.forEach((project) => {
        project.update();
      });
    }
  }
}
