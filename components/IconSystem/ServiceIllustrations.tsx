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
  ai: '/lottie/ai-brain.json',
  web: '/lottie/web-coding.json',
  mobile: '/lottie/mobile-app.json',
  uiux: '/lottie/design-ux.json',
  cloud: '/lottie/cloud-devops.json',
  data: '/lottie/analytics-data.json',
  automation: '/lottie/automation-gears.json',
  consulting: '/lottie/security-it.json',
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
