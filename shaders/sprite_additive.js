vs["sprite_additive"]=`


varying vec2 vUv;
attribute vec3 offset;
attribute vec2 scale;
uniform float time;
vec3 localUpVector=vec3(0.0,1.0,0.0);


#ifdef USE_rotating
attribute float rotating;
#endif


#ifdef USE_color
attribute vec3 color;
varying vec3 vColor;
#endif


#ifdef USE_alpha
attribute float alpha;
varying float vAlpha;
#endif


void main(){


#ifdef USE_rotating
float angle=time*rotating;
vec2 rotated=vec2(cos(angle)*(uv.x-0.5)+sin(angle)*(uv.y-0.5)+0.5,cos(angle)*(uv.y-0.5)-sin(angle)*(uv.x-0.5)+0.5);
vUv=rotated;
#else
vUv=uv;
#endif


#ifdef USE_color
vColor=color;
#endif


#ifdef USE_alpha
vAlpha=alpha;
#endif


#ifdef USE_followXZ
vec3 vPosition=position;
float x=offset.x-cameraPosition.x;
float z=offset.z-cameraPosition.z;
float angleXZ=acos(z/sqrt(x*x+z*z));
if(x>0.0){ angleXZ*=-1.0; }
vPosition.x=cos(angleXZ)*position.x-sin(angleXZ)*position.z;
vPosition.z=cos(angleXZ)*position.z+sin(angleXZ)*position.x;
vPosition.xz*=scale.x;
vPosition.y*=scale.y;
#else
vec3 vLook=normalize(offset-cameraPosition);
vec3 vRight=normalize(cross(vLook,localUpVector));
vec3 vUp=normalize(cross(vLook,vRight));
vec3 vPosition=vRight*position.x*scale.x+vUp*position.y*scale.y+vLook*position.z;
#endif


     
gl_Position=projectionMatrix*modelViewMatrix*vec4(vPosition+offset,1.0);


}


`;


fs["sprite_additive"]=`


uniform sampler2D map;
varying vec2 vUv;


#ifdef USE_color
varying vec3 vColor;
#endif


#ifdef USE_alpha
varying float vAlpha;
#endif


#ifdef USE_alphaMap
uniform sampler2D alphaMap;
uniform float alphaTest;
#endif


void main(){


#ifdef USE_smoke
gl_FragColor=texture2D(map,vUv);
//gl_FragColor.rgb*=vec3(0.1,0.1,0.1);
gl_FragColor.rgb*=vColor;
gl_FragColor.rgb*=gl_FragColor.a;
//gl_FragColor.a*=0.5; 
#else


#ifdef USE_alphaMap
if(texture2D(alphaMap,vUv).r<alphaTest){ discard; }
#endif


vec3 diffuse=texture2D(map,vUv).rgb;


#ifdef USE_color
diffuse*=vColor;
#endif


#ifndef USE_oneAlpha
#ifndef USE_alpha
float a=texture2D(map,vUv).a;
#else
float a=texture2D(map,vUv).a*vAlpha;
#endif
#else
float a=1.0;
#endif


gl_FragColor=vec4(diffuse,a);


#endif


}


`;
