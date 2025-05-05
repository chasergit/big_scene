let ajax=new XMLHttpRequest();
let ajax_timeout;


function ajax_send(){


let me2=me;
me='';
let ajax_form=new FormData();
ajax_form.append("me",me2);
if(voice_send.length>0){
ajax_form.append("voice_file",voice_send[0]);
}


ajax.onreadystatechange=function(){
if(ajax.readyState==4){
clearTimeout(ajax_timeout);
ajax_timeout=setTimeout("ajax_send();",2000);
if(ajax.status==200){


if(voice_send.length>0){
voice_send.splice(0,1);
}


try{ eval(ajax.responseText); }
catch(e){}


}
}
}
//ajax.open("POST","ajax.php",true);
//ajax.send(ajax_form);
}
