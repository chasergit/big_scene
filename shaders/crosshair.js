vs["crosshair"]=`


uniform vec4 center;


void main(){


/*
vec4 screenTransform=vec4(2.0/1920.0,-2.0/1080.0,-1.0,1.0);
gl_Position=vec4(vec2(1920.0/2.0,1080.0/2.0)*screenTransform.xy+screenTransform.zw,0.0,1.0);
ДЛЯ РАСЧЁТ В JS: var center=[screen.width/2.0*(2.0/1920.0)-1.0,screen.height/2.0*(-2.0/1080.0)+1.0,0.0,1.0];
*/


gl_Position=center;
gl_PointSize=32.0;


}


`;


fs["crosshair"]=`


uniform sampler2D map;
varying float rotation;
//float angle=3.14;
//float mid=0.5;


void main(){


gl_FragColor=texture2D(map,gl_PointCoord);


// ПОВООРОТ
/*
vec2 rotated=vec2(cos(angle)*(gl_PointCoord.x-mid)+sin(angle)*(gl_PointCoord.y-mid)+mid,cos(angle)*(gl_PointCoord.y-mid)-sin(angle)*(gl_PointCoord.x-mid)+mid);
vec4 rotatedTexture=texture2D(map,rotated);
gl_FragColor=rotatedTexture;
*/


}


`;
