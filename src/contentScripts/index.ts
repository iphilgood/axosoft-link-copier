/* eslint-disable no-console */
import { createApp } from 'vue';
import { App as VueApp } from '@vue/runtime-core';
import App from './views/App.vue';

let app: VueApp;

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  // console.log('[axo] Extension initialized');
  if (!window.location.origin.includes('axosoft.com')) {
    // console.info('[axo] No Axosoft URL detected');
    return;
  }

  // mount component to context window
  const containerEl = document.createElement('div');
  const rootEl = document.createElement('div');
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
  // console.log('[axo] Found body', bodyEl);

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

    // console.log('[axo] ClassName', className);
    if (
      className.includes('popout') ||
      className.includes('page-viewItem') ||
      className.includes('page-editItem')
    ) {
      mountButton(containerEl, rootEl);
    } else {
      unmountButton();
    }
  });
  mutationObserver.observe(bodyEl, {
    attributes: true,
  });
})();

function mountButton(containerEl: HTMLDivElement, rootEl: HTMLDivElement) {
  const checkIfToolbarDivExist = setInterval(() => {
    const toolbarEl = document.querySelector('.toolbar.right');
    if (toolbarEl) {
      clearInterval(checkIfToolbarDivExist);
      toolbarEl.appendChild(containerEl);
      app = createApp(App);
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
