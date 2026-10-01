/** Skill groups shared by the hero marquee and the Stack section. Labels are i18n keys. */
export const STACK_GROUPS = [
  {
    key: "skills.g1",
    skills: ["Claude", "Qwen", "Llama", "RAG", "BM25 + embeddings", "Qdrant", "QLoRA · DPO", "LLM evals", "LangChain", "Ollama", "Hugging Face"],
  },
  { key: "skills.g2", skills: ["PyTorch", "TensorFlow", "scikit-learn", "Stable-Baselines3", "Gymnasium", "NLP", "OpenCV"] },
  { key: "skills.g3", skills: ["Python", "TypeScript", "SQL", "Java", "C#", "R"] },
  { key: "skills.g4", skills: ["FastAPI", "Spring Boot", "Express", "React", "Next.js", "PostgreSQL / PostGIS", "Redis", "pandas"] },
  { key: "skills.g5", skills: ["MLflow", "Docker", "GitHub Actions", "Terraform", "Prometheus", "Grafana", "nginx"] },
  { key: "skills.g6", skills: ["AWS", "Azure", "Microsoft Fabric", "Power BI", "E2E encryption", "ECDSA", "Trivy"] },
] as const;
