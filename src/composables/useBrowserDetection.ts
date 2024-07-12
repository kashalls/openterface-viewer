export const useBrowserSupport = () => {
  if (!import.meta.client) return { };

  return {
    supported: "serial" in navigator && "mediaDevices" in navigator
  }
}
