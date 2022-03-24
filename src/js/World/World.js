import { Group } from "three";
import Experience from "../Experience";
import Projects from "./Project";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.group = new Group();
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;

    this.ressources.on("ready", () => {
      this.ressources.items.forEach((item) => {
        this.project = new Projects(item);
      });
    });
  }
}
