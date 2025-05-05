vs["terrain"]=`


varying vec3 vN;
uniform vec3 pos;
attribute vec2 uv2;
varying vec2 vUv2;


varying highp vec2 TexCoordX;
varying highp vec2 TexCoordY;
varying highp vec2 TexCoordZ;
varying highp vec2 NoiseXZ;


void main(){


gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


vN=normal;


vUv2=uv2;


//TexCoordX=position.zy*0.00002+0.5;
//TexCoordY=position.xz*0.00002+0.5;
//TexCoordZ=position.xy*0.00002+0.5;


NoiseXZ=vec2(position.x*0.00002,position.z*0.00002*-1.0)+0.5;


TexCoordX=position.zy*0.002;
TexCoordY=position.xz*0.002;
TexCoordZ=position.xy*0.002;


}


`;


fs["terrain"]=`


uniform highp sampler2D uTextureGrass;
uniform highp sampler2D uTextureDirt;
uniform highp sampler2D uTextureNoise;
uniform sampler2D aoMap;


varying vec3 vN;
varying vec2 vUv2;


varying highp vec2 TexCoordX;
varying highp vec2 TexCoordY;
varying highp vec2 TexCoordZ;
varying highp vec2 NoiseXZ;


void main(){


//vec3 vN=abs(vN);
//vec3 bf = normalize( abs( vNormal ) );
//bf /= dot( bf, vec3( 1.0 ) );
vec3 aaa=abs(vN);


vec3 grassTX=texture2D(uTextureGrass,TexCoordX).rgb*aaa.x;
vec3 dirtTX=texture2D(uTextureDirt,TexCoordX).rgb*aaa.x;
vec3 grassTY=texture2D(uTextureGrass,TexCoordY).rgb*aaa.y;
vec3 grassTZ=texture2D(uTextureGrass,TexCoordZ).rgb*aaa.z;


vec3 noise_tex=texture2D(uTextureNoise,NoiseXZ).rgb;


vec3 grassCol=texture2D(uTextureGrass,TexCoordX).rgb*vN.x+grassTY+grassTZ;
vec3 dirtCol=dirtTX+texture2D(uTextureDirt,TexCoordY).rgb*vN.y+texture2D(uTextureDirt,TexCoordZ).rgb*vN.z;
//vec3 color=dirtTX+grassTY+grassTZ;
vec3 color=grassTX+grassTY+grassTZ;


float slope=1.0-vN.y;
vec3 cliffCol;


if(slope<.1){ cliffCol=grassCol; }
if(slope<.4 && slope>=.1){ cliffCol=mix(grassCol,dirtCol,(slope-.1)*(1./(.4-.1))); }
if(slope >= .4){ cliffCol=dirtCol; }


highp vec3 fog_color = vec3(150./255.,189./255.,206./255.);
highp float fog_density = 1.;
highp float perspective_far = 200.;;
highp float fog = fog_density * (gl_FragCoord.z / gl_FragCoord.w) / perspective_far;
fog -= .2;
vec3 total=(color+cliffCol)*0.7*texture2D(aoMap,vUv2).rgb*noise_tex*2.0;
highp vec3 col = mix( fog_color, total , clamp(1. - fog, 0., 1.));
gl_FragColor=vec4(col,1.0);


//gl_FragColor=vec4((color+cliffCol)*0.7*texture2D(aoMap,vUv2).rgb*noise_tex*2.0,1.0);




}


`;
