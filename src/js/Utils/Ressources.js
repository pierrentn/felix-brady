import * as THREE from "three";
import EventEmitter from "./EventEmitter";

export default class Ressources extends EventEmitter {
  constructor(sources) {
    super();
    this.sources = sources;

    //Setup
    this.items = [];
    this.toLoad = 0;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.textureLoaders = new THREE.TextureLoader();
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "texture") {
        source.path.forEach((texture, index) => {
          this.toLoad++;
          //TODO project inside one obj
          this.loaders.textureLoaders.load(texture, (file) => {
            this.sourceLoaded(index, source, file);
          });
        });
      }
    }
  }

  //* index, temporary solution,
  sourceLoaded(index, source, file) {
    this.items.push({ index, texture: file });
    this.loaded++;
    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
