// src/components/layout/header/headerLoader.js
(async function loadHeader() {
  const loaderScript = document.currentScript;
  // baseURL será a pasta onde este loader está (ex: http://localhost:3000/src/components/layout/header/)
  const baseURL = loaderScript ? new URL('.', loaderScript.src).href : (window.location.origin + '/src/components/layout/header/');

  const headerContainer = document.getElementById('header-container');
  if (!headerContainer) {
    console.error('headerLoader: elemento #header-container não encontrado na página.');
    return;
  }

  // Helpers para evitar carregar duplicado
  function alreadyLoadedHref(href) {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"], script')).some(el => el.href === href || el.src === href);
  }

  try {
    const headerHtmlUrl = new URL('header.html', baseURL).href;
    console.log('headerLoader: tentando carregar ->', headerHtmlUrl);

    const response = await fetch(headerHtmlUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status} ao buscar ${headerHtmlUrl}`);

    const headerHTML = await response.text();
    headerContainer.innerHTML = headerHTML;
    console.log('headerLoader: HTML inserido.');

    // carrega CSS se ainda não carregado
    const cssUrl = new URL('header.css', baseURL).href;
    if (!alreadyLoadedHref(cssUrl)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssUrl;
      document.head.appendChild(link);
      console.log('headerLoader: CSS adicionado ->', cssUrl);
    } else {
      console.log('headerLoader: CSS já estava carregado.');
    }

    // carrega script do header se ainda não carregado
    const jsUrl = new URL('header.js', baseURL).href;
    if (!alreadyLoadedHref(jsUrl)) {
      const script = document.createElement('script');
      script.src = jsUrl;
      script.defer = true;
      document.body.appendChild(script);
      script.addEventListener('load', () => console.log('headerLoader: header.js carregado e executado.'));
    } else {
      console.log('headerLoader: header.js já estava carregado.');
    }

  } catch (err) {
    console.error('headerLoader: Erro ao carregar header:', err);
  }
})();