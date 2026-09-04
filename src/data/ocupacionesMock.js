const ocupacionesMock = [
  {
    id: "cno-0211",
    clasificacion: "CNO",
    codigo: "0211",
    nombre: "Gerentes de ingeniería",
    descripcion:
      "Dirigen y coordinan las actividades de ingeniería de una organización o unidad de negocio.",
    nivel: "Directivo",
    areaDesempeno: "Ingeniería y tecnología",
    funciones: [
      {
        codigo: "F-0211.01",
        descripcion: "Planear y supervisar proyectos de ingeniería.",
      },
      {
        codigo: "F-0211.02",
        descripcion: "Coordinar equipos técnicos y administrar recursos.",
      },
    ],
    habilidades: ["Liderazgo", "Planeación", "Toma de decisiones"],
    conocimientos: ["Gestión de proyectos", "Ingeniería", "Presupuestos"],
    denominaciones: ["Director de ingeniería", "Jefe de ingeniería"],
    relaciones: ["Ingenieros de proyectos", "Coordinadores de ingeniería"],
  },
  {
    id: "cno-2511",
    clasificacion: "CNO",
    codigo: "2511",
    nombre: "Analistas de sistemas",
    descripcion:
      "Analizan las necesidades de información y diseñan soluciones para los sistemas de una organización.",
    nivel: "Profesional",
    areaDesempeno: "Tecnologías de la información",
    funciones: [
      {
        codigo: "F-2511.01",
        descripcion: "Analizar requerimientos funcionales y técnicos.",
      },
      {
        codigo: "F-2511.02",
        descripcion: "Documentar y validar soluciones de sistemas.",
      },
    ],
    habilidades: ["Análisis", "Comunicación", "Modelado de procesos"],
    conocimientos: ["Análisis de sistemas", "Bases de datos", "Metodologías ágiles"],
    denominaciones: ["Analista funcional", "Analista de requerimientos"],
    relaciones: ["Desarrolladores de software", "Arquitectos de sistemas"],
  },
  {
    id: "cno-3312",
    clasificacion: "CNO",
    codigo: "3312",
    nombre: "Técnicos en soporte de tecnologías de la información",
    descripcion:
      "Brindan asistencia técnica a usuarios y mantienen la operación básica de equipos y sistemas informáticos.",
    nivel: "Técnico",
    areaDesempeno: "Tecnologías de la información",
    funciones: [
      {
        codigo: "F-3312.01",
        descripcion: "Atender incidentes de hardware y software.",
      },
    ],
    habilidades: ["Servicio al usuario", "Diagnóstico", "Organización"],
    conocimientos: ["Sistemas operativos", "Redes", "Mantenimiento informático"],
    denominaciones: ["Técnico de mesa de ayuda", "Técnico de soporte"],
    relaciones: ["Administradores de redes", "Analistas de sistemas"],
  },
  {
    id: "cuoc-251101",
    clasificacion: "CUOC",
    codigo: "251101",
    nombre: "Analista de aplicaciones informáticas",
    descripcion:
      "Examina el funcionamiento de aplicaciones informáticas y propone mejoras de acuerdo con las necesidades del usuario.",
    nivel: "Profesional",
    areaDesempeno: "Tecnologías de la información",
    funciones: [
      {
        codigo: "F-251101.01",
        descripcion: "Evaluar el comportamiento de aplicaciones informáticas.",
      },
    ],
    habilidades: ["Pensamiento analítico", "Pruebas de software", "Documentación"],
    conocimientos: ["Aplicaciones informáticas", "Calidad de software", "Requerimientos"],
    denominaciones: ["Analista de aplicaciones", "Analista de software"],
    relaciones: ["Analistas de sistemas", "Probadores de software"],
  },
  {
    id: "cuoc-351201",
    clasificacion: "CUOC",
    codigo: "351201",
    nombre: "Técnico de redes informáticas",
    descripcion:
      "Instala, configura y brinda soporte a redes informáticas y a sus dispositivos de comunicación.",
    nivel: "Técnico",
    areaDesempeno: "Tecnologías de la información",
    funciones: [
      {
        codigo: "F-351201.01",
        descripcion: "Configurar dispositivos y servicios de red.",
      },
    ],
    habilidades: ["Resolución de problemas", "Trabajo bajo presión", "Precisión"],
    conocimientos: ["Redes LAN", "Protocolos de comunicación", "Seguridad de redes"],
    denominaciones: ["Técnico de comunicaciones", "Técnico de conectividad"],
    relaciones: ["Técnicos de soporte", "Administradores de redes"],
  },
  {
    id: "cuoc-3512012",
    clasificacion: "CUOC",
    codigo: "3512012",
    nombre: "Técnico de redes",
    descripcion:
      "Instala, configura y brinda soporte a redes informáticas y a sus dispositivos de comunicación.",
    nivel: "Técnico",
    areaDesempeno: "Tecnologías de la información",
    funciones: [
      {
        codigo: "F-351201.01",
        descripcion: "Configurar dispositivos y servicios de red.",
      },
    ],
    habilidades: ["Resolución de problemas", "Trabajo bajo presión", "Precisión"],
    conocimientos: ["Redes LAN", "Protocolos de comunicación", "Seguridad de redes"],
    denominaciones: ["Técnico de comunicaciones", "Técnico de conectividad"],
    relaciones: ["Técnicos de soporte", "Administradores de redes"],
  },
];

export default ocupacionesMock;
