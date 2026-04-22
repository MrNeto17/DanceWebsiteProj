# 🕺 DANCEHUB — Urban Dance Community

[![CI](https://github.com/MrNeto17/DanceWebsiteProj/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/MrNeto17/DanceWebsiteProj/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)](https://dancehub.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

> **"Bringing the Portuguese urban scene together, one step at a time."**

🔗 **Live Demo:** [dancehub.vercel.app](https://dance-website-proj.vercel.app/) *(MOCKUP: replace with your real Vercel URL)*

---

---

## 📋 About the Project

**DANCEHUB** is a centralized platform for the urban dance community in Portugal. The goal is to connect artists, event organizers, and the general public in a single, intuitive digital ecosystem.

### 🚩 The Problem
The Portuguese urban dance scene is fragmented:
- **Promotion:** Artists have no centralized portfolio.
- **Discovery:** Organizers struggle to find new talent.
- **Visibility:** Battles and workshops get lost in WhatsApp groups and Instagram stories.
- **Opacity:** Lack of transparency around pricing and participation terms.

### 💡 The Solution
A central hub where:
- 🎯 **Artists** create professional profiles, set prices, and manage their portfolio.
- 🎪 **Organizers** create and manage events, battles, and workshops.
- 👥 **The public** discovers the urban cultural agenda in their city.

---

## 🚀 Features

### ✅ Shipped
- [x] **Authentication** via email (Supabase Auth)
- [x] **Profiles** with distinction between user, artist, and organizer
- [x] **Community feed**
- [x] **Onboarding flows** tailored per account type
- [x] **Public profiles** at `/profile/[id]`
- [x] **Event management** (create, edit, detail view)
- [x] **CI/CD** with GitHub Actions + branch protection on `main`
- [x] **Error monitoring** with Sentry

### 🏗️ In Progress
- [ ] **Bracket system** for battles
- [ ] **Registrations and payments** for workshops
- [ ] **Ratings & reviews**
- [ ] **Interactive calendar** with filters by city and style
- [ ] ....

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router) + React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Backend / DB** | Supabase (Auth, Postgres, Storage) |
| **Monitoring** | Sentry |
| **CI/CD** | GitHub Actions |
| **Deployment** | Vercel |

---

## 🎨 Design

DANCEHUB embraces a **raw and direct** visual language, inspired by battle flyers and underground event posters — solid black, electric yellow as the accent, and heavy uppercase typography. The choice is intentional: move away from the generic "SaaS look" and reflect the identity of urban culture.

<!-- MOCKUP: replace with real screenshots -->
<table>
  <tr>
    <td align="center"><strong>Landing</strong><br/><img src="https://via.placeholder.com/400x250/000000/FACC15?text=Landing" /></td>
    <td align="center"><strong>Feed</strong><br/><img src="https://via.placeholder.com/400x250/000000/FACC15?text=Feed" /></td>
    <td align="center"><strong>Profile</strong><br/><img src="https://via.placeholder.com/400x250/000000/FACC15?text=Profile" /></td>
  </tr>
</table>

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── artists/              # Artist listing
│   ├── events/               # Events (list, detail, create, edit)
│   ├── feed/                 # Community timeline
│   ├── login/  register/     # Authentication flows
│   ├── onboarding/           # Account type setup
│   ├── choose-role/          # Role selection
│   ├── profile/              # Public profiles and editing
│   └── workshops/            # Workshop hub
├── components/               # Reusable UI (Navbar, selectors...)
├── lib/                      # Supabase client, constants
└── public/                   # Static assets
```

---

## 🎯 Differentiators

- **🇵🇹 Portugal-focused:** curated for cities like Lisbon, Porto, Coimbra, Faro, and Braga.
- **💰 Transparency:** workshop and participation prices are visible before sign-up.
- **🎨 Distinct identity:** design rooted in urban culture, not another generic template.
- **📱 Mobile-first:** built to be used on the phone.
- **🛡️ Production-ready workflow:** enforced CI checks, protected `main`, automatic preview deploys on every PR.

---

## 🚦 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/MrNeto17/DanceWebsiteProj.git
cd DanceWebsiteProj

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🧪 Development Workflow

Every PR to `main` is validated automatically:

1. **GitHub Actions** runs `npm ci` and `npm run build` (full type-check included).
2. **Branch protection** blocks merging until the build passes.
3. **Vercel** deploys a preview URL for every PR — each change is instantly browsable in production-like conditions.
4. On merge to `main`, Vercel deploys to production automatically.

---

## 📊 Data Model (Preview)

```sql
-- User profiles
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

## 🤝 Contributing

1. **Fork** the project.
2. Create a **branch** (`git checkout -b feature/new-feature`).
3. **Commit** your changes (`git commit -m 'feat: add new feature'`).
4. **Push** to the branch (`git push origin feature/new-feature`).
5. Open a **Pull Request**.

---

## 👥 Author

- **Tiago Neto** — *Devops Engineer & B-boy*
  - [LinkedIn](https://www.linkedin.com/in/tiagomcneto/)
  - [GitHub](https://github.com/MrNeto17)

---

## 📝 License

This project is licensed under the MIT License.

---

⭐ **Star the project if you find it interesting!**
