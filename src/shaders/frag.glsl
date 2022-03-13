varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uFadeIn;
uniform float uTime;
uniform float uShift;

void main() {

  vec4 textureColor = texture2D(uTexture, vUv);
  gl_FragColor = vec4(textureColor.xyz * uFadeIn, 1.0);
  // gl_FragColor = vec4(1.0 - (1.0 - uFadeIn));
}