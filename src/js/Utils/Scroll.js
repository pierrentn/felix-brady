import VirtualScroll from "virtual-scroll";
import Experience from "../Experience";
import { lerp } from "./Maths";

export default class Scroll {
  constructor() {
    this.experience = new Experience();
    this.debug = this.experience.debug;

    this.debugObject = {
      mouseMultiplier: 0.0001,
      lerpIntensity: 0.03,
    };

    //1 : forward in gallery, -1 backward in gallery
    this.scrollDir = 0;
    this.scrollTop = 0;
    this.delayedScrollTop = 0;

    this.setInstance();
    // if (this.debug.active) this.setDebug();
  }
  // setDebug() {
  //   this.debugFolder = this.debug.ui.addFolder("Scroll");
  // this.debugFolder.add(this.debugObject, "lerpIntensity", 0.01, 1);
  //   this.debugFolder
  //     .add(this.debugObject, "mouseMultiplier", 0, 0.001)
  //     .onChange((val) => {
  //       this.instance.destroy();
  //       console.log(this.instance);
  //       this.setInstance();
  //     });
  // }
  updatePosition(e) {
    // console.log(e);
    this.scrollDir = e.deltaY < 0 ? 1 : -1;
    this.scrollTop += e.deltaY;
    this.scrollTop = this.scrollTop >= 0 ? 0 : this.scrollTop;
  }

  setInstance() {
    this.instance = new VirtualScroll({
      mouseMultiplier: this.debugObject.mouseMultiplier,
    });
    this.instance.on((e) => {
      this.updatePosition(e);
    });
  }

  update() {
    this.delayedScrollTop = lerp(
      this.delayedScrollTop,
      this.scrollTop,
      this.debugObject.lerpIntensity
    );
  }
}
