import * as THREE from "three";
import Experience from "../Experience";

//Shaders
import fragment from "/src/shaders/project/projectFragment.glsl?raw";
import vertex from "/src/shaders/project/projectVertex.glsl?raw";

let isDebugSet = false;
export default class Project {
  constructor(project, exploreInstance) {
    this.debugObject = exploreInstance.debugObject;
    //Params
    this.project = {};
    this.project.index = project.index;
    this.project.indexOffset = project.index + 1;
    this.project.texture = project.texture;

    //Classes
    this.experience = new Experience();
    this.explore = exploreInstance;
    this.world = this.experience.world;
    this.mouse = this.experience.mouse;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.camera = this.experience.camera;
    this.time = this.experience.time;

    //Settings
    this.baseAngle = Math.PI / 2;
    this.angle = (Math.PI / 2) * this.project.index;
    // this.baseAngle = -Math.PI / 2;
    // this.angle = this.baseAngle + Math.PI * this.project.index;
    this.scaleFactor = 0.7;
    //base apparition dist
    this.apparitionDistance = 10.5;
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
        uBlurChoice: { value: this.debugObject.uBlurChoice },
        uBlurOnly: { value: this.debugObject.uBlurOnly },
        uBlurDirections: { value: this.debugObject.uBlurDirections },
        uBlurQuality: { value: this.debugObject.uBlurQuality },
        uBlurSize: { value: this.debugObject.uBlurSize },
        uProgress: { value: this.debugObject.progress },
        uBlurX: { value: this.debugObject.uBlurX },
        uBlurY: { value: this.debugObject.uBlurY },
      },
      side: THREE.DoubleSide,
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
    this.maxWidth =
      this.camera.visibleSize.width / 2 -
      this.project.geometry.parameters.width;
    this.maxHeight =
      this.camera.visibleSize.height / 2 -
      this.project.geometry.parameters.height;
    // const xPosition = 0;
    // const yPosition = 0;
    const randX = (Math.random() - 0.5) * 2.5;
    const randY = (Math.random() - 0.5) * 2.5;
    // this.xPosition = 1.5 * rand;
    this.xPosition = randX * this.maxWidth;
    // this.xPosition = (Math.random() - 0.5) * 2 * 0.5;
    this.yPosition = randY * this.maxHeight;
    // this.yPosition = (Math.random() - 0.5) * 2 * 1;

    //TODO Add tweak
    const zPosition = this.project.indexOffset * -1;

    this.project.mesh.position.set(this.xPosition, this.yPosition, zPosition);
    if (this.project.index % 2 == 0) {
      this.project.mesh.position.x += 0.5;
      this.project.mesh.position.y += 0.5;
    }
    this.project.mesh.scale.set(
      this.scaleFactor,
      this.scaleFactor,
      this.scaleFactor
    );
    this.project.mesh.rotation.set(
      (this.yPosition / this.maxHeight) * 0.1,
      ((this.xPosition * -1) / this.maxWidth) * 0.3,
      0
    );
  }

  update() {
    const { mesh, material } = this.project;

    // mesh.rotation.copy(this.camera.instance.rotation);
    mesh.rotation.x = this.mouse.mouseRotation.x;
    mesh.rotation.y = this.mouse.mouseRotation.y;

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
        mesh.position.x =
          this.xPosition + Math.sin(this.angle) * (1.5 - distance);
        mesh.position.y =
          this.yPosition + Math.cos(this.angle) * (1.5 - distance);
      }

      if (this.debugObject.enableFadeIn)
        fadeIn = 1 - (distance - this.fullFadeInDist) / this.apparitionDistance;
      if (this.debugObject.enableFadeOut)
        fadeOut = distance / this.disparitionDistance;
    } else {
      this.isTriggered = [false, distance];
    }

    //Update project uniforms
    material.uniforms.uFadeIn.value = fadeIn;
    material.uniforms.uFadeOut.value = fadeOut;
    material.uniforms.uTime.value = this.time.elapsed;
  }
}
