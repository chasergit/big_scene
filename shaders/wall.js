vs["wall"]=`


varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vLightDir;
varying vec3 vViewPosition;
varying vec3 vPosition;


vec3 lightPosition=vec3(60.0,100.0,60.0);


void main(){


vPosition=position;


gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


vUv=uv*1.0;
vNormal=normalMatrix*normal;
vec3 vLightPosition=(viewMatrix*vec4(lightPosition,1.0)).xyz;
//vLightDir=vLightPosition-mvPosition.xyz; // POINT LIGHT
vLightDir=normalize(vLightPosition); // DIRECTIONAL LIGHT
vViewPosition=-vPosition.xyz;


vec4 vertPos4 = modelViewMatrix * vec4(position, 1.0);
  vPosition = vec3(vertPos4) / vertPos4.w;



}


`;


fs["wall"]=`


uniform sampler2D map;
uniform sampler2D normalMap;
uniform vec2 normalScale;
uniform vec2 normalRepeat;


varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vLightDir;
varying vec3 vViewPosition;
varying vec3 vPosition;

vec4 light_color=vec4(0.75,0.93,0.99,0.0);
vec4 specular_color=vec4(0.75,0.93,0.99,0.0);
vec4 ambient=vec4(0.2,0.2,0.2,1.0);



vec3 perturbNormalArb(vec3 eye_pos,vec3 surf_norm) {


vec3 q0=vec3(dFdx(eye_pos.x),dFdx(eye_pos.y),dFdx(eye_pos.z));
vec3 q1=vec3(dFdy(eye_pos.x),dFdy(eye_pos.y),dFdy(eye_pos.z));
vec2 st0=dFdx(vUv.st);
vec2 st1=dFdy(vUv.st);
float scale=sign(st1.t*st0.s-st0.t*st1.s); // we do not care about the magnitude
vec3 S=normalize((q0*st1.t-q1*st0.t)*scale);
vec3 T=normalize((-q0*st1.s+q1*st0.s)*scale);
vec3 N=normalize(surf_norm);
mat3 tsn=mat3(S,T,N);


vec3 mapN=texture2D(normalMap,vUv*normalRepeat).xyz*2.0-1.0;
mapN.xy*=vec2(normalScale.x,normalScale.y*1.0);


return normalize(tsn*mapN);


}





vec3 blinnPhongBRDF(vec3 lightDir, vec3 viewDir, vec3 normal, vec3 phongDiffuseCol, vec3 phongSpecularCol, float phongShininess) {
  vec3 color = phongDiffuseCol;
  vec3 halfDir = normalize(viewDir + lightDir);
  float specDot = max(dot(halfDir, normal), 0.0);
  color += pow(specDot, phongShininess) * phongSpecularCol;
  return color;
}


const vec3 lightPos = vec3(60.0, 100.0, 60.0);
const vec3 lightColor = vec3(1.0, 1.0, 1.0);
const float lightPower = 40.0;
const vec3 ambientColor = vec3(0.1, 0.1, 0.1);
const vec3 diffuseColor = vec3(0.0, 0.0, 0.0);
const vec3 specColor = vec3(1.0, 1.0, 1.0);
const float shininess = 60.0;
const float screenGamma = 2.2; // Assume the monitor is calibrated to the sRGB color space

void main(){




vec3 N=normalize(vNormal);
vec3 L=normalize(vLightDir);
vec3 V=normalize(vViewPosition);


vec3 PN=perturbNormalArb(-V,N);


vec4 diffuse=texture2D(map,vUv);
vec4 final_color=ambient*diffuse;


float lambert=dot(PN,L);


if(lambert>0.0){
vec3 R=reflect(-L,PN);
float specular=pow(max(dot(R,V),0.0),shininess);
final_color+=light_color*lambert*diffuse+specular_color*specular;
}


gl_FragColor=final_color;

int mode=1;

vec3 normal=PN;
vec3 lightDir = lightPos - vPosition;
  float distance = length(lightDir);
  distance = distance * distance;
  lightDir = normalize(lightDir);

  float lambertian = max(dot(lightDir, normal), 0.0);
  float specular = 0.0;

  if (lambertian > 0.0) {

    vec3 viewDir = normalize(-vPosition);

    // this is blinn phong
    vec3 halfDir = normalize(lightDir + viewDir);
    float specAngle = max(dot(halfDir, normal), 0.0);
    specular = pow(specAngle, shininess);

    // this is phong (for comparison)
    if (mode == 2) {
      vec3 reflectDir = reflect(-lightDir, normal);
      specAngle = max(dot(reflectDir, viewDir), 0.0);
      // note that the exponent is different here
      specular = pow(specAngle, shininess/4.0);
    }
  }
  vec3 colorLinear = diffuse.rgb +
                     diffuseColor * lambertian * lightColor * lightPower / distance +
                     specColor * specular * lightColor * lightPower / distance;
  // apply gamma correction (assume ambientColor, diffuseColor and specColor
  // have been linearized, i.e. have no gamma correction in them)
  vec3 colorGammaCorrected = pow(colorLinear, vec3(1.0 / screenGamma));
  // use the gamma corrected color in the fragment
  gl_FragColor = vec4(colorGammaCorrected, 1.0);


}


`;
