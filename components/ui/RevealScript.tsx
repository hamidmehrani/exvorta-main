/*
 * Inline scroll-reveal observer. Runs while the document is still parsing (it
 * sits at the top of <head>) so [data-reveal*] elements are picked up as they
 * stream in, and keeps watching for nodes added by client-side navigation.
 * Adds `data-in` once an element enters (or has already passed) the viewport.
 * Without IntersectionObserver it flags <html class="no-io"> so nothing stays hidden.
 */
const SCRIPT = `(function(){var d=document.documentElement;if(!('IntersectionObserver' in window)){d.className+=' no-io';return}var S='[data-reveal],[data-reveal-stagger],[data-sx-inview]';var io=new IntersectionObserver(function(es){for(var i=0;i<es.length;i++){var e=es[i];if(e.isIntersecting||e.boundingClientRect.top<0){e.target.setAttribute('data-in','');io.unobserve(e.target)}}},{rootMargin:'0px 0px -60px 0px'});function add(n){if(n.nodeType!==1)return;if(n.matches(S))io.observe(n);var l=n.querySelectorAll(S);for(var i=0;i<l.length;i++)io.observe(l[i])}new MutationObserver(function(ms){for(var i=0;i<ms.length;i++){var a=ms[i].addedNodes;for(var j=0;j<a.length;j++)add(a[j])}}).observe(d,{childList:true,subtree:true});add(d)})();`

export default function RevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
}
