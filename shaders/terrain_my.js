vs["terrain"]=`


//attribute vec3 normal;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 pos;
attribute vec2 uv2;
varying vec2 vUv2;


void main(){


gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


    vNormal = normal;
    vUv = uv;
    vPosition = position;
      vUv2=uv2;
}


`;


fs["terrain"]=`


uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;


uniform sampler2D map;
uniform sampler2D aoMap;


varying vec2 vUv2;
//uniform vec3 lightPos;


// Example varyings passed from the vertex shader
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;


uniform highp sampler2D uTextureGrass;
uniform highp sampler2D uTextureDirt;


void main() {


vec4 cX = texture2D(uTextureGrass, vPosition.zy* 0.002);
vec4 cY = texture2D(uTextureGrass, vPosition.xz* 0.002);
vec4 cZ = texture2D(uTextureGrass, vPosition.xy* 0.002);


vec3 blend = abs(vNormal);


// the values should sum to 1 but we must avoid dividing by 0
blend /= blend.x + blend.y + blend.z + 0.00001;


// blending
gl_FragColor = vec4((blend.x * cX + blend.y * cY + blend.z * cZ).rgb*1.4*texture2D(aoMap,vUv2).rgb,1.0);


vec4 dX = texture2D(uTextureDirt, vPosition.zy* 0.002);
vec4 dY = texture2D(uTextureDirt, vPosition.xz* 0.002);
vec4 dZ = texture2D(uTextureDirt, vPosition.xy* 0.002);


 highp vec3 grassCol = (blend.x * cX + blend.y * cY + blend.z * cZ).rgb;
 highp vec3 dirtCol = (blend.x * dX + blend.y * dY + blend.z * dZ).rgb;


  highp vec3 color = (cX + cY + cZ).rgb;
    
    highp float slope = 1.0 - blend.y;
    highp vec3 cliffCol;


    if (slope < .6)
        cliffCol = grassCol;


    if ((slope<.8) && (slope >= .6))
        cliffCol = mix( grassCol , dirtCol, (slope - .6) * (1. / (.8 - .6)));


    if (slope >= .8)
        cliffCol = dirtCol;
        
gl_FragColor = vec4(cliffCol, 1.);
        


}


`;
