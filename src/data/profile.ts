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
  role: "Lead Software Engineer",
  location: "United States",
  tagline:
    "Full-stack engineer building reliable products across .NET, React, and Node.js.",
  // TODO: replace with Roger's own words.
  about: [
    "I'm a Lead Software Engineer at Novatekra with 6+ years of experience shipping production software, including two years in healthcare technology at Elation Health.",
    "I work across the stack, from data models and backend services to the React interfaces people use every day, and I enjoy leading teams toward simple, maintainable solutions.",
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
    skills: [".NET Framework", "Databases"],
  },
  {
    title: "Software Engineer",
    company: "Elation Health",
    type: "Full-time",
    location: "Remote",
    start: "2020-11",
    end: "2022-10",
    skills: [],
  },
  {
    title: "Software Engineer",
    company: "Modulr",
    location: "Remote",
    start: "2019-11",
    end: "2020-11",
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
export const skills: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["React.js"] },
  { group: "Backend", items: [".NET Framework", "Node.js"] },
  { group: "Data", items: ["Databases"] },
  { group: "Domain", items: ["Good Clinical Practice (GCP)"] },
];
