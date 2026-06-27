'use client';
import React from 'react';

import LottiePlayer from '../LottiePlayer/LottiePlayer';

export type ServiceIllusType =
  | 'ai'
  | 'web'
  | 'mobile'
  | 'uiux'
  | 'cloud'
  | 'data'
  | 'automation'
  | 'consulting';

const LOTTIE_MAP: Record<ServiceIllusType, string> = {
  ai: '/lottie/01_ai_saas_dashboard.json',
  web: '/lottie/03_software_development_code.json',
  mobile: '/lottie/04_mobile_app_development.json',
  uiux: '/lottie/14_uiux_web_design.json',
  cloud: '/lottie/05_cloud_infrastructure.json',
  data: '/lottie/07_data_analytics_growth.json',
  automation: '/lottie/02_ai_automation_agent.json',
  consulting: '/lottie/06_cybersecurity_trust.json',
};

interface ServiceIllusProps {
  type: ServiceIllusType;
  size?: number;
  isDark?: boolean;
}

export const ServiceIllustration: React.FC<ServiceIllusProps> = ({ type, size = 100 }) => (
  <LottiePlayer
    src={LOTTIE_MAP[type]}
    loop
    autoplay
    pauseWhenHidden
    speed={0.6}
    style={{ width: size, height: size }}
  />
);

export default ServiceIllustration;
