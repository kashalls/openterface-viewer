export const useBrowserSupport = () => {
  if (!import.meta.client) return { supported: true };

  return {
    supported: "serial" in navigator && "mediaDevices" in navigator
  }
}
