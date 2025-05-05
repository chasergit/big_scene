function set_sprite(THREE,mat,tex,vs,fs,mesh,scene){


let geometry=new THREE.InstancedBufferGeometry();
geometry.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array([-0.5,0.5,0,-0.5,-0.5,0,0.5,0.5,0,0.5,-0.5,0,0.5,0.5,0,-0.5,-0.5,0]),3));
geometry.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array([0,1,0,0,1,1,1,0,1,1,0,0]),2));
geometry.setAttribute('offset',new THREE.InstancedBufferAttribute(new Float32Array(),3));
geometry.setAttribute('scale',new THREE.InstancedBufferAttribute(new Float32Array(),2));
geometry.setAttribute('quaternion',new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute('rotation',new THREE.InstancedBufferAttribute(new Float32Array(),1));
geometry.setAttribute('color',new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute('blend',new THREE.InstancedBufferAttribute(new Float32Array(),1));
geometry.setAttribute('frame',new THREE.InstancedBufferAttribute(new Float32Array(),4));
geometry.setAttribute('texture',new THREE.InstancedBufferAttribute(new Uint8Array(),1));


mat["sprite"]=new THREE.ShaderMaterial({
uniforms:{
map:{value:[tex["cloud"],tex["sprite_yellow"],tex["smoke"],tex["fire"],tex["beam"],tex["flare_blue"],tex["glass_1"],tex["window"],tex["spark"],tex["water_drop"],tex["homer"],tex["avatar"],tex["shot"],tex["tracer"],tex["water_splash"]]},
cameraDirection:{value:[0,0,0]},
cameraAngle:{value:[0,0]},
time:{value:0}
},
vertexShader:vs["sprite"],
fragmentShader:fs["sprite"],
//side:THREE.DoubleSide,
transparent:true,
depthWrite:false,
blending:THREE.CustomBlending,
blendEquation:THREE.AddEquation,
blendSrc:THREE.OneFactor,
blendDst:THREE.OneMinusSrcAlphaFactor
});


mesh["sprite"]=new THREE.Mesh(geometry,mat["sprite"]);
mesh["sprite"].frustumCulled=false;
mesh["sprite"].matrixAutoUpdate=false;
mesh["sprite"].updateMatrixWorld=function(){};
scene.add(mesh["sprite"]);


}


export{set_sprite};
