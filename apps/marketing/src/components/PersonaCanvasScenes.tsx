import { useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   HTML5 CANVAS ANIMATED SCENES — LIGHT THEME
   Clean light backgrounds with colorful accents and confetti particles.
   ═══════════════════════════════════════════════════════════════════════ */

const DPR = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

function useCanvas(draw: (ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => void) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width * DPR;
    canvas.height = rect.height * DPR;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
  }, []);
  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const t = prefersReduced ? 0 : (now - startRef.current) / 1000;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.save(); ctx.scale(DPR, DPR);
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, t, w, h);
      ctx.restore();
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [draw, resize]);
  return canvasRef;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

function drawNotifBadge(ctx: CanvasRenderingContext2D, x: number, y: number, count: number, t: number, delay: number) {
  const pulse = 1 + 0.15 * Math.sin((t - delay) * 3);
  ctx.save(); ctx.translate(x, y); ctx.scale(pulse, pulse);
  ctx.globalAlpha = 0.6 + 0.4 * Math.abs(Math.sin((t - delay) * 1.5));
  ctx.fillStyle = "#dc2626"; ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1; ctx.fillStyle = "#fff";
  ctx.font = "bold 8px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(String(count), 0, 0.5); ctx.restore();
}

function drawScreenLines(ctx: CanvasRenderingContext2D, x: number, y: number, count: number, maxW: number) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = "#e5e5e5";
    roundRect(ctx, x, y + i * 7, maxW * (0.5 + Math.sin(i * 2.3) * 0.3 + 0.2), 2.5, 1); ctx.fill();
  }
}

function drawDashedLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, t: number, delay: number) {
  ctx.save(); ctx.globalAlpha = 0.1 + 0.3 * Math.abs(Math.sin((t - delay) * 1.2));
  ctx.strokeStyle = "#a3a3a3"; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
}

// Floating confetti particles (anti-gravity)
function drawConfetti(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const colors = ["#4f46e5", "#7c3aed", "#db2777", "#0891b2", "#d97706"];
  for (let i = 0; i < 5; i++) {
    const x = (w * (0.1 + i * 0.2)) + Math.sin(t * 0.4 + i * 2) * 6;
    const y = h - ((t * 10 + i * 40) % (h + 20)) + 10;
    ctx.fillStyle = colors[i % colors.length]; ctx.globalAlpha = 0.2;
    ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  }
}

