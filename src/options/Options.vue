<template>
  <main class="text-gray-700 dark:text-gray-200">
    <div class="container mx-auto max-w-screen-sm px-4">
      <h1 class="flex items-center my-8">
        <pixelarticons-sliders class="mr-2 text-2xl" />
        Options
      </h1>

      <div class="mb-4">
        <label class="block mb-2 text-sm" for="delimiter">
          Delimiter between number and title
        </label>

        <input
          id="delimiter"
          v-model="delimiter"
          class="border border-gray-400 rounded px-2 py-1"
          name="delimiter"
        />
      </div>

      <div class="mb-4">
        <input
          id="shortcutIsEnabled"
          v-model="shortcutIsEnabled"
          type="checkbox"
          class="border border-gray-400 rounded px-2 py-1"
          name="shortcutIsEnabled"
        />
        <label class="ml-2 text-sm" for="shortcutIsEnabled">
          Shortcut is enabled
        </label>

        <span class="block my-2 text-xs gray-400">
          Shortcut is:
          <pre class="inline">ctrl/cmd+shift+c</pre>
        </span>
      </div>

      <div class="mt-8 text-xs">
        Powered by Vite <pixelarticons-zap class="align-middle" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  getDelimiter,
  getShortcutIsEnabled,
  setDelimiter,
  setShortcutIsEnabled,
} from '~/logic/storage';
</script>

<script lang="ts">
export default {
  data() {
    return {
      delimiter: '',
      shortcutIsEnabled: false,
    };
  },
  watch: {
    async delimiter(newDelimiter: string, _oldDelimiter: string) {
      await setDelimiter(newDelimiter);
    },
    async shortcutIsEnabled(newValue: boolean) {
      await setShortcutIsEnabled(newValue);
    },
  },
  async mounted() {
    this.delimiter = await getDelimiter();
    this.shortcutIsEnabled = await getShortcutIsEnabled();
  },
};
</script>
