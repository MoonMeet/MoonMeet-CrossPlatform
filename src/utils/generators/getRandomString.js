export default function getRandomString(length) {
  const randomChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars?.charAt(
      Math?.floor(Math?.random() * randomChars?.length),
    );
  }
  return result;
}