/* ═══ 1. THE DOCTOR ═══ */
export function DoctorScene() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const s = w / 320;
    ctx.fillStyle = "#f7f7f7"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#e8e8e8"; ctx.fillRect(0, h * 0.65, w, h * 0.35);
    drawConfetti(ctx, t, w, h);

    // Screen 1
    const s1x = 18*s, s1y = 25*s, s1w = 85*s, s1h = 65*s;
    ctx.fillStyle = "#065f46"; roundRect(ctx, s1x, s1y, s1w, s1h, 4*s); ctx.fill();
    ctx.fillStyle = "#fff"; roundRect(ctx, s1x+4*s, s1y+4*s, s1w-8*s, s1h-12*s, 2*s); ctx.fill();
    ctx.fillStyle = "#a3a3a3"; roundRect(ctx, s1x+8*s, s1y+8*s, 32*s, 3*s, 1); ctx.fill();
    drawScreenLines(ctx, s1x+8*s, s1y+15*s, 5, 50*s);
    ctx.globalAlpha = 0.5; ctx.fillStyle = "#dc2626"; roundRect(ctx, s1x+8*s, s1y+42*s, 18*s, 7*s, 2*s); ctx.fill();
    ctx.fillStyle = "#16a34a"; roundRect(ctx, s1x+30*s, s1y+42*s, 18*s, 7*s, 2*s); ctx.fill(); ctx.globalAlpha = 1;

    // Screen 2
    const s2x = 118*s, s2y = 20*s, s2w = 85*s, s2h = 65*s;
    ctx.fillStyle = "#065f46"; roundRect(ctx, s2x, s2y, s2w, s2h, 4*s); ctx.fill();
    ctx.fillStyle = "#fff"; roundRect(ctx, s2x+4*s, s2y+4*s, s2w-8*s, s2h-12*s, 2*s); ctx.fill();
    ctx.fillStyle = "#064e3b"; roundRect(ctx, s2x+8*s, s2y+8*s, 22*s, 3*s, 1); ctx.fill();
    drawScreenLines(ctx, s2x+8*s, s2y+16*s, 6, 55*s);

    // Tablet
    const s3x = 225*s, s3y = 35*s, s3w = 65*s, s3h = 85*s;
    ctx.fillStyle = "#2a2a2a"; roundRect(ctx, s3x, s3y, s3w, s3h, 8*s); ctx.fill();
    ctx.fillStyle = "#fff"; roundRect(ctx, s3x+5*s, s3y+7*s, s3w-10*s, s3h-22*s, 4*s); ctx.fill();
    ctx.fillStyle = "#064e3b"; roundRect(ctx, s3x+10*s, s3y+13*s, 22*s, 3*s, 1); ctx.fill();
    drawScreenLines(ctx, s3x+10*s, s3y+20*s, 5, 38*s);
    const cp = (Math.sin(t*1.5)+1)/2;
    if (cp > 0.3) {
      ctx.strokeStyle = "#16a34a"; ctx.lineWidth = 2*s; ctx.lineCap = "round"; ctx.beginPath();
      ctx.moveTo(s3x+22*s, s3y+55*s);
      const p = Math.min(1, (cp-0.3)/0.7);
      if (p < 0.4) ctx.lineTo(s3x+22*s+4*s*(p/0.4), s3y+55*s+4*s*(p/0.4));
      else { ctx.lineTo(s3x+26*s, s3y+59*s); ctx.lineTo(s3x+26*s+10*s*((p-0.4)/0.6), s3y+59*s-10*s*((p-0.4)/0.6)); }
      ctx.stroke();
    }
    ctx.fillStyle = "#555"; ctx.beginPath(); ctx.arc(s3x+s3w/2, s3y+s3h-7*s, 3*s, 0, Math.PI*2); ctx.fill();

    // Copy-paste dot
    const ap = (t*0.8)%3;
    if (ap < 2) {
      const p = ap/2;
      const ax = s1x+s1w+(s2x-s1x-s1w)*p, ay = (s1y+s1h/2)+Math.sin(p*Math.PI)*-8*s;
      ctx.save(); ctx.globalAlpha = 0.4+0.3*Math.sin(p*Math.PI);
      ctx.fillStyle = "#4f46e5"; ctx.beginPath(); ctx.arc(ax, ay, 3*s, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#4f46e5"; ctx.lineWidth = 0.5*s; ctx.setLineDash([2*s, 3*s]);
      ctx.beginPath(); ctx.moveTo(s1x+s1w, s1y+s1h/2); ctx.lineTo(ax, ay); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    }

    drawNotifBadge(ctx, s1x+s1w-2*s, s1y+2*s, 3+Math.floor(t*0.5)%5, t, 0);
    drawNotifBadge(ctx, s2x+s2w-2*s, s2y+2*s, 7+Math.floor((t+1)*0.4)%6, t, 0.8);
    drawNotifBadge(ctx, s3x+s3w-5*s, s3y+5*s, 2+Math.floor((t+2)*0.3)%4, t, 1.5);

    // Timer
    const timerX = w/2-25*s, timerY = h*0.7;
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "#d4d4d4"; ctx.lineWidth = 1;
    roundRect(ctx, timerX, timerY, 50*s, 20*s, 4*s); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#dc2626"; ctx.globalAlpha = 0.5+0.5*Math.abs(Math.sin(t*3));
    ctx.font = `${9*s}px monospace`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`${String(8+Math.floor(t/60)).padStart(2,"0")}:${String(Math.floor(t)%60).padStart(2,"0")}`, timerX+25*s, timerY+10*s);
    ctx.globalAlpha = 1; ctx.fillStyle = "#a3a3a3"; ctx.font = `${6*s}px system-ui`;
    ctx.fillText("patient waiting", w/2, timerY+28*s);
  }, []);
  return <canvas ref={useCanvas(draw)} className="w-full h-full" />;
}

