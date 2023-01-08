<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
</script>

<script lang="ts">
import * as clipboard from 'clipboard-polyfill'
import { createKeybindingsHandler } from 'tinykeys'
import {
  getDelimiter,
  getShortcutIsEnabled,
  onShortcutEnabledChanged,
} from '~/logic/storage'

const [show, toggle] = useToggle(false)

interface IAppData {
  tooltipIsReady: boolean
  tooltipIsVisible: boolean
  keyboardHandler: EventListener | null
}

export default {
  data(): IAppData {
    return {
      tooltipIsReady: false,
      tooltipIsVisible: false,
      keyboardHandler: null,
    }
  },
  async mounted() {
    setTimeout(() => {
      this.tooltipIsReady = true
    }, 100)
    this.keyboardHandler = this.buildKeyboardHandler()
    const shortcutIsEnabled = await getShortcutIsEnabled()
    if (shortcutIsEnabled)
      this.addEventListener()

    onShortcutEnabledChanged(this.onShortcutIsEnabledChanged)
  },
  beforeUnmount() {
    this.destoryEventListener()
  },
  methods: {
    async handleClick() {
      const url = this.getItemUrl()
      const description = await this.getItemDescription()
      const item = this.buildClipboardItem(url, description)
      clipboard.write([item]).then(
        () => {
          this.copySuccess()
        },
        (error) => {
          console.error(error)
        },
      )
    },
    buildClipboardItem(itemUrl: string, itemDescription: string) {
      const html = `<a href=\"${itemUrl}\">${itemDescription}</a>`
      const htmlMimeType = 'text/html'
      const textMimeType = 'text/plain'

      return new clipboard.ClipboardItem({
        [htmlMimeType]: new Blob([html], {
          type: htmlMimeType,
        }),
        [textMimeType]: new Blob([itemUrl], {
          type: textMimeType,
        }),
      })
    },
    copySuccess(): void {
      this.tooltipIsVisible = true
      setTimeout(() => {
        this.tooltipIsVisible = false
      }, 1000)
    },
    getItemId(): string {
      const itemId = document.querySelector('.item-field-id')?.textContent
      if (!itemId)
        return ''

      return itemId
    },
    getItemTitle(): string {
      let itemTitle = document.querySelector('.item-field-name')?.textContent
      if (!itemTitle) {
        const titleInput = document.querySelector(
          'input#name',
        ) as HTMLInputElement
        itemTitle = titleInput.value
      }
      if (!itemTitle)
        return ''

      return itemTitle
    },
    async getItemDescription(): Promise<string> {
      const itemId = this.getItemId()
      const itemTitle = this.getItemTitle()
      const delimiter = await getDelimiter()
      return `${itemId}${delimiter}${itemTitle}`
    },
    getItemUrl(): string {
      const origin = window.location.origin
      const itemId = this.getItemId()
      if (!origin || !itemId)
        return ''

      return `${origin}/viewitem?id=${itemId}&type=features&force_use_number=true`
    },
    buildKeyboardHandler(): EventListener {
      return createKeybindingsHandler({
        '$mod+Shift+C': (event: KeyboardEvent) => {
          event.preventDefault()
          this.handleClick()
        },
      })
    },
    addEventListener() {
      if (!this.keyboardHandler)
        return

      window.addEventListener('keydown', this.keyboardHandler)
    },
    destoryEventListener() {
      if (!this.keyboardHandler)
        return

      window.removeEventListener('keydown', this.keyboardHandler)
    },
    onShortcutIsEnabledChanged(isEnabled: boolean) {
      if (isEnabled) {
        this.addEventListener()
        return
      }
      this.destoryEventListener()
    },
  },
}
</script>

<template>
  <div class="relative h-30px -top-2 flex items-center font-sans select-none">
    <div
      v-if="tooltipIsReady" class="opacity-0 bg-axo-dark text-axo-gray rounded-md shadow w-max h-min font-medium"
      p="x-4 y-2" m="y-auto r-2" transition="opacity duration-300" :class="{ 'opacity-100': tooltipIsVisible }"
    >
      COPIED ✅
    </div>

    <div class="cursor-pointer" @click="handleClick()">
      <pixelarticons-link class="block m-auto text-axo-icon text-lg" />
    </div>
  </div>
</template>
