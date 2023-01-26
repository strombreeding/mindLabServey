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
