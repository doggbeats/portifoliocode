export const introInitScript = `(function(){try{
  var root=document.documentElement;
  var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  try{
    var stored=window.localStorage.getItem("code-ph-accessibility");
    if(stored&&JSON.parse(stored).reduceMotion===true){reduce=true;}
  }catch(error){}
  var hash=window.location.hash;
  var path=window.location.pathname;
  var home=path==="/"||path==="";
  var deep=window.scrollY>2||(hash!==""&&hash!=="#inicio");
  var gl=null;
  try{
    var probe=document.createElement("canvas");
    gl=probe.getContext("webgl",{alpha:true,antialias:false})||probe.getContext("experimental-webgl");
    if(gl&&gl.getExtension){var lose=gl.getExtension("WEBGL_lose_context");if(lose){lose.loseContext();}}
  }catch(error){gl=null;}
  var allow=!reduce&&home&&!deep;
  root.setAttribute("data-intro",allow?"on":"off");
  if(allow&&!gl){root.setAttribute("data-intro-fallback","on");}
}catch(error){document.documentElement.setAttribute("data-intro","off");}})();`;