/* ═══ 2. THE STUDENT ═══ */
export function StudentScene() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const s = w/320;
    ctx.fillStyle = "#f5f5f5"; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = "#e5e5e5"; ctx.fillRect(0,h*0.625,w,h*0.375);
    drawConfetti(ctx, t, w, h);

    const lx=60*s, ly=25*s, lw=160*s, lh=95*s;
    ctx.fillStyle = "#065f46"; roundRect(ctx,lx,ly,lw,lh,5*s); ctx.fill();
    ctx.fillStyle = "#fff"; roundRect(ctx,lx+5*s,ly+4*s,lw-10*s,lh-14*s,3*s); ctx.fill();

    const tabCount = 4+Math.floor(t*0.5)%9;
    for (let i=0; i<Math.min(tabCount,8); i++) {
      const a = Math.min(1,(t-i*0.2)*3); if (a<=0) continue;
      ctx.save(); ctx.globalAlpha = a;
      ctx.fillStyle = i===0?"#064e3b":"#f0f0f0"; ctx.strokeStyle = "#e5e5e5"; ctx.lineWidth = 0.3;
      roundRect(ctx,lx+9*s+i*17*s,ly+8*s,15*s,5*s,1*s); ctx.fill(); ctx.stroke(); ctx.restore();
    }
    const bp = 1+0.12*Math.sin(t*5);
    ctx.save(); ctx.translate(lx+lw-18*s,ly+10*s); ctx.scale(bp,bp);
    ctx.fillStyle = "#dc2626"; roundRect(ctx,-8*s,-4.5*s,16*s,9*s,3*s); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = `${6*s}px system-ui`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(String(tabCount),0,0); ctx.restore();

    ctx.fillStyle = "#a3a3a3"; roundRect(ctx,lx+9*s,ly+17*s,45*s,3*s,1); ctx.fill();
    drawScreenLines(ctx,lx+9*s,ly+24*s,7,120*s);
    ctx.fillStyle = "#d4d4d4"; roundRect(ctx,50*s,h*0.6,180*s,6*s,3*s); ctx.fill();

    // Phone
    const px=248*s,py=30*s,pw=48*s,ph=80*s;
    ctx.fillStyle = "#065f46"; roundRect(ctx,px,py,pw,ph,7*s); ctx.fill();
    ctx.fillStyle = "#fff"; roundRect(ctx,px+4*s,py+7*s,pw-8*s,ph-17*s,4*s); ctx.fill();
    ctx.fillStyle = "#555"; ctx.beginPath(); ctx.arc(px+pw/2,py+ph-5*s,2.5*s,0,Math.PI*2); ctx.fill();
    [{y:12,w:24,d:true},{y:22,w:20,d:false},{y:32,w:28,d:true},{y:42,w:22,d:false},{y:52,w:18,d:true}].forEach((b,i)=>{
      const a=Math.min(1,Math.max(0,(t-0.5-i*0.8)*2)); if(a<=0)return;
      ctx.save(); ctx.globalAlpha=a*(b.d?0.8:1);
      ctx.fillStyle=b.d?"#064e3b":"#e5e5e5";
      roundRect(ctx,b.d?px+8*s:px+pw-8*s-b.w*s,py+b.y*s,b.w*s,7*s,3.5*s); ctx.fill(); ctx.restore();
    });

    // PDF
    ctx.save(); ctx.translate(27*s,64*s); ctx.rotate((-3+2*Math.sin(t*0.4))*Math.PI/180);
    ctx.fillStyle="#fff"; ctx.strokeStyle="#d4d4d4"; ctx.lineWidth=1;
    roundRect(ctx,-19*s,-24*s,38*s,48*s,2*s); ctx.fill(); ctx.stroke();
    drawScreenLines(ctx,-14*s,-16*s,4,25*s);
    ctx.fillStyle="#dc2626"; ctx.globalAlpha=0.6; ctx.font=`${6*s}px system-ui`; ctx.textAlign="left";
    ctx.fillText("PDF",-12*s,15*s); ctx.globalAlpha=1; ctx.restore();

    const qy=h*0.78+Math.sin(t*1.2)*4*s;
    ctx.save(); ctx.globalAlpha=0.15+0.35*Math.abs(Math.sin(t));
    ctx.fillStyle="#a3a3a3"; ctx.font=`${28*s}px Georgia,serif`; ctx.textAlign="center";
    ctx.fillText("?",30*s,qy); ctx.restore();
    drawDashedLine(ctx,50*s,h*0.35,60*s,h*0.35,t,0);
    drawDashedLine(ctx,lx+lw+2*s,h*0.35,px-2*s,h*0.35,t,0.7);
  }, []);
  return <canvas ref={useCanvas(draw)} className="w-full h-full" />;
}

