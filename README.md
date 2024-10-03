# openterface-viewer

> [!WARNING]
> This software is experimental and **NOT FIT FOR PRODUCTION USE!**

Openterface Viewer is a open source alternative to the open source [Openterface-QT](https://github.com/TechxArtisanStudio/Openterface_QT) that requires it to be installed to a machine. Openterface Viewer works in Chromium-based browers using the [WebUSB API](https://developer.mozilla.org/en-US/docs/Web/API/WebUSB_API) which is commonly used with Google products to restore devices that offer a serial connection over USB.

This project is a WIP and may break between openterface versions.

This project is a contestant in [Crowd Supply's USB KVM DIY Challenge 2024](https://www.crowdsupply.com/techxartisan/usb-kvm-diy-challenge-2024). Enter your project today!

TechXArtisan has provided me a beta device to build this with, but otherwise has no control over what is implemented here. I am not affiliated with TechXArtisan other than being a community dev hero.

## Setup

In development, I use [bun.sh](https://bun.sh/) as my alternative npm installer. You can install this with [brew.sh](https://brew.sh/) or through their scripts. This will likely work with npm or other alternatives.

Make sure to install the dependencies:

```bash
# npm
npm install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
