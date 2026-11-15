export const introInitScript = `(function(){try{
  var root=document.documentElement;
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var deep=window.scrollY>2||!!window.location.hash;
  var gl=null;
  try{
    var probe=document.createElement("canvas");
    gl=probe.getContext("webgl",{alpha:true,antialias:false})||probe.getContext("experimental-webgl");
    if(gl&&gl.getExtension){var lose=gl.getExtension("WEBGL_lose_context");if(lose){lose.loseContext();}}
  }catch(error){gl=null;}
  root.setAttribute("data-intro",(reduce||deep||!gl)?"off":"on");
}catch(error){document.documentElement.setAttribute("data-intro","off");}})();`;
