self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    // Add caching or other installation logic here
  });
  
  self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
    // Add fetch event handling logic here
  });
  