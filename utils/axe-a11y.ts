// This file integrates axe-core for accessibility checks in development only.
import React from 'react';
import ReactDOM from 'react-dom';
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}
