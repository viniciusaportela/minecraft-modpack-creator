export default function useParams(param: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
