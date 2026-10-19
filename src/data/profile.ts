// Single source of truth for site content. Edit here; components read from this file.

export type Job = {
  title: string;
  company: string;
  url?: string;
  type?: string;
  location?: string;
  start: string; // YYYY-MM
  end?: string; // YYYY-MM, omit for current role
  summary?: string;
  highlights?: string[];
  skills: string[];
};

export const profile = {
  name: "Roger Arbizo",
  shortName: "Roger",
  role: "Senior Software Engineer",
  location: "United States",
  tagline:
    "Full-stack engineer building reliable products across .NET, React, and Node.js, from database design to polished interfaces.",
  // Rotating phrases in the hero headline: "I build …"
  focus: [
    "scalable .NET backends",
    "modern React interfaces",
    "reliable healthcare software",
    "full-stack products",
  ],
  // TODO: replace with Roger's own words.
  about: [
    "I'm a senior software engineer with 7+ years of experience shipping production software. Today I'm a Lead Software Engineer at Novatekra, where I set technical direction and help the team deliver maintainable systems at a steady pace.",
    "My work spans the whole stack: data models and backend services in .NET and Node.js, relational databases, and the React interfaces people use every day. I spent two years in healthcare technology at Elation Health, where correctness and data integrity are not optional.",
  ],
  // TODO: fill in real links; empty values are hidden.
  contact: {
    email: "",
    linkedin: "",
    github: "",
  },
};

export const experience: Job[] = [
  {
    title: "Lead Software Engineer",
    company: "Novatekra",
    type: "Full-time",
    start: "2022-10",
    summary:
      "Leads development on the .NET stack: backend services, data modeling and database work, plus architecture reviews and mentoring.",
    skills: [".NET Framework", "C#", "Databases", "SQL"],
  },
  {
    title: "Software Engineer",
    company: "Elation Health",
    type: "Full-time",
    location: "Remote",
    start: "2020-11",
    end: "2022-10",
    summary:
      "Built and maintained features for a clinical-first healthcare platform, in a domain with strict standards for correctness and privacy.",
    skills: ["Healthcare", "GCP"],
  },
  {
    title: "Software Engineer",
    company: "Modulr",
    location: "Remote",
    start: "2019-11",
    end: "2020-11",
    summary: "Shipped full-stack features with React on the frontend and Node.js on the backend.",
    skills: ["React.js", "Node.js"],
  },
];

export const education = [
  {
    school: "University of Houston",
    degree: "Bachelor of Science",
    start: "2013",
    end: "2019",
  },
];

// TODO: LinkedIn lists 20 skills; add the rest.
export const skills: { group: string; icon: string; items: string[] }[] = [
  { group: "Backend", icon: "⌘", items: [".NET Framework", "C#", "Node.js", "REST APIs"] },
  { group: "Frontend", icon: "◈", items: ["React.js", "TypeScript", "JavaScript"] },
  { group: "Data", icon: "◎", items: ["Databases", "SQL", "Query performance"] },
  { group: "Practice", icon: "✦", items: ["System design", "Code review", "Mentoring", "Remote collaboration"] },
  { group: "Domain", icon: "✚", items: ["Healthcare software", "Good Clinical Practice (GCP)"] },
];
