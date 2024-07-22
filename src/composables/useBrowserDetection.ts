export const useBrowserSupport = () => {
  if (!import.meta.client) return { supported: true };

  const config = useRuntimeConfig()

  const isPages = Boolean("CF_PAGES_COMMIT_SHA" in process.env)

  return {
    supported: "serial" in navigator && "mediaDevices" in navigator,
    isPages,
    commitSha: isPages ? process.env["CF_PAGES_COMMIT_SHA"] : config.public.VERSION
  }
}