/* ═══ 3. THE SMALL BUSINESS OWNER ═══ */
export function SmallBizScene() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const s = w/320;
    ctx.fillStyle = "#f0f0f0"; ctx.fillRect(0,0,w,h);
    ctx.fillStyle = "#d4d4d4"; ctx.fillRect(0,h*0.625,w,h*0.375);
    drawConfetti(ctx,t,w,h);

    // Phone
    const px=20*s,py=18*s,pw=60*s,ph=105*s;
    ctx.fillStyle="#065f46"; roundRect(ctx,px,py,pw,ph,9*s); ctx.fill();
    ctx.fillStyle="#fff"; roundRect(ctx,px+4*s,py+8*s,pw-8*s,ph-18*s,5*s); ctx.fill();
    ctx.fillStyle="#25D366"; roundRect(ctx,px+4*s,py+8*s,pw-8*s,10*s,5*s); ctx.fill();
    ctx.fillRect(px+4*s,py+15*s,pw-8*s,3*s);
    ctx.fillStyle="#555"; ctx.beginPath(); ctx.arc(px+pw/2,py+ph-5*s,3.5*s,0,Math.PI*2); ctx.fill();
    const mc=3+Math.floor(t*0.55)%8;
    for(let i=0;i<Math.min(mc,6);i++){
      const a=Math.min(1,Math.max(0,(t-i*0.3)*3)); if(a<=0)continue;
      ctx.save(); ctx.globalAlpha=a; ctx.fillStyle=i%2===0?"#dcfce7":"#e5e5e5";
      roundRect(ctx,i%2===0?px+8*s:px+22*s,py+22*s+i*11*s,i%2===0?30*s:25*s,8*s,4*s); ctx.fill(); ctx.restore();
    }
    drawNotifBadge(ctx,px+pw-3*s,py+4*s,mc,t,0);

    // Laptop
    const ex=100*s,ey=28*s,ew=115*s,eh=72*s;
    ctx.fillStyle="#2a2a2a"; roundRect(ctx,ex,ey,ew,eh,4*s); ctx.fill();
    ctx.fillStyle="#fff"; roundRect(ctx,ex+4*s,ey+4*s,ew-8*s,eh-10*s,2*s); ctx.fill();
    ctx.fillStyle="#a3a3a3"; roundRect(ctx,ex+8*s,ey+8*s,40*s,3*s,1); ctx.fill();
    ["#fef2f2","#fafafa","#fafafa","#fafafa"].forEach((c,i)=>{
      const ry=ey+16*s+i*12*s;
      ctx.fillStyle=c; ctx.strokeStyle="#e5e5e5"; ctx.lineWidth=0.5;
      roundRect(ctx,ex+8*s,ry,ew-16*s,10*s,1); ctx.fill(); ctx.stroke();
      ctx.fillStyle="#a3a3a3"; roundRect(ctx,ex+12*s,ry+2*s,30*s,2*s,1); ctx.fill();
      ctx.fillStyle="#d4d4d4"; roundRect(ctx,ex+12*s,ry+6*s,50*s,1.5*s,0.5); ctx.fill();
    });
    ctx.fillStyle="#c4c4c4"; roundRect(ctx,ex,ey+eh,ew,5*s,2*s); ctx.fill();

    // Spreadsheet
    const sx=235*s,sy=25*s,sw=68*s,sh=90*s;
    ctx.fillStyle="#fff"; ctx.strokeStyle="#d4d4d4"; ctx.lineWidth=1;
    roundRect(ctx,sx,sy,sw,sh,3*s); ctx.fill(); ctx.stroke();
    ctx.strokeStyle="#e5e5e5"; ctx.lineWidth=0.5;
    [23,45].forEach(dx=>{ctx.beginPath();ctx.moveTo(sx+dx*s,sy+5*s);ctx.lineTo(sx+dx*s,sy+sh-5*s);ctx.stroke();});
    [10,19,28,37,46,55,64,73].forEach(dy=>{ctx.beginPath();ctx.moveTo(sx+3*s,sy+dy*s);ctx.lineTo(sx+sw-3*s,sy+dy*s);ctx.stroke();});
    ctx.fillStyle="#fecaca"; ctx.globalAlpha=0.3+0.5*Math.abs(Math.sin(t*2.1));
    roundRect(ctx,sx+46*s,sy+46*s,17*s,8*s,1); ctx.fill(); ctx.globalAlpha=1;

    [0,1,2].forEach(i=>{const p=((t-i*0.8)*0.4)%2.5;if(p<0||p>2)return;
      ctx.save();ctx.globalAlpha=Math.max(0,0.5-p*0.25);ctx.fillStyle="#a3a3a3";
      ctx.beginPath();ctx.arc(130*s+i*60*s,h*0.62+p*18*s,2.5*s,0,Math.PI*2);ctx.fill();ctx.restore();
    });
    ctx.fillStyle="#a3a3a3";ctx.font=`${6*s}px system-ui`;ctx.textAlign="center";
    ctx.fillText("things falling through cracks",w/2,h*0.92);
    drawDashedLine(ctx,px+pw+2*s,h*0.32,ex-2*s,h*0.32,t,0);
    drawDashedLine(ctx,ex+ew+2*s,h*0.32,sx-2*s,h*0.32,t,0.5);
  }, []);
  return <canvas ref={useCanvas(draw)} className="w-full h-full" />;
}

