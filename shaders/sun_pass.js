const sun_pass={


uniforms:{
time:{value:0},
screen_aspect_ratio:{value:null},
screen_texel_size:{value:null},
sun_color:{value:[1.0,0.87,0.65]},
sun_direction:{value:null},
sun_3d_position:{value:null},
sun_2d_position:{value:null},
},


vertexShader:`


uniform float screen_aspect_ratio;
varying vec2 vUv;
varying vec2 sun_uv;


void main(){


vUv=uv;
sun_uv=(uv*2.0-1.0);
sun_uv.x*=screen_aspect_ratio;
gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


}`,


fragmentShader:`


uniform float time;
uniform float screen_aspect_ratio;
uniform sampler2D tDiffuse;
uniform vec3 sun_color;
uniform vec3 sun_direction;
uniform vec3 sun_3d_position;
uniform vec2 sun_2d_position;
varying vec2 vUv;
varying vec2 sun_uv;


void main(){


float sun_visibility=max(sun_3d_position.z,0.0);
float sun_flares_visibility=clamp((sun_3d_position.z-0.8)*10.0,0.0,1.0);


vec2 main=vUv-sun_3d_position.xy;
main.x*=screen_aspect_ratio;


float sun_shine_angle=atan(main.x,main.y);
float sun_shine_distance_1=length(main);
float sun_shine_distance_2=pow(sun_shine_distance_1,0.1);


float sun_shine_f=1.0/(sun_shine_distance_1*32.0+1.0);
sun_shine_f=pow(sun_shine_f,1.2)*max(0.5,sun_direction.y);
float sun_shine_a=sin((sun_shine_angle*0.5+time*0.001)*12.0);
float sun_shine_b=sin((sun_shine_angle*0.5-time*0.001)*16.0);
float sun_shine_c=sun_shine_f+sun_shine_f*(max(sun_shine_a,sun_shine_b)*0.1+sun_shine_distance_2*1.0+0.1);


vec3 sun_shine=sun_shine_c*sun_visibility;


vec2 uvd=sun_uv*(length(sun_uv));


float flare_r=max(1.0/(1.0+128.0*pow(length(uvd+0.8*sun_2d_position),2.0)),.0)*0.05;
float flare_g=max(1.0/(1.0+128.0*pow(length(uvd+0.85*sun_2d_position),2.0)),.0)*0.05;
float flare_b=max(1.0/(1.0+128.0*pow(length(uvd+0.9*sun_2d_position),2.0)),.0)*0.05;


flare_r+=max(0.01-pow(length(sun_uv+sun_2d_position*0.35),2.4),.0)*6.0;
flare_g+=max(0.01-pow(length(sun_uv+sun_2d_position*0.40),2.4),.0)*5.0;
flare_b+=max(0.01-pow(length(sun_uv+sun_2d_position*0.45),2.4),.0)*3.0;


flare_r+=max(0.01-pow(length(sun_uv-sun_2d_position*0.3),1.6),.0)*6.0;
flare_g+=max(0.01-pow(length(sun_uv-sun_2d_position*0.325),1.6),.0)*3.0;
flare_b+=max(0.01-pow(length(sun_uv-sun_2d_position*0.35),1.6),.0)*5.0;


vec3 sun_blinks=vec3(flare_r,flare_g,flare_b)*3.0;


float sun_circles_radius=0.25;
float sun_circles_thickness=0.01;
vec3 sun_circles_color=vec3(0.05,0.02,0);
vec3 sun_circles=sun_circles_color*smoothstep(sun_circles_thickness,0.0,abs(length(sun_uv+sun_2d_position*0.7)-sun_circles_radius));


gl_FragColor.rgb=texture2D(tDiffuse,vUv).rgb+sun_color*sun_shine*(1.0-sharp_line)+(sun_blinks+sun_circles)*sun_flares_visibility;


gl_FragColor.a=1.0;


}`


};


export default sun_pass;
