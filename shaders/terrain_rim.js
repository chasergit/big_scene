vs["terrain_rim"]=`


attribute vec2 uv2;
varying vec2 vUv2;
varying vec2 map_uv_y;
varying vec2 noise_uv_y;
varying vec3 light_c;
varying float fog_factor;


varying vec3 vNormal;
varying vec3 vPosition;
void main(){


vUv2=uv2;


noise_uv_y=vec2(position.x*0.00002,position.z*0.00002*-1.0)+0.5;


map_uv_y=position.xz*0.004;


float light_i=dot(normal,vec3(0.45,0.76,0.45));
if(light_i<0.4){ light_i=0.4; }
light_i*=2.5;


light_c=light_i*vec3(1.0,0.94,0.79);


vec4 mvPosition=modelViewMatrix*vec4(vPosition,1.0);


fogFactor=smoothstep(50.0,800.0,length(mvPosition));


gl_Position=projectionMatrix*mvPosition;
vPosition=position;


vNormal=normal;


}


`;


fs["terrain_rim"]=`


uniform sampler2D map;
uniform sampler2D noise;
uniform sampler2D aoMap;


uniform vec3 fog_color;
varying float fog_factor;


varying vec2 vUv2;
varying vec2 map_uv_y;
varying vec2 noise_uv_y;
varying vec3 light_c;
varying vec3 world_pos;
varying vec3 world_normal;
varying vec3 vNormal;
varying vec3 vPosition;


const float gamma = 1.0/0.8;


float rimStrength=1.0;
float rimWidth=0.6;
vec3 rimColor=vec3(0.99,0.99,0.65);


void main(){


vec3 viewVector=normalize(cameraPosition-vPosition);
float rimndotv=max(0.0,rimWidth-clamp(dot(vNormal,viewVector),0.0,1.0));
rimndotv=smoothstep(0.4,1.0,rimndotv);
vec3 rimLight=rimndotv*rimColor*rimStrength;


vec3 tex_rim=texture2D(map,map_uv_y).rgb*texture2D(noise,noise_uv_y).rgb*texture2D(aoMap,vUv2).rgb*light_c+rimLight;
vec3 finalColorGamma=vec3(pow(tex_rim.r,gamma),pow(tex_rim.g,gamma),pow(tex_rim.b,gamma));
gl_FragColor=vec4(mix(finalColorGamma,fog_color,fog_factor),1.0);


}


`;
