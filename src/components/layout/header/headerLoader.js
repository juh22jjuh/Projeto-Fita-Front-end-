// src/components/layout/header/headerLoader.js
(async function loadHeader() {
  const loaderScript = document.currentScript;
  if (!loaderScript) {
    console.error('headerLoader: Não foi possível encontrar o script do loader.');
    return;
  }

  // baseURL é o caminho absoluto para esta pasta (ex: .../src/components/layout/header/)
  const baseURL = new URL('.', loaderScript.src).href;

  //
  // ▼▼▼ MUDANÇA PRINCIPAL 1: CALCULAR A RAIZ DO PROJETO ▼▼▼
  //
  // 'baseURL' é ".../src/components/layout/header/"
  // Subimos 3 níveis (header -> layout -> components -> src) para chegar na raiz do projeto.
  // O resultado será algo como: http://localhost:5500/Projeto-Fita-Front-end-/
  const projectRootURL = new URL('../../../../', baseURL).href;
  //
  // ▲▲▲ FIM DA MUDANÇA 1 ▲▲▲
  //

  const headerContainer = document.getElementById('header-container');
  if (!headerContainer) {
    console.error('headerLoader: elemento #header-container não encontrado na página.');
    return;
  }

  function alreadyLoadedHref(href) {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"], script')).some(el => el.href === href || el.src === href);
  }

  try {
    const headerHtmlUrl = new URL('header.html', baseURL).href;
    console.log('headerLoader: tentando carregar ->', headerHtmlUrl);

    const response = await fetch(headerHtmlUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status} ao buscar ${headerHtmlUrl}`);

    const headerHTML = await response.text();

    //
    // ▼▼▼ MUDANÇA PRINCIPAL 2: CORRIGIR OS CAMINHOS ANTES DE INJETAR ▼▼▼
    //
    // Usamos uma RegEx (replace(/\.\//g, ...)) para encontrar todas as
    // ocorrências de "./" no HTML e substituí-las pela URL raiz do projeto.
    // Ex: "./src/assets/logo.png" se tornará
    //     "http://localhost:5500/Projeto-Fita-Front-end-/src/assets/logo.png"
    const fixedHTML = headerHTML.replace(/\.\//g, projectRootURL);
    //
    // ▲▲▲ FIM DA MUDANÇA 2 ▲▲▲
    //

    headerContainer.innerHTML = fixedHTML; // Injeta o HTML corrigido
    console.log('headerLoader: HTML inserido.');

    // O resto do código (carregar CSS e JS) já usa o 'baseURL' e está correto.
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