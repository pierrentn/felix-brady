import { WebGLRenderer } from "three";
import Experience from "./Experience";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";

import distorsionFragment from "../shaders/distorsion/distorsionFragment.glsl?raw";
import distorsionVertex from "../shaders/distorsion/distorsionVertex.glsl?raw";
export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;
    this.ui = this.debug.ui;

    this.debugObject = {
      focus: 20,
      aperture: 3,
      maxblur: 0.001,
    };

    this.setInstance();
    this.setPostProcess();
    if (this.debug.active) this.setDebug();
  }

  setInstance() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  setDebug() {
    this.debugFolder = this.ui.addFolder("post-processing");
    // this.debugFolder.close();

    if (this.postProcess.composer.passes.includes(this.postProcess.bokehPass)) {
      this.debugFolder
        .add(this.debugObject, "focus", 10, 3000)
        .onChange(
          (val) =>
            (this.postProcess.composer.passes[1].uniforms.focus.value = val)
        );
      this.debugFolder
        .add(this.debugObject, "aperture", 0, 10)
        .onChange(
          (val) =>
            (this.postProcess.composer.passes[1].uniforms.aperture.value =
              val * 0.00001)
        );
      this.debugFolder
        .add(this.debugObject, "maxblur", 0, 0.01)
        .onChange(
          (val) =>
            (this.postProcess.composer.passes[1].uniforms.maxblur.value = val)
        );
    }

    if (
      this.postProcess.composer.passes.includes(this.postProcess.distorsionPass)
    ) {
      this.distorsionFolder = this.debugFolder.addFolder("distorsion");
      this.distorsionFolder
        .add(
          this.postProcess.distorsionPass.uniforms.uDistorsionAmp,
          "value",
          0,
          1
        )
        .name("distorsion amplitude")
        .onChange(
          (val) =>
            (this.postProcess.distorsionPass.uniforms.uDistorsionAmp.value =
              val)
        );
      this.distorsionFolder
        .add(
          this.postProcess.distorsionPass.uniforms.uDistorsionStr,
          "value",
          1,
          10,
          1
        )
        .name("distorsion strength")
        .onChange(
          (val) =>
            (this.postProcess.distorsionPass.uniforms.uDistorsionStr.value =
              val)
        );
    }
  }

  setPostProcess() {
    this.postProcess = {};

    //Render pass
    this.postProcess.renderPass = new RenderPass(
      this.scene,
      this.camera.instance
    );

    //Bokeh pass
    this.postProcess.bokehPass = new BokehPass(
      this.scene,
      this.camera.instance,
      {
        focus: this.debugObject.focus,
        aperture: this.debugObject.aperture,
        maxblur: this.debugObject.maxblur,
      }
    );

    //Distortion Pass
    this.DistorsionShader = {
      uniforms: {
        tDiffuse: { value: null },
        uDistorsionAmp: { value: 1 },
        uDistorsionStr: { value: 1 },
        uTime: { value: 0 },
      },
      fragmentShader: distorsionFragment,
      vertexShader: distorsionVertex,
    };
    this.postProcess.distorsionPass = new ShaderPass(this.DistorsionShader);

    //Effect composer
    this.postProcess.composer = new EffectComposer(this.instance);
    this.postProcess.composer.addPass(this.postProcess.renderPass);
    // this.postProcess.composer.addPass(this.postProcess.bokehPass);
    this.postProcess.composer.addPass(this.postProcess.distorsionPass);

    this.postProcess.composer.setSize(this.sizes.width, this.sizes.height);
    this.postProcess.composer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.postProcess.composer.setSize(this.sizes.width, this.sizes.height);
    this.postProcess.composer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );
  }

  update() {
    // this.instance.render(this.scene, this.camera.instance);
    this.postProcess.distorsionPass.uniforms.uTime.value = this.time.elapsed;
    this.postProcess.composer.render(this.scene, this.camera.instance);
  }
}
