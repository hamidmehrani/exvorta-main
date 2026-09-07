/**
 * Preview-scroll receiver — embedded (inline, afterInteractive) in every
 * *.exvorta.com client deployment so the main site can drive a cinematic
 * hover-scroll on live preview iframes. Origin-restricted to exvorta.com.
 */
export const PREVIEW_SCROLL_SCRIPT = `(function(){var O=['https://exvorta.com','https://www.exvorta.com','http://localhost:3000','http://localhost:3105'];var r=null;function a(t,d){if(r)cancelAnimationFrame(r);var s=window.scrollY,n=null;function f(ts){if(n===null)n=ts;var p=Math.min(1,(ts-n)/d);var e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;window.scrollTo(0,s+(t-s)*e);if(p<1)r=requestAnimationFrame(f)}r=requestAnimationFrame(f)}window.addEventListener('message',function(e){if(O.indexOf(e.origin)===-1)return;var d=e.data||{};if(d.type==='exvorta:scroll'){var m=document.documentElement.scrollHeight-window.innerHeight;a(d.y==='bottom'?m:(d.y||0),Math.max(500,d.duration||5000))}})})();`
