import { useState, useEffect, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from "recharts";


// ===================== STUDENT PROFILES =====================
const STUDENT_PROFILES = [
  {
    id: "STU-001",
    nombre: "Valentina Ríos",
    grado: "9°",
    edad: 14,
    estilo: "Visual",
    nivel_socioeconomico: "Medio",
    tiempo_disponible: 8,
    dispositivos: ["Tablet", "Smartphone"],
    nivel_conocimiento: { pensamiento_computacional: 0.3, redes: 0.2, hardware: 0.4, software: 0.5, diseño: 0.6, ciudadania_digital: 0.4 },
    objetivos: ["pensamiento_computacional", "diseño", "ciudadania_digital"],
    fortalezas: "Creatividad visual, trabajo colaborativo",
    dificultades: "Abstracción lógica, algorítmica",
    color: "#00D4FF",
    accent: "#0099CC",
    avatar: "V"
  },
  {
    id: "STU-002",
    nombre: "Mateo Guerrero",
    grado: "10°",
    edad: 15,
    estilo: "Kinestésico",
    nivel_socioeconomico: "Bajo",
    tiempo_disponible: 5,
    dispositivos: ["Smartphone"],
    nivel_conocimiento: { pensamiento_computacional: 0.6, redes: 0.3, hardware: 0.7, software: 0.4, diseño: 0.2, ciudadania_digital: 0.5 },
    objetivos: ["pensamiento_computacional", "software", "redes"],
    fortalezas: "Resolución de problemas, hardware",
    dificultades: "Conectividad limitada, tiempo reducido",
    color: "#FF6B35",
    accent: "#CC4A1A",
    avatar: "M"
  },
  {
    id: "STU-003",
    nombre: "Isabella Moreno",
    grado: "11°",
    edad: 16,
    estilo: "Lectura/Escritura",
    nivel_socioeconomico: "Alto",
    tiempo_disponible: 15,
    dispositivos: ["Laptop", "Tablet", "Smartphone"],
    nivel_conocimiento: { pensamiento_computacional: 0.7, redes: 0.6, hardware: 0.5, software: 0.8, diseño: 0.7, ciudadania_digital: 0.8 },
    objetivos: ["redes", "software", "pensamiento_computacional", "ciudadania_digital"],
    fortalezas: "Autonomía, investigación, múltiples recursos",
    dificultades: "Trabajo práctico colaborativo",
    color: "#A855F7",
    accent: "#7C3AED",
    avatar: "I"
  }
];

// ===================== CURRICULUM T&I COLOMBIA =====================
const CURRICULUM_TI = {
  pensamiento_computacional: {
    nombre: "Pensamiento Computacional",
    ejes: ["Algoritmos y programación", "Resolución de problemas", "Abstracción y descomposición", "Patrones y generalización"],
    recursos_visual: ["Scratch visual", "Diagramas de flujo", "Infografías"],
    recursos_kines: ["Robótica con Arduino", "Desempacado de dispositivos", "Actividades físicas"],
    recursos_lec: ["Pseudocódigo", "Documentación técnica", "Libros de lógica"],
    nivel_requerido: 0.4,
    horas: 20
  },
  redes: {
    nombre: "Redes y Comunicaciones",
    ejes: ["Infraestructura de red", "Protocolos de comunicación", "Internet y servicios", "Seguridad básica"],
    recursos_visual: ["Simuladores Packet Tracer", "Mapas de red", "Videos"],
    recursos_kines: ["Cableado estructurado", "Configuración física", "Laboratorios"],
    recursos_lec: ["RFC y estándares", "Guías técnicas", "Casos de estudio"],
    nivel_requerido: 0.3,
    horas: 16
  },
  hardware: {
    nombre: "Hardware y Mantenimiento",
    ejes: ["Arquitectura de computadores", "Componentes físicos", "Mantenimiento preventivo", "Ensamble y diagnóstico"],
    recursos_visual: ["Diagramas de partes", "Videos de ensamble", "Esquemas"],
    recursos_kines: ["Práctica de ensamble", "Diagnóstico real", "Laboratorio físico"],
    recursos_lec: ["Manuales técnicos", "Fichas técnicas", "Tutoriales escritos"],
    nivel_requerido: 0.3,
    horas: 14
  },
  software: {
    nombre: "Software y Sistemas Operativos",
    ejes: ["Sistemas operativos", "Aplicaciones ofimáticas avanzadas", "Software libre", "Instalación y configuración"],
    recursos_visual: ["Screencasts", "Tutoriales visuales", "Capturas guiadas"],
    recursos_kines: ["Instalación práctica", "Proyectos reales", "Hackathons"],
    recursos_lec: ["Documentación oficial", "Wikis técnicas", "Manuales"],
    nivel_requerido: 0.4,
    horas: 18
  },
  diseño: {
    nombre: "Diseño Digital y Multimedia",
    ejes: ["Principios de diseño", "Herramientas digitales", "Comunicación visual", "Producción multimedia"],
    recursos_visual: ["Adobe/Canva tutoriales", "Galería de ejemplos", "Moodboards"],
    recursos_kines: ["Prototipado físico", "Instalaciones interactivas", "Proyectos creativos"],
    recursos_lec: ["Teoría del color", "Fundamentos tipografía", "Historia del diseño"],
    nivel_requerido: 0.3,
    horas: 16
  },
  ciudadania_digital: {
    nombre: "Ciudadanía Digital",
    ejes: ["Derechos digitales", "Ética en tecnología", "Seguridad y privacidad", "Impacto social TIC"],
    recursos_visual: ["Documentales", "Infografías interactivas", "Casos visuales"],
    recursos_kines: ["Simulaciones de rol", "Proyectos comunitarios", "Debates prácticos"],
    recursos_lec: ["Normativa colombiana", "Artículos académicos", "Política pública"],
    nivel_requerido: 0.3,
    horas: 10
  }
};

// ===================== ANYTIME ALGORITHM SIMULATION =====================
function simulateAnytimeStep(profile, iteration, prevQuality) {
  const { nivel_conocimiento, objetivos, tiempo_disponible } = profile;
  
  // Base quality from objectives coverage
  const coverageScore = objetivos.reduce((acc, obj) => {
    return acc + (1 - Math.abs((nivel_conocimiento[obj] || 0.3) - 0.7));
  }, 0) / objetivos.length;

  // Personalization score
  const estiloBonus = { Visual: 0.05, Kinestésico: 0.04, "Lectura/Escritura": 0.06 }[profile.estilo] || 0.04;
  
  // Time feasibility
  const feasibility = Math.min(1, tiempo_disponible / 10);
  
  // Anytime convergence curve: rapid initial improvement, diminishing returns
  const convergenceBase = 0.45 + coverageScore * 0.25 + feasibility * 0.15;
  const iterationGain = 0.3 * (1 - Math.exp(-iteration * 0.2));
  const noise = (Math.random() - 0.5) * 0.02 * Math.exp(-iteration * 0.15);
  const estiloEffect = estiloBonus * Math.min(1, iteration / 5);
  
  const quality = Math.min(0.98, convergenceBase + iterationGain + noise + estiloEffect);
  const improvement = prevQuality ? quality - prevQuality : quality;
  
  return {
    iteration: iteration + 1,
    quality: Math.max(0, quality),
    improvement,
    timeCost: 0.08 + Math.random() * 0.04,
    strategy: iteration < 3 ? "explore" : improvement > 0.01 ? "exploit" : "diversify",
    coverage: Math.min(1, 0.4 + iteration * 0.08)
  };
}

function generateStudyPlan(profile) {
  const { nivel_conocimiento, objetivos, estilo, tiempo_disponible, nivel_socioeconomico } = profile;
  const estiloKey = estilo === "Visual" ? "recursos_visual" : estilo === "Kinestésico" ? "recursos_kines" : "recursos_lec";
  
  const unidades = objetivos.map(obj => {
    const curriculum = CURRICULUM_TI[obj];
    const nivelActual = nivel_conocimiento[obj] || 0.3;
    const deficit = Math.max(0, curriculum.nivel_requerido - nivelActual + 0.3);
    const horasAjustadas = Math.min(curriculum.horas, Math.max(4, curriculum.horas * (deficit + 0.5)));
    const disponibilidad = nivel_socioeconomico === "Bajo" ? "offline" : "online+offline";
    
    return {
      id: obj,
      nombre: curriculum.nombre,
      ejes: curriculum.ejes,
      recursos: curriculum[estiloKey],
      horas: Math.round(horasAjustadas),
      nivelActual: (nivelActual * 100).toFixed(0) + "%",
      nivelMeta: "70%",
      modalidad: disponibilidad,
      estrategia: estilo,
      prioridad: deficit > 0.3 ? "Alta" : deficit > 0.1 ? "Media" : "Baja"
    };
  });

  const totalHoras = unidades.reduce((a, u) => a + u.horas, 0);
  const semanasNecesarias = Math.ceil(totalHoras / (tiempo_disponible * 0.8));
  
  return { unidades, totalHoras, semanasNecesarias, adaptaciones: getAdaptaciones(profile) };
}

function getAdaptaciones(profile) {
  const adaptaciones = [];
  if (profile.nivel_socioeconomico === "Bajo") {
    adaptaciones.push("📱 Recursos optimizados para smartphone sin datos ilimitados");
    adaptaciones.push("💾 Contenido descargable para acceso offline");
    adaptaciones.push("⏱️ Sesiones cortas de máximo 20 minutos");
  }
  if (profile.estilo === "Visual") {
    adaptaciones.push("🎨 Prioridad a contenido visual y multimedia");
    adaptaciones.push("🗺️ Mapas conceptuales y diagramas");
  }
  if (profile.estilo === "Kinestésico") {
    adaptaciones.push("🔧 Énfasis en proyectos prácticos y laboratorios");
    adaptaciones.push("🤝 Actividades colaborativas y aprendizaje basado en proyectos");
  }
  if (profile.tiempo_disponible < 8) {
    adaptaciones.push("⚡ Plan compacto con microlecciones diarias");
  }
  return adaptaciones;
}

// ===================== CARINA LOGO SVG (replicates original with glow) =====================
// flat-top hexagon: puntas a izquierda y derecha
// ángulos: 0°,60°,120°,180°,240°,300° desde el centro
// x = cx + r*cos(a),  y = cy + r*sin(a)
function hexPts(cx, cy, r) {
  return [0,60,120,180,240,300].map(deg => {
    const a = (deg * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

function CarinaLogoSVG() {
  const cx = 100, cy = 100;
  // Radios: cada par define el anillo de color, entre ellos va blanco
  const r1o = 90;  // borde externo azul
  const r1i = 72;  // borde interno azul  → blanco entre r1i y r2o
  const r2o = 68;  // borde externo dorado (gap blanco de 4px)
  const r2i = 50;  // borde interno dorado → blanco entre r2i y r3o
  const r3o = 46;  // borde externo verde  (gap blanco de 4px)
  const r3i = 28;  // borde interno verde  → blanco al centro

  return (
    <svg width="84" height="84" viewBox="0 0 200 200"
      style={{
        position: "relative", zIndex: 1,
        filter: [
          "drop-shadow(0 0 5px rgba(41,128,185,1))",
          "drop-shadow(0 0 12px rgba(41,128,185,0.8))",
          "drop-shadow(0 0 25px rgba(180,160,40,0.55))",
          "drop-shadow(0 0 40px rgba(41,128,185,0.4))"
        ].join(" ")
      }}>
      <defs>
        <filter id="cg-glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* 1. Fondo blanco completo del hexágono exterior (crea el borde blanco más externo) */}
      <polygon points={hexPts(cx,cy,r1o+2)} fill="white" opacity="0.9"/>

      {/* 2. Anillo AZUL exterior */}
      <polygon points={hexPts(cx,cy,r1o)} fill="#2A80B9" filter="url(#cg-glow)"/>

      {/* 3. Gap BLANCO entre azul y dorado */}
      <polygon points={hexPts(cx,cy,r1i)} fill="white"/>

      {/* 4. Anillo DORADO */}
      <polygon points={hexPts(cx,cy,r2o)} fill="#B8A030" filter="url(#cg-glow)"/>

      {/* 5. Gap BLANCO entre dorado y verde */}
      <polygon points={hexPts(cx,cy,r2i)} fill="white"/>

      {/* 6. Anillo VERDE */}
      <polygon points={hexPts(cx,cy,r3o)} fill="#7EA828" filter="url(#cg-glow)"/>

      {/* 7. Centro BLANCO */}
      <polygon points={hexPts(cx,cy,r3i)} fill="white"/>
    </svg>
  );
}

// ===================== MAIN DASHBOARD =====================
export default function CARINADashboard() {
  const [maxIterations, setMaxIterations] = useState(20);
  const [processingTime, setProcessingTime] = useState(3);
  const [selectedStudents, setSelectedStudents] = useState("all");
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [phase, setPhase] = useState("config"); // config | running | complete
  const [studentData, setStudentData] = useState({});
  const [currentIteration, setCurrentIteration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const intervalRef = useRef(null);
  const timeRef = useRef(null);
  const startTimeRef = useRef(null);

  const activeProfiles = selectedStudents === "all" 
    ? STUDENT_PROFILES 
    : STUDENT_PROFILES.filter((_, i) => i === parseInt(selectedStudents));

  const initStudentData = useCallback(() => {
    const data = {};
    activeProfiles.forEach(p => {
      data[p.id] = { history: [], currentQuality: 0, converged: false, plan: null, totalTime: 0 };
    });
    return data;
  }, [selectedStudents]);

  const handleRun = () => {
    const data = initStudentData();
    setStudentData(data);
    setCurrentIteration(0);
    setElapsedTime(0);
    setIsRunning(true);
    setIsComplete(false);
    setPhase("running");
    setSelectedPlan(null);
    startTimeRef.current = Date.now();

    const iterInterval = (processingTime * 1000) / maxIterations;
    
    timeRef.current = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - startTimeRef.current) / 100) / 10);
    }, 100);

    let iter = 0;
    intervalRef.current = setInterval(() => {
      if (iter >= maxIterations) {
        clearInterval(intervalRef.current);
        clearInterval(timeRef.current);
        setIsRunning(false);
        setIsComplete(true);
        setPhase("complete");
        setStudentData(prev => {
          const next = { ...prev };
          activeProfiles.forEach(p => {
            if (!next[p.id].plan) {
              next[p.id].plan = generateStudyPlan(p);
            }
          });
          return next;
        });
        return;
      }

      setCurrentIteration(iter + 1);
      setStudentData(prev => {
        const next = { ...prev };
        activeProfiles.forEach(p => {
          if (next[p.id].converged) return;
          const prevQ = next[p.id].history.length > 0 
            ? next[p.id].history[next[p.id].history.length - 1].quality 
            : 0;
          const step = simulateAnytimeStep(p, iter, prevQ);
          step.elapsedMs = (Date.now() - startTimeRef.current) / 1000;
          next[p.id].history = [...next[p.id].history, step];
          next[p.id].currentQuality = step.quality;
          
          // Check convergence
          if (iter > 5 && Math.abs(step.improvement) < 0.002) {
            next[p.id].converged = true;
            next[p.id].plan = generateStudyPlan(p);
          }
        });
        return next;
      });
      iter++;
    }, iterInterval);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    clearInterval(timeRef.current);
    setPhase("config");
    setIsRunning(false);
    setIsComplete(false);
    setStudentData({});
    setCurrentIteration(0);
    setElapsedTime(0);
    setSelectedPlan(null);
  };

  useEffect(() => () => { clearInterval(intervalRef.current); clearInterval(timeRef.current); }, []);

  const CustomTooltip = ({ active, payload, label, color }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "#0A0F1E", border: `1px solid ${color}30`, padding: "8px 12px", borderRadius: 8, fontSize: 11 }}>
          <p style={{ color: "#888", margin: 0 }}>Iter {label}</p>
          <p style={{ color, margin: 0, fontWeight: 700 }}>Q: {(payload[0].value * 100).toFixed(2)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060B18",
      color: "#F1F5F9",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      fontSize: 13,
      overflowX: "hidden"
    }}>
      {/* Animated grid background */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HEADER */}
        <div style={{
          borderBottom: "1px solid rgba(0,212,255,0.15)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(0,212,255,0.03)",
          backdropFilter: "blur(10px)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
              <div style={{
                position: "absolute", inset: -10, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(41,128,185,0.5) 0%, rgba(180,160,40,0.25) 50%, transparent 75%)",
                filter: "blur(8px)"
              }} />
              <img
                src="https://i.imgur.com/placeholder.png"
                onError={e => { e.target.style.display = "none"; }}
                alt=""
                style={{ display: "none" }}
              />
              <CarinaLogoSVG />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "0.06em", color: "#FFFFFF",
                textShadow: "0 0 16px rgba(41,128,185,0.8), 0 0 32px rgba(41,128,185,0.4)" }}>
                CARINA<span style={{ color: "#4DB8E8", fontWeight: 500, fontSize: 16 }}> -10</span>
              </div>
              <div style={{ fontSize: 11, color: "#B0C4D8", letterSpacing: "0.06em", marginTop: 2, fontWeight: 500 }}>
                COGNITIVE ARCHITECTURE · OBJECT LEVEL · ANYTIME ALGORITHM
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {phase === "running" && (
              <>
                <Chip label={`ITER ${currentIteration}/${maxIterations}`} color="#00D4FF" pulse />
                <Chip label={`${elapsedTime}s`} color="#A855F7" />
                <Chip label="PROCESSING" color="#FF6B35" pulse />
              </>
            )}
            {phase === "complete" && <Chip label="✓ CONVERGED" color="#22C55E" />}
            {phase === "config" && <Chip label="READY" color="#64748B" />}
          </div>
        </div>

        <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* CONFIG PANEL */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
            gap: 16,
            padding: 20,
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14
          }}>
            <ConfigField label="MAX ITERATIONS" value={maxIterations} onChange={v => setMaxIterations(Number(v))} min={5} max={50} type="number" disabled={isRunning} />
            <ConfigField label="PROCESSING TIME (s)" value={processingTime} onChange={v => setProcessingTime(Number(v))} min={1} max={10} type="number" disabled={isRunning} />
            <div>
              <div style={{ fontSize: 11, color: "#C8DDEF", letterSpacing: "0.08em", marginBottom: 8, fontWeight: 600 }}>STUDENTS TO PROCESS</div>
              <select
                value={selectedStudents}
                onChange={e => setSelectedStudents(e.target.value)}
                disabled={isRunning}
                style={{
                  width: "100%", padding: "10px 12px",
                  background: "#0D1526", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 8, color: "#F1F5F9", fontSize: 13, fontWeight: 500,
                  cursor: isRunning ? "not-allowed" : "pointer"
                }}
              >
                <option value="0">1 - Valentina Ríos</option>
                <option value="1">2 - Mateo Guerrero</option>
                <option value="2">3 - Isabella Moreno</option>
                <option value="all">Todos simultáneamente (3)</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#C8DDEF", letterSpacing: "0.08em", marginBottom: 8, fontWeight: 600 }}>PREDICTION MODEL</div>
              <select style={{
                width: "100%", padding: "10px 12px",
                background: "#0D1526", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, color: "#F1F5F9", fontSize: 13, fontWeight: 500
              }}>
                <option>Hybrid (Recommended)</option>
                <option>Empirical</option>
                <option>Analytical</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "flex-end" }}>
              {phase !== "running" ? (
                <button onClick={handleRun} style={{
                  padding: "10px 28px",
                  background: "linear-gradient(135deg, #00D4FF, #7C3AED)",
                  border: "none", borderRadius: 8, color: "#fff",
                  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.1em", cursor: "pointer",
                  boxShadow: "0 0 20px rgba(0,212,255,0.3)"
                }}>▶ RUN CARINA</button>
              ) : (
                <button onClick={handleReset} style={{
                  padding: "10px 28px",
                  background: "rgba(255,107,53,0.2)",
                  border: "1px solid rgba(255,107,53,0.4)",
                  borderRadius: 8, color: "#FF6B35",
                  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.1em", cursor: "pointer"
                }}>■ STOP</button>
              )}
              {isComplete && (
                <button onClick={handleReset} style={{
                  padding: "8px 20px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, color: "#B0C4D8",
                  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", fontSize: 11, cursor: "pointer"
                }}>↺ RESET</button>
              )}
            </div>
          </div>

          {/* STUDENT PROFILES OVERVIEW */}
          <div>
            <SectionLabel>STUDENT PROFILES · OBJECT LEVEL INPUT</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${activeProfiles.length}, 1fr)`, gap: 16, marginTop: 12 }}>
              {activeProfiles.map(profile => (
                <StudentCard key={profile.id} profile={profile} data={studentData[profile.id]} isRunning={isRunning} />
              ))}
            </div>
          </div>

          {/* ANYTIME ALGORITHM CHARTS */}
          {(phase === "running" || phase === "complete") && (
            <div>
              <SectionLabel>ANYTIME ALGORITHM · QUALITY CONVERGENCE · OBJECT LEVEL</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${activeProfiles.length}, 1fr)`, gap: 16, marginTop: 12 }}>
                {activeProfiles.map(profile => {
                  const data = studentData[profile.id];
                  if (!data) return null;
                  return (
                    <AnytimeChart key={profile.id} profile={profile} data={data} maxIter={maxIterations} />
                  );
                })}
              </div>
            </div>
          )}

          {/* QUALITY VS TIME CONVERGENCE */}
          {(phase === "running" || phase === "complete") && activeProfiles.length > 1 && (
            <div>
              <SectionLabel>QUALITY VS TIME · CONVERGENCE COMPARISON</SectionLabel>
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14, padding: 24, marginTop: 12
              }}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="iteration" type="number" domain={[0, maxIterations]} stroke="#334155"
                      label={{ value: "Iteration", position: "insideBottom", offset: -5, fill: "#64748B", fontSize: 10 }} />
                    <YAxis domain={[0, 1]} stroke="#334155"
                      tickFormatter={v => `${(v*100).toFixed(0)}%`}
                      label={{ value: "Quality Q(t)", angle: -90, position: "insideLeft", fill: "#64748B", fontSize: 10 }} />
                    <Tooltip formatter={(v, n) => [`${(v*100).toFixed(2)}%`, n]} contentStyle={{ background: "#0A0F1E", border: "1px solid #334155" }} />
                    {activeProfiles.map(p => {
                      const d = studentData[p.id];
                      return d?.history.length > 0 ? (
                        <Line key={p.id} data={d.history} dataKey="quality" name={p.nombre}
                          stroke={p.color} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                      ) : null;
                    })}
                  </LineChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 12 }}>
                  {activeProfiles.map(p => (
                    <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 24, height: 3, background: p.color, borderRadius: 2 }} />
                      <span style={{ color: "#B0C4D8", fontSize: 11 }}>{p.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STUDY PLANS OUTPUT */}
          {phase === "complete" && (
            <div>
              <SectionLabel>OUTPUT · PERSONALIZED STUDY PLANS · T&I COLOMBIA</SectionLabel>
              <div style={{ marginTop: 12 }}>
                {/* Plan Selector */}
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  {activeProfiles.map(profile => {
                    const data = studentData[profile.id];
                    const plan = data?.plan || (isComplete ? generateStudyPlan(profile) : null);
                    return (
                      <button key={profile.id}
                        onClick={() => setSelectedPlan(selectedPlan === profile.id ? null : profile.id)}
                        style={{
                          padding: "10px 20px",
                          background: selectedPlan === profile.id ? `${profile.color}20` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${selectedPlan === profile.id ? profile.color : "rgba(255,255,255,0.08)"}`,
                          borderRadius: 10, color: selectedPlan === profile.id ? profile.color : "#94A3B8",
                          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", fontSize: 12, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 10
                        }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: `${profile.color}30`, color: profile.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700
                        }}>{profile.avatar}</div>
                        {profile.nombre}
                        <span style={{ opacity: 0.6 }}>· {plan?.totalHoras}h</span>
                      </button>
                    );
                  })}
                </div>

                {/* Plan Detail */}
                {selectedPlan && (() => {
                  const profile = STUDENT_PROFILES.find(p => p.id === selectedPlan);
                  const data = studentData[selectedPlan];
                  const plan = data?.plan || generateStudyPlan(profile);
                  return <StudyPlanDetail profile={profile} plan={plan} data={data} />;
                })()}

                {/* All plans summary */}
                {!selectedPlan && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${activeProfiles.length}, 1fr)`,
                    gap: 16
                  }}>
                    {activeProfiles.map(profile => {
                      const data = studentData[profile.id];
                      const plan = data?.plan || generateStudyPlan(profile);
                      const finalQ = data?.currentQuality || 0;
                      return (
                        <div key={profile.id} style={{
                          background: "rgba(255,255,255,0.02)",
                          border: `1px solid ${profile.color}25`,
                          borderRadius: 14, padding: 20
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: `${profile.color}25`, color: profile.color,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 14, fontWeight: 700
                            }}>{profile.avatar}</div>
                            <div>
                              <div style={{ fontWeight: 700, color: "#F1F5F9" }}>{profile.nombre}</div>
                              <div style={{ fontSize: 10, color: "#B0C4D8" }}>{profile.grado} · {profile.estilo}</div>
                            </div>
                          </div>
                          <QualityBar value={finalQ} color={profile.color} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                            <MiniStat label="Unidades" value={plan.unidades.length} />
                            <MiniStat label="Total horas" value={`${plan.totalHoras}h`} />
                            <MiniStat label="Duración" value={`${plan.semanasNecesarias} sem`} />
                            <MiniStat label="Calidad" value={`${(finalQ * 100).toFixed(1)}%`} color={profile.color} />
                          </div>
                          <button onClick={() => setSelectedPlan(profile.id)} style={{
                            marginTop: 14, width: "100%", padding: "8px",
                            background: `${profile.color}15`,
                            border: `1px solid ${profile.color}40`,
                            borderRadius: 8, color: profile.color,
                            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", fontSize: 11, cursor: "pointer"
                          }}>Ver plan completo →</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== SUB COMPONENTS =====================

function Chip({ label, color, pulse }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "5px 12px",
      background: `${color}15`,
      border: `1px solid ${color}40`,
      borderRadius: 20, fontSize: 10, letterSpacing: "0.1em",
      color, fontWeight: 700
    }}>
      {pulse && <div style={{
        width: 6, height: 6, borderRadius: "50%",
        background: color, animation: "pulse 1s infinite",
        boxShadow: `0 0 8px ${color}`
      }} />}
      {label}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.12em", color: "#C8DDEF", fontWeight: 700, whiteSpace: "nowrap" }}>{children}</div>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function ConfigField({ label, value, onChange, min, max, type, disabled }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#C8DDEF", letterSpacing: "0.08em", marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        min={min} max={max} disabled={disabled}
        style={{
          width: "100%", padding: "10px 12px",
          background: "#0D1526", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 8, color: "#F1F5F9", fontSize: 13, fontWeight: 500,
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", boxSizing: "border-box",
          opacity: disabled ? 0.5 : 1
        }}
      />
    </div>
  );
}

function StudentCard({ profile, data, isRunning }) {
  const finalQ = data?.currentQuality || 0;
  const converged = data?.converged;
  const strategy = data?.history?.[data.history.length - 1]?.strategy || "—";

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${converged ? profile.color + "50" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 14, padding: 18,
      transition: "border-color 0.3s",
      boxShadow: converged ? `0 0 20px ${profile.color}10` : "none"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: `linear-gradient(135deg, ${profile.color}40, ${profile.accent}40)`,
          border: `2px solid ${profile.color}60`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700, color: profile.color
        }}>{profile.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 13 }}>{profile.nombre}</div>
          <div style={{ fontSize: 10, color: "#B0C4D8" }}>{profile.id} · {profile.grado} · {profile.edad} años</div>
        </div>
        {converged && <div style={{ fontSize: 16 }}>✓</div>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {[
          { l: "Estilo", v: profile.estilo },
          { l: "NSE", v: profile.nivel_socioeconomico },
          { l: "Tiempo/sem", v: `${profile.tiempo_disponible}h` },
          { l: "Dispositivos", v: profile.dispositivos.length }
        ].map(({ l, v }) => (
          <div key={l} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "6px 8px" }}>
            <div style={{ fontSize: 9, color: "#8899B0", marginBottom: 2 }}>{l}</div>
            <div style={{ fontSize: 11, color: "#E2EBF5" }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 9, color: "#8899B0", marginBottom: 6 }}>OBJETIVOS T&I</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {profile.objetivos.map(obj => (
            <div key={obj} style={{
              padding: "3px 8px", borderRadius: 20,
              background: `${profile.color}15`, color: profile.color,
              fontSize: 9, letterSpacing: "0.05em"
            }}>{CURRICULUM_TI[obj]?.nombre.split(" ")[0]}</div>
          ))}
        </div>
      </div>

      {(isRunning || data?.history?.length > 0) && (
        <>
          <QualityBar value={finalQ} color={profile.color} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 10, color: "#B0C4D8" }}>Strategy: <span style={{ color: profile.color }}>{strategy}</span></span>
            <span style={{ fontSize: 10, color: converged ? "#22C55E" : "#64748B" }}>
              {converged ? "CONVERGED" : "PROCESSING"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

function AnytimeChart({ profile, data }) {
  const history = data?.history || [];
  const converged = data?.converged;
  const finalQ = data?.currentQuality || 0;

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${profile.color}20`,
      borderRadius: 14, padding: 20
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: profile.color }}>{profile.nombre}</div>
          <div style={{ fontSize: 9, color: "#B0C4D8" }}>Anytime Algorithm · Planning Function</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: profile.color }}>{(finalQ * 100).toFixed(1)}%</div>
          <div style={{ fontSize: 9, color: "#B0C4D8" }}>Q(t) Quality</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={history} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <defs>
            <linearGradient id={`grad-${profile.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={profile.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={profile.color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="iteration" stroke="#334155" tick={{ fontSize: 9, fill: "#475569" }} />
          <YAxis domain={[0, 1]} stroke="#334155" tick={{ fontSize: 9, fill: "#475569" }}
            tickFormatter={v => `${(v*100).toFixed(0)}%`} />
          <Tooltip content={<CustomTooltip color={profile.color} />} />
          {converged && <ReferenceLine y={finalQ} stroke={profile.color} strokeDasharray="4 4" opacity={0.5} />}
          <Area type="monotone" dataKey="quality" stroke={profile.color} strokeWidth={2}
            fill={`url(#grad-${profile.id})`} dot={false} activeDot={{ r: 3, fill: profile.color }} />
        </AreaChart>
      </ResponsiveContainer>

      {/* Cost-Benefit Mini */}
      <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { l: "Iter", v: history.length },
          { l: "ΔQ last", v: history.length > 1 ? `${((history[history.length-1]?.improvement || 0)*100).toFixed(3)}%` : "—" },
          { l: "Status", v: converged ? "STOP" : "RUN" }
        ].map(({ l, v }) => (
          <div key={l} style={{
            background: "rgba(255,255,255,0.03)", borderRadius: 6,
            padding: "5px 8px", textAlign: "center"
          }}>
            <div style={{ fontSize: 9, color: "#8899B0" }}>{l}</div>
            <div style={{ fontSize: 11, color: converged && l === "Status" ? "#22C55E" : "#CBD5E1", fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label, color }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0A0F1E", border: `1px solid ${color}30`, padding: "8px 12px", borderRadius: 8, fontSize: 11 }}>
        <p style={{ color: "#888", margin: 0 }}>Iter {label}</p>
        <p style={{ color, margin: 0, fontWeight: 700 }}>Q: {(payload[0].value * 100).toFixed(2)}%</p>
      </div>
    );
  }
  return null;
}

function QualityBar({ value, color }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 9, color: "#8899B0" }}>Quality Q(t)</span>
        <span style={{ fontSize: 9, color }}>{(value * 100).toFixed(1)}%</span>
      </div>
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${value * 100}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          borderRadius: 2, transition: "width 0.3s ease"
        }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "7px 10px" }}>
      <div style={{ fontSize: 10, color: "#8BAAC0", marginBottom: 3, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 13, color: color || "#E2EBF5", fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function StudyPlanDetail({ profile, plan, data }) {
  const finalQ = data?.currentQuality || 0;

  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${profile.color}30`,
      borderRadius: 14, padding: 28,
      boxShadow: `0 0 40px ${profile.color}08`
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: `${profile.color}20`, color: profile.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, fontWeight: 700, border: `2px solid ${profile.color}50`
          }}>{profile.avatar}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9" }}>{profile.nombre}</div>
            <div style={{ fontSize: 11, color: "#B0C4D8" }}>
              {profile.grado} · {profile.estilo} · {profile.nivel_socioeconomico} NSE · Grado {profile.grado}
            </div>
            <div style={{ fontSize: 11, color: "#B0C4D8", marginTop: 2 }}>
              Fortalezas: {profile.fortalezas}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: profile.color }}>{(finalQ * 100).toFixed(1)}%</div>
          <div style={{ fontSize: 10, color: "#B0C4D8" }}>PLAN QUALITY</div>
          <div style={{ fontSize: 12, color: "#B0C4D8", marginTop: 4 }}>{plan.totalHoras}h · {plan.semanasNecesarias} semanas</div>
        </div>
      </div>

      {/* Adaptaciones */}
      {plan.adaptaciones.length > 0 && (
        <div style={{
          background: `${profile.color}08`,
          border: `1px solid ${profile.color}20`,
          borderRadius: 10, padding: 14, marginBottom: 20
        }}>
          <div style={{ fontSize: 10, color: profile.color, letterSpacing: "0.1em", marginBottom: 8, fontWeight: 700 }}>
            ADAPTACIONES PERSONALIZADAS
          </div>
          {plan.adaptaciones.map((a, i) => (
            <div key={i} style={{ fontSize: 11, color: "#B0C4D8", marginBottom: 4 }}>{a}</div>
          ))}
        </div>
      )}

      {/* Unidades */}
      <div style={{ fontSize: 10, color: "#B0C4D8", letterSpacing: "0.12em", marginBottom: 14, fontWeight: 700 }}>
        PLAN DE ESTUDIOS · LINEAMIENTOS CURRICULARES T&I COLOMBIA
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {plan.unidades.map((unidad, idx) => (
          <div key={unidad.id} style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, padding: 18
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: `${profile.color}20`, color: profile.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700
                }}>{idx + 1}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#F1F5F9", fontSize: 13 }}>{unidad.nombre}</div>
                  <div style={{ fontSize: 10, color: "#B0C4D8" }}>
                    Nivel actual: {unidad.nivelActual} → Meta: {unidad.nivelMeta}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{
                  padding: "3px 10px", borderRadius: 20, fontSize: 10,
                  background: unidad.prioridad === "Alta" ? "rgba(239,68,68,0.15)" : unidad.prioridad === "Media" ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)",
                  color: unidad.prioridad === "Alta" ? "#EF4444" : unidad.prioridad === "Media" ? "#EAB308" : "#22C55E",
                  border: `1px solid ${unidad.prioridad === "Alta" ? "#EF444430" : unidad.prioridad === "Media" ? "#EAB30830" : "#22C55E30"}`
                }}>{unidad.prioridad}</div>
                <div style={{ fontSize: 12, color: profile.color, fontWeight: 700 }}>{unidad.horas}h</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 9, color: "#8899B0", marginBottom: 6 }}>EJES TEMÁTICOS</div>
                {unidad.ejes.map(eje => (
                  <div key={eje} style={{
                    fontSize: 10, color: "#B0C4D8", padding: "3px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)"
                  }}>• {eje}</div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 9, color: "#8899B0", marginBottom: 6 }}>RECURSOS ({profile.estilo})</div>
                {unidad.recursos.map(r => (
                  <div key={r} style={{
                    fontSize: 10, color: "#B0C4D8", padding: "3px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)"
                  }}>→ {r}</div>
                ))}
                <div style={{ marginTop: 8, fontSize: 10, color: "#B0C4D8" }}>
                  Modalidad: <span style={{ color: "#B0C4D8" }}>{unidad.modalidad}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}