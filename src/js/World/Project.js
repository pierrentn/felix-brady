import * as THREE from "three";
import Experience from "../Experience";

//Shaders
import fragment from "/src/shaders/frag.glsl?raw";
import vertex from "/src/shaders/vert.glsl?raw";

export default class Project {
  constructor(project) {
    this.project = {};
    this.project.index = project.index;
    this.project.indexOffset = project.index + 1;
    this.project.texture = project.texture;
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.camera = this.experience.camera;
    this.world = this.experience.world;

    this.baseAngle = Math.PI / 3;
    this.scaleFactor = 1.3;
    this.apparitionDistance = 2.5;
    this.disparitionDistance = 0.75;

    this.scene.add(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({ color: "red" })
    );

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setPosition();
  }

  setGeometry() {
    const aspect = this.project.texture.width / this.project.texture.height;
    this.project.geometry = new THREE.PlaneGeometry(aspect, 1, 20, 20);
  }

  setMaterial() {
    // this.project.material = new THREE.ShaderMaterial({
    //   vertexShader: vertex,
    //   fragmentShader: fragment,
    //   transparent: true,
    //   // wireframe: true,
    //   uniforms: {
    //     uTexture: { value: this.project.texture },
    //     uFadeIn: { value: 0 },
    //     uFadeOut: { value: 0 },
    //     uTime: { value: 0 },
    //     uShift: { value: 0 },
    //     uRez: { value: new THREE.Vector2(this.sizes.width, this.sizes.height) },
    //     // uProgress: { value: this.debugObject.progress },
    //     // uBlurX: { value: this.debugObject.blurX },
    //     // uBlurY: { value: this.debugObject.blurY },
    //   },
    // });
    this.project.material = new THREE.MeshBasicMaterial({ color: "red" });
  }

  setMesh() {
    this.project.mesh = new THREE.Mesh(
      this.project.geometry,
      this.project.material
    );
    this.world.group.add(this.project.mesh);
  }

  setPosition() {
    const xPosition = 0;
    const yPosition = 0;
    const zPosition = this.indexOffset * -1;

    this.project.mesh.position.set(xPosition, yPosition, zPosition);
    this.project.mesh.scale.set(
      this.scaleFactor,
      this.scaleFactor,
      this.scaleFactor
    );
  }
}
