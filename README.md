# Çelik Raf Hesaplama

Müşterilerin duvar ölçüsünü girerek çelik raf ünitelerini otomatik yerleştirdiği ve malzeme fiyatını gördüğü tek sayfalık hesaplayıcı (`index.html`). Kurulum gerektirmez, internet bağlantısı veya harici kütüphane kullanmaz.

## Özellikler
- Duvar genişliği/yüksekliği, raf derinliği (31 / 43 / 59), profil boyu (200 / 250) ve kat sayısı seçimi
- 93 / 75 / 60 cm ünitelerle **otomatik yerleşim**: "Duvarı tam doldur" veya "En ekonomik"
- +/− ile elle düzenleme
- Ortak profilli (bitişik) veya bağımsız ünite kurulumu
- Önden şematik çizim, malzeme listesi, birim fiyatlar, %20 KDV seçeneği
- Paylaşılabilir link (seçimler linkte saklanır), WhatsApp ile gönderme, yazdırma / PDF

## Fiyatları değiştirme
`index.html` içindeki `CONFIG` bölümünü düzenleyin (raf, profil ve somun-cıvata fiyatları, WhatsApp numarası).

## Yayınlama
- **Web sitesine ekleme:** `index.html` dosyasını sitenize yükleyin (ör. `acarraf.com/raf-hesapla/`) veya bir sayfaya iframe ile gömün:
  `<iframe src="/raf-hesapla/index.html" style="width:100%;height:2200px;border:0"></iframe>`
- **GitHub Pages:** Depo ayarlarında Pages'i `main` dalı için açın. Hesaplayıcı `https://<kullanıcı>.github.io/D-KKAN/` adresinden yayınlanır.
