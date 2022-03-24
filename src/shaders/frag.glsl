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
// GAUSSIAN BLUR SETTINGS {{{
float Directions = 25.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
float Quality = 10.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
float Size = 40.0; // BLUR SIZE (Radius)
// GAUSSIAN BLUR SETTINGS }}}
vec2 Radius = Size/uRez;


  vec4 initialTextureColor = texture2D(uTexture, vUv);
  vec4 textureColor = initialTextureColor;

  //Blur 1
  vec4 bluredTextureColor = blur13(uTexture, vUv, uRez, vec2(1.0, 1.0));
  // float blurDelay = pow(uFadeIn, 2.);
  
  //Blur 2
  for( float d=0.0; d<Pi; d+=Pi/Directions)
  {
  for(float i=1.0/Quality; i<=1.0; i+=1.0/Quality)
    {
      textureColor += texture2D( uTexture, vUv+vec2(cos(d),sin(d))*Radius*i);		
    }
  }
  // Output to screen
  textureColor /= Quality * Directions - 15.0;

  float blurDelay = pow(uFadeIn, 3.);
  vec4 mixColor = mix(textureColor, initialTextureColor, blurDelay);

  // vec2 displacedUv = vec2(vUv);
  // displacedUv.x += 0.1;
  // textureColor.x = texture2D(uTexture, displacedUv); 

  // textureColor.x += vPosition.x *0.01 + uShift *0.001;
  // textureColor.y += vUv.y *0.01 + uShift *0.001;

  // float position = vPosition.x;


  gl_FragColor = vec4(mixColor.xyz * uFadeIn, uFadeOut);
  // gl_FragColor = vec4(bluredTextureColor);
  // gl_FragColor = vec4(vec3(uFadeIn), 1.0);
}