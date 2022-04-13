varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uDistorsionAmp;
uniform float uDistorsionStr;

void main() {
  float amp = 0.3 + 0.2 * uDistorsionAmp;
  float strength = uDistorsionStr;

  vec4 color = texture2D(tDiffuse, vUv);
  vec4 redShiftColor = texture2D(tDiffuse, vec2(vUv.x + 0.01, vUv.y));

  // color = vec4(redShiftColor.r, color.gba);
  // vec4 textureColor = vec4(redShiftTextureColor.r, orginalTextureColor.gba);

  float center = distance(vUv, vec2(0.5));
  center = smoothstep(amp, 1.0, center);
  center *= strength;

  // color += center;
  color.r = mix(color.r, redShiftColor.r, center);

  gl_FragColor = vec4(color);
}