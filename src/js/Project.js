import * as THREE from "three";

//Shaders
import fragment from "/src/shaders/frag.glsl?raw";
import vertex from "/src/shaders/vert.glsl?raw";

export default class Project {
  constructor(
    projectThumb,
    i,
    img,
    projectsGroup,
    projectsMesh,
    camera,
    debugObject
  ) {
    this.projectsGroup = projectsGroup;
    this.projectsMesh = projectsMesh;
    this.camera = camera;
    this.debugObject = debugObject;

    this.baseAngle = Math.PI / 3;
    this.scaleFactor = 1.3;
    this.apparitionDistance = 2.5;
    this.disparitionDistance = 0.75;
    this.projectThumb = projectThumb;
    this.i = i;
    this.img = img;

    console.log(`Create project ${i}`);

    this.initProject();
  }

  initProject() {
    this.setSettings();
    this.createMesh();
    this.setMeshPosition();
  }

  setMeshPosition() {
    const xPosition = 0;
    const yPosition = 0;
    const zPosition = this.index * -1;

    this.projectMesh.position.set(xPosition, yPosition, zPosition);
    this.projectMesh.scale.set(
      this.scaleFactor,
      this.scaleFactor,
      this.scaleFactor
    );
  }

  createMesh() {
    const { texture, width, height } = this.projectThumb;
    //TODO add subdivisions to Experience params
    const planeGeometry = new THREE.PlaneGeometry(this.aspect, 1, 20, 20);
    const planeMaterial = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      // wireframe: true,
      uniforms: {
        uTexture: { value: texture },
        uFadeIn: { value: 0 },
        uFadeOut: { value: 0 },
        uTime: { value: 0 },
        uShift: { value: 0 },
        uRez: { value: new THREE.Vector2(width, height) },
        uProgress: { value: this.debugObject.progress },
        uBlurX: { value: this.debugObject.blurX },
        uBlurY: { value: this.debugObject.blurY },
      },
    });
    this.projectMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    this.projectsGroup.add(this.projectMesh);
    // this.projectsMesh[this.i] = {
    //   mesh: this.projectMesh,
    // };
    console.log(this.projectMesh);
  }

  setSettings() {
    this.index = this.i + 1;
    this.angle = this.baseAngle + this.baseAngle * this.i;
    this.aspect = this.projectThumb.width / this.projectThumb.height;
  }

  update(elapsedTime, shiftTop) {
    let fadeIn = this.debugObject.enableFadeIn ? 0 : 1;
    let fadeOut = 1;

    const distance = this.projectMesh.position.z - this.camera.position.z;
    this.projectMesh.material.uniforms.uTime.value = elapsedTime;
    this.projectMesh.material.uniforms.uShift.value = shiftTop;

    if (this.i == 0) {
      document.querySelector(".debug1").innerText = distance;
    }

    if (Math.abs(distance) - 0.5 < this.apparitionDistance) {
      // console.log(Math.abs(distance), this.distance);

      //TODO Make it depending view size
      if (this.debugObject.enableCircleMovement) {
        this.projectMesh.position.x =
          Math.sin(this.angle) * (1.5 - Math.abs(distance));
        this.projectMesh.position.y =
          Math.cos(this.angle) * (1.5 - Math.abs(distance));
      }

      // if (this.i == 0) document.querySelector(".debug2").innerText = this.projectMesh.position.x;

      // fadeIn = Math.abs(this.cameraZPosition - this.cameraZOffset);
      if (this.debugObject.enableFadeIn)
        fadeIn = 1 - (Math.abs(distance) - 0.5) / this.apparitionDistance;
      // if (this.i == 0) console.log(distance.toFixed(2), this.projectMesh.position.x, fadeIn, i);
      if (this.i == 0) console.log(fadeIn);

      // if (
      //   distance >= -this.disparitionDistance &&
      //   distance <= this.disparitionDistance &&
      //   this.debugObject.enableFadeOut
      // )
      fadeOut = (-1 * distance) / this.disparitionDistance;
    } else if (distance > this.apparitionDistance) {
      fadeIn = 1;
    }

    // else if (this.currentImg >= i - 1) {
    // fadeIn = 1;
    // } else {
    // fadeIn = 0;
    // }
    this.projectMesh.material.uniforms.uFadeIn.value = fadeIn;
    this.projectMesh.material.uniforms.uFadeOut.value = fadeOut;
    // Math.abs(this.projectsMesh[0].position.z - this.camera.position.z)
  }
}
