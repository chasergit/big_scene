vs["terrain_triplanar"]=`


attribute vec2 uv2;


varying vec2 noise_uv_y;
varying vec2 shadowGroundUv;
varying vec3 light_c;
varying float fogFactor;
varying vec3 vNormal;
varying vec3 vPosition;


void main(){


vPosition=position;


noise_uv_y=vec2(position.x*0.002,position.z*0.002*-1.0)+0.5;
shadowGroundUv=vec2(position.x,position.z*-1.0);


vNormal=normal;


float light_i=dot(normal,vec3(0.45,0.76,0.45));
if(light_i<0.2){ light_i=0.2; }
light_i*=2.4;


light_c=light_i*vec3(1.0,0.94,0.79);


vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.0);



fogFactor=smoothstep(50.0,800.0,length(mvPosition));


gl_Position=projectionMatrix*mvPosition;


}


`;


fs["terrain_triplanar"]=`


uniform sampler2D map;
uniform sampler2D dirt;
uniform sampler2D noise;
uniform sampler2D aoMap;
uniform sampler2D shadowGroundMap;
uniform vec2 shadowGroundOffset;


uniform vec3 fogColor;
varying float fogFactor;


varying vec2 noise_uv_y;
varying vec2 shadowGroundUv;
varying vec3 light_c;
varying vec3 vNormal;
varying vec3 vPosition;


vec3 triplanar(vec3 normal,float smooth_1,float smooth_2){
vec3 blend_weights=normal*normal;
float max_blend=max(blend_weights.x,max(blend_weights.y,blend_weights.z));
blend_weights=max(blend_weights-max_blend*smooth_1,0.0);// МЯГКИЙ ПЕРЕХОД
blend_weights.y*=smooth_2;
float rcp_blend=1.0/(blend_weights.x+blend_weights.y+blend_weights.z);
return blend_weights*rcp_blend;
}


void main(){


float grid=1.0;
float width=3.0;
vec3 pos=d_position.xyz*grid;
vec3 fw=fwidth(pos);
vec3 bc=clamp(width-abs(1.0-2.0*fract(pos))/fw,0.0,1.0);
vec3 f1=smoothstep(1.0/grid,2.0/grid,fw);
vec3 f2=smoothstep(2.0/grid,4.0/grid,fw);
//gl_FragColor.rgb=mix(mix(bc,vec3(0.5),f1),vec3(0.0),f2);


vec2 map_uv_x=vPosition.zy*0.4;
vec2 map_uv_y=vPosition.xz*0.4;
vec2 map_uv_z=vPosition.xy*0.4;


vec3 weights=triplanar(vNormal,0.25,1.0);


vec3 color=weights.x*texture2D(dirt,map_uv_x).rgb+weights.y*texture2D(map,map_uv_y).rgb+weights.z*texture2D(dirt,map_uv_z).rgb;


vec3 finalColor=color*texture2D(aoMap,noise_uv_y).rgb*texture2D(noise,noise_uv_y).rgb*light_c;
vec3 shadowGroundTex=finalColor*texture2D(shadowGroundMap,shadowGroundUv*0.002+vec2(0.0,1.0)+shadowGroundOffset).r;
float shadowGroundDist=clamp(98.0-distance(cameraPosition.xz,vPosition.xz),0.0,1.0);
//finalColor=mix(finalColor,shadowGroundTex,shadowGroundDist);
finalColor=shadowGroundTex;


finalColor=pow(finalColor,vec3(1.4));
finalColor=mix(finalColor,fogColor,fogFactor);


gl_FragColor=vec4(finalColor,1.0);


}


`;
