export default function isJsonValid(json: string) {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
}