/* ═══ 4. THE FREELANCER ═══ */
export function FreelancerScene() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const s=w/320;
    ctx.fillStyle="#f5f5f5";ctx.fillRect(0,0,w,h);
    ctx.fillStyle="#e0e0e0";ctx.fillRect(0,h*0.65,w,h*0.35);
    drawConfetti(ctx,t,w,h);

    const clients=[{n:"A",c:"#4f46e5"},{n:"B",c:"#0891b2"},{n:"C",c:"#db2777"},{n:"D",c:"#059669"},{n:"E",c:"#7c3aed"}];
    const ac=Math.floor(t/1.8)%5;

    const mx=65*s,my=12*s,mw=190*s,mh=110*s;
    ctx.fillStyle="#065f46";roundRect(ctx,mx,my,mw,mh,5*s);ctx.fill();
    ctx.fillStyle="#fff";roundRect(ctx,mx+5*s,my+4*s,mw-10*s,mh-14*s,3*s);ctx.fill();

    clients.forEach((c,i)=>{
      const tx=mx+9*s+i*34*s,ty=my+8*s;
      ctx.fillStyle=i===ac?c.c:"#f0f0f0"; roundRect(ctx,tx,ty,30*s,8*s,2*s);ctx.fill();
      ctx.fillStyle=i===ac?"#fff":"#a3a3a3";ctx.font=`${4*s}px system-ui`;ctx.textAlign="center";
      ctx.fillText(c.n,tx+15*s,ty+5.5*s);
    });

    const fi=Math.min(1,((t%1.8)*2));
    ctx.save();ctx.globalAlpha=fi;
    const pc=clients[ac].c;
    ctx.fillStyle="#fafafa";ctx.strokeStyle="#e5e5e5";ctx.lineWidth=0.5;
    roundRect(ctx,mx+9*s,my+20*s,85*s,75*s,2*s);ctx.fill();ctx.stroke();
    ctx.fillStyle=pc;ctx.globalAlpha=fi*0.15;roundRect(ctx,mx+9*s,my+20*s,85*s,7*s,2*s);ctx.fill();
    ctx.globalAlpha=fi;drawScreenLines(ctx,mx+13*s,my+32*s,5,55*s);
    ctx.fillStyle="#fafafa";ctx.strokeStyle="#e5e5e5";
    roundRect(ctx,mx+99*s,my+20*s,82*s,75*s,2*s);ctx.fill();ctx.stroke();
    ctx.fillStyle=pc;ctx.globalAlpha=fi*0.1;roundRect(ctx,mx+99*s,my+20*s,82*s,7*s,2*s);ctx.fill();
    ctx.globalAlpha=fi;drawScreenLines(ctx,mx+103*s,my+32*s,5,50*s);
    ctx.restore();

    ctx.fillStyle="#c4c4c4";roundRect(ctx,mx+mw/2-20*s,my+mh,40*s,10*s,3*s);ctx.fill();

    ctx.save();ctx.translate(w/2,my+mh/2-5*s);ctx.rotate(t*1.57);
    ctx.strokeStyle="#064e3b";ctx.lineWidth=0.3*s;ctx.globalAlpha=0.07;ctx.setLineDash([3*s,8*s]);
    ctx.beginPath();ctx.arc(0,0,55*s,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.restore();

    [{x:8,y:30,r:-5,bg:"#fef08a"},{x:8,y:90,r:3,bg:"#fce7f3"},{x:268,y:30,r:4,bg:"#dbeafe"},
     {x:268,y:90,r:-2,bg:"#d1fae5"},{x:140,y:h/s*0.76,r:1,bg:"#fef3c7"}].forEach((st,i)=>{
      const isAc=i===ac,sc=isAc?1+0.06*Math.sin(t*4):1;
      ctx.save();ctx.translate(st.x*s+21*s,st.y*s+15*s);ctx.rotate(st.r*Math.PI/180);ctx.scale(sc,sc);
      ctx.globalAlpha=isAc?1:0.45;ctx.fillStyle=st.bg;
      roundRect(ctx,-21*s,-15*s,42*s,30*s,2*s);ctx.fill();
      ctx.fillStyle="#737373";ctx.font=`${5*s}px system-ui`;ctx.textAlign="left";
      ctx.fillText(`Client ${clients[i]?.n}`,-16*s,-3*s);ctx.restore();
    });

    ctx.fillStyle="#a3a3a3";ctx.font=`${6*s}px system-ui`;ctx.textAlign="center";
    ctx.fillText("context-switching, not creating",w/2,h*0.95);
  }, []);
  return <canvas ref={useCanvas(draw)} className="w-full h-full" />;
}

