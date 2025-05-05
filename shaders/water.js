vs["water"]=`


//#define test_waves 


#ifdef ocean
uniform vec3 move;
#endif


uniform vec4 gerstner_waves[waves_amount];
uniform float gerstner_waves_speed;
uniform float time;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vToEye;
varying vec3 vViewPosition;
#ifdef use_waves
varying float wave_height;
#endif
varying float distance_attenuation;
varying float attenuation_env;
uniform float wave_max_height;
float PI2=6.283185307179586;


#ifdef holes
uniform vec4 holes_pars;
varying vec2 holes_uv;
#endif


uniform vec2 normal_far_smoothing;
uniform vec2 sky_far_mix_value;


vec3 gerstner_wave(vec4 wave,vec3 point,inout vec3 tangent,inout vec3 binormal,float time_shift){


float steepness=wave.z;
float k=PI2/wave.w;
float c=sqrt(9.8/k);
vec2 d=wave.xy;
float f=k*(dot(d,point.xz)-c*time_shift);
float a=steepness/k;
float steepness_sin_f=steepness*sin(f);
float steepness_cos_f=steepness*cos(f);
float minus_dx_dy_steepness_sin_f=-d.x*d.y*steepness_sin_f;
tangent+=vec3(-d.x*d.x*steepness_sin_f,d.x*steepness_cos_f,minus_dx_dy_steepness_sin_f);
binormal+=vec3(minus_dx_dy_steepness_sin_f,d.y*steepness_cos_f,-d.y*d.y*steepness_sin_f);
float a_cos=a*cos(f);
return vec3(d.x*a_cos,a*sin(f),d.y*a_cos);


}


// SHADOWMAP_PARS_VERTEX


#ifdef USE_SHADOWMAP


uniform mat4 directionalShadowMatrix[NUM_DIR_LIGHT_SHADOWS];
varying vec4 vDirectionalShadowCoord[NUM_DIR_LIGHT_SHADOWS];


struct DirectionalLightShadow{
float shadowIntensity;
float shadowBias;
float shadowNormalBias;
float shadowRadius;
vec2 shadowMapSize;
};


uniform DirectionalLightShadow directionalLightShadows[NUM_DIR_LIGHT_SHADOWS];


#endif


void main(){


#ifndef ocean
vUv=position.xz;
#else
vUv=position.xz+move.xz;
#endif


#ifdef use_waves


float time_shift=time*gerstner_waves_speed;


#ifndef ocean
vec3 grid_point=position;
#else
vec3 grid_point=position+move;
#endif
vec3 tangent=vec3(1.0,0.0,0.0);
vec3 binormal=vec3(0.0,0.0,1.0);
vPosition=position;
for(int i=0;i<waves_amount;i++){
vPosition+=gerstner_wave(gerstner_waves[i],grid_point,tangent,binormal,time_shift);
}


#ifdef test_waves


tangent=vec3(1.0,0.0,0.0);
binormal=vec3(0.0,0.0,1.0);
vPosition=position;


float iteration=0.0;	
float steepness=0.02;
float frequency=5.0;
for(int i=0;i<12;i++){
vec2 rnd=vec2(sin(iteration),cos(iteration));
vec4 my_wave=vec4(rnd,steepness,frequency);
vPosition+=gerstner_wave(my_wave,grid_point,tangent,binormal,time_shift);
frequency*=1.1;
iteration+=1232.399963;
}


steepness=0.02;
frequency=15.0;
for(int i=0;i<12;i++){
vec2 rnd=vec2(sin(iteration),cos(iteration));
vec4 my_wave=vec4(rnd,steepness,frequency);
vPosition+=gerstner_wave(my_wave,grid_point,tangent,binormal,time_shift);
frequency*=1.1;
iteration+=1232.399963;
}


steepness=0.05;
frequency=60.0;
for(int i=0;i<3;i++){
vec2 rnd=vec2(sin(iteration),cos(iteration));
vec4 my_wave=vec4(rnd,steepness,frequency);
vPosition+=gerstner_wave(my_wave,grid_point,tangent,binormal,time_shift);
frequency*=1.3;
iteration+=1232.399963;
}
#endif


vNormal=cross(binormal,tangent);
#else
vPosition=position;
vNormal=vec3(0.0,1.0,0.0);
#endif


#ifdef holes
#ifndef ocean
holes_uv=vPosition.xz*holes_pars.xy+holes_pars.zw;
#else
holes_uv=(vPosition.xz+move.xz)*holes_pars.xy+holes_pars.zw;
#endif
#endif


#ifdef use_waves
#ifndef ocean
float distance_to_vertex=length(vPosition-cameraPosition+modelMatrix[3].xyz);
#else
float distance_to_vertex=length(position-vec3(0.0,cameraPosition.y-modelMatrix[3].y,0.0));	
#endif	
distance_attenuation=1.0-smoothstep(0.0,normal_far_smoothing.y,distance_to_vertex-normal_far_smoothing.x);
vPosition.y*=distance_attenuation;
vNormal=mix(vec3(0.0,1.0,0.0),vNormal,distance_attenuation);
#endif


#ifdef use_sky_far_mix
#ifndef ocean
attenuation_env=1.0-smoothstep(0.0,sky_far_mix_value.x,length(position.xz-cameraPosition.xz+modelMatrix[3].xz)-sky_far_mix_value.y);
#else
attenuation_env=1.0-smoothstep(0.0,sky_far_mix_value.x,length(position.xz)-sky_far_mix_value.y);
#endif		
#endif
	

vNormal=normalize(normalMatrix*vNormal);


#ifdef use_waves
// ПРЕВРАЩАЕМ ВЫСОТУ ВОЛНЫ В ИНТЕРВАЛ ОТ 0 ДО 1
wave_height=max(0.0,vPosition.y/wave_max_height);
#endif


vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.0);
gl_Position=projectionMatrix*mvPosition;


vPosition=(modelMatrix*vec4(vPosition,1.0)).xyz;
vToEye=cameraPosition-vPosition;
vViewPosition=-mvPosition.xyz;


// SHADOWMAP_VERTEX


#if defined(USE_SHADOWMAP)
for(int i=0;i<NUM_DIR_LIGHT_SHADOWS;i++){
vDirectionalShadowCoord[i]=directionalShadowMatrix[i]*vec4(vPosition,1.0);
}
#endif


}


`;


