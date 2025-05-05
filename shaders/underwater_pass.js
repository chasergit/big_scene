const underwater_pass={


name:"underwater_pass",


uniforms:{
time:{value:0},
screen_aspect_ratio:{value:null},
screen_texel_size:{value:null},
sun_direction:{value:null},
sun_3d_position:{value:null},
cameraPosition:{value:null},
position_from_depth_projection:{value:null},
use_caustics:{value:true},
caustics_map:{value:null},
caustics_top:{value:0},
caustics_bottom:{value:0},
caustics_1_dir_speed:{value:[0,0]},
caustics_2_dir_speed:{value:[0,0]},
caustics_wave:{value:[1,0.1,0.001]},
caustics_intensity:{value:1},
caustics_scale_power:{value:[0.2,1]},
caustics_color:{value:[1,1,1]},
tDepth:{value:null},
waterline_rtt:{value:null},
tDiffuse:{value:null},
use_transparent_style:{value:false},
gradient_top:{value:0},
gradient_bottom:{value:0},
top_color_top:{value:0},
top_color_bottom:{value:0},
top_color:{value:[0.0,0.91,0.19]},
bottom_color:{value:[0.0,0.18,0.09]},
sun_flare_color:{value:[1.0,1.0,0.0]},
sun_flare_intensity:{value:1},
darkness_top:{value:2},
darkness_bottom:{value:-20},
depth_distance:{value:70},
directionalLightShadows:{value:[]},
directionalShadowMap:{value:[]},
directionalShadowMatrix:{value:[]},
gamma:{value:1.0},
saturation:{value:1.0},
use_shadows:{value:true},
use_sun_flare:{value:true}
},


defines:{
USE_SHADOWMAP:true,
SHADOWMAP_TYPE_VSM:true,	
screen_normal_quality:1, // QUALITY OF NORMAL FROM DEPTH TEXTURE: 1 - LOW, 2 - MEDIUM, 3 - HIGH
use_gamma:true,
use_saturation:true,
},


vertexShader:`


uniform float screen_aspect_ratio;
varying vec2 vUv;


void main(){


vUv=uv;
gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


}`,


fragmentShader:`


uniform float time;
uniform float screen_aspect_ratio;
uniform vec2 screen_texel_size;
uniform mat4 position_from_depth_projection;
uniform bool use_caustics;
uniform sampler2D caustics_map;
uniform vec2 caustics_1_dir_speed;
uniform vec2 caustics_2_dir_speed;
uniform vec3 caustics_wave;
uniform float caustics_intensity;
uniform vec2 caustics_scale_power;
uniform vec3 caustics_color;
uniform sampler2D tDepth;
uniform sampler2D waterline_rtt;
uniform sampler2D tDiffuse;
uniform vec3 sun_direction;
uniform vec3 sun_3d_position;
uniform bool use_transparent_style;
uniform float gradient_top;
uniform float gradient_bottom;
uniform float top_color_top;
uniform float top_color_bottom;
uniform vec3 top_color;
uniform vec3 bottom_color;
uniform float darkness_top;
uniform float darkness_bottom;
uniform float depth_distance;
uniform float caustics_top;
uniform float caustics_bottom;
uniform bool use_shadows;
uniform vec3 sun_flare_color;
uniform float sun_flare_intensity;
uniform bool use_sun_flare;
#ifdef use_gamma
uniform float gamma; 
#endif
#ifdef use_saturation
uniform float saturation; 
#endif
varying vec2 vUv;


vec3 triplanar(vec3 normal,float smooth_1,float smooth_2){
vec3 blend_weights=normal*normal;
float max_blend=max(blend_weights.x,max(blend_weights.y,blend_weights.z));
blend_weights=max(blend_weights-max_blend*smooth_1,0.0);
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


// NUM ЗАМЕНЕНО НА КОЛИЧЕСТВО С ПРОБЕЛАМИ ПО БОКАМ:  1


uniform mat4 directionalShadowMatrix[  1  ];
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


uniform DirectionalLightShadow directionalLightShadows[  1  ];
uniform sampler2D directionalShadowMap[  1  ];


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


float getShadowMask_bottom(vec4 d_position){


float shadow=1.0;
DirectionalLightShadow directionalLight;


#pragma unroll_loop_start
for(int i=0;i<  1  ;i++){
directionalLight=directionalLightShadows[i];
shadow*=getShadow(directionalShadowMap[i],directionalLight.shadowMapSize,directionalLight.shadowIntensity,directionalLight.shadowBias,directionalLight.shadowRadius,directionalShadowMatrix[i]*d_position);
}
#pragma unroll_loop_end


return shadow;


}


#endif


void main(){


gl_FragColor=texture2D(tDiffuse,vUv);


vec3 d_position=get_position_from_depth(tDepth,vUv);


float sharp_line=texture2D(waterline_rtt,vUv).r;


// ____________________ LANDSCAPE GRADIENT BY HEIGHT ____________________


float from_top_to_bottom_distance=smoothstep(gradient_top,gradient_bottom,d_position.y)*sharp_line;
if(!use_transparent_style){
vec3 top_gradient_color=mix(gl_FragColor.rgb,gl_FragColor.rgb*top_color,smoothstep(top_color_top,top_color_bottom,d_position.y)*sharp_line);
gl_FragColor.rgb=mix(top_gradient_color,bottom_color,from_top_to_bottom_distance);
}
else{
gl_FragColor.rgb=mix(gl_FragColor.rgb,gl_FragColor.rgb*bottom_color,sharp_line);
}


// ____________________ SHADOWS ___________________


float shadow_bottom=1.0;

	
#ifdef USE_SHADOWMAP
if(use_shadows){
shadow_bottom=getShadowMask_bottom(vec4(d_position,1.0));
}
#endif


if(use_caustics){


// ____________________ CALCULATION OF NORMAL FROM DEPTH ___________________


#if screen_normal_quality==1
vec3 screen_normal=normalize(cross(dFdx(d_position),dFdy(d_position))); // EASY
#elif screen_normal_quality==2
vec3 screen_normal=get_normal_from_depth_2(tDepth,vUv,screen_texel_size); // AVERAGE
#elif screen_normal_quality==3
vec3 screen_normal=get_normal_from_depth_3(tDepth,vUv,screen_texel_size); // HARD
#endif


// ____________________ CAUTICS ____________________


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


// ADD CAUSTIC SOFTLY, BECAUSE AT A SHARP TRANSITION IT WILL OVERLAP THE BACK SIDE OF THE WATER BECAUSE OF THE CLOSE BORDER
// WE ALWAYS SET sharp_line. OTHERWISE, IF YOU LOOK 50 METERS ABOVE THE WATER, DISTORTIONS WILL BE VISIBLE
gl_FragColor.rgb+=caustics*smoothstep(caustics_top,caustics_bottom,d_position.y)*(1.0-from_top_to_bottom_distance)*sharp_line;


}


// ____________________ BOTTOM COLOR GRADIENT BY DISTANCE ____________________


float diving_y=1.0-smoothstep(darkness_top,darkness_bottom,cameraPosition.y);
float distance_to_objects=smoothstep(depth_distance,0.0,length(cameraPosition.xz-d_position.xz));
gl_FragColor.rgb=mix(gl_FragColor.rgb,bottom_color,(1.0-min(diving_y,distance_to_objects))*sharp_line);


// ____________________ DARKENING WITH DEPTH ____________________


gl_FragColor.rgb*=diving_y;


// ____________________ SATURATION ____________________


#ifdef use_saturation
float luminance=dot(gl_FragColor.rgb,vec3(0.2125,0.7154,0.0721));
vec3 intensity=vec3(luminance);
gl_FragColor.rgb=mix(intensity,gl_FragColor.rgb,mix(1.0,saturation,sharp_line));
#endif


// ____________________ GAMMA ____________________


#ifdef use_gamma
gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(mix(1.0,gamma,sharp_line)));
#endif


// ____________________ SUNSHINE UNDER WATER ____________________


if(use_sun_flare){
vec2 sun_difference=vUv-sun_3d_position.xy;
sun_difference.x*=screen_aspect_ratio;
float prop=clamp(length(sun_difference)/2.9,0.0,1.0);
prop=pow(1.0-prop,5.0)*sun_flare_intensity;
gl_FragColor.rgb=mix(sun_flare_color*diving_y,gl_FragColor.rgb,1.0-prop*sharp_line);
}


}`


};


export default underwater_pass;
