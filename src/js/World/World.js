import Explore from "./Explore";
import Experience from "../Experience";
import Projects from "./Project";
import { GridHelper } from "three";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.ressources = this.experience.ressources;
    this.explore = new Explore();

    if (this.debug.active) this.setGrid();
    this.ressources.on("ready", () => {
      this.explore.setProjects();
    });
  }

  setGrid() {
    this.gridHelper = new GridHelper(100, 100);
    this.scene.add(this.gridHelper);
  }

  update() {
    this.explore.update();
    if (this.explore.projects.length) {
      this.explore.projects.forEach((project) => {
        project.update();
      });
    }
  }
}
