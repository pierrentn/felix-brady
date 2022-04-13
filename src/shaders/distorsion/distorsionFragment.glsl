varying vec2 vUv;
uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uDistorsionAmp;
uniform float uDistorsionStr;
uniform float uK;
uniform float uKube;
uniform sampler2D uTexture;
uniform bool uVisible;

vec2 computeUV( vec2 uv, float k, float kcube ){
  vec2 t = uv - .5;

  //Vector Multiplication
  float r2 = pow(t.x, 2.0) + pow(t.y, 2.0);
	
  float f = 0.;
  if( kcube == 0.0){
      f = 1. + r2 * k;
  }else{
      f = 1. + r2 * ( k + kcube * sqrt( r2 ) );
  }
  
  vec2 nUv = f * t + .5;
  // nUv.y = 1. - nUv.y;
 
  // return r2;
  return nUv;
    
}

void main() {
  float amp = 0.3 + 0.2 * uDistorsionAmp;
  float strength = uDistorsionStr;

  // vec4 shiftColor = texture2D(tDiffuse, vec2(vUv.x + 0.01, vUv.y) + center * 0.33);
  
  float k = uK;
  float kcube = uKube;

  vec4 color = texture2D(tDiffuse, vUv);

  float red = texture2D(tDiffuse, computeUV(vUv, k + sin(0.1), kcube)).r;
  float green = texture2D(tDiffuse, computeUV(vUv, k, kcube)).g;
  float blue = texture2D(tDiffuse, computeUV(vUv, k + sin(0.05), kcube)).b;
  

  gl_FragColor = uVisible ? vec4(red, green, blue, 1.0) : vec4(color);
  // gl_FragColor = vec4(step(nUv.x, 0.5), step(nUv.y, 0.5), 1.0, 1.0);
}