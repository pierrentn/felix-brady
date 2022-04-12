import VirtualScroll from "virtual-scroll";
import Experience from "../Experience";

export default class Scroll {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;

    this.debugObject = {
      mouseMultiplier: 0.0001,
    };
    this.scrollTop = 0;

    this.setInstance();
    // if (this.debug.active) this.setDebug();
  }
  // setDebug() {
  //   this.debugFolder = this.debug.ui.addFolder("Scroll");
  //   this.debugFolder
  //     .add(this.debugObject, "mouseMultiplier", 0, 0.001)
  //     .onChange((val) => {
  //       this.instance.destroy();
  //       console.log(this.instance);
  //       this.setInstance();
  //     });
  // }

  setInstance() {
    this.instance = new VirtualScroll({
      mouseMultiplier: this.debugObject.mouseMultiplier,
    });
  }
}
