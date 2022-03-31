import VirtualScroll from "virtual-scroll";
import Experience from "../Experience";

export default class Scroll {
  constructor() {
    this.experience = new Experience();
    this.scrollTop = 0;
    this.setInstance();
  }

  setInstance() {
    this.instance = new VirtualScroll();
  }
}
