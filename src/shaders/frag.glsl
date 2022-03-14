varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D uTexture;
uniform float uFadeIn;
uniform float uTime;
uniform float uShift;
uniform float uOpacity;

void main() {
  vec4 textureColor = texture2D(uTexture, vUv);

  // vec2 displacedUv = vec2(vUv);
  // displacedUv.x += 0.1;
  // textureColor.x = texture2D(uTexture, displacedUv); 

  // textureColor.x += vPosition.x *0.01 + uShift *0.001;
  // textureColor.y += vUv.y *0.01 + uShift *0.001;

  // float position = vPosition.x;

  gl_FragColor = vec4(textureColor.xyz * uFadeIn, uOpacity);
  // gl_FragColor = vec4(vPosition.x);
  // gl_FragColor = vec4(vUv.x);
}