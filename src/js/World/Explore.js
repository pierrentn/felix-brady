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
      uBlurOnly: false,
      uBlurChoice: 0,
      uBlurDirections: 16,
      uBlurQuality: 4,
      uBlurSize: 16,
      uBlurX: 7,
      uBlurY: 7,
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

      this.blurDebugFolder = this.debugFolder.addFolder("Blur");
      this.blurDebugFolder
        .add(this.debugObject, "uBlurChoice", [0, 1])
        .onChange((val) => {
          this.projects.forEach((project) => {
            project.project.material.uniforms.uBlurChoice.value = val;
          });
        });
      this.blurDebugFolder
        .add(this.debugObject, "uBlurOnly")
        .name("Show blur only")
        .onChange((val) => {
          this.projects.forEach((project) => {
            project.project.material.uniforms.uBlurOnly.value = val;
          });
        });

      //Blur 0
      this.blurDebugFolder
        .add(this.debugObject, "uBlurDirections", 16, 40)
        .name("blur0 direction")
        .onChange(() => {
          this.projects.forEach((project) => {
            project.project.material.uniforms.uBlurDirections.value =
              this.debugObject.uBlurDirections;
          });
        });
      this.blurDebugFolder
        .add(this.debugObject, "uBlurQuality", 4, 15)
        .name("blur0 quality")
        .onChange(() => {
          this.projects.forEach((project) => {
            project.project.material.uniforms.uBlurQuality.value =
              this.debugObject.uBlurQuality;
          });
        });
      this.blurDebugFolder
        .add(this.debugObject, "uBlurSize", 8, 32)
        .name("blur0 size")
        .onChange(() => {
          this.projects.forEach((project) => {
            project.project.material.uniforms.uBlurSize.value =
              this.debugObject.uBlurSize;
          });
        });

      //Blur 1
      this.blurDebugFolder
        .add(this.debugObject, "uBlurX", -16, 16)
        .name("blur1 directionX")
        .onChange(() => {
          this.projects.forEach((project) => {
            project.project.material.uniforms.uBlurX.value =
              this.debugObject.uBlurX;
          });
        });
      this.blurDebugFolder
        .add(this.debugObject, "uBlurY", -16, 16)
        .name("blur1 directionY")
        .onChange(() => {
          this.projects.forEach((project) => {
            project.project.material.uniforms.uBlurY.value =
              this.debugObject.uBlurY;
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
