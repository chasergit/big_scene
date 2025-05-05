

function set_crosshair(THREE,mat,tex,vs,fs,mesh,scene_hud){


let crosshair_geometry=new THREE.BufferGeometry();
crosshair_geometry.setAttribute("position",new THREE.BufferAttribute(new Float32Array([0,0,0]),3));


mat["crosshair"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:tex["crosshair"]},
center:{value:[0.0,0.0,0.0,1.0]}
},
vertexShader:vs["crosshair"],
fragmentShader:fs["crosshair"],
transparent:true,
depthTest:false,
depthWrite:false,
});


mesh["crosshair"]=new THREE.Points(crosshair_geometry,mat["crosshair"]);
mesh["crosshair"].frustumCulled=false;
mesh["crosshair"].matrixAutoUpdate=false;
mesh["crosshair"].updateMatrixWorld=function(){};
mesh["crosshair"].renderOrder=2;
scene_hud.add(mesh["crosshair"]);


}


export{set_crosshair};
