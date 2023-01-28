/**
 *
 */
export const randomNumber = () => {
  return Number(
    String(Math.floor(Math.random() * 100)) +
      String(Date.now() - 1674700000000) +
      String(Math.floor(Math.random() * 10000)).replace(/0/g, ''),
  );
};

export const getClientOs = (userAgent: string) => {
  const compare = userAgent.toLowerCase();
  // let userAgent = '';
  if (compare.indexOf('windows') > -1) {
    userAgent = 'Windows';
  } else if (compare.indexOf('iphone') > -1) {
    userAgent = 'Iphone';
  } else if (compare.indexOf('ipad') > -1) {
    userAgent = 'Ipad';
  } else if (compare.indexOf('android') > -1) {
    userAgent = 'Android';
  } else if (compare.indexOf('mac') > -1) {
    userAgent = 'Mac';
  } else {
    userAgent = 'Unknown';
  }
  return userAgent;
};
