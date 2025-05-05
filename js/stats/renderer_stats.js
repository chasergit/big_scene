let renderer_stats_m=0;


let renderer_stats_canvas=document.createElement("canvas");
renderer_stats_canvas.id="renderer_stats";
renderer_stats_canvas.style.cssText="opacity:0.9;position:fixed;left:0px;top:48px;";
renderer_stats_canvas.width=120;
renderer_stats_canvas.height=85;


let renderer_stats_ctx=renderer_stats_canvas.getContext("2d");
renderer_stats_ctx.font="10px tahoma";
renderer_stats_ctx.translate(10,5);


function renderer_stats_reset(num){
renderer_stats_m=num;
renderer_stats_canvas.height+=40;
renderer_stats_ctx.font="10px tahoma";
renderer_stats_ctx.translate(10,5);
}


function renderer_stats_update(num){


if(num==0){ renderer_stats_update_big(); }
else{
if(num>renderer_stats_m){ renderer_stats_reset(num); }
renderer_stats_update_small(num);
}


}


function renderer_stats_r(v){
return String(v).replace(/\B(?=(\d{3})+(?!\d))/g,".");
}


function renderer_stats_update_big(){


renderer_stats_ctx.fillStyle="#1D467C";
renderer_stats_ctx.fillRect(-10,-5,renderer_stats_canvas.width,renderer_stats_canvas.height);
renderer_stats_ctx.fillStyle="#ffffff";


let item_1=renderer.info;
let item_2=item_1.render;
renderer_stats_ctx.fillText("GEOMETRIES: "+renderer_stats_r(item_1.memory.geometries),0,10);
renderer_stats_ctx.fillText("TEXTURES: "+renderer_stats_r(item_1.memory.textures),0,20);
renderer_stats_ctx.fillText("SHADERS: "+renderer_stats_r(item_1.programs.length),0,30);
renderer_stats_ctx.fillText("CALLS: "+renderer_stats_r(item_2.calls),0,40);
renderer_stats_ctx.fillText("TRIANGLES: "+renderer_stats_r(item_2.triangles),0,50);
renderer_stats_ctx.fillText("LINES: "+renderer_stats_r(item_2.lines),0,60);
renderer_stats_ctx.fillText("POINTS: "+renderer_stats_r(item_2.points),0,70);


}


function renderer_stats_update_small(num){


let item=renderer.info.render;
renderer_stats_ctx.fillText("CALLS: "+renderer_stats_r(item.calls),0,80+(40*(num-1)));
renderer_stats_ctx.fillText("TRIANGLES: "+renderer_stats_r(item.triangles),0,90+(40*(num-1)));
renderer_stats_ctx.fillText("LINES: "+renderer_stats_r(item.lines),0,100+(40*(num-1)));
renderer_stats_ctx.fillText("POINTS: "+renderer_stats_r(item.points),0,110+(40*(num-1)));


}
