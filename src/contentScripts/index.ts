import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'
import type { App as VueApp } from '@vue/runtime-core'
import App from './views/App.vue'
import { setupApp } from '~/logic/common-setup'

let app: VueApp;

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[axo] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[axo] Navigate from page "${data.title}"`)
  })

  if (!window.location.origin.includes('axosoft.com')) {
    // console.info('[axo] No Axosoft URL detected');
    return
  }

  // mount component to context window
  const containerEl = document.createElement('div')
  const rootEl = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM
    = containerEl.attachShadow?.({
      mode: __DEV__ ? 'open' : 'closed',
    }) || containerEl
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute(
    'href',
    browser.runtime.getURL('dist/contentScripts/style.css'),
  )
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(rootEl)

  const bodyEl = document.getElementsByTagName('body')[0]
  // console.log('[axo] Found body', bodyEl);

  const mutationObserver = new MutationObserver((records: MutationRecord[]) => {
    const classChangeRecord = records.find(
      record => record.attributeName === 'class',
    )
    if (!classChangeRecord)
      return

    const className = document.querySelector('body')?.className
    if (!className)
      return

    // console.log('[axo] ClassName', className);
    if (
      className.includes('popout')
      || className.includes('page-viewItem')
      || className.includes('page-editItem')
    )
      mountButton(containerEl, rootEl)

    else
      unmountButton()
  })
  mutationObserver.observe(bodyEl, {
    attributes: true,
  })
})()

function mountButton(containerEl: HTMLDivElement, rootEl: HTMLDivElement) {
  const checkIfToolbarDivExist = setInterval(() => {
    const toolbarEl = document.querySelector('.toolbar.right')
    if (toolbarEl) {
      clearInterval(checkIfToolbarDivExist)
      toolbarEl.appendChild(containerEl)
      app = createApp(App)
      setupApp(app)
      app.mount(rootEl)
    }
  }, 100)
}

function unmountButton() {
  if (!app)
    return

  app.unmount()
}
