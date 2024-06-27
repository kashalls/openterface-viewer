import UAParser from 'ua-parser-js'

export const useBrowserDetection = () => {
  if (!import.meta.client) return null;

  const userAgent = navigator.userAgent;
  const parser = new UAParser(userAgent);
  const browser = parser.getBrowser();

  return {
    name: browser.name,
    version: browser.version,
    isChrome: /Chrome/.test(userAgent) && !/Edg/.test(userAgent),
    isFirefox: /Firefox/.test(userAgent),
    isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
    isEdge: /Edg/.test(userAgent),
    isIE: /MSIE|Trident/.test(userAgent),
  };
}
