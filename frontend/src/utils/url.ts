export const isValidUrl = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://');
};

export const formatDisplayUrl = (url: string, maxLength: number = 40): string => {
  const urlWithoutProtocol = url.replace(/^https?:\/\//, '');
  
  if (urlWithoutProtocol.length <= maxLength) {
    return urlWithoutProtocol;
  }
  
  const start = urlWithoutProtocol.substring(0, 20);
  const end = urlWithoutProtocol.substring(urlWithoutProtocol.length - 20);
  return `${start}...${end}`;
};

export const getDomainFromUrl = (url: string): string => {
  return url.replace(/^https?:\/\//, '').split('/')[0];
};
