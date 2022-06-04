<template>
  <div
    class="relative flex-1 flex items-center font-sans select-none"
    :class="[className]"
  >
    <div
      v-if="tooltipIsReady"
      class="opacity-0 bg-axo-dark text-axo-gray rounded-md shadow w-max h-min font-medium"
      p="x-4 y-2"
      m="y-auto r-2"
      transition="opacity duration-300"
      :class="{ 'opacity-100': tooltipIsVisible }"
    >
      COPIED ✅
    </div>

    <div class="cursor-pointer" @click="handleClick()">
      <pixelarticons-link class="block m-auto text-axo-icon text-lg" />
    </div>
  </div>
</template>

<script lang="ts">
import 'virtual:windi.css';
import * as clipboard from 'clipboard-polyfill';
import { createKeybindingsHandler } from 'tinykeys';
import { ClipboardItemBuilder } from '../clipboard-item-builder';
import {
  getShortcutIsEnabled,
  onShortcutEnabledChanged,
} from '~/logic/storage';
import { IAppData } from '../app-data';

export default {
  props: {
    context: String,
  },
  data(): IAppData {
    return {
      tooltipIsReady: false,
      tooltipIsVisible: false,
      keyboardHandler: null,
      className: '',
    };
  },
  async mounted() {
    console.log('MOUNTED', this.context);
    setTimeout(() => {
      this.tooltipIsReady = true;
    }, 100);
    this.className = `axo-app-${this.context}`;
    console.log(this.className);
    this.keyboardHandler = this.buildKeyboardHandler();
    const shortcutIsEnabled = await getShortcutIsEnabled();
    if (shortcutIsEnabled) {
      this.addEventListener();
    }
    onShortcutEnabledChanged(this.onShortcutIsEnabledChanged);
  },
  beforeUnmount() {
    this.destoryEventListener();
  },
  methods: {
    async handleClick() {
      const item = await ClipboardItemBuilder.build(<string>this.context);
      // clipboard.write([item]).then(
      //   () => this.copySuccess(),
      //   (error) => console.error(error)
      // );
      clipboard.write([item]).then(
        () => this.onCopySuccess(),
        (error) => this.onCopyError(error)
      );
    },
    onCopySuccess(): void {
      this.tooltipIsVisible = true;
      setTimeout(() => {
        this.tooltipIsVisible = false;
      }, 1000);
    },
    onCopyError(error: any): void {
      console.error(error);
    },
    buildKeyboardHandler(): EventListener {
      return createKeybindingsHandler({
        '$mod+Shift+C': (event: KeyboardEvent) => {
          event.preventDefault();
          this.handleClick();
        },
      });
    },
    addEventListener() {
      if (!this.keyboardHandler) {
        return;
      }
      window.addEventListener('keydown', this.keyboardHandler);
    },
    destoryEventListener() {
      if (!this.keyboardHandler) {
        return;
      }
      window.removeEventListener('keydown', this.keyboardHandler);
    },
    onShortcutIsEnabledChanged(isEnabled: boolean) {
      if (isEnabled) {
        this.addEventListener();
        return;
      }
      this.destoryEventListener();
    },
  },
};
</script>
