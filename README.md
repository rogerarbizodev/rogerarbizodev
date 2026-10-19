# Roger Arbizo

**Senior Software Engineer · 7+ years** · Lead Software Engineer at Novatekra · United States

I'm a full-stack software engineer with more than seven years of experience building and shipping production software. My work spans backend services in .NET and Node.js, relational databases, and React interfaces. That includes two years in healthcare technology, where reliability and data integrity are not optional. Today I lead engineering work at Novatekra, where I own technical direction, review and shape system design, and help the team deliver maintainable software at a steady pace.

---

## Experience

| Role | Company | Dates | Focus |
| --- | --- | --- | --- |
| **Lead Software Engineer** | Novatekra | Oct 2022 – Present | .NET Framework, databases, technical leadership |
| **Software Engineer** | Elation Health (remote) | Nov 2020 – Oct 2022 | Healthcare software |
| **Software Engineer** | Modulr (remote) | Nov 2019 – Nov 2020 | React.js, Node.js |

### Novatekra: Lead Software Engineer
Leads development of the company's software products on the .NET stack: backend services, data modeling and database work, and the engineering practices around them. As lead, sets technical direction, reviews architecture and code, and mentors other engineers.

### Elation Health: Software Engineer
Built and maintained features for a clinical-first healthcare platform used by primary care practices. Worked in a domain with strict standards for correctness, privacy, and regulatory compliance.

### Modulr: Software Engineer
Built full-stack features with React.js on the frontend and Node.js on the backend in a fully remote team.

## Core skills

- **Backend:** .NET Framework, C#, Node.js, REST APIs
- **Frontend:** React.js, TypeScript, JavaScript
- **Data:** relational database design, SQL, query performance
- **Practice:** system design, code review, mentoring, remote collaboration
- **Domain:** healthcare software, Good Clinical Practice (GCP)

## Education

**University of Houston**, Bachelor of Science (2013 – 2019)

## Contact

- Portfolio: _coming soon_
- LinkedIn: _add link_
- Email: _add address_

---

## About this repository

This repository is the source for my personal portfolio site.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Three.js with React Three Fiber.

**Visual design:** a WebGL background with a morphing energy orb drawn by a custom GLSL shader, wireframe and orbit rings, and a twinkling particle field. It reacts to the mouse and to scrolling. On top of it sit a cursor-following spotlight, glass cards whose borders light up under the pointer, aurora glows, a film-grain texture, and scroll-reveal animations. All motion respects `prefers-reduced-motion`.

### Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

### Project layout

```
src/
  app/          layout, global styles, home page
  components/   page sections (Hero, About, Experience, Skills, Contact) and effects
    three/      WebGL background scene and shaders
  data/         profile.ts: all site content lives here
  lib.ts        date formatting and duration helpers
```

To update the site's content, edit `src/data/profile.ts`. You don't need to touch the components.
