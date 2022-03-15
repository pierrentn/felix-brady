varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D uTexture;
uniform float uFadeIn;
uniform float uTime;
uniform float uShift;
uniform float uFadeOut;
uniform vec2 uRez;
uniform float uProgress;
uniform float uBlurX;
uniform float uBlurY;

vec4 blur13(sampler2D tex, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
    vec2 off1 = vec2(0.66293) * direction;
    vec2 off2 = vec2(2.47904) * direction;
    vec2 off3 = vec2(4.46232) * direction;
    vec2 off4 = vec2(6.44568) * direction;
    vec2 off5 = vec2(8.42917) * direction;
    vec2 off6 = vec2(10.41281) * direction;
    vec2 off7 = vec2(12.39664) * direction;
    vec2 off8 = vec2(14.38070) * direction;
    vec2 off9 = vec2(16.36501) * direction;

    color += texture2D(tex, uv + (off1 / resolution)) * 0.10855;
    color += texture2D(tex, uv - (off1 / resolution)) * 0.10855;
    color += texture2D(tex, uv + (off2 / resolution)) * 0.13135;
    color += texture2D(tex, uv - (off2 / resolution)) * 0.13135;
    color += texture2D(tex, uv + (off3 / resolution)) * 0.10406;
    color += texture2D(tex, uv - (off3 / resolution)) * 0.10406;
    color += texture2D(tex, uv + (off4 / resolution)) * 0.07216;
    color += texture2D(tex, uv - (off4 / resolution)) * 0.07216;
    color += texture2D(tex, uv + (off5 / resolution)) * 0.04380;
    color += texture2D(tex, uv - (off5 / resolution)) * 0.04380;
    color += texture2D(tex, uv + (off6 / resolution)) * 0.02328;
    color += texture2D(tex, uv - (off6 / resolution)) * 0.02328;
    color += texture2D(tex, uv + (off7 / resolution)) * 0.01083;
    color += texture2D(tex, uv - (off7 / resolution)) * 0.01083;
    color += texture2D(tex, uv + (off8 / resolution)) * 0.00441;
    color += texture2D(tex, uv - (off8 / resolution)) * 0.00441;
    color += texture2D(tex, uv + (off9 / resolution)) * 0.00157;
    color += texture2D(tex, uv - (off9 / resolution)) * 0.00157;
  return color;
}


void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  vec4 bluredTextureColor = blur13(uTexture, vUv, uRez, vec2(uBlurX, uBlurY));
  // bluredTextureColor = bluredTextureColor * 3.;
  float blurDelay = pow(uFadeIn, 2.);
  vec4 color = mix(bluredTextureColor, textureColor, blurDelay);

  // vec2 displacedUv = vec2(vUv);
  // displacedUv.x += 0.1;
  // textureColor.x = texture2D(uTexture, displacedUv); 

  // textureColor.x += vPosition.x *0.01 + uShift *0.001;
  // textureColor.y += vUv.y *0.01 + uShift *0.001;

  // float position = vPosition.x;


  gl_FragColor = vec4(color.xyz * uFadeIn, uFadeOut);
  // gl_FragColor = vec4(textureColor.xyz * uFadeIn, uFadeOut);
  // gl_FragColor = vec4(vPosition.x);
  // gl_FragColor = vec4(vec3(uFadeIn), 1.0);
}