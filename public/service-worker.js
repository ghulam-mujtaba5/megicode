// Basic service worker for Next.js
self.addEventListener('install', function(event) {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // Claim clients immediately
  event.waitUntil(self.clients.claim());
});

// You can add fetch event logic here if needed
