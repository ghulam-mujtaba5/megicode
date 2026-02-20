import { Project } from "../components/Projects/ProjectsShowcase";

export const projects: Project[] = [
  {
    slug: "aesthetics-clinic-platform",
    title: "Aesthetics Clinic Website & Management System",
    category: "web",
    description: "A full‑stack clinic platform for a doctor‑led aesthetic center. Includes a public website, internal portal, appointment scheduling, patient records, billing, staff roles and service management to streamline daily clinic operations.",
    problem: "The Aesthetics Place, a leading doctor‑led aesthetic clinic in Pakistan, was managing everything manually — patient records in spreadsheets, appointments over WhatsApp, billing on paper, and no online presence to attract new clients. The clinic needed a professional digital platform to match the quality of their medical services.",
    challenge: "Build a complete digital ecosystem — a modern public‑facing website that converts visitors into patients, plus a secure internal management system handling appointments, patient records, billing, inventory, and staff roles — all within a single unified platform.",
    solution: "Megicode delivered a full‑stack Next.js application with dual purposes: a polished, SEO‑optimized public website showcasing the clinic's services, treatments, doctors, and before/after galleries, paired with a secure internal portal featuring role‑based access for doctors, staff, and administrators. The system includes real‑time appointment scheduling, patient record management with treatment history, automated billing and invoice generation, service catalog management, and staff role permissions. MongoDB handles patient data and records while LibSQL powers fast operational queries.",
    process: [
      "Discovery & Requirements Workshop with Clinic Owner",
      "Competitor Analysis of Top Aesthetic Clinics Worldwide",
      "UI/UX Design & Prototyping (Mobile‑First)",
      "Public Website Development (Next.js + SSR)",
      "Internal Portal Development (Dashboard, Appointments, Patients)",
      "Billing & Invoice System Integration",
      "Staff Role & Permission System",
      "Testing, QA & Security Audit",
      "Deployment & Staff Training"
    ],
    toolsUsed: [
      "Next.js", "React", "Node.js", "MongoDB", "LibSQL", "TypeScript", "Tailwind CSS", "Vercel", "Figma"
    ],
    implementation: "The project was delivered over 14 weeks in agile sprints. The public website launched first to start generating patient inquiries, followed by the internal management portal. Staff received hands‑on training sessions and a video walkthrough for daily operations. Post‑launch support included two months of bug fixes and feature refinements based on real clinic usage.",
    impact: "The clinic went from zero online presence to a fully professional digital platform. Online appointment bookings replaced manual WhatsApp coordination. Patient record lookup time dropped from minutes to seconds. Billing errors were eliminated with automated invoice generation. The website started attracting new patients through Google within weeks of launch.",
    lessonsLearned: [
      "Healthcare platforms require extra attention to data privacy and access controls.",
      "Staff onboarding and training are as critical as the software itself.",
      "A phased rollout (public site first, then internal tools) reduces adoption friction.",
      "Real‑time appointment scheduling dramatically improves patient satisfaction."
    ],
    nextSteps: "Planned enhancements include SMS/WhatsApp appointment reminders, patient self‑service portal for viewing treatment history, and integration with payment gateways for online deposits.",
    techStack: ["Next.js", "React", "Node.js", "MongoDB", "LibSQL", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://www.aestheticsplace.pk",
    testimonial: "Megicode transformed our clinic operations completely. From a beautiful website that brings in new patients to the internal system that manages everything — appointments, records, billing — it all just works. Our staff adapted quickly, and patients love the professional experience. Highly recommended for any medical practice. — Dr. Owner, The Aesthetics Place",
    metrics: {
      "Online Presence": "0 → Full Website + Portal",
      "Appointment Booking": "Manual → Automated",
      "Patient Record Lookup": "Minutes → Seconds",
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
    title: "CampusAxis – University Portal & Student Platform",
    category: "web",
    description: "A comprehensive university portal for COMSATS students that centralizes academic resources, dashboards, community discussions, timetables, news and student support — built as Megicode's own product.",
    problem: "University students at COMSATS had no single platform to access academic resources, timetables, campus news, or connect with peers. Information was scattered across multiple outdated systems, WhatsApp groups, and notice boards. Students wasted hours hunting for schedules, past papers, and campus updates.",
    challenge: "Build a unified, modern student portal that consolidates academic dashboards, course timetables, community discussions, campus news, and support resources — all accessible from one place, on any device, designed for how students actually use technology.",
    solution: "Megicode designed and built CampusAxis as a full product — a Next.js web application with React frontend and dual database architecture (MongoDB for content and user data, Supabase for real‑time features). The platform includes personalized student dashboards, dynamic timetable generation, a community discussion forum with moderation, campus news feed, resource library for past papers and notes, and a support ticket system. The UI was designed mobile‑first since most students access it on phones between classes.",
    process: [
      "Student Pain Point Research & Surveys",
      "Competitive Analysis of University Portals",
      "Product Strategy & Feature Prioritization",
      "UI/UX Design (Mobile‑First, Student‑Centric)",
      "Frontend Development (Next.js + React)",
      "Backend & API Development (Node.js)",
      "Database Architecture (MongoDB + Supabase)",
      "Community Forum & Real‑Time Features",
      "Beta Launch with Student Testers",
      "Iterative Improvements Based on Feedback"
    ],
    toolsUsed: [
      "Next.js", "React", "Node.js", "MongoDB", "Supabase", "TypeScript", "Tailwind CSS", "Vercel", "Figma"
    ],
    implementation: "CampusAxis was developed as Megicode's own product over 16 weeks. We started with extensive student surveys to identify the most painful gaps, then built and shipped in iterative sprints. Beta testing with 200+ COMSATS students shaped the final feature set. The platform runs on Vercel with MongoDB Atlas and Supabase for real‑time capabilities.",
    impact: "CampusAxis became the go‑to platform for COMSATS students. Students save hours each week by accessing timetables, resources, and campus news from one dashboard. The community forum replaced scattered WhatsApp groups with organized, searchable discussions. The platform demonstrates Megicode's ability to build and ship a complete product from concept to live users.",
    lessonsLearned: [
      "Building your own product proves capability better than any portfolio piece.",
      "Student users demand fast, mobile‑first experiences — every millisecond matters.",
      "Community features drive organic growth through word‑of‑mouth.",
      "Real‑time features (Supabase) dramatically improve engagement and retention."
    ],
    nextSteps: "Expanding to other universities, adding AI‑powered study recommendations, integrating with university LMS systems, and launching a mobile app.",
    techStack: ["Next.js", "React", "Node.js", "MongoDB", "Supabase", "TypeScript", "Tailwind CSS", "Vercel"],
    liveUrl: "https://campusaxis.pk",
    testimonial: "CampusAxis changed how I manage my university life. Everything I need — timetable, past papers, campus news, peer discussions — is in one place. Way better than juggling 10 different WhatsApp groups. — COMSATS Student",
    metrics: {
      "Platform Type": "Megicode's Own Product",
      "Target Users": "COMSATS University Students",
      "Key Features": "Dashboard, Timetable, Forum, News",
      "Tech Architecture": "Next.js + MongoDB + Supabase",
      "Status": "Live at campusaxis.pk"
    },
    image: "/images/campusaxis.png",
    screenshots: [
      "/images/campusaxis.png"
    ]
  },
  {
    slug: "fintech-uiux-revamp",
    title: "Redesigning Financial Clarity – Smart Expense App",
    category: "uiux",
    description: "A comprehensive UX/UI transformation for a fintech startup, resulting in a 42% increase in task completion and a 2x boost in daily engagement.",
    
    problem: "Our client, a US-based fintech startup targeting Gen Z and Millennial users, was experiencing high churn rates and low engagement on their budgeting app. The interface was cluttered, onboarding was confusing, and non-technical users struggled to manage their finances.",
    challenge: "Create a modern, accessible, and engaging budgeting app UI/UX that would delight users, reduce onboarding friction, and drive retention in a crowded market.",
    solution: "Megicode led a full-scale UX overhaul. We began with in-depth user interviews and competitor analysis, then mapped pain points and designed wireframes in Figma. Our team delivered a mobile-first UI with a 30% shorter onboarding flow, dynamic budgeting sliders, real-time charts, and a seamless dark/light mode toggle. Accessibility and WCAG compliance were prioritized throughout.",
    process: [
      "Discovery & Stakeholder Workshops",
      "User Research (12 interviews, 2 focus groups)",
      "Persona & Journey Mapping",
      "Wireframing & Prototyping (Figma)",
      "Design System Creation",
      "Agile Sprints (2-week cycles)",
      "Usability Testing (3 rounds)",
      "Handoff & Developer QA"
    ],
    toolsUsed: [
      "Figma", "Adobe XD", "Miro", "Jira", "Amplitude", "React Native", "Notion", "Slack"
    ],
    
    artifacts: [
      { type: "Wireframes", url: "https://www.figma.com/file/xyz123/fintech-wireframes" },
      { type: "Design System", url: "https://www.figma.com/file/xyz123/fintech-design-system" },
      { type: "User Flow Diagram", url: "https://miro.com/app/board/xyz123/" }
    ],
    implementation: "The project ran over 10 weeks with biweekly sprints. Key milestones included the launch of the design system, completion of 3 usability test rounds, and a successful developer handoff with zero major UI bugs reported.",
    impact: "Within 3 months of launch: Task completion rates rose from 51% to 93%. Daily engagement doubled. User retention improved by 38%. The app received 4.8/5 ratings in the app store, and customer support tickets related to onboarding dropped by 60%.",
    lessonsLearned: [
      "Early user involvement is critical for feature prioritization.",
      "A design system accelerates development and ensures consistency.",
      "Accessibility investments pay off in user satisfaction."
    ],
    nextSteps: "Phase 2 will introduce AI-powered financial insights and expand support for international currencies.",
    
    techStack: ["Figma", "Adobe XD", "React Native", "Material Design", "Jira", "Amplitude"],
    github: "https://github.com/megicodes/DigiFinSense",
    testimonial: "Megicode’s process was world-class. Our users rave about the new design, and our KPIs have never looked better. — Product Manager, Fintech Startup",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&auto=format&fit=crop&q=80",
    metrics: {
      "Task Completion Rate": "51% → 93%",
      "Onboarding Time": "3.5 min → <2.3 min",
      "Daily Engagement": "2x increase",
      "Support Tickets": "-60% (onboarding-related)"
    },
    screenshots: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    slug: "desktop-pos-javafx",
    title: "Smart Billing System for Small Retailers – POS Software",
    category: "desktop",
    description: "A robust JavaFX-based POS system that reduced billing time by 30% and empowered local retailers with modern inventory and invoicing tools.",
    problem: "Our client, a regional bookstore chain with legacy systems, faced slow billing, manual inventory tracking, and compliance issues with invoicing. Staff were frustrated with error-prone spreadsheets and lost sales data.",
    challenge: "Replace outdated, manual billing and inventory processes with an efficient, user-friendly desktop POS that meets new compliance standards and minimizes training time for non-technical staff.",
    solution: "Megicode designed and delivered a desktop POS system using JavaFX. The solution featured real-time inventory CRUD, batch product import, a visual sales dashboard, and one-click PDF invoice generation with tax calculations. We provided hands-on training and a migration script for legacy data.",
    process: [
      "Requirements Gathering & Workflow Mapping",
      "Legacy Data Audit & Migration Planning",
      "UI Prototyping (JavaFX SceneBuilder)",
      "Agile Development (3 sprints)",
      "Integration Testing with Sample Data",
      "User Acceptance Testing (store staff)",
      "Deployment & Onsite Training"
    ],
    toolsUsed: [
      "JavaFX", "SceneBuilder", "SQLite", "Maven", "PDFBox", "JasperReports", "Git", "Jira"
    ],
    artifacts: [
      { type: "UI Prototype", url: "https://github.com/megicodes/JavaFX-Billing-System/tree/main/prototypes" },
      { type: "Migration Script", url: "https://github.com/megicodes/JavaFX-Billing-System/blob/main/tools/migrate.sql" },
      { type: "Test Reports", url: "https://github.com/megicodes/JavaFX-Billing-System/tree/main/test-reports" }
    ],
    implementation: "The project was delivered over 6 weeks, with weekly check-ins and a dedicated phase for data migration. The final rollout included in-person training for all store staff and a two-week support window for post-launch troubleshooting.",
    impact: "Billing time dropped by 30%. Monthly revenue tracking improved, and manual errors in inventory management were reduced by 80%. The system enabled compliance with new tax regulations and improved customer checkout experience.",
    lessonsLearned: [
      "Early stakeholder buy-in is essential for smooth adoption.",
      "Data migration from legacy systems requires thorough validation.",
      "Hands-on training accelerates user confidence and reduces support tickets."
    ],
    nextSteps: "Future updates will introduce barcode scanning and cloud-based reporting for multi-branch analytics.",
    techStack: ["JavaFX", "SQLite", "Maven", "PDFBox", "JasperReports"],
    github: "https://github.com/megicodes/JavaFX-Billing-System",
    testimonial: "This POS system transformed our stores. Inventory headaches are gone, and our staff love the easy billing. — Owner, Regional Bookstore Chain",
    metrics: {
      "Billing Time": "-30%",
      "Inventory Errors": "-80%",
      "Checkout Satisfaction": "+25% (surveyed)",
      "Tax Compliance": "100%"
    },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    slug: "mobile-expense-tracker",
    title: "Real-Time Expense Tracker for Individuals & Families",
    category: "mobile",
    description: "A feature-rich cross-platform app that enabled families to track expenses, set budgets, and receive AI-driven insights—resulting in 1,000+ installs and a 4.7/5 user rating.",
    problem: "A growing family-focused fintech startup needed a mobile solution for collaborative expense tracking, AI-powered budgeting, and real-time alerts. Existing apps were too complex or lacked family sharing features.",
    challenge: "Build an intuitive, multi-user mobile app that enables real-time, collaborative budgeting for families, with seamless data sync and actionable insights.",
    solution: "Megicode partnered with the client to design a React Native app supporting both iOS and Android. We integrated Supabase for real-time data sync, built ML-driven budget forecasting, and implemented notifications for overspending. The UI was tailored for multi-user (family) scenarios, with intuitive category tagging and a shared dashboard.",
    process: [
      "Market Research & User Persona Development",
      "Feature Prioritization with Client",
      "Wireframing & Prototyping (Figma)",
      "Agile Development (4 sprints)",
      "Integration of Supabase for real-time sync",
      "ML Model Integration for Budget Forecasting",
      "Beta Testing with 50+ families"
    ],
    toolsUsed: [
      "React Native CLI", "Figma", "Supabase", "TensorFlow.js", "Firebase", "Redux", "Node.js", "Jest", "Slack"
    ],
    artifacts: [
      { type: "Wireframes", url: "https://www.figma.com/file/xyz123/mobile-expense-wireframes" },
      { type: "Beta Test Report", url: "https://github.com/megicodes/DigiFinSense/tree/main/beta-reports" },
      { type: "ML Model Notebook", url: "https://github.com/megicodes/DigiFinSense/blob/main/ai/budget-forecast.ipynb" }
    ],
    implementation: "The app was developed over 8 weeks, with continuous feedback from beta users. Key milestones included the launch of the family dashboard, successful real-time data sync tests, and the integration of AI-driven insights.",
    impact: "The app reached 1,200+ beta installs in the first quarter. 85% of users reported improved budget awareness. Family sharing and AI insights were the most-used features. App Store rating: 4.7/5.",
    lessonsLearned: [
      "Early beta testing uncovers real-world usage patterns.",
      "Real-time sync is a major differentiator for collaborative apps.",
      "Clear onboarding reduces support requests and increases engagement."
    ],
    nextSteps: "Planned updates include expense receipt scanning and personalized savings recommendations using advanced AI models.",
    techStack: ["React Native CLI", "Supabase", "Node.js", "Firebase", "Redux", "TensorFlow.js"],
    github: "https://github.com/megicodes/DigiFinSense",
    testimonial: "Our family finally understands where our money goes each month! The alerts and sharing make it fun. — Beta User, Family of 4",
    metrics: {
      "Beta Installs": "1,200+",
      "User Rating": "4.7/5",
      "Budget Awareness": "+85% (surveyed)",
      "Most Used Feature": "Family Sharing, AI Insights"
    },
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    slug: "ai-hr-attrition-predictor",
    title: "AI-Driven HR Insights – Employee Attrition Predictor",
    category: "ai",
    description: "A predictive analytics solution for HR that achieved 85% accuracy and reduced unexpected employee exits by 15% for a multinational enterprise.",
    problem: "A global manufacturing firm with 5,000+ employees faced high attrition and lacked data-driven tools to predict and prevent churn. HR needed actionable insights to retain top talent and reduce costly turnover.",
    challenge: "Develop an interpretable, accurate ML model and dashboard that HR teams can trust and use independently for proactive retention actions.",
    solution: "Megicode delivered an end-to-end ML pipeline: data cleaning, feature engineering, and a scikit-learn model for attrition prediction. We built interactive dashboards (Plotly Dash) for HR to filter risk by department, tenure, and performance. The project included stakeholder workshops and model explainability training.",
    process: [
      "Stakeholder Workshops & Problem Framing",
      "Data Collection & Cleaning (HRIS, surveys)",
      "Feature Engineering & Selection",
      "Model Training (scikit-learn)",
      "Dashboard Prototyping (Plotly Dash)",
      "Model Validation & Explainability Sessions",
      "Deployment & HR Training"
    ],
    toolsUsed: [
      "Python", "pandas", "scikit-learn", "Plotly Dash", "Jupyter", "Docker", "Git", "Slack"
    ],
    artifacts: [
      { type: "Feature Engineering Notebook", url: "https://github.com/megicodes/Attrition-Predictor/blob/main/notebooks/feature-engineering.ipynb" },
      { type: "Dashboard Demo", url: "https://github.com/megicodes/Attrition-Predictor/tree/main/dashboard" },
      { type: "Model Explainability Report", url: "https://github.com/megicodes/Attrition-Predictor/blob/main/reports/explainability.pdf" }
    ],
    implementation: "The solution was implemented over 12 weeks, with iterative model improvements and hands-on dashboard training for HR. Model explainability was emphasized to ensure HR buy-in and trust.",
    impact: "The model achieved 85% test accuracy. HR used the dashboard to target at-risk groups, leading to a 15% reduction in unexpected exits over 6 months. The project was featured in the company's annual innovation report.",
    lessonsLearned: [
      "Model transparency and user training drive adoption.",
      "Early engagement with HR ensures relevant features and outcomes.",
      "Continuous monitoring is key for ML solutions in production."
    ],
    nextSteps: "Next phase will add predictive turnover cost analytics and integrate with the HRIS for automated alerts.",
    techStack: ["Python", "pandas", "scikit-learn", "Plotly Dash", "Jupyter", "Docker"],
    github: "https://github.com/megicodes/Attrition-Predictor",
    testimonial: "Megicode’s data science team was proactive and transparent. The dashboards are now a core part of our HR strategy. — VP HR, Manufacturing Enterprise",
    metrics: {
      "Model Accuracy": "85%",
      "Attrition Reduction": "-15%",
      "Time to Insight": "Instant (dashboard)",
      "HR Adoption": "100% (all regions)"
    },
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
    ]
  },
  {
    slug: "predictive-pricing-nyc-taxi",
    title: "Predictive Pricing with NYC Taxi Data – AI Fare Estimator",
    category: "ai",
    description: "An AI-powered fare estimator for urban transport, reducing fare prediction error by 12% for a leading ride-hailing aggregator.",
    problem: "A ride-hailing aggregator operating in NYC needed to optimize pricing for thousands of daily trips. Their legacy model failed to account for zone, time, and surge, leading to lost revenue and customer complaints.",
    challenge: "Deliver a scalable, accurate fare prediction engine that adapts to city-scale data and changing ride patterns, with automated retraining and business-ready dashboards.",
    solution: "Megicode built a robust data pipeline: ingesting and cleaning NYC taxi trip data, extracting features (distance, duration, time of day), and training regression models for fare estimation. We implemented model monitoring and retraining scripts for continuous improvement.",
    process: [
      "Data Acquisition & Cleaning (NYC TLC dataset)",
      "Exploratory Data Analysis & Feature Extraction",
      "Model Selection & Training (scikit-learn)",
      "Performance Benchmarking & Error Analysis",
      "Dashboard Prototyping (Streamlit)",
      "Automated Model Retraining (Airflow)",
      "Deployment & Monitoring"
    ],
    toolsUsed: [
      "Python", "pandas", "seaborn", "scikit-learn", "Jupyter", "Airflow", "Git", "Streamlit"
    ],
    artifacts: [
      { type: "Feature Engineering Notebook", url: "https://github.com/megicodes/Taxi-Fare-ML-Project/blob/main/notebooks/features.ipynb" },
      { type: "Dashboard Demo", url: "https://github.com/megicodes/Taxi-Fare-ML-Project/tree/main/dashboard" },
      { type: "Retraining Pipeline Script", url: "https://github.com/megicodes/Taxi-Fare-ML-Project/blob/main/airflow/retrain.py" }
    ],
    implementation: "The fare estimator was built and deployed in 10 weeks, with weekly model performance reviews and automated retraining. The dashboard provided actionable insights for pricing and business decisions.",
    impact: "Fare prediction error dropped by 12%. The new estimator enabled better pricing, improved customer satisfaction, and increased gross margin by 7%. The model’s insights were presented at a national urban mobility conference.",
    lessonsLearned: [
      "Automated retraining is key for dynamic pricing models.",
      "Feature selection has a major impact on prediction accuracy.",
      "Business stakeholder feedback shapes dashboard usability."
    ],
    nextSteps: "Planned roadmap includes adding surge pricing prediction and expanding to new cities with transfer learning.",
    techStack: ["Python", "pandas", "seaborn", "scikit-learn", "Jupyter", "Airflow"],
    github: "https://github.com/megicodes/Taxi-Fare-ML-Project",
    testimonial: "Megicode delivered exactly what we needed—fast, reliable, and with full transparency. Our pricing is now a competitive advantage. — Data Lead, Ride-Hailing Co.",
    metrics: {
      "Prediction Error": "-12%",
      "Gross Margin": "+7%",
      "Customer Satisfaction": "+18%",
      "Model Retraining": "Automated (weekly)"
    },
    image: "https://images.pexels.com/photos/1483579/pexels-photo-1483579.jpeg?auto=compress&cs=tinysrgb&w=800",
    screenshots: [
      "https://images.pexels.com/photos/1483579/pexels-photo-1483579.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    slug: "market-trends-dashboard",
    title: "Market Trends Dashboard – Web Scraping & Data Insights",
    category: "data-engineering",
    description: "A real-time competitor monitoring dashboard that reduced manual research by 80% and enabled dynamic pricing for an e-commerce brand.",
    problem: "A fast-growing e-commerce brand needed to monitor competitor prices and visualize daily trends. Manual research was time-consuming and error-prone, and leadership lacked real-time insights for pricing decisions.",
    challenge: "Automate competitor price tracking and deliver actionable insights to leadership in real time, reducing manual research and enabling agile pricing decisions.",
    solution: "Megicode developed a Python-based web scraper (BeautifulSoup) to pull competitor prices, storing data in a time-series database. We built a Streamlit dashboard with Plotly visualizations and auto-alerts for significant price changes. The system included scheduling and email integration for daily reports.",
    process: [
      "Requirements Gathering & Data Source Mapping",
      "Scraper Development (BeautifulSoup)",
      "Database Schema Design (PostgreSQL)",
      "Dashboard Prototyping (Streamlit, Plotly)",
      "Alert Logic Implementation",
      "User Testing with Exec Team",
      "Deployment & Training"
    ],
    toolsUsed: [
      "Python", "BeautifulSoup", "Plotly", "Streamlit", "PostgreSQL", "Celery", "Git", "Jira"
    ],
    artifacts: [
      { type: "Scraper Script", url: "https://github.com/megicodes/Market-Trends-Dashboard/blob/main/scraper/scrape.py" },
      { type: "Dashboard Demo", url: "https://github.com/megicodes/Market-Trends-Dashboard/tree/main/dashboard" },
      { type: "User Guide", url: "https://github.com/megicodes/Market-Trends-Dashboard/blob/main/docs/user_guide.pdf" }
    ],
    implementation: "The dashboard was built and launched in 7 weeks, with iterative feedback from leadership. Email alerts and daily reports were integrated to maximize executive adoption.",
    impact: "Manual price research time dropped by 80%. The dashboard enabled dynamic pricing, leading to a 10% revenue boost during promotions. Leadership cited the tool as a key enabler for agile decision-making.",
    lessonsLearned: [
      "Direct user feedback shapes dashboard usability and adoption.",
      "Automated alerts reduce manual oversight and speed up response times.",
      "Data quality and source reliability are critical for ongoing success."
    ],
    nextSteps: "Planned enhancements include competitor assortment tracking and predictive price change alerts using ML.",
    techStack: ["Python", "BeautifulSoup", "Plotly", "Streamlit", "PostgreSQL", "Celery"],
    github: "https://github.com/megicodes/Market-Trends-Dashboard",
    testimonial: "We now see the whole market at a glance and can change prices instantly. Megicode’s dashboard is a game changer. — Head of Growth, E-Commerce Brand",
    metrics: {
      "Manual Research Time": "-80%",
      "Revenue During Promo": "+10%",
      "Alert Accuracy": "98%",
      "Dashboard Usage": "Daily by exec team"
    },
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
    screenshots: [
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80"
    ]
  }
];
