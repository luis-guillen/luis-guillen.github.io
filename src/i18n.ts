import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        about: "About",
        experience: "Experience",
        projects: "Projects",
        skills: "Skills",
        education: "Education",
        contact: "Contact",
        download: "Download CV",
        cv: "CV",
        menu: "Menu",
        close: "Close"
      },
      hero: {
        open: "Open to opportunities",
        location: "Las Palmas de Gran Canaria, Spain",
        subtitle: "AI Engineer · Tech Lead · Machine Learning",
        description: "I design and ship AI systems end to end, from RAG and LLM assistants to reinforcement learning, with the evaluation, MLOps and security that production needs.",
        viewProjects: "View projects",
        phrases: [
          "Building AI that *actually* ships.",
          "RAG systems you can *measure*.",
          "From notebook to *production*.",
          "LLMs with *guardrails*."
        ],
        localTime: "local time",
        photoCaption: "Las Palmas de Gran Canaria · AI Engineer",
        stackLabel: "Working stack",
        talk: "Let's talk",
        scroll: "Scroll",
        metrics: [
          { value: "1+", label: "Years of experience" },
          { value: "100%", label: "RAG Recall@5" },
          { value: "16.7%", label: "RL gain over heuristic" }
        ]
      },
      about: {
        label: "About",
        title: "Engineer first, data scientist second.",
        capabilities: "What I do",
        pipeline: {
          title: "The system around the model",
          data: "Data",
          features: "Features",
          train: "Train",
          serve: "Serve",
          monitor: "Monitor",
          loop: "retrain on drift"
        },
        p1: "I'm an AI engineer and tech lead at Reker Tech Solutions, where I build custom platforms for industrial, logistics and healthcare clients, from the first requirements meeting to production. My focus is applied AI: RAG systems that cite their sources, LLM assistants with guardrails, and reinforcement learning agents backed by a proper MLOps lifecycle.",
        p2: "I believe the hardest part of AI isn't the model. It's everything around it: evaluation, monitoring, security and the people who will use it. That's why everything I ship comes with a test set and numbers I can defend.",
        cards: {
          c1_title: "LLM & RAG systems",
          c1_desc: "Retrieval pipelines, hybrid search and assistants that cite their sources, measured against a golden set before they reach users.",
          c2_title: "Fine-tuning & evaluation",
          c2_desc: "QLoRA and DPO fine-tuning, model comparisons on quality and latency, and the discipline to keep the baseline when it wins.",
          c3_title: "MLOps & deployment",
          c3_desc: "Model registries with promotion gates, drift detection, continuous training, Docker, Terraform and CI/CD with security scanning.",
          c4_title: "Technical leadership",
          c4_desc: "Turning client requirements into architecture, leading delivery to production, and designing for security and compliance (GDPR, NIS2, EU AI Act) from day one."
        }
      },
      experience: {
        label: "Experience",
        items: [
          {
            role: "Tech Lead & AI Engineer", company: "Reker Tech Solutions", period: "Jul 2026 — Present", type: "Full-time · Hybrid", bullets: [
              "Lead the architecture and delivery of custom platforms for industrial, logistics and healthcare clients, from requirements to production.",
              "Built SafeWork AI, a GenAI compliance platform piloted with three companies: a switchable LLM layer (Claude, Groq, Ollama), hybrid RAG, guardrails and a 22-scenario evaluation harness. Semifinalist at the NTT DATA Foundation eAwards 2026.",
              "Fine-tuned a 4B Qwen model with QLoRA and DPO, cutting median latency from 18.1 s to 0.9 s, and kept the hosted model when the evaluation showed a recall gap.",
              "Shipped a surgical-logistics platform now in daily use by a Canary Islands hospital supplier, and am building a continuous threat-exposure platform aligned with NIS2."
            ]
          },
          {
            role: "Junior Software Developer", company: "Icod Systems", period: "May 2025 — Jul 2026", type: "Full-time · Hybrid", bullets: [
              "Applied open LLMs (TinyLlama, Zephyr) to intelligent document classification, with documents stored in AWS S3 and inference integrated into the company's microservices.",
              "Developed Java/Spring Boot services for document management and classification, packaged with Docker.",
              "Led the internal pilot of an AI workflow-automation platform similar to n8n."
            ]
          },
          {
            role: "Data Science Intern", company: "Astican (shipyard)", period: "Oct 2024 — Dec 2024", type: "Internship", bullets: [
              "Built Power BI dashboards on SQL Server (Microsoft Fabric) to monitor operational KPIs in real time.",
              "Automated data workflows with Power Apps and produced analysis reports with Python and Excel."
            ]
          }
        ]
      },
      projects: {
        label: "Featured work",
        more: "More work",
        problem: "Problem",
        impact: "Impact",
        code: "Code",
        demo: "Live",
        caseStudy: "Case study",
        preview: "Preview",
        mockups: {
          p1: "Interface preview: a heritage web page is scanned, the matching passages are highlighted and the assistant answers with citations.",
          p2: "Dashboard preview: reward per episode for the PPO agent against the nearest-ETA baseline, and a feed of driver assignments ranked by urgency.",
          p3: "Interface preview: an encrypted report with its chain-of-custody log, and the assistant answering a legal question with citations.",
          p4: "Preview: a control plane connected to on-premise scanning sensors.",
          p5: "Preview: a weekly surgery schedule with material deliveries.",
          p6: "Preview: a search query with results ranked by relevance."
        },
        p1: { title: "RAG Canarias: the islands' heritage, with sources", status: "BSc thesis", problem: "Information about Canarian cultural heritage is spread across many websites, and a chatbot rarely tells you where its answer comes from.", description: "My BSc thesis. A crawler that respects robots.txt collects and cleans the sources, multilingual E5 embeddings index them in Qdrant, and a FastAPI service answers with citations. An automated set of 50 questions measures retrieval quality, and I compared a remote 30B model with a local 4B one: 2.7 s against 26 s, with the same retrieval quality.", impact: "100% Recall@5 · MRR 0.82" },
        p2: { title: "City2Cruise: a reinforcement learning dispatcher for the port", status: "MSc thesis", problem: "Cruise passengers only spend a few hours in port, so every late pickup counts, and the usual 'nearest driver' rule leaves room to improve.", description: "My MSc thesis, developed at Reker. A PPO agent trained with behaviour cloning and fine-tuning assigns drivers to pickups. It runs behind an MLflow registry with a promotion gate, drift detection, continuous training and an EU AI Act model card, and each parcel's custody is recorded in a permissioned, blockchain-style ledger.", impact: "+16.7% vs. heuristic · −31.7% missed deadlines" },
        p3: { title: "SafeWork AI: confidential reporting with an AI assistant", status: "pilot", problem: "Spanish companies with 50 or more employees must offer a confidential reporting channel (Law 2/2023), and harassment cases need careful, well-documented handling.", description: "Built at Reker. Reports are encrypted end to end in the browser, case files keep a verifiable chain of custody, and an assistant answers with hybrid RAG, guardrails and a switchable LLM layer (Claude, Groq, Ollama). A 22-scenario golden set compares the models, including my QLoRA + DPO fine-tune of Qwen 4B.", impact: "Piloted with 3 companies · eAwards 2026 semifinalist" },
        p4: { title: "Continuous threat-exposure platform", impact: "406 automated tests" },
        p5: { title: "Surgical-logistics platform for a hospital supplier", impact: "In daily use" },
        p6: { title: "Search engine over Project Gutenberg", impact: "Inverted + metadata index" }
      },
      skills: {
        label: "Technical Stack",
        g1: "Generative AI & LLMs",
        g2: "Machine Learning",
        g3: "Programming",
        g4: "Backend & Data",
        g5: "MLOps & Deployment",
        g6: "Cloud & Security"
      },
      education: {
        label: "Education",
        credentials: "Credentials",
        thesis: "Thesis",
        coursework: "Coursework",
        items: {
          e1_degree: "MSc in Artificial Intelligence",
          e1_school: "UNIR — Universidad Internacional de La Rioja",
          e1_period: "Oct 2025 — Present",
          e1_coursework: "Machine learning, NLP, computer vision and big data with Python, TensorFlow, Azure and AWS",
          e1_thesis: "City2Cruise: a reinforcement learning dispatcher with production MLOps",
          e2_degree: "BSc in Data Science and Engineering",
          e2_school: "ULPGC — Universidad de Las Palmas de Gran Canaria",
          e2_period: "Sep 2020 — Jun 2026",
          e2_coursework: "Machine learning, big data, data analysis and software engineering",
          e2_thesis: "RAG Canarias: question answering over cultural-heritage sources",
          e3_degree: "Erasmus exchange, MSc Artificial Intelligence programme",
          e3_school: "University of Bologna, Italy",
          e3_period: "Oct 2022 — Jul 2023"
        }
      },
      certifications: {
        label: "Certifications",
        c1: "Generative AI Fundamentals",
        c2: "Architecting Solutions on AWS",
        c3: "Cambridge C1 Advanced"
      },
      achievements: {
        label: "Highlights",
        items: {
          award: "Semifinalist at the NTT DATA Foundation eAwards Spain 2026 with SafeWork AI.",
          publication: "\"La adopción de la inteligencia artificial en PYMEs\" (AI adoption in Spanish SMEs), Tax Legal Advisory Review, 2024.",
          languages: "Spanish (native) · English (C1, Cambridge Advanced) · French (B1) · German (B1) · Italian (A2)",
          debate: "Took part in the Spanish University STEM Debate League (Cátedras Telefónica), 2022."
        }
      },
      footer: {
        backToTop: "Back to top",
        localTime: "Local time",
        built: "Designed and built by Luis Guillén"
      },
      contact: {
        label: "Contact",
        title: "Let's build together.",
        direct: "Or write to me directly",
        elsewhere: "Elsewhere",
        hint: "Opens your email client with the message pre-filled.",
        desc: "Whether you're hiring or have a project in mind, I'd love to hear from you.",
        form: {
          name: "Name",
          email: "Email",
          message: "Message",
          submit: "Send Message",
          sending: "Sending..."
        }
      }
    }
  },
  es: {
    translation: {
      nav: {
        about: "Sobre mí",
        experience: "Experiencia",
        projects: "Proyectos",
        skills: "Tecnologías",
        education: "Formación",
        contact: "Contacto",
        download: "Descargar CV",
        cv: "CV",
        menu: "Menú",
        close: "Cerrar"
      },
      hero: {
        open: "Abierto a oportunidades",
        location: "Las Palmas de Gran Canaria, España",
        subtitle: "AI Engineer · Tech Lead · Machine Learning",
        description: "Diseño y llevo a producción sistemas de IA de principio a fin, desde RAG y asistentes con LLM hasta aprendizaje por refuerzo, con la evaluación, el MLOps y la seguridad que exige un entorno real.",
        viewProjects: "Ver proyectos",
        phrases: [
          "Construyo IA que *de verdad* llega a producción.",
          "Sistemas RAG que se pueden *medir*.",
          "Del notebook a *producción*.",
          "LLM con *salvaguardas*."
        ],
        localTime: "hora local",
        photoCaption: "Las Palmas de Gran Canaria · Ingeniero de IA",
        stackLabel: "Stack de trabajo",
        talk: "Hablemos",
        scroll: "Scroll",
        metrics: [
          { value: "1+", label: "Años de experiencia" },
          { value: "100 %", label: "Recall@5 del RAG" },
          { value: "16,7 %", label: "Mejora del agente RL" }
        ]
      },
      about: {
        label: "Sobre mí",
        title: "Primero ingeniero, después científico de datos.",
        capabilities: "Qué hago",
        pipeline: {
          title: "El sistema alrededor del modelo",
          data: "Datos",
          features: "Variables",
          train: "Entreno",
          serve: "Servicio",
          monitor: "Monitorización",
          loop: "reentreno ante drift"
        },
        p1: "Soy ingeniero de IA y tech lead en Reker Tech Solutions, donde desarrollo plataformas a medida para clientes industriales, logísticos y sanitarios, desde la primera reunión de requisitos hasta la puesta en producción. Me centro en la IA aplicada: sistemas RAG que citan sus fuentes, asistentes con LLM y salvaguardas, y agentes de aprendizaje por refuerzo respaldados por un ciclo MLOps completo.",
        p2: "Creo que lo difícil de la IA no es el modelo, sino todo lo que lo rodea: la evaluación, la monitorización, la seguridad y las personas que lo van a usar. Por eso todo lo que entrego viene con su conjunto de pruebas y con cifras que puedo defender.",
        cards: {
          c1_title: "Sistemas con LLM y RAG",
          c1_desc: "Pipelines de recuperación, búsqueda híbrida y asistentes que citan sus fuentes, evaluados con un conjunto de referencia antes de llegar a los usuarios.",
          c2_title: "Fine-tuning y evaluación",
          c2_desc: "Fine-tuning con QLoRA y DPO, comparación de modelos por calidad y latencia, y el criterio de quedarse con el modelo base cuando es mejor.",
          c3_title: "MLOps y despliegue",
          c3_desc: "Registro de modelos con criterios de promoción, detección de drift, reentrenamiento continuo, Docker, Terraform y CI/CD con análisis de seguridad.",
          c4_title: "Liderazgo técnico",
          c4_desc: "Convierto los requisitos del cliente en arquitectura, lidero la entrega hasta producción y diseño pensando en la seguridad y el cumplimiento (RGPD, NIS2, Reglamento de IA) desde el primer día."
        }
      },
      experience: {
        label: "Experiencia",
        items: [
          {
            role: "Tech Lead e Ingeniero de IA", company: "Reker Tech Solutions", period: "jul. 2026 — actualidad", type: "Jornada completa · Híbrido", bullets: [
              "Lidero la arquitectura y la entrega de plataformas a medida para clientes industriales, logísticos y sanitarios, desde los requisitos hasta producción.",
              "He creado SafeWork AI, una plataforma de cumplimiento normativo con IA generativa que se ha probado en tres empresas: capa de LLM intercambiable (Claude, Groq, Ollama), RAG híbrido, salvaguardas y un banco de evaluación con 22 escenarios. Fue semifinalista en los eAwards 2026 de la Fundación NTT DATA.",
              "Hice fine-tuning de un modelo Qwen de 4B con QLoRA y DPO y bajé la latencia mediana de 18,1 s a 0,9 s; mantuve el modelo alojado porque la evaluación mostró una pérdida de recall.",
              "He puesto en marcha una plataforma de logística quirúrgica que ya usa a diario un distribuidor hospitalario de Canarias, y estoy desarrollando una plataforma de gestión continua de la exposición a amenazas alineada con NIS2."
            ]
          },
          {
            role: "Desarrollador de Software Junior", company: "Icod Systems", period: "may. 2025 — jul. 2026", type: "Jornada completa · Híbrido", bullets: [
              "Apliqué LLM abiertos (TinyLlama, Zephyr) a la clasificación inteligente de documentos, con almacenamiento en AWS S3 e inferencia integrada en los microservicios de la empresa.",
              "Desarrollé servicios en Java/Spring Boot para la gestión y clasificación de documentos, desplegados con Docker.",
              "Lideré el piloto interno de una plataforma de automatización de procesos con IA, similar a n8n."
            ]
          },
          {
            role: "Científico de Datos en prácticas", company: "Astican (astillero)", period: "oct. 2024 — dic. 2024", type: "Prácticas", bullets: [
              "Creé cuadros de mando en Power BI sobre SQL Server (Microsoft Fabric) para seguir los KPI operativos en tiempo real.",
              "Automaticé flujos de datos con Power Apps y preparé informes de análisis con Python y Excel."
            ]
          }
        ]
      },
      projects: {
        label: "Proyectos",
        more: "Más proyectos",
        problem: "Problema",
        impact: "Impacto",
        code: "Código",
        demo: "Demo",
        caseStudy: "Caso de estudio",
        preview: "Vista previa",
        mockups: {
          p1: "Vista de la interfaz: se analiza una web de patrimonio, se resaltan los pasajes relevantes y el asistente responde citando las fuentes.",
          p2: "Vista del panel: recompensa por episodio del agente PPO frente a la heurística de menor ETA, y una lista de asignaciones de conductores ordenadas por urgencia.",
          p3: "Vista de la interfaz: una denuncia cifrada con su registro de cadena de custodia, y el asistente respondiendo una consulta legal con citas.",
          p4: "Vista previa: un plano de control conectado a sensores de escaneo instalados en el cliente.",
          p5: "Vista previa: una agenda semanal de cirugías con las entregas de material.",
          p6: "Vista previa: una búsqueda con resultados ordenados por relevancia."
        },
        p1: { title: "RAG Canarias: el patrimonio de las islas, con fuentes", status: "TFG", problem: "La información sobre el patrimonio cultural canario está repartida entre muchas webs, y un chatbot rara vez te dice de dónde sale su respuesta.", description: "Mi TFG. Un crawler que respeta robots.txt recoge y limpia las fuentes, los embeddings multilingües E5 las indexan en Qdrant y un servicio en FastAPI responde citándolas. Un banco automático de 50 preguntas mide la calidad de la recuperación, y comparé un modelo remoto de 30B con uno local de 4B: 2,7 s frente a 26 s, con la misma calidad.", impact: "100 % Recall@5 · MRR 0,82" },
        p2: { title: "City2Cruise: un despachador con aprendizaje por refuerzo para el puerto", status: "TFM", problem: "Los cruceristas pasan pocas horas en el puerto, así que cada recogida tardía cuenta, y la regla habitual del «conductor más cercano» deja margen de mejora.", description: "Mi TFM, desarrollado en Reker. Un agente PPO, entrenado con behaviour cloning y fine-tuning, asigna conductores a las recogidas. Funciona con un registro de modelos en MLflow con criterio de promoción, detección de drift, reentrenamiento continuo y una model card según el Reglamento de IA de la UE, y la custodia de cada paquete queda anotada en un registro permisionado de tipo blockchain.", impact: "+16,7 % frente a la heurística · −31,7 % de entregas fuera de plazo" },
        p3: { title: "SafeWork AI: canal de denuncias confidencial con asistente de IA", status: "piloto", problem: "Las empresas españolas con 50 o más trabajadores deben tener un canal de denuncias confidencial (Ley 2/2023), y los casos de acoso exigen un trato cuidadoso y bien documentado.", description: "Desarrollado en Reker. Las denuncias se cifran de extremo a extremo en el navegador, los expedientes mantienen una cadena de custodia verificable y un asistente responde con RAG híbrido, salvaguardas y una capa de LLM intercambiable (Claude, Groq, Ollama). Un conjunto de referencia de 22 escenarios compara los modelos, incluido mi fine-tuning de Qwen 4B con QLoRA y DPO.", impact: "Piloto en 3 empresas · semifinalista eAwards 2026" },
        p4: { title: "Plataforma de gestión de la exposición a amenazas", impact: "406 tests automatizados" },
        p5: { title: "Plataforma de logística quirúrgica para un distribuidor hospitalario", impact: "En uso diario" },
        p6: { title: "Buscador sobre el Proyecto Gutenberg", impact: "Índice invertido y de metadatos" }
      },
      skills: {
        label: "Tecnologías",
        g1: "IA generativa y LLM",
        g2: "Machine learning",
        g3: "Programación",
        g4: "Backend y datos",
        g5: "MLOps y despliegue",
        g6: "Nube y seguridad"
      },
      education: {
        label: "Estudios",
        credentials: "Formación",
        thesis: "Trabajo final",
        coursework: "Contenidos",
        items: {
          e1_degree: "Máster Universitario en Inteligencia Artificial",
          e1_school: "UNIR — Universidad Internacional de La Rioja",
          e1_period: "oct. 2025 — actualidad",
          e1_coursework: "Machine learning, PLN, visión por computador y big data con Python, TensorFlow, Azure y AWS",
          e1_thesis: "City2Cruise: un despachador con aprendizaje por refuerzo y MLOps en producción",
          e2_degree: "Grado en Ciencia e Ingeniería de Datos",
          e2_school: "ULPGC — Universidad de Las Palmas de Gran Canaria",
          e2_period: "sept. 2020 — jun. 2026",
          e2_coursework: "Machine learning, big data, análisis de datos e ingeniería del software",
          e2_thesis: "RAG Canarias: respuesta a preguntas sobre fuentes de patrimonio cultural",
          e3_degree: "Erasmus, programa de Máster en Inteligencia Artificial",
          e3_school: "Universidad de Bolonia, Italia",
          e3_period: "oct. 2022 — jul. 2023"
        }
      },
      certifications: {
        label: "Certificaciones",
        c1: "Generative AI Fundamentals",
        c2: "Architecting Solutions on AWS",
        c3: "Cambridge C1 Advanced"
      },
      achievements: {
        label: "Destacados",
        items: {
          award: "Semifinalista en los eAwards España 2026 de la Fundación NTT DATA con SafeWork AI.",
          publication: "«La adopción de la inteligencia artificial en PYMEs», Tax Legal Advisory Review, 2024.",
          languages: "Español (nativo) · inglés (C1, Cambridge Advanced) · francés (B1) · alemán (B1) · italiano (A2)",
          debate: "Participé en la Liga Española de Debate Universitario STEM de las Cátedras Telefónica, 2022."
        }
      },
      footer: {
        backToTop: "Volver arriba",
        localTime: "Hora local",
        built: "Diseñado y desarrollado por Luis Guillén"
      },
      contact: {
        label: "Contacto",
        title: "Construyamos juntos.",
        direct: "O escríbeme directamente",
        elsewhere: "También en",
        hint: "Abre tu cliente de correo con el mensaje ya redactado.",
        desc: "Si buscas a alguien para tu equipo o tienes un proyecto en mente, escríbeme.",
        form: {
          name: "Nombre",
          email: "Correo",
          message: "Mensaje",
          submit: "Enviar mensaje",
          sending: "Enviando..."
        }
      }
    }
  }
};

const systemLanguage = typeof window !== 'undefined' ? navigator.language.split("-")[0] : "en";
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem("app_lang") : null;
const defaultLanguage = savedLanguage || (["es", "en"].includes(systemLanguage) ? systemLanguage : "en");

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;
