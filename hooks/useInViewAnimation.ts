import { useEffect } from 'react';

export function useInViewAnimation() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const els = document.querySelectorAll('[data-animate]');
    const observer = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
