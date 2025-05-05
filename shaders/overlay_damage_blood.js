vs["overlay_damage_blood"]=`


varying vec2 vUv;


void main(){


vUv=uv;


gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);


}


`;


fs["overlay_damage_blood"]=`


uniform sampler2D map;
uniform float intensity;
varying vec2 vUv;


void main(){


gl_FragColor=texture2D(map,vUv)*intensity;


}


`;