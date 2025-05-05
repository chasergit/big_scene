vs["i_tree_sprite"]=`


attribute float scale;
attribute vec3 offset;
varying vec2 vUv;
uniform vec3 pos;
uniform vec3 sun_direction;
varying float light;
vec3 localUpVector=vec3(0.0,1.0,0.0);


void main(){
//if(distance(cameraPosition.xz,offset.xz)>50.0){ gl_Position=vec4(2.0,2.0,2.0,1.0); return; }
vec3 vLook=offset-cameraPosition;
vec3 vRight=normalize(cross(vLook,localUpVector));
vec3 vPosition=position.x*vRight+position.y*localUpVector+position.z;
gl_Position=projectionMatrix*modelViewMatrix*vec4(offset-pos+vPosition*scale,1.0);
vUv=uv;
light=dot(normalize(sun_direction-offset),normalize(cameraPosition-offset))*2.0;
//light=dot(normalize(sun_direction-offset),normalize(cameraPosition-vPosition-offset))*2.5;
if(light<0.9){ light=0.9; }
}


`;


fs["i_tree_sprite"]=`


uniform sampler2D map;
varying vec2 vUv;
varying float light;
void main() {
gl_FragColor=texture2D(map,vUv);
if(gl_FragColor.a<0.5){ discard; }
gl_FragColor.rgb*=light;
}


`;
