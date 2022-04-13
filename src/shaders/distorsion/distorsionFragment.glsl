varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uDistorsionAmp;
uniform float uDistorsionStr;


void main() {
  float amp = 0.3 + 0.2 * uDistorsionAmp;
  float strength = uDistorsionStr;


  float center = distance(vUv, vec2(0.5));
  center = smoothstep(amp, 1.0, center);
  center *= strength;
  
  // vec4 color = texture2D(tDiffuse,  vUv + sin(n * 0.005 * 50.));
  vec4 color = texture2D(tDiffuse,  vUv);
  // vec4 shiftColor = texture2D(tDiffuse, vec2(vUv.x + 0.01, vUv.y) + center * .33);

  //Offset texture
  vec4 shiftColor = texture2D(tDiffuse, vec2(vUv.x + 0.01, vUv.y) + center * 0.33);
  // shiftColor = mix(color, shiftColor, 1.0);

  vec4 distoColor = texture2D(tDiffuse, vec2(vUv.x, vUv.y) + center * 0.33);
  // distoColor.r *= shiftColor.r;

  // color = vec4(shiftColor.r, color.gba);

  // color = vec4(1.0 - center * snoise(color.rgb));

  // color.r = mix(color.r, shiftColor, center);
  // color = mix(color, distoColor, center);
  color = distoColor;
  color *= vec4(shiftColor.r, shiftColor.g * 0.95, 1.0, 1.0);

  // gl_FragColor = vec4(shiftColor.r, distoColor.g, distoColor.b, 1.0);
  gl_FragColor = vec4(color);
  // gl_FragColor = vec4(vUv, 1.0, 1.0);
}