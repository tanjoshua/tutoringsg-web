export const postalCodeToRegion = (postalCode: string) => {
  // might wanna replace with more districts in the future
  if (postalCode.length !== 6) {
    return "";
  }

  const first2digits = parseInt(postalCode.slice(0, 2));
  if (first2digits < 34) {
    return;
  } else if (first2digits < 53) {
    return;
  } else if (first2digits < 58) {
    return;
  } else if (first2digits < 72) {
    return;
  } else {
    return;
  }
};