fs["water"]=`


varying float attenuation_env;
uniform float time;
uniform vec3 water_top_color;
uniform vec3 water_bottom_color;
uniform float shore_transparent;
uniform vec3 wave_color;
uniform float wave_color_power;
uniform samplerCube envMap;
uniform sampler2D foam_shore_map;
uniform sampler2D foam_wave_map;
#ifdef use_caustics
uniform sampler2D caustics_map;
uniform vec2 caustics_1_dir_speed;
uniform vec2 caustics_2_dir_speed;
uniform vec3 caustics_wave;
uniform float caustics_intensity;
uniform vec2 caustics_scale_power;
uniform vec3 caustics_color;
#endif
uniform sampler2D normal_map;
uniform sampler2D scene_map;
uniform sampler2D scene_depth_map;
uniform sampler2D water_depth_map;


uniform float env_mix;
uniform float env_melt;
uniform float env_fresnel_min;
uniform float env_fresnel_power;
uniform float env_intensity;
uniform float env_max;
uniform float env_add_background;


#ifdef holes
uniform sampler2D holes_map;
varying vec2 holes_uv;
#endif
uniform vec2 screen_resolution;
uniform vec2 screen_texel_size;
uniform mat4 projectionMatrix;
uniform mat4 position_from_depth_projection;
uniform vec3 sun_direction;
uniform vec3 sun_color;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vToEye;
varying vec3 vViewPosition;
#ifdef use_waves
varying float wave_height;
#endif
uniform float depth_offset; 
uniform float depth_beers_law;
uniform float depth_distance; 
#ifdef use_gamma
uniform float gamma; 
#endif
#ifdef use_saturation
uniform float saturation; 
#endif
#if defined fog || defined fog_exp2
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform float fogDensity;
#endif
#ifdef use_sss
uniform vec3 sss_color;
uniform vec4 sss_value;
#endif
varying float distance_attenuation;


uniform float phong_simple_intensity;
uniform float scattering_intensity;
uniform vec3 specular;
uniform vec3 foam_waves_value;
uniform vec4 foam_shore_value;
uniform float shore_smoothing_intensity;
uniform vec2 refraction_value;


uniform vec3 normal_a_value;
uniform vec3 normal_b_value;
uniform float normal_ab;
uniform vec3 normal_c_value;
uniform vec3 normal_d_value;
uniform float normal_cd;
uniform vec2 normal_small_far_total;


vec3 inverseTransformDirection(in vec3 dir,in mat4 matrix){
return normalize((vec4(dir,0.0)*matrix).xyz);
}


vec3 perturbNormal2Arb(vec3 eye_pos,vec3 N,vec3 mapN){
vec3 q0=dFdx(eye_pos.xyz);
vec3 q1=dFdy(eye_pos.xyz);
vec2 st0=dFdx(vUv);
vec2 st1=dFdy(vUv);
vec3 q1perp=cross(q1,N);
vec3 q0perp=cross(N,q0);
vec3 T=q1perp*st0.x+q0perp*st1.x;
vec3 B=q1perp*st0.y+q0perp*st1.y;
float det=max(dot(T,T),dot(B,B));
float scale=(det==0.0)?0.0:inversesqrt(det);
return normalize(T*(mapN.x*scale)+B*(mapN.y*scale)+N*mapN.z);
}


vec3 triplanar(vec3 normal,float smooth_1,float smooth_2){
vec3 blend_weights=normal*normal;
float max_blend=max(blend_weights.x,max(blend_weights.y,blend_weights.z));
blend_weights=max(blend_weights-max_blend*smooth_1,0.0);// МЯГКИЙ ПЕРЕХОД
blend_weights.y*=smooth_2;
float rcp_blend=1.0/(blend_weights.x+blend_weights.y+blend_weights.z);
return blend_weights*rcp_blend;
}


vec3 get_position_from_depth(sampler2D depth,vec2 uv){
vec4 position=position_from_depth_projection*vec4((uv*2.0-1.0),texture2D(depth,uv).r*2.0-1.0,1.0);
return position.xyz/position.w;
}


vec3 get_position_from_depth(float depth,vec2 uv){
vec4 position=position_from_depth_projection*vec4((uv*2.0-1.0),depth*2.0-1.0,1.0);
return position.xyz/position.w;
}


vec3 get_normal_from_depth_2(sampler2D depth,vec2 uv,vec2 screen_texel_size){
vec3 dpdx=get_position_from_depth(depth,uv+vec2(1,0)*screen_texel_size)-get_position_from_depth(depth,uv-vec2(1,0)*screen_texel_size);
vec3 dpdy=get_position_from_depth(depth,uv+vec2(0,1)*screen_texel_size)-get_position_from_depth(depth,uv-vec2(0,1)*screen_texel_size);
return normalize(cross(dpdx,dpdy));
}


vec3 get_normal_from_depth_3(sampler2D depth,vec2 uv,vec2 screen_texel_size){
float c0=texture(depth,uv).r;
float l2=texture(depth,uv-vec2(2,0)*screen_texel_size).r;
float l1=texture(depth,uv-vec2(1,0)*screen_texel_size).r;
float r1=texture(depth,uv+vec2(1,0)*screen_texel_size).r;
float r2=texture(depth,uv+vec2(2,0)*screen_texel_size).r;
float b2=texture(depth,uv-vec2(0,2)*screen_texel_size).r;
float b1=texture(depth,uv-vec2(0,1)*screen_texel_size).r;
float t1=texture(depth,uv+vec2(0,1)*screen_texel_size).r;
float t2=texture(depth,uv+vec2(0,2)*screen_texel_size).r;
float dl=abs(l1*l2/(2.0*l2-l1)-c0);
float dr=abs(r1*r2/(2.0*r2-r1)-c0);
float db=abs(b1*b2/(2.0*b2-b1)-c0);
float dt=abs(t1*t2/(2.0*t2-t1)-c0);
vec3 ce=get_position_from_depth(c0,uv);
vec3 dpdx=(dl<dr)?ce-get_position_from_depth(l1,uv-vec2(1,0)*screen_texel_size):-ce+get_position_from_depth(r1,uv+vec2(1,0)*screen_texel_size);
vec3 dpdy=(db<dt)?ce-get_position_from_depth(b1,uv-vec2(0,1)*screen_texel_size):-ce+get_position_from_depth(t1,uv+vec2(0,1)*screen_texel_size);
return normalize(cross(dpdx,dpdy));
}


#ifdef USE_SHADOWMAP


uniform mat4 directionalShadowMatrix[NUM_DIR_LIGHT_SHADOWS];
const float UnpackDownscale=255./256.; // 0..1 -> fraction (excluding 1)
const vec4 PackFactors=vec4(1.0,256.0,256.0*256.0,256.0*256.0*256.0);
const vec4 UnpackFactors4=vec4(UnpackDownscale/PackFactors.rgb,1.0/PackFactors.a);
float unpackRGBAToDepth(const in vec4 v){ return dot(v,UnpackFactors4); }
vec2 unpackRGBATo2Half(const in vec4 v){ return vec2(v.x+(v.y/255.0),v.z+(v.w/255.0)); }


// SHADOWMAP_PARS_FRAGMENT


struct DirectionalLightShadow{
float shadowIntensity;
float shadowBias;
float shadowNormalBias;
float shadowRadius;
vec2 shadowMapSize;
};


uniform DirectionalLightShadow directionalLightShadows[NUM_DIR_LIGHT_SHADOWS];
uniform sampler2D directionalShadowMap[NUM_DIR_LIGHT_SHADOWS];
varying vec4 vDirectionalShadowCoord[NUM_DIR_LIGHT_SHADOWS];


float texture2DCompare(sampler2D depths,vec2 uv,float compare){
return step(compare,unpackRGBAToDepth(texture2D(depths,uv)));


}


vec2 texture2DDistribution(sampler2D shadow,vec2 uv){
return unpackRGBATo2Half(texture2D(shadow,uv));
}


float VSMShadow(sampler2D shadow,vec2 uv,float compare){
float occlusion=1.0;
vec2 distribution=texture2DDistribution(shadow,uv);
float hard_shadow=step(compare,distribution.x); // Hard Shadow
if(hard_shadow!=1.0){
float distance=compare-distribution.x ;
float variance=max(0.00000,distribution.y*distribution.y);
float softness_probability=variance/(variance+distance*distance); // Chebeyshevs inequality
softness_probability=clamp((softness_probability-0.3)/(0.95-0.3),0.0,1.0); // 0.3 reduces light bleed
occlusion=clamp(max(hard_shadow,softness_probability),0.0,1.0);
}
return occlusion;
}


float getShadow(sampler2D shadowMap,vec2 shadowMapSize,float shadowIntensity,float shadowBias,float shadowRadius,vec4 shadowCoord){


float shadow=1.0;
shadowCoord.xyz/=shadowCoord.w;
shadowCoord.z+=shadowBias;


bool inFrustum=shadowCoord.x>=0.0 && shadowCoord.x<=1.0 && shadowCoord.y>=0.0 && shadowCoord.y<=1.0;
bool frustumTest=inFrustum && shadowCoord.z<=1.0;


if(frustumTest){
#if defined(SHADOWMAP_TYPE_VSM)
shadow=VSMShadow(shadowMap,shadowCoord.xy,shadowCoord.z);
#else // no percentage-closer filtering:
shadow=texture2DCompare(shadowMap,shadowCoord.xy,shadowCoord.z);
#endif
}


return mix(1.0,shadow,shadowIntensity);


}


vec2 cubeToUV(vec3 v,float texelSizeY){	
vec3 absV=abs(v);
float scaleToCube=1.0/max(absV.x,max(absV.y,absV.z));
absV*=scaleToCube;
v*=scaleToCube*(1.0-2.0*texelSizeY);
vec2 planar=v.xy;
float almostATexel=1.5*texelSizeY;
float almostOne=1.0-almostATexel;
if(absV.z>=almostOne){
if(v.z>0.0)
planar.x=4.0-v.x;
}else if(absV.x>=almostOne){
float signX=sign(v.x);
planar.x=v.z*signX+2.0*signX;
}else if(absV.y>=almostOne){
float signY=sign(v.y);
planar.x=v.x+2.0*signY+2.0;
planar.y=v.z*signY-2.0;
}
return vec2(0.125,0.25)*planar+vec2(0.375,0.75);
}


float getPointShadow(sampler2D shadowMap,vec2 shadowMapSize,float shadowIntensity,float shadowBias,float shadowRadius,vec4 shadowCoord,float shadowCameraNear,float shadowCameraFar){
float shadow=1.0;
vec3 lightToPosition=shadowCoord.xyz;
float lightToPositionLength=length(lightToPosition);
if(lightToPositionLength-shadowCameraFar<=0.0 && lightToPositionLength-shadowCameraNear>=0.0){
float dp=(lightToPositionLength-shadowCameraNear)/(shadowCameraFar-shadowCameraNear);
dp+=shadowBias;
vec3 bd3D=normalize(lightToPosition);
vec2 texelSize=vec2(1.0)/(shadowMapSize*vec2(4.0,2.0));
shadow=texture2DCompare(shadowMap,cubeToUV(bd3D,texelSize.y),dp);
}
return mix(1.0,shadow,shadowIntensity);
}


// SHADOWMASK_PARS_FRAGMENT


float getShadowMask_top(){


float shadow=1.0;
DirectionalLightShadow directionalLight;


#pragma unroll_loop_start
for(int i=0;i<NUM_DIR_LIGHT_SHADOWS;i++){
directionalLight=directionalLightShadows[i];
shadow*=getShadow(directionalShadowMap[i],directionalLight.shadowMapSize,directionalLight.shadowIntensity,directionalLight.shadowBias,directionalLight.shadowRadius,vDirectionalShadowCoord[i]);
}
#pragma unroll_loop_end


return shadow;


}


float getShadowMask_bottom(vec4 d_position){


float shadow=1.0;
DirectionalLightShadow directionalLight;


#pragma unroll_loop_start
for(int i=0;i<NUM_DIR_LIGHT_SHADOWS;i++){
directionalLight=directionalLightShadows[i];
shadow*=getShadow(directionalShadowMap[i],directionalLight.shadowMapSize,directionalLight.shadowIntensity,directionalLight.shadowBias,directionalLight.shadowRadius,directionalShadowMatrix[i]*d_position);
}
#pragma unroll_loop_end


return shadow;


}


#endif


void main(){


#ifdef holes
if(texture2D(holes_map,holes_uv).r<1.0){ discard; }
#endif


vec2 screen_uv=gl_FragCoord.xy/screen_resolution;
vec3 viewDir=normalize(vToEye); 


vec3 normal_a=texture2D(normal_map,vec2(vUv.x*normal_a_value.x+time*normal_a_value.y,vUv.y*normal_a_value.x+time*normal_a_value.z)).rgb;
vec3 normal_b=texture2D(normal_map,vec2(vUv.x*normal_b_value.x+time*normal_b_value.y,vUv.y*normal_b_value.x+time*normal_b_value.z)).rgb;


vec3 normal_small=normal_a+normal_b-1.0;
normal_small.y*=normal_ab;
normal_small=normalize(normal_small);
normal_small=perturbNormal2Arb(-vViewPosition,vNormal,normal_small);
normal_small=inverseTransformDirection(normal_small,viewMatrix);


vec3 normal_c=texture2D(normal_map,vec2(vUv.x*normal_c_value.x+time*normal_c_value.y,vUv.y*normal_c_value.x+time*normal_c_value.z)).rgb;
vec3 normal_d=texture2D(normal_map,vec2(vUv.x*normal_d_value.x+time*normal_d_value.y,vUv.y*normal_d_value.x+time*normal_d_value.z)).rgb;


vec3 normal_far=normal_c+normal_d-1.0;
normal_far.y*=normal_cd;
normal_far=normalize(normal_far);
normal_far=perturbNormal2Arb(-vViewPosition,vNormal,normal_far);
normal_far=inverseTransformDirection(normal_far,viewMatrix);


vec3 normal_big=perturbNormal2Arb(-vViewPosition,vNormal,vec3(0.0,0.0,1.0));
normal_big=inverseTransformDirection(normal_big,viewMatrix);
#if defined ocean && defined use_waves
normal_big=mix(vec3(0.0,1.0,0.0),normal_big,distance_attenuation);
#endif


normal_far=normalize(mix(normal_small,normal_far,normal_small_far_total.x));


vec3 normal_total=normalize(mix(normal_big,normal_far,normal_small_far_total.y));


// ____________________ VERTICAL DEPTH ___________________
 

float scene_depth_raw=texture2D(scene_depth_map,screen_uv).r;
float scene_depth_computed=projectionMatrix[3][2]/((scene_depth_raw*2.0-1.0)+projectionMatrix[2][2]);
float water_depth_vertical_raw=vPosition.y-((vPosition.y-cameraPosition.y)/vViewPosition.z*scene_depth_computed+cameraPosition.y);


float water_depth_vertical=water_depth_vertical_raw;


water_depth_vertical=clamp(1.0-water_depth_vertical*2.0+0.2,0.0,1.0);
water_depth_vertical=pow(water_depth_vertical,1.0);
//water_depth_vertical=1.0-exp(-water_depth_vertical);


// ____________________ REFRACTION __________________


#ifdef refraction_use
vec2 uv_distorted=screen_uv+mix(normal_small,normal_big,0.5).xz*refraction_value.x*clamp(water_depth_vertical_raw,0.0,1.0)*smoothstep(30.0,0.0,vViewPosition.z);
// УМЕНЬШАЕМ РЕФРАКЦИЮ У БЕРЕГА
uv_distorted=mix(screen_uv,uv_distorted,clamp((scene_depth_computed-vViewPosition.z)*refraction_value.y,0.0,1.0));
#else
vec2 uv_distorted=screen_uv;
#endif


// ____________________ ANGLED DEPTH ___________________


#ifdef refraction_use
float scene_depth_distorted=texture2D(scene_depth_map,uv_distorted).r;
float scene_depth_angled=projectionMatrix[3][2]/((scene_depth_distorted*2.0-1.0)+projectionMatrix[2][2]);
#else
float scene_depth_angled=scene_depth_computed;
#endif


#ifdef refraction_use


float water_depth=texture2D(water_depth_map,uv_distorted).r;
water_depth=projectionMatrix[3][2]/((water_depth*2.0-1.0)+projectionMatrix[2][2]);


#ifdef refraction_flat
if(scene_depth_angled>=water_depth){
uv_distorted=mix(screen_uv,uv_distorted,min(clamp(scene_depth_angled-water_depth,0.0,1.0)*20.0,1.0));
}
#endif


// REMOVE DISTORTION


if(scene_depth_angled<water_depth){
uv_distorted=screen_uv;
scene_depth_angled=scene_depth_computed;
}


#endif


float water_depth_angled=scene_depth_angled-vViewPosition.z;


float water_depth_angled_raw=water_depth_angled;


water_depth_angled=exp((water_depth_angled-depth_offset)*depth_beers_law);
water_depth_angled=clamp(pow(water_depth_angled,depth_distance),0.0,1.0);


float water_depth_angled_inverted=1.0-water_depth_angled;



// ____________________ VERTEX FROM DEPTH ___________________


#if (defined use_shadows && defined USE_SHADOWMAP) || defined use_caustics
vec3 d_position=get_position_from_depth(scene_depth_map,uv_distorted);
#endif


// ____________________ SHADOWS ___________________


#if defined use_shadows && defined USE_SHADOWMAP
float shadow_top_raw=getShadowMask_top();
float shadow_top_bright=min(shadow_top_raw+0.5,1.0);
float shadow_bottom=getShadowMask_bottom(vec4(d_position,1.0));
#else
float shadow_top_raw=1.0;
float shadow_top_bright=1.0;
float shadow_bottom=1.0;
#endif


#ifdef use_caustics


// ____________________ NORMAL FROM DEPTH ___________________


#if screen_normal_quality==1
vec3 screen_normal=normalize(cross(dFdx(d_position),dFdy(d_position))); // EASY
#elif screen_normal_quality==2
vec3 screen_normal=get_normal_from_depth_2(scene_depth_map,uv_distorted,screen_texel_size); // AVERAGE
#elif screen_normal_quality==3
vec3 screen_normal=get_normal_from_depth_3(scene_depth_map,uv_distorted,screen_texel_size); // HARD
#endif


// FIX BLACK HOLES
screen_normal=clamp(screen_normal,-1.0,1.0);


// ____________________ CAUSTICS ___________________


vec2 caustics_uv_x=d_position.zy*caustics_scale_power.x;
vec2 caustics_uv_y=d_position.xz*caustics_scale_power.x;
vec2 caustics_uv_z=d_position.xy*caustics_scale_power.x;


float caustics_amplitude=sin(time*caustics_wave.z)*caustics_wave.y;
vec2 caustics_waves=vec2(sin(d_position.y*caustics_wave.x+caustics_wave.z)*caustics_amplitude,sin(d_position.x*caustics_wave.x+caustics_wave.z)*caustics_amplitude);
caustics_uv_x+=caustics_waves;
caustics_uv_y+=caustics_waves;
caustics_uv_z+=caustics_waves;


vec3 caustics_weights=triplanar(screen_normal,0.25,1.0);


vec2 caustics_1_speed=vec2(time*caustics_1_dir_speed.x,time*caustics_1_dir_speed.y);
vec2 caustics_2_speed=vec2(time*caustics_2_dir_speed.x,time*caustics_2_dir_speed.y);
vec3 caustics_1=caustics_weights.x*texture2D(caustics_map,caustics_uv_x+caustics_1_speed).rgb+caustics_weights.y*texture2D(caustics_map,caustics_uv_y+caustics_1_speed).rgb+caustics_weights.z*texture2D(caustics_map,caustics_uv_z+caustics_1_speed).rgb;
vec3 caustics_2=caustics_weights.x*texture2D(caustics_map,caustics_uv_x*0.8+caustics_2_speed).rgb+caustics_weights.y*texture2D(caustics_map,caustics_uv_y*0.8+caustics_2_speed).rgb+caustics_weights.z*texture2D(caustics_map,caustics_uv_z*0.8+caustics_2_speed).rgb;
vec3 caustics=pow(min(caustics_1,caustics_2),vec3(caustics_scale_power.y))*caustics_color*caustics_intensity*pow(sun_direction.y,2.0)*shadow_bottom*max(0.0,dot(sun_direction,screen_normal));


#endif


// ____________________ WATER COLOR __________________


vec3 top_color=water_top_color*max(0.2,sun_direction.y);
vec3 bottom_color=water_bottom_color*max(0.2,sun_direction.y);


// TRANSPARENT SHORE
#ifdef use_shore_transparent
float depth_top_smooth=smoothstep(1.0,shore_transparent,water_depth_angled);
top_color=mix(vec3(1.0),top_color,depth_top_smooth);
#else
float depth_top_smooth=1.0;	
#endif


vec3 screen_map=texture(scene_map,uv_distorted).rgb;


// SIMPLE
#ifndef use_transparent_style
#ifdef use_caustics
gl_FragColor.rgb=mix(screen_map*top_color+caustics,bottom_color,water_depth_angled_inverted);
#else
gl_FragColor.rgb=mix(screen_map*top_color,bottom_color,water_depth_angled_inverted);
#endif
// TRANSPARENT
#else
#ifdef use_caustics
gl_FragColor.rgb=screen_map*mix(top_color,bottom_color,water_depth_angled_inverted)+caustics;
#else
gl_FragColor.rgb=screen_map*mix(top_color,bottom_color,water_depth_angled_inverted);
#endif
#endif


// ____________________ WAVES COLOR ___________________


#if defined use_waves && defined use_wave_color
float waves_color_limit=dot(viewDir,normal_big); 
//gl_FragColor.rgb=mix(gl_FragColor.rgb,gl_FragColor.rgb+wave_color*water_depth_angled_inverted*waves_color_limit,pow(wave_height,wave_color_power)*sun_direction.y);
gl_FragColor.rgb=mix(gl_FragColor.rgb,wave_color,pow(wave_height,wave_color_power)*sun_direction.y);
#endif


// ____________________ SSS - SUBSURFACE SCATTERING ___________________


#ifdef use_sss
vec3 sss_refraction=normalize(refract(-viewDir,normal_total,sss_value.x));
float sss_dot=pow(max(0.0,dot(sss_refraction,normalize(vec3(sun_direction.x,sun_direction.y*sss_value.w,sun_direction.z)))),sss_value.y);
gl_FragColor.rgb+=sss_dot*sss_color*sss_value.z*(1.0-sun_direction.y)*shadow_top_bright*water_depth_angled_inverted;
#endif


// ____________________ PHONG SIMPLE ___________________


#ifdef use_phong_simple
float phong_simple_dot=max(0.0,dot(sun_direction,normal_total));
gl_FragColor.rgb+=phong_simple_intensity*phong_simple_dot*sun_color*gl_FragColor.rgb*water_depth_angled_inverted;
#endif


// ____________________ SCATTERING ___________________


#ifdef use_scattering
gl_FragColor.rgb*=mix(1.0,max(0.0,dot(sun_direction,normal_total)),scattering_intensity*water_depth_angled_inverted);
#endif


// ____________________ ENV ___________________


vec3 env_normal=mix(normal_big,normal_total,env_mix);
//vec3 env_R=reflect(-viewDir,env_normal); // CUBE ENV
vec3 env_R=reflect(-viewDir,normalize(vec3(env_normal.x,env_melt,env_normal.z))); // CUBE ENV
//vec3 env_R=reflect(viewDir,vec3(-env_normal.x,-env_normal.z,-env_normal.y)); // CUBE ENV INVERTED
env_R.y=abs(env_R.y);
vec3 env_reflection_map=textureCube(envMap,env_R).rgb;
float env_fresnel_reflectance=env_fresnel_min+(1.0-env_fresnel_min)*(pow(1.0-max(0.0,dot(viewDir,env_normal)),env_fresnel_power));
gl_FragColor=vec4(mix(gl_FragColor.rgb,env_reflection_map*env_intensity+gl_FragColor.rgb*env_add_background,env_fresnel_reflectance*env_max*depth_top_smooth),1.0);


// ____________________ GAMMA ____________________


#ifdef use_gamma
gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(gamma));
#endif


// ____________________ SATURATION ____________________


#ifdef use_saturation
float luminance=dot(gl_FragColor.rgb,vec3(0.2125,0.7154,0.0721));
vec3 intensity=vec3(luminance);
gl_FragColor.rgb=mix(intensity,gl_FragColor.rgb,saturation);
#endif


#ifdef use_specular


// ____________________ SUN __________________


vec3 normal_specular=normalize(mix(normal_big,normal_small,0.5)); 


vec3 halfDir=normalize(viewDir+sun_direction);
float specular_fresnel_power=mix(specular.y,specular.z,sun_direction.y); 
float specular_fresnel=pow(max(0.0,dot(halfDir,normal_specular)),specular_fresnel_power);
#ifndef use_back
gl_FragColor.rgb+=specular.x*specular_fresnel*sun_color*shadow_top_raw;
#else
if(gl_FrontFacing){
gl_FragColor.rgb+=specular.x*specular_fresnel*sun_color*shadow_top_raw;
}	
#endif


// ____________________ BACK __________________


#ifdef use_back
if(!gl_FrontFacing){
vec3 env_R_back=reflect(-viewDir,-env_normal);
float env_fresnel_reflectance_back=env_fresnel_min+(1.0-env_fresnel_min)*(pow(1.0-max(0.0,dot(viewDir,-env_normal)),env_fresnel_power));
vec3 env_reflection_map_back=textureCube(envMap,vec3(env_R_back.x,-env_R_back.y,env_R.z)).rgb;
gl_FragColor.rgb=mix(texture2D(scene_map,screen_uv+normal_total.xz*0.5).rgb,env_reflection_map_back,env_fresnel_reflectance_back);
}
#endif


#endif


// ____________________ FOAM WAVES __________________


#if defined use_waves && defined use_foam_waves
vec3 foam_waves=texture(foam_wave_map,vUv*foam_waves_value.x).rgb;
foam_waves=foam_waves*foam_waves_value.z*max(0.2,sun_direction.y);
gl_FragColor.rgb=mix(gl_FragColor.rgb,max(gl_FragColor.rgb,foam_waves)*shadow_top_bright,pow(wave_height,foam_waves_value.y));
#endif


// ____________________ FOAM SHORE __________________


#ifdef use_foam_shore
vec3 foam_shore=texture(foam_shore_map,vUv*foam_shore_value.y+vec2(time*foam_shore_value.z,time*foam_shore_value.w)).rgb;
// FIX BUG
gl_FragColor.rgb=mix(max(gl_FragColor.rgb,foam_shore)*(0.5+sun_direction.y*0.5)*shadow_top_bright,gl_FragColor.rgb,1.0-clamp(pow(water_depth_vertical,foam_shore_value.x)*(1.0-max(0.0,water_depth_angled_raw-1.0))+normal_small.x*0.4-0.2,0.0,1.0));
#endif


// ____________________ SKY MIX __________________


#ifdef use_sky_far_mix
gl_FragColor.rgb=mix(textureCube(envMap,-viewDir).rgb,gl_FragColor.rgb,attenuation_env);
#endif


// ____________________ SHORE SMOOTHING __________________


#ifdef use_shore_smoothing
float water_depth_shore=clamp((scene_depth_computed-vViewPosition.z)*shore_smoothing_intensity,0.0,1.0);
gl_FragColor.rgb=mix(texture(scene_map,screen_uv).rgb,gl_FragColor.rgb,water_depth_shore);
#endif


// ____________________ FOG __________________


#if defined fog || defined fog_exp2
#ifdef fog
float fogFactor=smoothstep(fogNear,fogFar,vViewPosition.z);
#else
float fogFactor=1.0-exp(-fogDensity*fogDensity*vViewPosition.z*vViewPosition.z);	
#endif
gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,fogFactor);
#endif


// CHECKING LIGHT ON NORMAL MAP
//gl_FragColor.rgb=vec3(dot(normal_small,sun_direction));


}


`;
