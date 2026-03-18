# 🕺 DANCEHUB - Comunidade de Dança Urbana

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6)

> **"Unindo a cena urbana portuguesa, um passo de cada vez."**

## 📋 Sobre o Projeto

O **DANCEHUB** é uma plataforma centralizadora para a comunidade de dança urbana em Portugal. O objetivo é conectar artistas, organizadores e o público geral num ecossistema digital único e intuitivo.

### 🚩 O Problema
Atualmente, a cena urbana em Portugal encontra-se fragmentada:
* **Promoção:** Artistas não têm um portfólio centralizado.
* **Descoberta:** Organizadores têm dificuldade em encontrar novos talentos.
* **Divulgação:** Battles e workshops perdem-se em grupos de WhatsApp ou stories de Instagram.
* **Opacidade:** Falta de transparência em preços e condições de participação.

### 💡 A Solução
Um hub central onde:
* 🎯 **Artistas:** Criam perfis profissionais, definem preços e gerem o seu portfólio.
* 🎪 **Organizadores:** Criam e gerem eventos, battles e workshops com facilidade.
* 👥 **Público:** Descobre a agenda cultural urbana da sua cidade.

---

## 🚀 Funcionalidades

### ✅ Implementadas
- [x] **Autenticação:** Sistema completo via email (Supabase Auth).
- [x] **Gestão de Perfis:** Distinção entre utilizador comum, artista e organizador.
- [x] **Feed da Comunidade:** Mural interativo para atualizações.
- [x] **Onboarding:** Fluxo personalizado para novos perfis profissionais.
- [x] **Perfis Públicos:** Visualização dinâmica via `/profile/[id]`.

### 🏗️ Em Desenvolvimento
- [ ] **Sistema de Brackets:** Gestão automática de chaves para battles.
- [ ] **Inscrições Online:** Pagamento e reserva de lugar em workshops.
- [ ] **Ratings & Reviews:** Sistema de feedback para eventos e artistas.
- [ ] **Calendário Interativo:** Filtro de eventos por cidade e estilo.

---

## 🛠️ Stack Tecnológica

| Componente | Tecnologia |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router) |
| **Estilização** | Tailwind CSS |
| **Backend/DB** | Supabase (Auth, DB, Storage) |
| **Linguagem** | TypeScript |
| **Deploy** | Vercel |

---

## 📁 Estrutura do Projeto

```text
dancehub/
├── app/
│   ├── artists/          # Listagem de profissionais
│   ├── events/           # Hub de eventos e competições
│   ├── feed/             # Timeline da comunidade
│   ├── login/ /register/ # Fluxos de acesso
│   ├── profile/          # Gestão e visualização de perfis
│   ├── onboarding/       # Setup de conta (artista/org)
│   └── choose-role/      # Seleção de tipo de conta
├── components/           # Componentes UI reutilizáveis
├── lib/                  # Configurações (Supabase client, etc)
└── public/               # Assets e imagens estáticas
```

---

## 🎯 Diferenciais

* **🇵🇹 Foco em Portugal:** Curadoria específica para cidades como Lisboa, Porto, Coimbra, Faro e Braga.
* **💰 Transparência:** Preços de workshops e participações visíveis antes da inscrição.
* **🎨 UI Clean:** Experiência focada no conteúdo, sem distrações desnecessárias.
* **📱 Mobile First:** Otimizado para ser usado no telemóvel.

---

## 🚦 Como Correr o Projeto

```bash
 1. Clonar o repositório
git clone https://github.com/teu-repo/dancehub.git

 2. Instalar dependências
npm install

 3. Configurar variáveis de ambiente
cp .env.local.example .env.local

 4. Correr em desenvolvimento
npm run dev
```

---

## 📊 Modelo de Dados (Preview)

```sql
-- Perfis de Utilizador
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  artistic_name text,
  current_location text,
  user_type text CHECK (user_type IN ('user', 'artist', 'organizer')),
  PRIMARY KEY (id)
);
```

---

## 🤝 Como Contribuir

1. Faz **fork** do projeto.
2. Cria uma **branch** (`git checkout -b feature/nova-feature`).
3. Faz **commit** (`git commit -m 'feat: add nova funcionalidade'`).
4. **Push** (`git push origin feature/nova-feature`).
5. Abre um **Pull Request**.

---

## 👥 Autores

* **Zé** - *Desenvolvedor Full-stack & B-boy*

---

## 📝 Licença

Este projeto está sob a licença MIT.

---
⭐ **Dá uma estrela ao projeto se achaste interessante!**
