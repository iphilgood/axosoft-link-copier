<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />

    <h1 class="mb-4">Hi buddy 👋</h1>

    <p class="mb-6 opacity-50 text-sm">
      I'll be there when you view an Axosoft item.
    </p>

    <button
      class="btn bg-axo-dark text-axo-gray font-medium text-sm hover:(bg-axo-dark)"
      @click="openOptionsPage()"
    >
      Open Options
    </button>
  </main>
</template>

<script lang="ts">
export default {
  methods: {
    openOptionsPage() {
      browser.runtime.openOptionsPage();
    },
  },
};
</script>
