'use client'
import React from 'react';
import styles from './ProjectFilter.module.css';
import { useTheme } from '@/context/ThemeContext';

type ProjectFilterProps = {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filters: string[];
};

const ProjectFilter = ({ activeFilter, setActiveFilter, filters }: ProjectFilterProps) => {
  const { theme } = useTheme();

  return (
    <div className={`${styles.filterContainer} ${theme === 'dark' ? styles.dark : styles.light}`}>
      <div className={styles.filterWrapper}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
            {activeFilter === filter && <div className={styles.activeIndicator} />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectFilter;