/* ═══ 5. THE PARENT ═══ */
export function ParentScene() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const s=w/320;
    ctx.fillStyle="#f0f0f0";ctx.fillRect(0,0,w,h);
    ctx.fillStyle="#d9d9d9";ctx.fillRect(0,h*0.675,w,h*0.325);
    drawConfetti(ctx,t,w,h);

    const px=20*s,py=15*s,pw=65*s,ph=110*s;
    ctx.fillStyle="#2a2a2a";roundRect(ctx,px,py,pw,ph,9*s);ctx.fill();
    ctx.fillStyle="#fff";roundRect(ctx,px+4*s,py+8*s,pw-8*s,ph-18*s,6*s);ctx.fill();
    ctx.fillStyle="#25D366";roundRect(ctx,px+4*s,py+8*s,pw-8*s,10*s,6*s);ctx.fill();
    ctx.fillRect(px+4*s,py+15*s,pw-8*s,3*s);

    const groups=[{c:"#3b82f6",l:"School"},{c:"#f472b6",l:"Family"},{c:"#a78bfa",l:"Building"},{c:"#34d399",l:"Carpool"}];
    groups.forEach((g,i)=>{
      const gy=py+22*s+i*14*s;
      ctx.fillStyle=g.c;ctx.beginPath();ctx.arc(px+11*s,gy+5*s,4*s,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#333";ctx.font=`${5*s}px system-ui`;ctx.textAlign="left";ctx.fillText(g.l,px+18*s,gy+4*s);
      ctx.fillStyle="#a3a3a3";ctx.font=`${4*s}px system-ui`;ctx.fillText("new message...",px+18*s,gy+10*s);
      ctx.save();ctx.globalAlpha=0.5+0.5*Math.sin(t*3+i);ctx.fillStyle="#25D366";
      ctx.beginPath();ctx.arc(px+pw-10*s,gy+5*s,3*s,0,Math.PI*2);ctx.fill();ctx.restore();
    });
    drawNotifBadge(ctx,px+pw-3*s,py+3*s,5+Math.floor(t*0.66)%20,t,0);

    const lx=105*s,ly=20*s,lw=115*s,lh=80*s;
    ctx.fillStyle="#065f46";roundRect(ctx,lx,ly,lw,lh,4*s);ctx.fill();
    ctx.fillStyle="#fff";roundRect(ctx,lx+4*s,ly+4*s,lw-8*s,lh-10*s,2*s);ctx.fill();
    ctx.fillStyle="#064e3b";ctx.font=`${5*s}px system-ui`;ctx.textAlign="left";ctx.fillText("February 2026",lx+8*s,ly+12*s);
    const cellW=13*s,cellH=10*s,startX=lx+8*s,startY=ly+18*s;
    ["M","T","W","T","F","S","S"].forEach((d,i)=>{ctx.fillStyle="#a3a3a3";ctx.font=`${3.5*s}px system-ui`;ctx.textAlign="center";ctx.fillText(d,startX+i*cellW+cellW/2,startY);});
    for(let r=0;r<4;r++)for(let c=0;c<7;c++){
      const day=r*7+c+1;if(day>28)continue;
      const cx=startX+c*cellW,cy=startY+4*s+r*cellH;
      ctx.fillStyle="#e5e5e5";roundRect(ctx,cx+1,cy,cellW-2,cellH-2,1);ctx.fill();
      ctx.fillStyle="#555";ctx.font=`${4*s}px system-ui`;ctx.textAlign="center";ctx.fillText(String(day),cx+cellW/2,cy+cellH/2+1);
      if([3,7,12,15,18,22,25].includes(day)){ctx.fillStyle=groups[day%4].c;ctx.beginPath();ctx.arc(cx+cellW/2,cy+cellH-3,1.5*s,0,Math.PI*2);ctx.fill();}
    }
    ctx.fillStyle="#c4c4c4";roundRect(ctx,lx-5*s,ly+lh,lw+10*s,5*s,2*s);ctx.fill();

    const tx=240*s,ty=25*s,tw=55*s,th=75*s;
    ctx.fillStyle="#2a2a2a";roundRect(ctx,tx,ty,tw,th,6*s);ctx.fill();
    ctx.fillStyle="#fff";roundRect(ctx,tx+4*s,ty+6*s,tw-8*s,th-14*s,3*s);ctx.fill();
    ["#bfdbfe","#fecaca","#d9f99d","#e9d5ff","#fde68a","#a7f3d0"].forEach((c,ci)=>{
      ctx.fillStyle=c;roundRect(ctx,tx+6*s+(ci%2)*22*s,ty+8*s+Math.floor(ci/2)*18*s,20*s,16*s,2*s);ctx.fill();
    });
    ctx.fillStyle="#555";ctx.beginPath();ctx.arc(tx+tw/2,ty+th-4*s,2.5*s,0,Math.PI*2);ctx.fill();

    ctx.save();ctx.globalAlpha=0.15+0.25*Math.abs(Math.sin(t*0.8));
    ctx.fillStyle="#555";ctx.font=`${7*s}px system-ui`;ctx.textAlign="center";ctx.fillText("you are the router",w/2,h*0.88);ctx.restore();
    drawDashedLine(ctx,px+pw+2*s,h*0.35,lx-2*s,h*0.35,t,0);
    drawDashedLine(ctx,lx+lw+2*s,h*0.35,tx-2*s,h*0.35,t,0.5);
  }, []);
  return <canvas ref={useCanvas(draw)} className="w-full h-full" />;
}

