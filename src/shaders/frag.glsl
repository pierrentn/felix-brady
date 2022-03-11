varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform float uTime;

void main() {

  vec4 textureColor = texture2D(uTexture, vUv);
  gl_FragColor = vec4(textureColor.xyz, uOpacity);
  // gl_FragColor = vec4(1.0 - uOpacity);
}