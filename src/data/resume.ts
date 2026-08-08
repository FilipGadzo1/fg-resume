export type Project = {
  name: string
  description: string
  github: string
  live: string | null
  language: string
  tech?: string[]
  images?: string[]
}

export const resume = {
  name: 'Filip Gadžo',
  nameFirst: 'Filip',
  nameLast: 'Gadžo',
  title: 'Full-Stack Developer',
  tagline: '3+ years building enterprise fintech applications',
  bio: 'Full-stack developer with hands-on experience in React, Vue 3, and TypeScript, building production applications for Apollo Global Management. Focused on maintainable code, real usability, and reliable delivery in complex financial systems.',
  contact: {
    email: 'filip.gadzo123@gmail.com',
    phone: '+385 99 199 1159',
    location: 'Uppsala, Sweden',
    linkedin: 'https://linkedin.com/in/filip-gadzo/',
    linkedinHandle: 'filip-gadzo',
    github: 'https://github.com/FilipGadzo1',
    githubHandle: 'FilipGadzo1',
  },
  experience: [
    {
      company: 'SpaceInch / Apollo Global Management',
      role: 'Full-Stack Developer',
      period: 'May 2023 – Present',
      current: true,
      highlights: [
        'Build and maintain fintech applications supporting complex trading and financial workflows at Apollo Global Management.',
        'Deliver features using Vue 3 and TypeScript in a demanding enterprise environment.',
        'Write maintainable, scalable code with strong attention to performance and long-term usability.',
        'Work across frontend and full-stack tasks on internal financial platforms.',
        'Collaborate with developers, stakeholders, and business teams on tight delivery timelines.',
        'Integrate Claude, Codex, and Cursor into daily workflows to accelerate implementation.',
      ],
    },
    {
      company: 'BISS',
      role: 'Frontend Developer',
      period: 'April 2022 – April 2023',
      current: false,
      highlights: [
        'Built frontend projects with React, TypeScript, Redux, REST APIs, and Zod.',
        'Delivered responsive, accessible web applications.',
        'Wrote unit tests with Vitest and Jest.',
        'Contributed to refactoring, performance improvements, and code reviews.',
        'Used Jira, SonarQube, Jenkins, and Git in a professional team environment.',
      ],
    },
  ],
  skills: [
    { category: 'Frontend', items: ['React', 'Vue 3', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS'] },
    { category: 'State & APIs', items: ['Redux', 'REST APIs', 'Zod', 'Python'] },
    { category: 'Testing', items: ['Vitest', 'Jest', 'Unit Testing'] },
    { category: 'Tools', items: ['Git', 'Jira', 'SonarQube', 'Jenkins'] },
    { category: 'AI Tooling', items: ['Claude', 'Codex', 'Cursor'] },
  ],
  stats: [
    { value: '3+', label: 'Years exp.' },
    { value: '2', label: 'Companies' },
    { value: '10+', label: 'Technologies' },
    { value: '5', label: 'Live projects' },
  ],
  projects: [
    {
      name: 'Skye',
      description: 'A visually rich weather app with animated illustrated backgrounds that shift based on conditions and time of day. Features city search and geolocation, current conditions, 24-hour temperature charts, 7-day forecast, wind and humidity visualisations, atmosphere data, and a Health tab with air quality index, UV index, and moon phase. Includes an AI-generated "At a Glance" daily summary and a best-time-outside recommendation.',
      github: 'https://github.com/FilipGadzo1/weather-app',
      live: 'https://weather-app-ashy-omega-23.vercel.app/',
      language: 'React, TypeScript',
      tech: ['React', 'TypeScript', 'Tailwind CSS'],
      images: [
        '/assets/weather-app/Screenshot 2026-05-24 142510.png',
        '/assets/weather-app/Screenshot 2026-05-24 142522.png',
        '/assets/weather-app/Screenshot 2026-05-24 142528.png',
        '/assets/weather-app/Screenshot 2026-05-24 142535.png',
        '/assets/weather-app/Screenshot 2026-05-24 142541.png',
        '/assets/weather-app/Screenshot 2026-05-24 142547.png',
      ],
    },
    {
      name: 'Budget Dashboard',
      description: 'Full-stack personal finance app with multi-month balance projections, savings goals, named scenarios, real-time budget collaboration, and live currency conversion. Features Google OAuth, per-user Row Level Security, and light/dark theming.',
      github: 'https://github.com/FilipGadzo1/budget-dashboard',
      live: 'https://budget-dashboard-mu.vercel.app',
      language: 'Vue, TypeScript, Supabase',
      tech: ['TypeScript', 'Vue 3', 'Pinia', 'PrimeVue', 'Tailwind CSS', 'Supabase'],
      images: [
        '/assets/budget-dashboard/Dashboard.png',
        '/assets/budget-dashboard/Projections.png',
        '/assets/budget-dashboard/Savings.png',
        '/assets/budget-dashboard/Scenarios.png',
        '/assets/budget-dashboard/Collab.png',
        '/assets/budget-dashboard/Settings.png',
        '/assets/budget-dashboard/Dashboard_light.png',
      ],
    },
    {
      name: 'GainPlan',
      description: 'A local-first meal planner for bulking. Takes your body stats, activity level and goal, derives a BMR-based daily calorie and macro target, then generates a full week of meals from a recipe pool — with per-meal portion scaling, swapping and locking. Also builds a categorised grocery list priced against a real store with quantities rounded to package sizes, and a batch-cooking prep schedule that groups meals into cooking sessions. Bilingual (Swedish/English), no login and no backend — everything runs in the browser.',
      github: 'https://github.com/FilipGadzo1/gainplan',
      live: 'https://gainplan-taupe.vercel.app/',
      language: 'React, TypeScript',
      tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS', 'i18next', 'Vitest'],
      images: [
        '/assets/gain-plan/gain-plan-week.png',
        '/assets/gain-plan/gain-plan-list.png',
        '/assets/gain-plan/gain-plan-prep.png',
        '/assets/gain-plan/gain-plan-setup.png',
      ],
    },
    {
      name: 'Orbit Golf',
      description: 'A 2D minigolf game played across procedurally generated solar systems — slingshot the ball between planets and use gravity wells to curve it into the cup. Custom canvas renderer and physics engine with a real forward-simulated aim line, seeded course generation across four difficulty tiers, and hazards like black holes, repulsors and ice, lava and gas surfaces. Serverless multiplayer over Supabase Realtime with deterministic host election, lobbies and live ghost balls, plus local career stats, 17 achievements and a cosmetics shop. Sound and music are synthesised at runtime, so there are no audio assets to ship.',
      github: 'https://github.com/FilipGadzo1/orbit-golf',
      live: 'https://orbit-golf-mu.vercel.app/',
      language: 'TypeScript, Canvas',
      tech: ['TypeScript', 'Canvas 2D', 'Vite', 'Supabase Realtime', 'Web Audio', 'Playwright'],
      images: [
        '/assets/orbit-golf/main-menu.png',
        '/assets/orbit-golf/aiming.png',
        '/assets/orbit-golf/ball-in-air.png',
        '/assets/orbit-golf/hole-finished.png',
        '/assets/orbit-golf/level.png',
        '/assets/orbit-golf/career.png',
      ],
    },
  ],
  education: {
    degree: 'BSc in Web & Mobile Computing',
    school: 'RIT Croatia',
    location: 'Zagreb',
    period: '2018 – 2022',
  },
  languages: [
    { name: 'Croatian', level: 'Native', proficiency: 100 },
    { name: 'English', level: 'C1', proficiency: 85 },
    { name: 'German', level: 'Basic', proficiency: 25 },
    { name: 'Spanish', level: 'Basic', proficiency: 20 },
  ],
}
