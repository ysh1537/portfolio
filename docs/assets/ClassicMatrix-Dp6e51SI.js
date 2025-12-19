import{r as o,v as c,l,k as u,C as m,x as f,j as e,a1 as d}from"./three-Cwdqg_u8.js";import"./index-sb9UF3ya.js";import"./vendor-CqO7gtIP.js";import"./animation-B64uUSMy.js";const v=({opacity:r=.2})=>{const t=o.useRef(),{viewport:a}=c(),i=o.useMemo(()=>new l({uniforms:{uTime:{value:0},uColor:{value:new m("#00ff41")},uOpacity:{value:r}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                varying vec2 vUv;
                uniform float uTime;
                uniform vec3 uColor;
                uniform float uOpacity;

                float random(vec2 st) {
                    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
                }

                void main() {
                    vec2 uv = vUv;
                    
                    // Grid columns
                    float columns = 60.0;
                    vec2 ipos = floor(uv * columns);
                    
                    // Rain speed varying per column
                    float speed = 1.0 + random(vec2(ipos.x, 1.33)) * 2.0;
                    float y = mod(uv.y + uTime * speed * 0.1, 1.0);

                    // Matrix character flickering / trail
                    float strength = 1.0 - step(0.1, random(vec2(ipos.x, floor(y * 40.0)))); 
                    strength *= (1.0 - fract(y * 10.0)); // Fade trail
                    
                    // Leading bright head
                    float head = 1.0 - step(0.005, y); 
                    
                    vec3 color = uColor * (strength + head * 1.5);
                    gl_FragColor = vec4(color, (strength + head) * uOpacity);
                }
            `,transparent:!0,depthWrite:!1,side:u}),[r]);return f(n=>{if(t.current&&t.current.material&&t.current.material.uniforms){const s=t.current.material.uniforms;s.uTime&&(s.uTime.value=n.clock.getElapsedTime()),s.uOpacity&&(s.uOpacity.value=r)}}),e.jsxs("mesh",{ref:t,scale:[a.width*2,a.height*2,1],position:[0,0,-8],children:[e.jsx("planeGeometry",{args:[1,1]}),e.jsx("primitive",{object:i,attach:"material"})]})},y=({isFinished:r})=>{const[t,a]=o.useState(!1);return o.useEffect(()=>{r&&a(!0)},[r]),e.jsxs("group",{children:[e.jsx(v,{opacity:.3}),t&&e.jsx(d,{center:!0,zIndexRange:[100,0],children:e.jsxs("div",{className:"flex flex-col items-center justify-center w-screen h-screen bg-black/80 backdrop-blur-sm",children:[e.jsxs("h1",{className:"text-6xl md:text-8xl font-black text-[#00ff41] tracking-tighter animate-pulse drop-shadow-[0_0_20px_rgba(0,255,65,0.8)] text-center px-4",children:["ACCESS",e.jsx("br",{}),"GRANTED"]}),e.jsx("div",{className:"mt-4 text-[#00ff41] font-mono text-sm opacity-80 animate-bounce",children:"INITIALIZING SYSTEM..."})]})})]})};export{y as default};
