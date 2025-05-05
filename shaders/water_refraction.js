vs["water_refraction"]=`


#ifdef ocean
uniform vec3 move;
#endif


#ifdef holes
uniform vec4 holes_pars;
varying vec2 holes_uv;
#endif


#ifdef use_waves
uniform float time;
uniform vec4 gerstner_waves[waves_amount];
uniform float gerstner_waves_speed;
float PI2=6.283185307179586;


vec3 gerstner_wave(vec4 wave,vec3 point,float time_shift){


float k=PI2/wave.w;
float c=sqrt(9.8/k);
vec2 d=wave.xy;
float f=k*(dot(d,point.xz)-c*time_shift);
float a=wave.z/k;
float a_cos=a*cos(f);
return vec3(d.x*a_cos,a*sin(f),d.y*a_cos);


}
#endif


void main(){


#ifdef use_waves
#ifndef ocean
vec3 grid_point=position;
#else
vec3 grid_point=position+move;
#endif
vec3 tangent=vec3(1.0,0.0,0.0);
vec3 binormal=vec3(0.0,0.0,1.0);
vec3 vPosition=position;


float time_shift=time*gerstner_waves_speed;


for(int i=0;i<waves_amount;i++){
vPosition+=gerstner_wave(gerstner_waves[i],grid_point,time_shift);
}


#ifdef holes
#ifndef ocean
holes_uv=vPosition.xz*holes_pars.xy+holes_pars.zw;
#else
holes_uv=(vPosition.xz+move.xz)*holes_pars.xy+holes_pars.zw;
#endif
#endif


gl_Position=projectionMatrix*modelViewMatrix*vec4(vPosition,1.0);


#else

	
#ifdef holes
#ifndef ocean
holes_uv=position.xz*holes_pars.xy+holes_pars.zw;
#else
holes_uv=(position.xz+move.xz)*holes_pars.xy+holes_pars.zw;
#endif
#endif


gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


#endif


}


`;


fs["water_refraction"]=`


#ifdef holes
uniform sampler2D holes_map;
varying vec2 holes_uv;
#endif


void main(){


#ifdef holes
if(texture2D(holes_map,holes_uv).r<1.0){ discard; }
#endif


gl_FragColor=vec4(1.0);


}


`;