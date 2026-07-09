import React from 'react';

import styles from './article.module.css';

interface AuthorProfile {
  name: string;
  title: string;
  avatarText: string;
  bio: string;
  linkedin?: string;
  github?: string;
  verified: boolean;
}

const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  'Ghulam Mujtaba': {
    name: 'Ghulam Mujtaba',
    title: 'Founder & Principal Architect at Megicode',
    avatarText: 'GM',
    bio: 'Ghulam Mujtaba is the founder and principal architect at Megicode. With years of experience design-engineering scalable custom platforms, financial systems, and AI-driven solutions, he writes on startup MVP scope, tech stack planning, and cloud infrastructure.',
    linkedin: 'https://www.linkedin.com/in/ghulam-mujtaba5/',
    github: 'https://github.com/ghulam-mujtaba5',
    verified: true,
  },
  Azan: {
    name: 'Azan',
    title: 'Co-Founder & Lead Systems Engineer',
    avatarText: 'AZ',
    bio: 'Azan is the co-founder and lead engineer at Megicode, specializing in business workflow automation, Turso/SQL integrations, and secure backend architectures.',
    linkedin: 'https://www.linkedin.com/in/ghulam-mujtaba5/',
    verified: true,
  },
  'Megicode Team': {
    name: 'Megicode Team',
    title: 'Senior Engineering & Product Strategy Team',
    avatarText: 'MC',
    bio: 'The Megicode Team comprises senior full-stack developers, AI architects, and UI/UX strategists. We ship production-grade, highly optimized B2B software, Next.js web applications, and generative AI agents for clients worldwide.',
    linkedin: 'https://www.linkedin.com/company/megicode',
    github: 'https://github.com/ghulam-mujtaba5',
    verified: true,
  },
};

interface AuthorCardProps {
  authorName?: string;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ authorName = 'Megicode Team' }) => {
  const profile = AUTHOR_PROFILES[authorName] || AUTHOR_PROFILES['Megicode Team'];

  return (
    <div className={styles.authorCard}>
      <div className={styles.authorCardLayout}>
        <div className={styles.authorCardLeft}>
          <div className={styles.authorAvatarBig}>
            {profile.avatarText}
            {profile.verified && (
              <span className={styles.verifiedBadge} title="Verified Expert Author">
                ✓
              </span>
            )}
          </div>
        </div>
        <div className={styles.authorCardRight}>
          <div className={styles.authorHeader}>
            <div>
              <h4 className={styles.authorCardName}>{profile.name}</h4>
              <p className={styles.authorCardTitle}>{profile.title}</p>
            </div>
            <div className={styles.authorSocials}>
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.authorSocialLink}
                  aria-label={`${profile.name}'s LinkedIn profile`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.authorSocialLink}
                  aria-label={`${profile.name}'s GitHub profile`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
              )}
            </div>
          </div>
          <p className={styles.authorCardBio}>{profile.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorCard;
