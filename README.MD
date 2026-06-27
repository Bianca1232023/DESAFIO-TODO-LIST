# Desafio TodoList — Trabalho Final DevOps

Projeto original (pré-DevOps): https://github.com/Bianca1232023/DESAFIO-TODO-LIST/tree/main

Este repositório aplica toda a camada de infraestrutura e DevOps sobre a aplicação TodoList original, composta por uma API backend (Node.js), uma interface frontend (React) e um banco de dados PostgreSQL.

---

## 1. APIs

### API 1 — Backend (Node.js / Express)

**Responsabilidade:** Gerencia o domínio de tarefas (tasks). Expõe uma API REST que permite criar, listar, atualizar e deletar tarefas, persistindo os dados em um banco PostgreSQL.

**Linguagem / Runtime:** Node.js 20 (ESM), Express 5, pg 8

**Porta:** `3000`

**Rotas:**

| Método | Rota         | Descrição                              |
|--------|--------------|----------------------------------------|
| GET    | `/tasks`     | Retorna todas as tarefas               |
| POST   | `/task`      | Cria uma nova tarefa                   |
| PUT    | `/task/:id`  | Atualiza descrição e status da tarefa  |
| DELETE | `/task/:id`  | Remove uma tarefa pelo ID              |

**Corpo esperado (POST / PUT):**
```json
{
  "description": "Estudar Kubernetes",
  "completed": false
}
```

**Variáveis de ambiente:**

| Variável      | Padrão      | Descrição              |
|---------------|-------------|------------------------|
| `DB_HOST`     | `localhost` | Host do PostgreSQL     |
| `DB_PORT`     | `5432`      | Porta do PostgreSQL    |
| `DB_NAME`     | `todolist`  | Nome do banco          |
| `DB_USER`     | `postgres`  | Usuário do banco       |
| `DB_PASSWORD` | —           | Senha do banco         |

**Infraestrutura aplicada:**
- Dockerfile multi-stage (`infra/apis/backend/Dockerfile`)
- Imagem publicada no Docker Hub: `bianca1232023/api-backend:latest`
- Deploy via Ansible (`deploy-docker.yml`) em VM Azure (EC2 equivalente)

---

### API 2 — Frontend (React / Vite)

**Responsabilidade:** Interface web da aplicação TodoList. Consome a API Backend para exibir, adicionar, marcar como concluída e remover tarefas. Servida via nginx em produção.

**Linguagem / Runtime:** TypeScript, React 19, Vite 6, nginx (Alpine)

**Porta:** `80` (nginx)

**Rotas (SPA — client-side):**

| Caminho | Descrição                         |
|---------|-----------------------------------|
| `/`     | Página principal com lista de tarefas |

**Infraestrutura aplicada:**
- Dockerfile multi-stage com build Vite + nginx (`infra/apis/frontend/Dockerfile`)
- Imagem publicada no Docker Hub: `bianca1232023/api-frontend:latest`
- Deploy no Kubernetes via `infra/kubernetes/deployment.yaml` (2 réplicas, RollingUpdate)

---

## Banco de Dados

**PostgreSQL 16** — provisionado via Terraform (`azurerm_postgresql_flexible_server`) e replicado no Kubernetes via StatefulSet (`statefulset-primary.yaml` + `statefulset-secondary.yaml`).

---

## Estrutura do Projeto

```
infra/
├── apis/
│   ├── backend/          # API 1 — Node.js/Express
│   └── frontend/         # API 2 — React/Vite + nginx
├── gateway/              # Configuração do API Gateway (Azure APIM)
├── kubernetes/           # Manifestos K8s (Deployment, Service, Ingress, HPA, etc.)
├── terraform/            # IaC Azure (compute, network, database, storage, kubernetes, gateway)
├── ansible/              # Playbooks de deploy (Docker e Kubernetes)
└── .github/workflows/    # Pipeline CI/CD (GitHub Actions)
```

---

## Pipeline CI/CD

O pipeline (`.github/workflows/pipeline.yml`) executa na branch `main`:

1. **Testes unitários** — Jest (backend) + Vitest (frontend)
2. **SonarQube** — Quality Gate em container local
3. **Segurança (SAST)** — Trivy scan do código-fonte
4. **Build e Push** — Imagens Docker para o Docker Hub
5. **Deploy** — Ansible: `deploy-docker.yml` (backend na VM) + `deploy-k8s.yml` (frontend no K8s)
6. **DAST** — OWASP ZAP Baseline contra o gateway
7. **Notificação** — Resumo do resultado de todos os jobs
