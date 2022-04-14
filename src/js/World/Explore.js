import * as THREE from "three";
import Experience from "../Experience";
import Project from "./Project";

export default class Explore {
  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera.instance;
    this.scroll = this.experience.scroll;
    this.mouse = this.experience.mouse;
    this.debug = this.experience.debug;
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.currentProjectIndex = 0;

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

  copyProject() {
    const index = this.currentProjectIndex % this.ressources.items.length;
    console.log(index);
    let copyProject = this.ressources.items[0];
    for (const a of this.projects) {
      console.log(a);
      if (a.project.index === this.currentProjectIndex) {
        copyProject = a.project;
      }
    }
    copyProject.index =
      this.currentProjectIndex + this.ressources.items.length - 1;
    // console.log(copyProject.index);
    this.projects.push(new Project(copyProject, this));
  }
  //-1 on recule 1 on avance
  moveProject() {
    let indexProjectToMove;
    let newPosition;
    if (this.scroll.scrollDir === 1) {
      const index = (this.currentProjectIndex - 2) % this.projects.length;
      // console.log("move forward", index);
      for (const a of this.projects) {
        if (a.project.index === index) {
          a.project.mesh.position.z -= this.ressources.items.length;
          console.log(a.project.index, "moved forward");
        }
      }
    }
    if (this.scroll.scrollDir === -1) {
      const index = (this.currentProjectIndex - 1) % this.projects.length;
      // console.log("move backward", index);
      for (const a of this.projects) {
        if (a.project.index === index) {
          console.log(a.project.index);
          a.project.mesh.position.z += this.ressources.items.length;
          console.log(a.project.index, "moved backward");
        }
      }
    }

    // for (const a of this.projects) {
    //   console.log(a);
    //   if (a.project.index === index) {
    //     a.project.mesh.position.z -= this.ressources.items.length;
    //   }
    // }
    // //math min max
    // const index =
    //   (this.currentProjectIndex - 1 * direction) % this.projects.length;
    // console.log(index);
    // for (const a of this.projects) {
    //   console.log(a);
    //   if (a.project.index === index) {
    //     a.project.mesh.position.z -= this.ressources.items.length;
    //   }
    // }
  }

  update() {
    this.group.position.x = this.mouse.delayedMousePos.x * 0.1;
    this.group.position.y = this.mouse.delayedMousePos.y * 0.1;

    let TmpCurrentProjectIndex = Math.ceil(this.camera.position.z * -1) - 1;
    TmpCurrentProjectIndex =
      TmpCurrentProjectIndex <= 0 ? 0 : TmpCurrentProjectIndex;
    // console.log(TmpCurrentProjectIndex);
    if (TmpCurrentProjectIndex != this.currentProjectIndex) {
      this.currentProjectIndex = TmpCurrentProjectIndex;
      this.moveProject();
    }
  }
}
