import Explore from "./Explore";
import Experience from "../Experience";
import Projects from "./Project";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.ressources = this.experience.ressources;
    this.explore = new Explore();

    this.ressources.on("ready", () => {
      this.explore.setProjects();
    });
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
