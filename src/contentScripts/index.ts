/* eslint-disable no-console */
import { createApp } from 'vue';
import { App as VueApp } from '@vue/runtime-core';
import App from './views/App.vue';
import { Context } from './context';

let app: VueApp;

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.log('[axo] Extension initialized');
  if (!window.location.origin.includes('axosoft.com')) {
    // console.info('[axo] No Axosoft URL detected');
    return;
  }

  // mount component to context window
  const containerEl = document.createElement('div');

  const rootEl = document.createElement('div');
  rootEl.classList.add('axo-root');
  rootEl.style.height = '100%';
  rootEl.style.display = 'flex';

  const styleEl = document.createElement('link');
  const shadowDOM =
    containerEl.attachShadow?.({
      mode: __DEV__ ? 'open' : 'closed',
    }) || containerEl;
  styleEl.setAttribute('rel', 'stylesheet');
  styleEl.setAttribute(
    'href',
    browser.runtime.getURL('dist/contentScripts/style.css')
  );
  shadowDOM.appendChild(styleEl);
  shadowDOM.appendChild(rootEl);

  const bodyEl = document.getElementsByTagName('body')[0];
  console.log('[axo] Found body', bodyEl);

  const mutationObserver = new MutationObserver((records: MutationRecord[]) => {
    const classChangeRecord = records.find(
      (record) => record.attributeName === 'class'
    );
    if (!classChangeRecord) {
      return;
    }

    const className = document.querySelector('body')?.className;
    if (!className) {
      return;
    }
    console.log('[axo] ClassName', className);

    if (app) {
      console.log('[axo] unmount');
      unmountButton();
    }

    if (
      className.includes('popout') ||
      className.includes('page-viewItem') ||
      className.includes('page-editItem')
    ) {
      mountDetailButton(containerEl, rootEl);
    } else {
      mountOverviewButton(containerEl, rootEl);
    }
  });
  mutationObserver.observe(bodyEl, {
    attributes: true,
  });
})();

function mountDetailButton(
  containerEl: HTMLDivElement,
  rootEl: HTMLDivElement
) {
  console.log('[axo] mount detail');
  containerEl.style.position = '';
  containerEl.style.top = '';
  containerEl.style.right = '';
  containerEl.style.height = '';
  containerEl.style.marginTop = '-7px';
  mountButton('.toolbar.right', containerEl, rootEl, Context.Detail);
}

function mountOverviewButton(
  containerEl: HTMLDivElement,
  rootEl: HTMLDivElement
) {
  console.log('[axo] mount overview');
  containerEl.style.position = 'absolute';
  containerEl.style.top = '0';
  containerEl.style.right = '5px';
  containerEl.style.height = '100%';
  containerEl.style.marginTop = '';
  mountButton('.ontime-menubar.main', containerEl, rootEl, Context.Overview);
}

function mountButton(
  mountElSelector: string,
  containerEl: HTMLDivElement,
  rootEl: HTMLDivElement,
  context: string
) {
  const checkIfMountElExists = setInterval(() => {
    const mountEl = document.querySelector(mountElSelector);
    if (mountEl) {
      clearInterval(checkIfMountElExists);
      mountEl.appendChild(containerEl);
      app = createApp(App, { context });
      app.mount(rootEl);
    }
  }, 100);
}

function unmountButton() {
  if (!app) {
    return;
  }

  app.unmount();
}
