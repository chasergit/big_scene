const correction_pass={


name:"correction_pass",


uniforms:{
time:{value:0},
tDiffuse:{value:null},
color:{value:[0,0,0]},
hue:{value:0},
saturation:{value:1},
vibrance:{value:0},
gamma:{value:1},
brightness:{value:0},
contrast:{value:0},
vignette:{value:0}
},


vertexShader:`


varying vec2 vUv;


void main(){


vUv=uv;
gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


}`,


fragmentShader:`


// ВЗЯТО ИЗ OutputShader.js
//#define CINEON_TONE_MAPPING;
#include <tonemapping_pars_fragment>


uniform float time;
uniform sampler2D tDiffuse;
varying vec2 vUv;
uniform vec3 color;
uniform float hue; 
uniform float saturation; 
uniform float vibrance; 
uniform float gamma;
uniform float brightness; 
uniform float contrast; 
uniform float vignette; 

		
void main(){


gl_FragColor=texture2D(tDiffuse,vUv);
gl_FragColor.rgb=clamp(gl_FragColor.rgb,0.0,1.0);


// ____________________ GammaCorrectionShader ____________________


gl_FragColor=vec4(mix(pow(gl_FragColor.rgb,vec3(0.41666))*1.055-vec3(0.055),gl_FragColor.rgb*12.92,vec3(lessThanEqual(gl_FragColor.rgb,vec3(0.0031308)))),1.0);


// ____________________ TONE MAPPING ____________________


#ifdef LINEAR_TONE_MAPPING
gl_FragColor.rgb=LinearToneMapping(gl_FragColor.rgb);
#elif defined(REINHARD_TONE_MAPPING)
gl_FragColor.rgb=ReinhardToneMapping(gl_FragColor.rgb);
#elif defined(CINEON_TONE_MAPPING)
gl_FragColor.rgb=CineonToneMapping(gl_FragColor.rgb);
#elif defined(ACES_FILMIC_TONE_MAPPING)
gl_FragColor.rgb=ACESFilmicToneMapping(gl_FragColor.rgb);
#elif defined(AGX_TONE_MAPPING)
gl_FragColor.rgb=AgXToneMapping(gl_FragColor.rgb);
#elif defined(NEUTRAL_TONE_MAPPING)
gl_FragColor.rgb=NeutralToneMapping(gl_FragColor.rgb);
#endif


// ____________________ HUE ____________________


float angle=hue*3.14159265;
float s=sin(angle);
float c=cos(angle);
vec3 weights=(vec3(2.0*c,-sqrt(3.0)*s-c,sqrt(3.0)*s-c)+1.0)/3.0;
float len=length(gl_FragColor.rgb);
gl_FragColor.rgb=vec3(dot(gl_FragColor.rgb,weights.xyz),dot(gl_FragColor.rgb,weights.zxy),dot(gl_FragColor.rgb,weights.yzx));


// ____________________ SATURATION ____________________


float luminance=dot(gl_FragColor.rgb,vec3(0.2125,0.7154,0.0721));
vec3 intensity=vec3(luminance);
gl_FragColor.rgb=mix(intensity,gl_FragColor.rgb,saturation);


// ____________________ VIBRANCE ____________________


float average=(gl_FragColor.r+gl_FragColor.g+gl_FragColor.b)/3.0;
float mx=max(gl_FragColor.r,max(gl_FragColor.g,gl_FragColor.b));
float amt=(mx-average)*(-3.0*vibrance);
gl_FragColor.rgb=mix(gl_FragColor.rgb,vec3(mx),amt);


// ____________________ GAMMA ____________________


gl_FragColor.rgb=pow(gl_FragColor.rgb,vec3(gamma));


// ____________________ BRIGHTNESS ____________________


gl_FragColor.rgb+=brightness;


// ____________________ CONTRAST ____________________


gl_FragColor.rgb=(gl_FragColor.rgb-0.5)/(1.0-contrast)+0.5;


// ____________________ VIGNETTE ____________________


float innerVig=1.0-vignette;
float outerVig=1.0001; // Position for the outer vignette
vec2 center=vec2(0.5,0.5);
gl_FragColor.rgb*=clamp((outerVig-distance(center,vUv)*1.414213)/(outerVig-innerVig),0.0,1.0);


/*


// ____________________ GRAY CIRCLE ____________________


vec2 circle_gray_center=vUv-0.5;
circle_gray_center.x*=1920.0/1080.0;
float circle_gray_distance=1.0-pow(length(circle_gray_center)*5.0,10.0);
circle_gray_distance=max(0.0,circle_gray_distance);
gl_FragColor.rgb=mix(intensity,gl_FragColor.rgb,1.0-circle_gray_distance);


// ____________________ MOTION BLUR ____________________


float motion_blur_steps=10.0;
float motion_blur_intensity=0.025;
float motion_blur_center_x=0.5;
float motion_blur_center_y=0.5;
float motion_blur_radius=0.2;
vec3 motion_blur_color=vec3(0);
vec2 motion_blur_distance=vUv-vec2(motion_blur_center_x,motion_blur_center_y);


for(float j=0.0;j<motion_blur_steps;j++){
float scale=1.0-motion_blur_intensity*(j/motion_blur_steps)*(clamp(length(motion_blur_distance)/motion_blur_radius,0.0,1.0));
motion_blur_color+=texture(tDiffuse,motion_blur_distance*scale+vec2(motion_blur_center_x,motion_blur_center_y)).rgb;
}
motion_blur_color/=motion_blur_steps;
gl_FragColor.rgb=motion_blur_color.rgb;


// ____________________ VIGNETTE ____________________


float v1=smoothstep(0.5,0.3,abs(vUv.x-0.5));
float v2=smoothstep(0.5,0.3,abs(vUv.y-0.5));
float v=v1*v2;
v=pow(v,0.2);
v=remap(v,0.0,1.0,0.2,1.0);
gl_FragColor.rgb*=v;
*/


// ____________________ DITHERING ИЛИ COLOR DEBANDING ____________________


vec3 dither_shift_RGB_1=2.0*vec3(0.25/255.0,-0.25/255.0,0.25/255.0);
vec3 dither_shift_RGB_2=-2.0*vec3(0.25/255.0,-0.25/255.0,0.25/255.0);
float grid_position=fract(sin(gl_FragCoord.x*12.9898+gl_FragCoord.y*78.233)*43758.5453);
vec3 dither_shift_RGB=mix(dither_shift_RGB_1,dither_shift_RGB_2,grid_position);
gl_FragColor.rgb=clamp(gl_FragColor.rgb+dither_shift_RGB,0.0,1.0);


}`


};


export default correction_pass;