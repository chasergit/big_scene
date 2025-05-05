vs["sprite"]=`


attribute vec3 offset;
attribute vec2 scale;
attribute vec4 quaternion;
attribute float rotation;
attribute vec4 color;
attribute float blend;
attribute vec4 frame;
attribute float texture;
varying vec2 vUv;
varying vec4 vColor;
varying float vBlend;
varying vec4 vFrame;
varying float tex_num;
uniform float time;
uniform vec3 cameraDirection;
uniform vec2 cameraAngle;
vec3 localUpVector=vec3(0.0,1.0,0.0);


void main(){


float angle=time*rotation;
vec3 vRotated=vec3(position.x*scale.x*cos(angle)-position.y*scale.y*sin(angle),position.y*scale.y*cos(angle)+position.x*scale.x*sin(angle),position.z);


vUv=uv;
vColor=color;
vBlend=blend;
tex_num=texture;
vFrame=frame;


vec3 vPosition;



if(quaternion.w<2.0){
vec3 vcV=cross(quaternion.xyz,vRotated);
vPosition=vcV*(2.0*quaternion.w)+(cross(quaternion.xyz,vcV)*2.0+vRotated);
}


else if(quaternion.w==2.0){


// ДЕФЕКТ: ЕСЛИ СПРАЙТ ВРАЩАЕТСЯ, ТО ПРИ ПОВОРОТЕ КАМЕРЫ СПРАЙТ КАК БЫ ЗАМИРАЕТ
// ТО ЕСТЬ ЛУЧШЕ ИСПОЛЬЗОВАТЬ ДЛЯ СТАТИЧНЫХ СПРАЙТОВ
vec3 cameraRight=vec3(viewMatrix[0].x,viewMatrix[1].x,viewMatrix[2].x);
vec3 cameraUp=vec3(viewMatrix[0].y,viewMatrix[1].y,viewMatrix[2].y);
vPosition=(cameraRight*vRotated.x)+(cameraUp*vRotated.y);


}


else if(quaternion.w==3.0){


vec3 vLook=normalize(cameraPosition-offset);
vec3 vRight=normalize(cross(vLook,localUpVector));
vec3 vUp=normalize(cross(vLook,vRight));
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;


}


else if(quaternion.w==4.0){


vec3 vLook=offset-cameraPosition;
vec3 vRight=normalize(cross(vLook,localUpVector));
vPosition=vRotated.x*vRight+vRotated.y*localUpVector+vRotated.z;


}


else if(quaternion.w==5.0){


vec3 vLook=normalize(quaternion.xyz-offset);
vec3 vRight=normalize(cross(vLook,localUpVector));
vec3 vUp=normalize(cross(vLook,vRight));
vPosition=vRight*vRotated.x+vUp*vRotated.y+vLook*vRotated.z;


}


else if(quaternion.w==6.0){


vec3 vLook=normalize(offset-cameraPosition);
vec3 xaxis=normalize(cross(vLook,quaternion.xyz));
vec3 zaxis=normalize(cross(xaxis,quaternion.xyz));
mat3 rotMatrix=mat3(vec3(xaxis.x,quaternion.x,zaxis.x),vec3(xaxis.y,quaternion.y,zaxis.y),vec3(xaxis.z,quaternion.z,zaxis.z));
vPosition=vec3(dot(rotMatrix[0],vRotated),dot(rotMatrix[1],vRotated),dot(rotMatrix[2],vRotated));


}


else if(quaternion.w==7.0){


vec4 mvPosition=modelViewMatrix*vec4(offset,1.0);
vec3 viewVelocity=normalMatrix*quaternion.xyz;
vPosition=vec3(position.xy*scale.x,vRotated.z);


float spherical_intensity=1.0-abs(dot(quaternion.xyz,cameraDirection));
mvPosition.xyz+=vPosition+dot(vPosition,viewVelocity)*viewVelocity/length(viewVelocity)*scale.y*spherical_intensity;


gl_Position=projectionMatrix*mvPosition;
return;


}


gl_Position=projectionMatrix*modelViewMatrix*vec4(vPosition+offset,1.0);


}


`;


fs["sprite"]=`


const int count=15;
uniform sampler2D map[count];
varying vec2 vUv;
varying vec4 vColor;
varying float vBlend;
varying vec4 vFrame;
varying float tex_num;


void main(){


float tex_num_2=round(tex_num);


if(tex_num_2==0.0){ gl_FragColor=texture2D(map[0],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==1.0){ gl_FragColor=texture2D(map[1],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==2.0){ gl_FragColor=texture2D(map[2],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==3.0){ gl_FragColor=texture2D(map[3],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==4.0){ gl_FragColor=texture2D(map[4],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==5.0){ gl_FragColor=texture2D(map[5],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==6.0){ gl_FragColor=texture2D(map[6],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==7.0){ gl_FragColor=texture2D(map[7],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==8.0){ gl_FragColor=texture2D(map[8],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==9.0){ gl_FragColor=texture2D(map[9],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==10.0){ gl_FragColor=texture2D(map[10],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==11.0){ gl_FragColor=texture2D(map[11],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==12.0){ gl_FragColor=texture2D(map[12],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==13.0){ gl_FragColor=texture2D(map[13],vUv/vFrame.xy+vFrame.zw)*vColor; }
else if(tex_num_2==14.0){ gl_FragColor=texture2D(map[14],vUv/vFrame.xy+vFrame.zw)*vColor; }


gl_FragColor.rgb*=gl_FragColor.a; 
gl_FragColor.a*=vBlend; 


}


`;
