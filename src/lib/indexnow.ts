// IndexNow — notifie Bing/Yandex/Naver instantanément à la publication/màj d'un article.
// La clé est publiée à la racine : /a1b2c3d4e5f60718293a4b5c6d7e8f90.txt
// Appeler submitToIndexNow([...urls]) depuis le futur flux d'admin/publication.
const KEY = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';

export async function submitToIndexNow(urls: string[], site = 'https://rigpure.com/') {
  if (!urls.length) return false;
  const host = new URL(site).host;
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: KEY, keyLocation: `${site}${KEY}.txt`, urlList: urls }),
  });
  return res.ok;
}
