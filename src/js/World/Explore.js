import * as THREE from "three";
import Experience from "../Experience";
import Project from "./Project";

export default class Explore {
  constructor() {
    this.experience = new Experience();
    this.mouse = this.experience.mouse;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;

    this.setGroup();
  }

  setDebug() {
    this.debugObject = {
      enableFadeOut: true,
      enableFadeIn: true,
      enableDisplacementMovement: true,
      // apparitionDistance: 2.5,
      disparitionDistance: 0.75,
      progress: 1,
      blurX: 7,
      blurY: -7,
    };

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Projects");
      this.debugFolder.add(this.debugObject, "enableFadeOut");
      this.debugFolder.add(this.debugObject, "enableFadeIn");
      this.debugFolder.add(this.debugObject, "enableDisplacementMovement");
      this.debugFolder.add(this.debugObject, "progress", 0, 1).onChange(() => {
        this.projects.forEach((project) => {
          console.log(project.project.material.uniforms);
          project.project.material.uniforms.uProgress.value =
            this.debugObject.progress;
        });
      });
      this.debugFolder.add(this.debugObject, "blurX", -16, 16).onChange(() => {
        this.projects.forEach((project) => {
          project.project.material.uniforms.uBlurX.value =
            this.debugObject.blurX;
        });
      });
      this.debugFolder.add(this.debugObject, "blurY", -16, 16).onChange(() => {
        this.projects.forEach((project) => {
          project.project.material.uniforms.uBlurY.value =
            this.debugObject.blurY;
        });
      });
    }
  }

  setGroup() {
    this.group = new THREE.Group();
    this.projects = [];
    this.scene.add(this.group);
  }

  setProjects() {
    this.setDebug();
    this.ressources.items.forEach((item) => {
      this.projects.push(new Project(item, this));
    });
  }

  update() {
    this.group.position.x = this.mouse.delayedMousePos.x * 0.1;
    this.group.position.y = this.mouse.delayedMousePos.y * 0.1;
  }
}
