/* Small "life" for 3D models: whales glide, jellyfish pulse. Runs only while the model is on screen. */
(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const els=[...document.querySelectorAll('model-viewer[data-life]')];
  const vis=new Set();
  const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?vis.add(e.target):vis.delete(e.target)));
  els.forEach(el=>io.observe(el));
  const t0=performance.now();
  function tick(now){
    const t=(now-t0)/1000;
    vis.forEach(el=>{
      const k=el.dataset.life,base=(el.dataset.base||'0 0 0').split(' ').map(Number);
      if(k==='swim'){
        const roll=base[0]+Math.sin(t*.7)*5,pitch=base[1]+Math.sin(t*.45+1)*6,yaw=base[2]+Math.sin(t*.25)*14;
        el.orientation=`${roll}deg ${pitch}deg ${yaw}deg`;
      }else if(k==='pulse'){
        const p=Math.sin(t*2.2);el.scale=`${1-p*.04} ${1+p*.07} ${1-p*.04}`;
        el.orientation=`${Math.sin(t*.5)*4}deg 0deg ${base[2]+t*6}deg`;
      }else if(k==='drift'){
        el.orientation=`${Math.sin(t*.6)*4}deg ${Math.sin(t*.4)*3}deg ${base[2]+Math.sin(t*.3)*20}deg`;
      }
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  /* videos: always muted; pause when off screen to save battery */
  document.querySelectorAll('video.vbg').forEach(v=>{v.muted=true;v.defaultMuted=true;v.volume=0;
    new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){v.play().catch(()=>{})}else v.pause()})).observe(v)});
})();
