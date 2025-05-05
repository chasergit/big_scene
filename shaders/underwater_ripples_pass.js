const underwater_ripples_pass={


name:"underwater_ripples_pass",


uniforms:{
time:{value:0},
normal_map:{value:null},
eyes_normal_map:{value:null},
waterline_rtt:{value:null},
tDiffuse:{value:null},
eyes_intensity:{value:0.0},
eyes:{value:true},
},


vertexShader:`


varying vec2 vUv;


void main(){


vUv=uv;
gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


}`,


fragmentShader:`


uniform float time;
uniform sampler2D waterline_rtt;
uniform sampler2D tDiffuse;
uniform sampler2D normal_map;
uniform sampler2D eyes_normal_map;
uniform float eyes_intensity;
uniform bool eyes;
varying vec2 vUv;


void main(){


float ripples_size_1=0.1;
float ripples_size_2=0.3;
float ripples_speed=time*0.0001;


vec2 ripples_1=texture2D(normal_map,vec2(vUv.x*ripples_size_1,vUv.y*ripples_size_1+ripples_speed)).rb;
vec2 ripples_2=texture2D(normal_map,vUv*ripples_size_2+ripples_speed).rb;
vec2 ripples=ripples_1+ripples_2-1.0;
vec2 uv=vUv;
float intensity=0.02;
uv*=1.0-intensity*2.0;
uv+=intensity;
uv+=ripples*intensity;
uv.y-=intensity*2.0;




float sharp_water_line=texture2D(waterline_rtt,vUv).r;



if(texture2D(waterline_rtt,uv).r==0.0){ uv=vUv; }


vec2 eyes_normal_1=texture2D(eyes_normal_map,vUv*vec2(0.5,0.3)+vec2(0.0,time*0.0002)).xy;
vec2 eyes_normal_2=texture2D(eyes_normal_map,vUv*vec2(0.5,0.3)+vec2(0.0,time*0.0004)).xy;
vec2 eyes_normal=min(eyes_normal_1,eyes_normal_2);


if(eyes){
gl_FragColor.rgb=mix(texture2D(tDiffuse,vUv+(eyes_normal.xy*2.0-1.0)*eyes_intensity).rgb,texture2D(tDiffuse,uv).rgb,sharp_water_line);
}
else{
gl_FragColor.rgb=mix(texture2D(tDiffuse,vUv).rgb,texture2D(tDiffuse,uv).rgb,sharp_water_line);
}


float water_line_frequency=10.0;
float water_line_amplitude=0.003;
float water_line_offset=sin(time*0.005+vUv.x*water_line_frequency)*water_line_amplitude;


float next_mask=texture2D(waterline_rtt,vUv+vec2(0.0,0.01+water_line_offset)).r;
if(sharp_water_line>0.0 && next_mask==0.0){
gl_FragColor.rgb*=0.5;
}


gl_FragColor.a=1.0;


}`


};


export default underwater_ripples_pass;
