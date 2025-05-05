vs["terrain_single"]=`


attribute vec2 uv2;


varying vec2 map_uv_y;
varying vec2 noise_uv_y;
varying vec2 shadowGroundUv;
varying vec2 vUv2;
varying vec3 light_c;
varying float fogFactor;
varying vec3 vPosition;
varying float shadowGroundDist;
uniform vec2 shadowGroundOffset;


void main(){


vPosition=position;


noise_uv_y=vec2(position.x*0.002,position.z*0.002*-1.0)+0.5;
shadowGroundUv=(vec2(position.x,position.z)+modelMatrix[3].xz)*0.002+shadowGroundOffset;


map_uv_y=position.xz;


vUv2=uv2;


float light_i=dot(normal,vec3(0.45,0.76,0.45));
if(light_i<0.2){ light_i=0.2; }
light_i*=2.0;


light_c=light_i*vec3(1.0,0.99,0.99);


shadowGroundDist=clamp(145.0-distance(cameraPosition.xz,vPosition.xz),0.0,1.0);


vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.0);


fogFactor=smoothstep(50.0,800.0,length(mvPosition));


gl_Position=projectionMatrix*mvPosition;


}


`;


fs["terrain_single"]=`


uniform sampler2D map;
uniform sampler2D dirt;
uniform sampler2D noise;
uniform sampler2D aoMap;
uniform sampler2D shadowGroundMap;


uniform vec3 fogColor;
varying float fogFactor;


varying vec2 map_uv_y;
varying vec2 noise_uv_y;
varying vec2 shadowGroundUv;
varying vec2 vUv2;
varying vec3 light_c;
varying vec3 vPosition;
varying float shadowGroundDist;


void main(){


vec3 finalColor=texture2D(map,map_uv_y*0.2).rgb;


vec3 noiseTex=texture2D(noise,noise_uv_y).rgb;


vec3 dirtTex=texture2D(dirt,map_uv_y*0.2).rgb;


finalColor*=noiseTex;



finalColor*=texture2D(aoMap,noise_uv_y).rgb;


finalColor*=light_c; 


vec3 shadowGroundTex=finalColor*texture2D(shadowGroundMap,shadowGroundUv).r;


finalColor=mix(finalColor,shadowGroundTex,clamp(145.0-distance(cameraPosition.xz,vPosition.xz),0.0,1.0));


finalColor=pow(finalColor,vec3(1.4));
finalColor=mix(finalColor,fogColor,fogFactor);


gl_FragColor=vec4(finalColor,1.0);


}


`;
