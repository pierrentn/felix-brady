import * as THREE from "three";
import Experience from "../Experience";

//Shaders
import fragment from "/src/shaders/frag.glsl?raw";
import vertex from "/src/shaders/vert.glsl?raw";

let isDebugSet = false;
export default class Project {
  constructor(project, explore) {
    this.debugObject = explore.debugObject;

    //Params
    this.project = {};
    this.project.index = project.index;
    this.project.indexOffset = project.index + 1;
    this.project.texture = project.texture;

    //Classes
    this.experience = new Experience();
    this.explore = explore;
    this.world = this.experience.world;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.camera = this.experience.camera;
    this.time = this.experience.time;

    //Settings
    this.baseAngle = -Math.PI / 2;
    this.angle = this.baseAngle + Math.PI * this.project.index;
    this.scaleFactor = 1.3;
    //base apparition dist
    this.apparitionDistance = 2.5;
    //end fade in dist
    this.fullFadeInDist = 0.5;
    //define start dist of fade out
    this.disparitionDistance = 0.75;

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
      uniforms: {
        uTexture: { value: this.project.texture },
        uFadeIn: { value: 1 },
        uFadeOut: { value: 1 },
        uTime: { value: 0 },
        uShift: { value: 0 },
        uRez: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
        uProgress: { value: this.debugObject.progress },
        uBlurChoice: { value: this.debugObject.uBlurChoice },
        uBlurX: { value: this.debugObject.blurX },
        uBlurY: { value: this.debugObject.blurY },
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

  //TODO Make full visibility interval clearer

  update() {
    const { mesh, material } = this.project;

    let fadeIn = this.debugObject.enableFadeIn ? 0 : 1;
    let fadeOut = 1;
    //Distance between camera and project
    const distance = Math.abs(
      mesh.position.z - this.camera.instance.position.z
    );
    // if (this.project.index == 0) console.log(distance);

    //If in active zone (project pos, fadeIn, fadeOut)
    if (distance - this.fullFadeInDist < this.apparitionDistance) {
      this.isTriggered = [true, distance];

      //TODO Make it depending view size
      if (this.debugObject.enableDisplacementMovement) {
        mesh.position.x = Math.sin(this.angle) * (1.5 - distance);
        mesh.position.y = Math.cos(this.angle) * (1.5 - distance);
      }

      if (this.debugObject.enableFadeIn)
        fadeIn = 1 - (distance - this.fullFadeInDist) / this.apparitionDistance;
      if (this.debugObject.enableFadeOut)
        fadeOut = distance / this.disparitionDistance;
    } else {
      this.isTriggered = [false, distance];
    }

    if (this.project.index == 0) {
      // console.log("------------------------");
      // console.log("fadeOut", fadeOut.toFixed(2));
      // // console.log("fadeIn", fadeIn.toFixed(2));
      // console.log("distance", distance);
    }

    //Update project uniforms
    material.uniforms.uFadeIn.value = fadeIn;
    material.uniforms.uFadeOut.value = fadeOut;
    material.uniforms.uTime.value = this.time.elapsed;
  }
}

/**
 * 1 - x / 2.5 = 1
 * x / 2.5 = 0
 * x = 0
 */
