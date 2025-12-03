# Lighthouse CI Configuration
url=http://127.0.0.1:4173

[lighthouserc:ci]
collect:
  startServerCommand=npm run preview
  startServerReadyPattern=Local:
  url=http://127.0.0.1:4173
  numberOfRuns=3

upload:
  target=temporary-public-storage

assert:
  preset=lighthouse:no-pwa
  assertions:
    categories:performance=[0.9,null]
    categories:accessibility=[0.95,null]
    categories:best-practices=[0.9,null]
    categories:seo=[0.9,null]
    categories:pwa=[0.9,null]