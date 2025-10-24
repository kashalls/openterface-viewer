export const useBrowserSupport = () => {
  if (!import.meta.client) return { supported: true };

  const config = useRuntimeConfig()

  const isPages = Boolean("CF_PAGES_COMMIT_SHA" in process.env)

  const serial = "serial" in navigator;
  const usb = "usb" in navigator;
  const media = "mediaDevices" in navigator;

  return {
    serial, usb, media,
    supported: Boolean(serial && usb && media),
    commitSha: isPages ? process.env["CF_PAGES_COMMIT_SHA"] : config.public.VERSION
  }
}