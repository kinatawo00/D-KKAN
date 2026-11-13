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
`index.html` içindeki `CONFIG` bölümünü düzenleyin (raf, profil, somun-cıvata ve pabuç fiyatları, WhatsApp numarası).

## Yayınlama
1. **GitHub Pages:** Depo → Settings → Pages → "Deploy from a branch" → `main` / `(root)` → Save. Birkaç dakika sonra hesaplayıcı `https://kinatawo00.github.io/D-KKAN/` adresinde açılır. Bu link doğrudan müşterilerle paylaşılabilir.
2. **Siteye gömme (Ticimax):** Yeni bir içerik sayfası açın, editörü HTML / kaynak kod moduna alın ve `site-embed.html` dosyasının içeriğini yapıştırın. Çerçevenin yüksekliği kendiliğinden ayarlanır.
