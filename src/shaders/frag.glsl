varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D uTexture;
uniform float uFadeIn;
uniform float uTime;
uniform float uShift;
uniform float uFadeOut;
uniform vec2 uRez;
uniform float uProgress;

uniform float uBlurChoice;
uniform bool uBlurOnly;
uniform float uBlurX;
uniform float uBlurY;
uniform float uBlurDirections;
uniform float uBlurQuality;
uniform float uBlurSize;

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
  return color;
}

float Pi = 6.28318530718; // Pi*2



void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  vec4 bluredTextureColor;

  if(uBlurChoice == 0.0) {
    bluredTextureColor = textureColor;
    // GAUSSIAN BLUR SETTINGS {{{
    float Directions = uBlurDirections; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
    float Quality = uBlurQuality; // BLUR QUALITY (Default 4.0 - More is better but slower)
    float Size = uBlurSize; // BLUR SIZE (Radius)
    vec2 Radius = Size/uRez;
    // GAUSSIAN BLUR SETTINGS }}}

    for( float d=0.0; d<Pi; d+=Pi/Directions)
    {
      for(float i=1.0/Quality; i<=1.0; i+=1.0/Quality)
      {
        bluredTextureColor += texture2D( uTexture, vUv+vec2(cos(d),sin(d))*Radius*i);		
      }
    }
    bluredTextureColor /= Quality * Directions - 15.0;

  } else {
    bluredTextureColor = blur13(uTexture, vUv, uRez, vec2(uBlurX, uBlurY));
  }

  float blurDelay = pow(uFadeIn, 3.);
  blurDelay = uBlurOnly ? 0.0 : blurDelay;
  vec4 mixColor = mix(bluredTextureColor, textureColor, blurDelay);



  // vec2 displacedUv = vec2(vUv);
  // displacedUv.x += 0.1;
  // bluredTextureColor.x = texture2D(uTexture, displacedUv); 
  // bluredTextureColor.x += vPosition.x *0.01 + uShift *0.001;
  // bluredTextureColor.y += vUv.y *0.01 + uShift *0.001;


  gl_FragColor = vec4(mixColor.xyz * uFadeIn, uFadeOut);
  // gl_FragColor = vec4(blurDelay);
  // gl_FragColor = vec4(vec3(uFadeOut), 1.0);
}