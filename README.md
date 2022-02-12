# Axosoft Link Copier

This is a Firefox and Chromium browser extension which allows you to copy nice links of an Axosoft item to your clipboard.

<p align="center">
<img width="655" src="./docs/images/axosoft-link-copier.png"><br/>
</p>

## Features

- Button to copy link to current Axosoft item
- Possibility to change delimiter between item number and title
- Possibility to enable a shortcut for even faster copy

## Downloads

- [Firefox](https://addons.mozilla.org/en-GB/firefox/addon/axosoft-link-copier/)
- [Chromium](https://chrome.google.com/webstore/detail/axosoft-link-copier/hegmcnlplcgnkbgcgjeaahhccocffllg)

## Usage

### Folders

- `src` - main source.
  - `contentScript` - scripts and components to be injected as `content_script`
  - `background` - scripts for background.
  - `components` - auto-imported Vue components that shared in popup and options page.
  - `styles` - styles shared in popup and options page
  - `manifest.ts` - manifest for the extension.
- `extension` - extension package root.
  - `assets` - static assets.
  - `dist` - built files, also serve stub entry for Vite on development.
- `scripts` - development and bundling helper scripts.

### Development

```bash
pnpm dev
```

Then **load extension in browser with the `extension/` folder**.

For Firefox developers, you can run the following command instead:

```bash
pnpm start:firefox
```

`web-ext` auto reload the extension when `extension/` files changed.

> While Vite handles HMR automatically in the most of the case, [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) is still recommanded for cleaner hard reloading.

### Build

To build the extension and generate artefacts, run

```bash
pnpm build
```

To generate ZIP file of the whole project for reviewers

```bash
pnpm pack
```

To build XPI which can be uploaded to stores

```bash
pnpm pack:xpi
```

## Shoutouts

A massive shoutout goes out to [@antfu](https://github.com/antfu) who provided the base of this project with the [vitesse-webext](https://github.com/antfu/vitesse-webext) template. Thank you 🎉
