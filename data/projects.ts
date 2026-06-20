import { Project } from "../components/Projects/ProjectsShowcase";

export const projects: Project[] = [
  {
    slug: "aesthetics-clinic-platform",
    title: "The Aesthetics Place — Full‑Stack Clinic Platform",
    category: "web",
    clientName: "The Aesthetics Place",
    clientIndustry: "Healthcare & Aesthetic Medicine",
    duration: "14 weeks",
    teamSize: "3 engineers + 1 UI/UX designer",
    overview: "From zero online presence to Sheikhupura's first digital aesthetic clinic — a complete website and internal management system.",
    description: "A full‑stack clinic platform for Sheikhupura's first reliable hair transplant center. Public website showcasing 7+ aesthetic services (Hair Transplant, Botox & Fillers, Laser Hair Removal, HydraFacial, PRP Therapy, Tattoo Removal, Electrocautery), integrated WhatsApp booking, free consultation scheduling, plus a secure internal portal for appointments, patient records, billing, and staff management.",
    problem: "The Aesthetics Place — a doctor‑led aesthetic center at Dil Chowk, Civil Lines, Sheikhupura — was entirely offline. Patient appointments were managed through personal WhatsApp messages, records were kept in paper files, billing was manual, and there was zero discoverability on Google. Potential patients searching for aesthetic treatments in Sheikhupura found competitors instead. The clinic needed a full digital transformation to match the quality of their medical expertise.",
    challenge: "Build both a patient‑facing website that ranks on Google for aesthetic services in Sheikhupura AND a secure internal portal — in a single unified platform. The website needed to showcase 7+ specialized treatments with medical credibility, integrate WhatsApp for instant patient communication, and offer free consultation booking. The internal system had to handle appointment scheduling, patient records with treatment history, automated billing, and role‑based access for doctors, staff, and admins.",
    solution: "Megicode delivered a dual‑purpose Next.js application. The public website is SEO‑optimized and showcases all 7 core services — Hair Transplant, Botox & Fillers, Laser Hair Removal, Hydra & Oxygeno Facial, PRP Therapy, Tattoo Removal, and Electrocautery — with dedicated service pages, real patient testimonials, a blog for medical authority, WhatsApp integration (click‑to‑chat), and a free consultation booking form. The secure internal portal features role‑based dashboards for doctors and staff, real‑time appointment management, patient record tracking with treatment history, automated invoice generation, service catalog management, and inventory tracking. MongoDB handles patient data while LibSQL powers fast operational queries.",
    process: [
      "Discovery workshop with clinic owner to map patient journey and operational bottlenecks",
      "Competitor analysis of top aesthetic clinics in Pakistan and globally",
      "UI/UX design with mobile‑first approach — 80% of patients browse on mobile",
      "Public website development: service pages, testimonials, blog, WhatsApp integration",
      "Internal portal: appointment dashboard, patient records, billing module",
      "Staff role and permission system (Doctor, Admin, Receptionist access levels)",
      "SEO optimization targeting 'aesthetic clinic Sheikhupura' keywords",
      "Testing, security audit, and HIPAA‑aligned data handling review",
      "Deployment, staff training sessions, and post‑launch support"
    ],
    toolsUsed: [
      "Next.js", "React", "Node.js", "MongoDB", "LibSQL", "TypeScript", "Tailwind CSS", "Vercel", "Figma"
    ],
    implementation: "Delivered over 14 weeks in agile sprints. The public website launched first to start generating patient inquiries through Google and WhatsApp, followed by the internal management portal two weeks later. Staff received hands‑on training along with video walkthroughs for daily operations. Post‑launch support included two months of bug fixes, SEO refinements, and feature iterations based on real clinic usage patterns.",
    impact: "The clinic went from zero online presence to Sheikhupura's first fully digital aesthetic center. Patients now discover the clinic through Google, view all 7 services with detailed information, read real testimonials, and book free consultations directly — all before making a phone call. Internally, appointment coordination moved from personal WhatsApp to a structured dashboard. Patient record lookup dropped from minutes to seconds. Billing errors were eliminated with automated invoice generation. Within weeks of launch, the website became the primary source of new patient inquiries.",
    lessonsLearned: [
      "Healthcare platforms require extra attention to data privacy and role‑based access controls — medical records are sensitive.",
      "Staff onboarding and training are as critical as the software itself — the best system fails if users can't adopt it.",
      "Phased rollout (public site first, internal tools second) builds confidence and reduces adoption friction.",
      "WhatsApp integration is non‑negotiable for Pakistani businesses — it's the primary communication channel.",
      "Real patient testimonials on the website dramatically increase conversion rates."
    ],
    nextSteps: "Planned enhancements include automated SMS/WhatsApp appointment reminders, a patient self‑service portal for viewing treatment history and upcoming appointments, online payment integration for deposits, and AI‑powered content recommendations for the medical blog.",
    techStack: ["Next.js", "React", "Node.js", "MongoDB", "LibSQL", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://aestheticsplace.pk",
    testimonial: "Megicode transformed our clinic operations completely. We went from paper files and WhatsApp chaos to a professional website that brings in new patients and an internal system that manages everything — appointments, records, billing. Our staff adapted quickly, and patients love the professional experience. It's the best investment we've made for the clinic. — Dr. Owner, The Aesthetics Place, Sheikhupura",
    metrics: {
      "Online Presence": "0 → Full Website + Internal Portal",
      "Services Showcased": "7 Aesthetic Treatments",
      "Patient Booking": "Manual WhatsApp → Automated System",
      "Record Lookup": "Minutes → Seconds",
      "Billing Errors": "Eliminated",
      "Staff Roles": "Doctor, Admin, Receptionist"
    },
    image: "/images/aesthetics-clinic.png",
    screenshots: [
      "/images/aesthetics-clinic.png"
    ]
  },
  {
    slug: "campusaxis-university-portal",
    title: "CampusAxis — Pakistan's #1 Student Platform",
    category: "web",
    clientName: "CampusAxis (Megicode's Community Initiative)",
    clientIndustry: "EdTech",
    duration: "16 weeks initial build, continuously evolving",
    teamSize: "4 engineers + 1 designer",
    overview: "Pakistan's largest free student platform — 15,000+ students, 20+ universities, 48,000+ past papers — built, designed, and operated by Megicode.",
    description: "Pakistan's #1 student platform serving 15,000+ active students across 20+ top Pakistani universities including COMSATS, NUST, FAST, LUMS, UET, and GIKI. Features 48,719+ past papers, 8,136+ study resources, 444+ faculty reviews, GPA Calculator, Merit Calculator, community hub, leaderboard, timetable management, events, and more — 100% free forever. Designed, developed, and operated by Megicode.",
    problem: "Pakistani university students face a fragmented academic ecosystem. Past papers are buried in WhatsApp groups and shared drives. Faculty reviews exist only as word‑of‑mouth rumors. There's no standardized GPA calculator across universities. Merit calculations for admissions are opaque. Timetable management is manual. Students waste countless hours every semester hunting for resources that should be a click away — and no single platform existed to solve this at scale across multiple universities.",
    challenge: "Build a platform that serves the needs of students across 20+ different Pakistani universities with different grading systems, course structures, and academic calendars — all from a single unified platform. The system had to handle tens of thousands of past papers and study resources with fast search, support real‑time community features for peer interaction, compute accurate GPA and merit calculations per university's specific rules, and scale to thousands of concurrent users during exam season — while remaining 100% free.",
    solution: "Megicode designed and built CampusAxis as a full‑stack community platform using Next.js with a React frontend and dual database architecture — MongoDB for user data, content, and the massive document library, and Supabase for real‑time community features. The platform includes: a searchable library of 48,719+ past papers and 8,136+ study resources organized by university, semester, and course; a GPA Calculator calibrated to each university's grading scale; a Merit Calculator for admission predictions; faculty reviews with 444+ professors rated across departments; a community hub with discussion forums and peer collaboration; a gamified leaderboard for student engagement; personal timetable management; campus events calendar; a lost & found board; and a blog with study tips and guides. Everything is mobile‑first since 85%+ of students access it on phones.",
    process: [
      "Student pain point research — surveys across 5+ universities to identify top frustrations",
      "Competitive analysis of university portals and EdTech platforms globally",
      "Product strategy and feature prioritization using impact‑effort matrix",
      "Multi‑university data architecture design (per‑university grading rules, course catalogs)",
      "UI/UX design — mobile‑first, optimized for quick access between classes",
      "Frontend development with Next.js + React, SSR for fast load times",
      "Backend API development for document library, GPA engine, merit calculator",
      "Community features: forums, leaderboard, events, lost & found",
      "Database architecture: MongoDB Atlas + Supabase for real‑time",
      "Beta launch with 200+ students, iterative improvements from real usage data",
      "Public launch and organic growth through word‑of‑mouth and university communities"
    ],
    toolsUsed: [
      "Next.js", "React", "Node.js", "MongoDB", "Supabase", "TypeScript", "Tailwind CSS", "Vercel", "Figma"
    ],
    implementation: "CampusAxis was built in an initial 16‑week sprint and has been continuously evolving since. We started with extensive student surveys across COMSATS, NUST, and FAST to identify the most critical gaps, then built and shipped in iterative sprints. Beta testing with 200+ students shaped the initial feature set. After launch, organic growth drove rapid adoption — students sharing the platform with classmates and across university WhatsApp groups. The platform runs on Vercel with MongoDB Atlas for the document library and Supabase for real‑time community features. We continuously add new universities, expand the past paper library, and ship features based on student feedback.",
    impact: "CampusAxis has grown to become Pakistan's largest free student platform with 15,000+ active students across 20+ universities. The past paper library (48,000+ documents) saves each student an estimated 5+ hours per exam week. The GPA Calculator has become the trusted tool students rely on — calibrated to their specific university's grading scale. Faculty reviews with 444+ professors reviewed help students make informed course selections. The community hub replaced fragmented WhatsApp groups with organized, searchable discussions. The platform proves Megicode's ability to conceive, build, scale, and operate a real product with real users — not just client work.",
    lessonsLearned: [
      "Building your own product proves capability better than any portfolio piece — 15,000+ real users is the ultimate proof of engineering quality.",
      "Student users demand instant, mobile‑first experiences — every 100ms of load time affects engagement.",
      "Community features drive organic growth — students share what's genuinely useful with classmates.",
      "Multi‑university support requires flexible data architecture from day one — retrofitting is painful.",
      "Free platforms build massive goodwill and create a powerful brand among the next generation of tech professionals."
    ],
    nextSteps: "Expanding to all major Pakistani universities, launching AI‑powered study recommendations and smart past paper suggestions, integrating with university LMS systems, building a mobile app, and exploring AI tutoring features powered by the platform's massive academic content library.",
    techStack: ["Next.js", "React", "Node.js", "MongoDB", "Supabase", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://campusaxis.pk",
    testimonial: "CampusAxis literally changed my university experience. Past papers, GPA calculator, faculty reviews, timetable — everything I need is in one place. I used to spend hours before exams just finding past papers in WhatsApp groups. Now it takes seconds. Every student I know uses it. — University Student, CampusAxis User",
    metrics: {
      "Active Students": "15,000+",
      "Universities Served": "20+",
      "Past Papers": "48,719+",
      "Study Resources": "8,136+",
      "Faculty Reviewed": "444+",
      "Price": "100% Free Forever"
    },
    image: "/images/campusaxis.png",
    screenshots: [
      "/images/campusaxis.png"
    ]
  },
  {
    slug: "wajdan-growth-system-website",
    title: "Wajdan Digital Alchemy — High‑Converting Growth Agency Website",
    category: "web",
    clientName: "Wajdan Digital Alchemy",
    clientIndustry: "Growth Marketing & Lead Generation (Education Consultancies)",
    duration: "6 weeks",
    teamSize: "2 engineers + 1 UI/UX designer",
    overview: "A conversion‑first Next.js website for a European growth agency — built to turn cold visitors into booked, qualified consultation audits.",
    description: "A high‑performance, conversion‑optimized marketing website for Wajdan Digital Alchemy, a European growth agency that builds end‑to‑end client‑acquisition systems for education consultancies. Built on Next.js, the site sells the agency's signature 60‑day growth system through a story‑driven sales narrative — hero value proposition, the 'Half‑Service Trap' problem framing, a five‑layer system breakdown (Offer, Funnel + VSL, GHL + Automation, Meta Campaigns, Conversion Loop), live results, social proof, pricing, and a 'Book Free Audit' conversion flow. Engineered for speed, mobile‑first responsiveness, and clarity so every section moves the visitor toward booking a call.",
    problem: "Wajdan had a category‑defining offer but no digital home to sell it. Growth agencies live and die by their own conversion rate, yet most have generic, slow, template‑looking sites that fail to communicate a differentiated system or build trust with high‑intent prospects. Wajdan needed a website that practiced what it preached — one that frames the problem sharply, explains a sophisticated multi‑layer system simply, proves results credibly, and drives qualified education‑consultancy owners to book a free audit instead of bouncing.",
    challenge: "Translate a premium, multi‑layered service offering — offer creation, funnels and video sales letters, GoHighLevel CRM automation, Meta ad campaigns, and a data conversion loop — into a single, fast, scannable narrative that converts cold traffic into booked calls. The site needed to load instantly, look elite on mobile (where most ad traffic lands), guide visitors through a persuasive story arc, surface proof and a show‑up guarantee without feeling salesy, and funnel everyone toward one clear action: booking a free audit.",
    solution: "Megicode designed and built a conversion‑first website on Next.js with a React frontend, optimized for Core Web Vitals and mobile‑first ad traffic. The page architecture follows a deliberate persuasion sequence: a bold hero with the agency's core promise, the 'What You're Missing' problem section that names the Half‑Service Trap, a transparent five‑layer system breakdown, a lead‑lifecycle timeline showing automated SMS confirmations and reminder sequences, a results/social‑proof block (show rates improving from 28% to 84%), scarcity framing (max 6 clients per month), a risk‑reversal guarantee, transparent pricing, and a frictionless 'Book Free Audit' CTA wired to a scheduling flow. We implemented clean semantic markup, fast image delivery, smooth scroll‑based reveals, and on‑page SEO so the site ranks for growth‑system and consultation‑scaling queries while staying laser‑focused on conversion.",
    process: [
      "Discovery session to extract the agency's offer, ideal client profile, and differentiators",
      "Messaging and copy architecture — mapping the visitor's journey from cold to booked call",
      "Conversion‑focused wireframing of the full sales narrative and CTA placement",
      "UI/UX design — bold, high‑contrast, mobile‑first visual system for paid traffic",
      "Next.js development with performance and Core Web Vitals as first‑class constraints",
      "Sectioned build: hero, problem framing, five‑layer system, lifecycle timeline, proof, pricing",
      "Booking flow integration for the 'Book Free Audit' conversion action",
      "On‑page SEO, semantic structure, Open Graph, and metadata optimization",
      "Performance, responsiveness, and cross‑device QA",
      "Deployment and post‑launch conversion refinements"
    ],
    toolsUsed: [
      "Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel", "Figma"
    ],
    implementation: "Delivered in a focused 6‑week engagement. We started from the offer and messaging — because for a growth agency the copy is the product — then designed a mobile‑first visual system and built it in Next.js with performance budgets enforced throughout. The site shipped on Vercel with optimized images, lazy‑loaded media, and a scheduling‑backed booking CTA. Post‑launch, we iterated on section ordering and CTA copy to tighten the path from landing to booked audit.",
    impact: "Wajdan went from no dedicated web presence to a fast, premium website that sells its 60‑day growth system on its own terms. The site gives the agency a credible, differentiated home for its paid traffic — framing the problem, explaining a complex five‑layer system simply, proving results, and converting high‑intent education‑consultancy owners into booked free audits. It now functions as the agency's primary closing asset: the destination every Meta campaign points to, engineered to convert rather than just inform.",
    lessonsLearned: [
      "For a growth agency, the website IS the proof — it has to out‑convert the sites it promises to beat.",
      "A clear problem‑agitation‑solution narrative converts far better than a feature list.",
      "Mobile‑first is non‑negotiable when nearly all traffic arrives from Meta ads.",
      "Risk reversal and scarcity, used honestly, dramatically lift booking intent.",
      "Performance is a conversion feature — every 100ms of load time costs booked calls."
    ],
    nextSteps: "Planned enhancements include A/B testing of hero messaging and CTA variants, a results/case‑study section as new client wins land, blog content targeting consultation‑scaling keywords for organic reach, and tighter analytics on the booking funnel to optimize conversion rate over time.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    liveUrl: "https://wajdan.co",
    testimonial: "Megicode built us a website that actually sells. It captures our entire system in a way prospects instantly understand, it's fast, it looks premium, and it turns our ad traffic into booked audits. As a growth agency our own site has to convert — and this one does. — Founder, Wajdan Digital Alchemy",
    metrics: {
      "Web Presence": "0 → High‑Converting Sales Site",
      "Built With": "Next.js (Mobile‑First)",
      "System Layers Sold": "5 (Offer → Conversion Loop)",
      "Primary Goal": "Booked Free Audits",
      "Show Rate Story": "28% → 84%",
      "Core Web Vitals": "Performance‑Optimized"
    },
    image: "/images/wajdan.png",
    screenshots: [
      "/images/wajdan.png"
    ]
  }
];
