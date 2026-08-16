(function () {
  'use strict';

  const metaValue = document.querySelector('meta[name="boycelab-api-base"]')?.content?.trim();
  const baseUrl = (metaValue || 'https://api.boycelab.com').replace(/\/$/, '');

  window.BoyceApiConfig = Object.freeze({
    baseUrl: baseUrl,
    healthUrl: `${baseUrl}/health`
  });
})();
