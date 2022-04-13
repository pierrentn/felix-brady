varying vec2 vUv; 
varying vec3 vPosition; 
uniform float uTime;
uniform float uShift;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // modelPosition.y += ((sin(uv.x * 3.) * uShift * 5.0) * 0.00005);
  // modelPosition.z += sin(modelPosition.y * 2.0 + uTime * uv.x) * 0.05;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  

  vUv = uv;
  vPosition = position;

  gl_Position = projectedPosition;
}