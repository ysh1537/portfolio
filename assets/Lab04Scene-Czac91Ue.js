import{t as l,z as e,am as N,C as h,G as A,ap as k,aq as G,ar as D,as as L,at as P,a8 as E,aa as T,a0 as I,a4 as U,u as O,n as H,m as z,w as j,a6 as B,J as C,K as F}from"./three-B9-2A0-2.js";import{a as $}from"./index-SHItErlE.js";import{d as b}from"./firebase-DmZgpn7F.js";import{q as K,l as Y,o as _,c as R,a as V,b as X,s as q}from"./firebase-DYoEMUzx.js";import"./vendor-CqO7gtIP.js";import"./animation-DsH0_-YU.js";import"./postprocessing-Qbs0T82m.js";const W=()=>{const[n,s]=l.useState([]),[i,f]=l.useState(""),[a,u]=l.useState(""),[r,m]=l.useState(!1),[o,x]=l.useState(null);l.useEffect(()=>{if(!b){x("데이터베이스 연결 대기 중... (Demo Mode)"),s([{id:"1",nickname:"Pilot",message:"시스템이 오프라인 모드입니다. API 키를 설정해주세요.",createdAt:null},{id:"2",nickname:"System",message:"Firebase 연결이 필요합니다.",createdAt:null}]);return}const c=K(R(b,"guestbook"),_("createdAt","desc"),Y(50)),d=V(c,t=>{const y=t.docs.map(p=>({id:p.id,...p.data()}));s(y)},t=>{console.error("[Guestbook] 로드 실패:",t),x("방명록을 불러올 수 없습니다.")});return()=>d()},[]);const v=async c=>{if(c.preventDefault(),!i.trim()||!a.trim()){x("닉네임과 메시지를 모두 입력해주세요.");return}if(i.length>20||a.length>500){x("닉네임은 20자, 메시지는 500자 이내로 입력해주세요.");return}m(!0),x(null);try{if(!b)throw new Error("Database not initialized");await X(R(b,"guestbook"),{nickname:i.trim(),message:a.trim(),createdAt:q()}),f(""),u("")}catch(d){console.error("[Guestbook] 작성 실패:",d),x("방명록 작성에 실패했습니다. 다시 시도해주세요.")}finally{m(!1)}},g=c=>{if(!c)return"";const d=c.toDate();return new Intl.DateTimeFormat("ko-KR",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}).format(d)};return e.jsxs("div",{className:"w-full h-full flex flex-col text-white font-mono",children:[e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("h3",{className:"text-cyan-400 font-bold text-lg mb-1",children:"📝 GUESTBOOK UNLOCKED"}),e.jsx("p",{className:"text-gray-400 text-xs",children:"섹터 안정화에 성공하셨군요! 방명록을 남겨주세요."})]}),e.jsxs("form",{onSubmit:v,className:"mb-4 space-y-2",children:[e.jsx("input",{type:"text",placeholder:"닉네임 (최대 20자)",value:i,onChange:c=>f(c.target.value),maxLength:20,className:"w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"}),e.jsx("textarea",{placeholder:"메시지를 남겨주세요 (최대 500자)",value:a,onChange:c=>u(c.target.value),maxLength:500,rows:3,className:"w-full px-3 py-2 bg-black/50 border border-cyan-500/30 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-none"}),o&&e.jsx("p",{className:"text-red-400 text-xs",children:o}),e.jsx("button",{type:"submit",disabled:r,className:`w-full py-2 rounded text-sm font-bold transition-all ${r?"bg-gray-700 text-gray-400 cursor-not-allowed":"bg-cyan-600 text-white hover:bg-cyan-500"}`,children:r?"전송 중...":"방명록 남기기"})]}),e.jsx("div",{className:"flex-1 overflow-y-auto space-y-2 pr-1",children:n.length===0?e.jsx("p",{className:"text-gray-500 text-center text-sm py-4",children:"아직 방명록이 없습니다. 첫 번째로 남겨보세요!"}):n.map(c=>e.jsxs("div",{className:"p-3 bg-black/40 border border-cyan-500/20 rounded",children:[e.jsxs("div",{className:"flex justify-between items-center mb-1",children:[e.jsx("span",{className:"text-cyan-300 font-bold text-sm",children:c.nickname}),e.jsx("span",{className:"text-gray-500 text-xs",children:g(c.createdAt)})]}),e.jsx("p",{className:"text-gray-200 text-sm whitespace-pre-wrap break-words",children:c.message})]},c.id))})]})},Z=N({uTime:0,uColorCore:new h("#000000"),uColorRim:new h("#ef4444"),uColorAccent:new h("#fbbf24"),uIntensity:1},`
    varying vec2 vUv;
    varying vec3 vViewPosition;
    void main() {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,`
    uniform float uTime;
    uniform vec3 uColorCore;
    uniform vec3 uColorRim;
    uniform vec3 uColorAccent;
    uniform float uIntensity; // Increases as destabilized

    varying vec2 vUv;

    // Noise Function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        vec2 uv = vUv * 2.0 - 1.0;
        float r = length(uv);
        float angle = atan(uv.y, uv.x);

        // Glitch Distortion
        float glitch = step(0.98, random(vec2(uTime * 10.0, uv.y)));
        float shift = (random(vec2(uTime)) - 0.5) * 0.2 * uIntensity;
        if (glitch > 0.5) {
            angle += shift;
            r += shift * 0.5;
        }

        // Accretion Disk Pattern (Spiral)
        float spiral = angle * 2.0 + uTime * 2.0; 
        float diskNoise = noise(vec2(r * 5.0 - uTime * 2.0, angle * 3.0));
        
        // Ring shape
        float ring = smoothstep(0.4, 0.6, r) - smoothstep(0.6, 0.9, r);
        ring *= diskNoise; // Textured ring

        // Core (Event Horizon)
        float core = 1.0 - smoothstep(0.35, 0.4, r);

        // Beam / Jets
        float jets = smoothstep(0.8, 0.9, abs(uv.x * 0.1)) * step(0.5, abs(uv.y)); 

        // Combine
        vec3 color = mix(vec3(0.0), uColorRim, ring);
        
        // Add accent sparks
        float spark = step(0.95, noise(vec2(angle * 10.0, uTime * 5.0))) * ring;
        color += uColorAccent * spark;

        // Black Hole Core
        color = mix(color, uColorCore, core);

        // Glitch Color Shift
        if (glitch > 0.5) {
            color.r = color.g;
            color.g = color.b;
        }

        gl_FragColor = vec4(color, max(ring, core)); 
        
        // Alpha dissolve at edges
        if (r > 0.9) discard;
    }
  `);A({EventHorizonMaterial:Z});const J=()=>(j(({clock:n,scene:s})=>{s.traverse(i=>{i.material&&i.material.uniforms&&i.material.uniforms.uTime&&(i.material.uniforms.uTime.value=n.elapsedTime)})}),null),M={vertexShader:`
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,fragmentShader:`
        varying vec2 vUv;
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uSpeed;

        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
            vec2 uv = vUv;
            float columns = 50.0;
            vec2 ipos = floor(uv * columns);
            // 속도 절반으로 줄임 (0.5~1.5)
            float baseSpeed = 0.5 + random(vec2(ipos.x, 0.0)) * 1.0;
            float y = mod(uv.y + uTime * baseSpeed * 0.1 * uSpeed, 1.0);
            float strength = 1.0 - step(0.1, random(vec2(ipos.x, floor(y * 20.0))));
            strength *= (1.0 - fract(y * 10.0));
            float head = 1.0 - step(0.01, y); 
            vec3 color = uColor * strength;
            color += vec3(0.8, 1.0, 0.8) * head;
            gl_FragColor = vec4(color, strength * 0.7);
        }
    `},Q=({stabilized:n})=>{const s=l.useRef(),{viewport:i}=O(),f=l.useRef(0),a=l.useMemo(()=>new H({uniforms:{uTime:{value:0},uColor:{value:new h("#ef4444")},uSpeed:{value:1}},vertexShader:M.vertexShader,fragmentShader:M.fragmentShader,transparent:!0,depthWrite:!1,side:z}),[]);return j((u,r)=>{if(s.current&&s.current.material&&s.current.material.uniforms){const m=s.current.material.uniforms;n?(f.current===0&&(f.current=u.clock.elapsedTime),m.uTime.value=f.current,m.uSpeed.value=C.lerp(m.uSpeed.value,0,r*2)):(m.uTime.value=u.clock.getElapsedTime(),m.uSpeed.value=1);const o=n?new h("#06b6d4"):new h("#ef4444");m.uColor.value.lerp(o,r*2)}}),e.jsxs("mesh",{ref:s,scale:[i.width,i.height,1],position:[0,0,-5],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("primitive",{object:a,attach:"material"})]})},ee=({text:n,position:s,fontSize:i,color:f,intensity:a=1})=>{const u=l.useRef();return j(()=>{u.current&&(Math.random()>1-.05*a?(u.current.position.x=s[0]+(Math.random()-.5)*.1*a,u.current.position.y=s[1]+(Math.random()-.5)*.1*a):u.current.position.set(...s))}),e.jsxs("group",{ref:u,position:s,children:[e.jsx(T,{position:[.02*a,0,0],fontSize:i,color:"cyan",opacity:.5,anchorX:"center",children:n}),e.jsx(T,{position:[-.02*a,0,0],fontSize:i,color:"red",opacity:.5,anchorX:"center",children:n}),e.jsx(T,{position:[0,0,0],fontSize:i,color:f,anchorX:"center",children:n})]})},S=({id:n,position:s,geometry:i,onPatch:f,isPatched:a,speed:u=2})=>{const r=l.useRef(),[m,o]=l.useState(!1),{playHover:x,playClick:v}=$();j((c,d)=>{if(!r.current)return;a?(r.current.rotation.x+=d*.3,r.current.rotation.y+=d*.2,r.current.position.x=C.lerp(r.current.position.x,s[0],d*5),r.current.position.y=C.lerp(r.current.position.y,s[1],d*5)):(r.current.rotation.x+=d*u*(.5+Math.sin(c.clock.elapsedTime*5)*.3),r.current.rotation.y+=d*u*(.5+Math.cos(c.clock.elapsedTime*4)*.3),Math.random()>.9&&(r.current.position.x=s[0]+(Math.random()-.5)*.2,r.current.position.y=s[1]+(Math.random()-.5)*.2));const t=m?1.3:1;r.current.scale.lerp(new F(t,t,t),.1)});const g=()=>{a||(v(),f(n))};return e.jsx(B,{speed:a?2:8,rotationIntensity:a?1:4,floatIntensity:1,children:e.jsxs("mesh",{ref:r,position:s,onPointerOver:()=>{a||(o(!0),x(),document.body.style.cursor="pointer")},onPointerOut:()=>{o(!1),document.body.style.cursor="auto"},onClick:g,children:[e.jsx("primitive",{object:i,attach:"geometry"}),e.jsx("meshBasicMaterial",{color:a?"#06b6d4":m?"#ffffff":"#ef4444",wireframe:!0,transparent:!0,opacity:a?.8:m?.9:.5})]})})},ce=()=>{const[n,s]=l.useState(new Set),[i,f]=l.useState(["[SYSTEM] CRITICAL FAILURE IN SECTOR 04","[KERNEL] REALITY INTEGRITY: 12%","[WARNING] DATA CORRUPTION DETECTED"]),a=4,u=12,r=Math.floor((100-u)/a),m=u+n.size*r,o=n.size>=a,x=l.useCallback(t=>{s(p=>{const w=new Set(p);return w.add(t),w});const y={"mod-1":"QUANTUM_CORE","mod-2":"NEURAL_LINK","mod-3":"MEMORY_STACK","mod-4":"REALITY_ANCHOR"};f(p=>[...p,`[PATCHING] ${y[t]||t}...`,`[SUCCESS] Module restored. Integrity +${r}%`])},[r]);l.useEffect(()=>{o&&f(t=>[...t,"[SYSTEM] ALL MODULES RESTORED","[STATUS] SECTOR STABILIZED","",'>>> "Debugging is Creating." <<<'])},[o]);const v=l.useMemo(()=>new k(.8,0),[]),g=l.useMemo(()=>new G(.5,.15,64,12),[]),c=l.useMemo(()=>new D(.7,0),[]),d=l.useMemo(()=>new L(.6,0),[]);return e.jsxs("group",{children:[e.jsx(Q,{stabilized:o}),e.jsxs("mesh",{position:[0,0,-8],scale:[10,10,1],children:[e.jsx("planeGeometry",{}),e.jsx("eventHorizonMaterial",{uTime:0,uIntensity:o?0:1,uColorRim:o?new h("#06b6d4"):new h("#ef4444"),transparent:!0,depthWrite:!1},o?"stable":"unstable")]}),"// Custom hook to animate shader time",e.jsx(J,{}),e.jsxs("group",{position:[0,0,0],children:[e.jsxs("mesh",{position:[0,0,-1],children:[e.jsx("planeGeometry",{args:[6,4]}),e.jsx("meshBasicMaterial",{color:"#000000",transparent:!0,opacity:.9}),e.jsxs("lineSegments",{children:[e.jsx("edgesGeometry",{args:[new P(6,4)]}),e.jsx("meshBasicMaterial",{color:o?"#06b6d4":"#ef4444"})]})]}),e.jsx(E,{children:e.jsx(ee,{text:o?"SECTOR STABILIZED":"THE GLITCH [FATAL ERROR]",position:[0,1.5,0],fontSize:.3,color:o?"#06b6d4":"#ef4444",intensity:o?.1:1})}),e.jsx(E,{children:e.jsxs(T,{position:[0,1.1,0],fontSize:.15,color:o?"#06b6d4":"#fbbf24",anchorX:"center",children:["REALITY INTEGRITY: ",m,"%"]})}),e.jsx(I,{position:[-2.5,.8,0],transform:!0,scale:.5,style:{width:"800px",maxHeight:"350px",overflow:"hidden",pointerEvents:"none"},children:e.jsxs("div",{className:"font-mono text-sm leading-relaxed",children:[i.map((t,y)=>e.jsx("p",{className:`
                                ${t.includes("SUCCESS")?"text-emerald-400":""}
                                ${t.includes("PATCHING")?"text-yellow-400":""}
                                ${t.includes("CRITICAL")||t.includes("ERROR")?"text-red-500":""}
                                ${t.includes("STABILIZED")?"text-cyan-400 font-bold":""}
                                ${t.includes("Debugging")?"text-white text-lg font-bold mt-4 animate-pulse":""}
                                ${!t.includes("SUCCESS")&&!t.includes("PATCHING")&&!t.includes("CRITICAL")&&!t.includes("ERROR")&&!t.includes("STABILIZED")&&!t.includes("Debugging")?"text-red-400 opacity-70":""}
                            `,children:t.startsWith("[")?`> ${t}`:t},y)),!o&&e.jsx("p",{className:"text-yellow-500 animate-pulse mt-4",children:"> [HINT] 불안정한 모듈을 클릭하여 패치하세요..."})]})}),o&&e.jsx(I,{position:[0,-2.5,0],transform:!0,scale:.4,style:{width:"600px",maxHeight:"400px",overflow:"auto",background:"rgba(0, 0, 0, 0.9)",borderRadius:"12px",border:"1px solid rgba(6, 182, 212, 0.3)",padding:"16px"},children:e.jsx(W,{})})]}),e.jsx(S,{id:"mod-1",position:[3.5,.8,1],geometry:v,onPatch:x,isPatched:n.has("mod-1"),speed:3}),e.jsx(S,{id:"mod-2",position:[-5,1.5,3],geometry:g,onPatch:x,isPatched:n.has("mod-2"),speed:4}),e.jsx(S,{id:"mod-3",position:[3.5,-1.2,1],geometry:c,onPatch:x,isPatched:n.has("mod-3"),speed:2.5}),e.jsx(S,{id:"mod-4",position:[-3.5,-1.2,1],geometry:d,onPatch:x,isPatched:n.has("mod-4"),speed:3.5}),e.jsx(U,{count:o?100:50,scale:10,size:o?3:5,speed:o?.3:.8,opacity:.8,color:o?"#06b6d4":"#ef4444"})]})};export{ce as default};
