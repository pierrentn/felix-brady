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
    this.apparitionDistance = 2.5;
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

  update() {
    const { mesh, material } = this.project;

    let fadeIn = this.debugObject.enableFadeIn ? 0 : 1;
    let fadeOut = 1;
    const distance = mesh.position.z - this.camera.instance.position.z;
    material.uniforms.uTime.value = this.time.elapsed;

    if (Math.abs(distance) - 0.5 < this.apparitionDistance) {
      //TODO Make it depending view size
      mesh.position.x = Math.sin(this.angle) * (1.5 - Math.abs(distance));
      mesh.position.y = Math.cos(this.angle) * (1.5 - Math.abs(distance));

      if (this.debugObject.enableFadeIn)
        fadeIn = 1 - (Math.abs(distance) - 0.5) / this.apparitionDistance;
      if (this.i == 0) console.log(fadeIn);

      if (this.debugObject.enableFadeOut)
        fadeOut = (-1 * distance) / this.disparitionDistance;
    }

    material.uniforms.uFadeIn.value = fadeIn;
    material.uniforms.uFadeOut.value = fadeOut;
  }
}