/* ═══ 6. THE EXECUTIVE ═══ */
export function ExecutiveScene() {
  const draw = useCallback((ctx: CanvasRenderingContext2D, t: number, w: number, h: number) => {
    const s=w/320;
    ctx.fillStyle="#f5f5f5";ctx.fillRect(0,0,w,h);
    ctx.fillStyle="#e0e0e0";ctx.fillRect(0,h*0.65,w,h*0.35);
    drawConfetti(ctx,t,w,h);

    const mx=30*s,my=12*s,mw=260*s,mh=105*s;
    ctx.fillStyle="#065f46";roundRect(ctx,mx,my,mw,mh,5*s);ctx.fill();
    ctx.fillStyle="#fff";roundRect(ctx,mx+4*s,my+4*s,mw-8*s,mh-12*s,3*s);ctx.fill();

    const tl=["Sales","Ops","Finance","HR","Support"];
    const tc=["#4f46e5","#0891b2","#059669","#7c3aed","#db2777"];
    const at=Math.floor(t/2)%5;
    tl.forEach((l,i)=>{const tx=mx+8*s+i*48*s,ty=my+7*s;
      ctx.fillStyle=i===at?tc[i]:"#f0f0f0";roundRect(ctx,tx,ty,44*s,7*s,2*s);ctx.fill();
      ctx.fillStyle=i===at?"#fff":"#a3a3a3";ctx.font=`${4*s}px system-ui`;ctx.textAlign="center";ctx.fillText(l,tx+22*s,ty+5*s);
    });

    const fi=Math.min(1,((t%2)*2.5));
    ctx.save();ctx.globalAlpha=fi;
    const chartX=mx+10*s,chartY=my+20*s,chartW=100*s,chartH=70*s;
    ctx.fillStyle="#fafafa";ctx.strokeStyle="#e5e5e5";ctx.lineWidth=0.5;
    roundRect(ctx,chartX,chartY,chartW,chartH,2*s);ctx.fill();ctx.stroke();
    for(let i=0;i<5;i++){const bH=(20+Math.sin(t*0.5+i*1.2)*12)*s;
      ctx.fillStyle=tc[i];ctx.globalAlpha=fi*0.7;roundRect(ctx,chartX+10*s+i*18*s,chartY+chartH-12*s-bH,12*s,bH,1*s);ctx.fill();ctx.globalAlpha=fi;}
    ctx.strokeStyle="#d4d4d4";ctx.beginPath();ctx.moveTo(chartX+5*s,chartY+chartH-10*s);ctx.lineTo(chartX+chartW-5*s,chartY+chartH-10*s);ctx.stroke();

    const lcX=mx+115*s,lcY=my+20*s,lcW=70*s,lcH=35*s;
    ctx.fillStyle="#fafafa";ctx.strokeStyle="#e5e5e5";roundRect(ctx,lcX,lcY,lcW,lcH,2*s);ctx.fill();ctx.stroke();
    ctx.strokeStyle=tc[at];ctx.lineWidth=1.5*s;ctx.beginPath();
    for(let i=0;i<=6;i++){const lxp=lcX+5*s+i*10*s,lyp=lcY+lcH/2+Math.sin(t*0.3+i*0.8)*8*s;
      if(i===0)ctx.moveTo(lxp,lyp);else ctx.lineTo(lxp,lyp);}ctx.stroke();

    const kpiX=mx+115*s,kpiY=my+60*s;
    for(let r=0;r<2;r++)for(let c=0;c<2;c++){
      const kx=kpiX+c*36*s,ky=kpiY+r*15*s;
      ctx.fillStyle="#fafafa";ctx.strokeStyle="#e5e5e5";ctx.lineWidth=0.5;
      roundRect(ctx,kx,ky,33*s,13*s,2*s);ctx.fill();ctx.stroke();
      ctx.fillStyle="#a3a3a3";roundRect(ctx,kx+3*s,ky+3*s,15*s,2*s,1);ctx.fill();
      ctx.fillStyle="#064e3b";roundRect(ctx,kx+3*s,ky+7*s,20*s,3*s,1);ctx.fill();
    }

    const pieX=mx+mw-50*s,pieY=my+20*s;
    ctx.fillStyle="#fafafa";ctx.strokeStyle="#e5e5e5";roundRect(ctx,pieX,pieY,42*s,70*s,2*s);ctx.fill();ctx.stroke();
    const pcx=pieX+21*s,pcy=pieY+25*s,pr=14*s;
    let sa=-Math.PI/2;[0.35,0.25,0.2,0.15,0.05].forEach((sl,i)=>{const ea=sa+sl*Math.PI*2;
      ctx.fillStyle=tc[i];ctx.beginPath();ctx.moveTo(pcx,pcy);ctx.arc(pcx,pcy,pr,sa,ea);ctx.closePath();ctx.fill();sa=ea;});
    ctx.fillStyle="#fafafa";ctx.beginPath();ctx.arc(pcx,pcy,7*s,0,Math.PI*2);ctx.fill();
    for(let i=0;i<3;i++){ctx.fillStyle=tc[i];ctx.beginPath();ctx.arc(pieX+8*s,pieY+46*s+i*8*s,2*s,0,Math.PI*2);ctx.fill();
      ctx.fillStyle="#a3a3a3";roundRect(ctx,pieX+13*s,pieY+44*s+i*8*s,18*s,2.5*s,1);ctx.fill();}
    ctx.restore();

    ctx.fillStyle="#c4c4c4";roundRect(ctx,w/2-25*s,my+mh,50*s,7*s,3*s);ctx.fill();

    ctx.save();ctx.globalAlpha=0.3+0.5*Math.abs(Math.sin(t*2));ctx.fillStyle="#dc2626";ctx.font=`${5*s}px system-ui`;ctx.textAlign="center";
    ctx.fillText("⚠ partial data — 3 sources still loading",w/2,my+mh-4*s);ctx.restore();

    for(let i=0;i<3;i++){const rx=20*s+i*28*s,ry=h*0.7+i*2*s;
      ctx.save();ctx.translate(rx+20*s,ry+18*s);ctx.rotate((-4+i*4)*Math.PI/180);
      ctx.fillStyle="#fff";ctx.strokeStyle="#d4d4d4";ctx.lineWidth=0.5;
      roundRect(ctx,-20*s,-18*s,40*s,36*s,2*s);ctx.fill();ctx.stroke();
      ctx.fillStyle="#e5e5e5";roundRect(ctx,-15*s,-12*s,25*s,2*s,1);ctx.fill();roundRect(ctx,-15*s,-7*s,28*s,2*s,1);ctx.fill();
      ctx.fillStyle="#a3a3a3";ctx.font=`${4*s}px system-ui`;ctx.textAlign="left";ctx.fillText(["PDF","XLS","PPT"][i],-15*s,11*s);ctx.restore();}

    ctx.fillStyle="#a3a3a3";ctx.font=`${6*s}px system-ui`;ctx.textAlign="center";ctx.fillText("decisions on partial data",w/2,h*0.95);
  }, []);
  return <canvas ref={useCanvas(draw)} className="w-full h-full" />;
}
