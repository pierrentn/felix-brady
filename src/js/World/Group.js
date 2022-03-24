import * as THREE from "three";
import Experience from "../Experience";

export default class Group {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.Group();
    this.scene.add(this.instance);
  }
}
