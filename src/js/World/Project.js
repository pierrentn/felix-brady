import * as THREE from "three";
import Experience from "../Experience";

//Shaders
import fragment from "/src/shaders/frag.glsl?raw";
import vertex from "/src/shaders/vert.glsl?raw";

let isDebugSet = false;
export default class Project {
  constructor(project, explore) {
    this.explore = explore;
    this.debugObject = explore.debugObject;

    //Params
    this.project = {};
    this.project.index = project.index;
    this.project.indexOffset = project.index + 1;
    this.project.texture = project.texture;

    //Classes
    this.experience = new Experience();
    this.world = this.experience.world;

    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.camera = this.experience.camera;
    // this.debug = this.experience.debug;
    this.time = this.experience.time;

    // this.explore = this.world.explore;

    //Debug
    // if (this.debug.active && !isDebugSet) {
    // isDebugSet = true;
    // this.debugFolder = this.debug.ui.addFolder("Projects");
    // this.debugObject = {
    //   enableFadeOut: true,
    //   enableFadeIn: true,
    //   enableCircleMovement: true,
    //   // apparitionDistance: 2.5,
    //   disparitionDistance: 0.75,
    //   // maxScrollSpeed: 75,
    //   progress: 1,
    //   blurX: 7,
    //   blurY: -7,
    // };
    // }
    // console.log(this.debugObject);

    //Settings
    this.baseAngle = Math.PI / 3;
    this.angle = this.baseAngle + this.baseAngle * this.project.index;
    this.scaleFactor = 1.3;
    this.apparitionDistance = 2.5;
    this.disparitionDistance = 0.75;

    //Debug Object

    //Setup
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setPosition();
  }

  setGeometry() {
    const textureWidth = this.project.texture.source.data.naturalWidth;
    const textureHeight = this.project.texture.source.data.naturalHeight;
    const aspect = textureWidth / textureHeight;
    this.project.geometry = new THREE.PlaneGeometry(aspect, 1, 20, 20);
  }

  setMaterial() {
    this.project.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      // wireframe: true,
      uniforms: {
        uTexture: { value: this.project.texture },
        uFadeIn: { value: 1 },
        uFadeOut: { value: 1 },
        uTime: { value: 0 },
        uShift: { value: 0 },
        uRez: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
        // uProgress: { value: this.debugObject.progress },
        // uBlurX: { value: this.debugObject.blurX },
        // uBlurY: { value: this.debugObject.blurY },
      },
    });
  }

  setMesh() {
    this.project.mesh = new THREE.Mesh(
      this.project.geometry,
      this.project.material
    );
    this.explore.group.add(this.project.mesh);
  }

  setPosition() {
    const xPosition = 0;
    const yPosition = 0;
    const zPosition = this.project.indexOffset * -1;
    this.project.mesh.position.set(xPosition, yPosition, zPosition);
    this.project.mesh.scale.set(
      this.scaleFactor,
      this.scaleFactor,
      this.scaleFactor
    );
  }

  update() {
    let fadeIn = this.debugObject.enableFadeIn ? 0 : 1;
    let fadeOut = 1;
    const distance =
      this.project.mesh.position.z - this.camera.instance.position.z;
    this.project.material.uniforms.uTime.value = this.time.elapsed;
    // this.project.material.uniforms.uShift.value = this.camera.scrollTop;

    if (this.i == 0) {
      document.querySelector(".debug1").innerText = distance;
    }

    if (Math.abs(distance) - 0.5 < this.apparitionDistance) {
      // console.log(Math.abs(distance), this.distance);

      //TODO Make it depending view size
      if (this.project.index == 0) console.log(this.angle);
      if (Math.abs(distance) - 0.5 < this.apparitionDistance) {
        this.project.mesh.position.x =
          Math.sin(this.angle) * (1.5 - Math.abs(distance));
        this.project.mesh.position.y =
          Math.cos(this.angle) * (1.5 - Math.abs(distance));
      }

      // if (this.i == 0) document.querySelector(".debug2").innerText = this.project.mesh.position.x;

      // fadeIn = Math.abs(this.cameraZPosition - this.cameraZOffset);
      if (this.debugObject.enableFadeIn)
        fadeIn = 1 - (Math.abs(distance) - 0.5) / this.apparitionDistance;
      // if (this.i == 0) console.log(distance.toFixed(2), this.project.mesh.position.x, fadeIn, i);
      if (this.i == 0) console.log(fadeIn);

      // if (
      //   distance >= -this.disparitionDistance &&
      //   distance <= this.disparitionDistance &&
      //   this.debugObject.enableFadeOut
      // )
      fadeOut = (-1 * distance) / this.disparitionDistance;
    } else if (distance > this.apparitionDistance) {
      fadeIn = 1;
    }

    // else if (this.currentImg >= i - 1) {
    // fadeIn = 1;
    // } else {
    // fadeIn = 0;
    // }
    this.project.material.uniforms.uFadeIn.value = fadeIn;
    // this.project.material.uniforms.uFadeIn.value = 1;
    this.project.material.uniforms.uFadeOut.value = fadeOut;
    // this.project.material.uniforms.uFadeOut.value = 1;
    // Math.abs(this.projectsMesh[0].position.z - this.camera.position.z)
  }
}
