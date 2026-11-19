# Çelik Raf Hesaplama

Müşterilerin duvar ölçüsünü girerek çelik raf ünitelerini otomatik yerleştirdiği ve malzeme fiyatını gördüğü tek sayfalık hesaplayıcı (`index.html`). Kurulum gerektirmez, internet bağlantısı veya harici kütüphane kullanmaz.

## Özellikler
- Duvar genişliği/yüksekliği, raf derinliği (31 / 43 / 59), profil boyu (200 / 250) ve kat sayısı seçimi
- 93 / 75 / 60 cm ünitelerle **otomatik yerleşim**: "Duvarı tam doldur" veya "En ekonomik"
- +/− ile elle düzenleme
- Ortak profilli (bitişik) veya bağımsız ünite kurulumu
- Önden şematik çizim, malzeme listesi, birim fiyatlar, %20 KDV seçeneği
- Paylaşılabilir link (seçimler linkte saklanır), WhatsApp ile gönderme, yazdırma / PDF

## Siteye ekleme (önerilen)
`raf-hesaplama-kodu.html` (aynısı `.txt` olarak da var) dosyasının tamamını Ticimax'ta **Modüller → Sayfa Yönetimi → Yeni sayfa** içeriğine, editörün kaynak kod (`<>`) modunda yapıştırın. Harici site veya üyelik gerekmez. Fiyatlar dosyanın başındaki `AYAR` bölümündedir.

`index.html` aynı hesaplayıcının tek başına açılan sürümüdür (kodun etrafına sayfa iskeleti eklenmiş hâli).

## Hafif rack hesaplayıcı
`hafif-rack-kodu.html` (aynısı `.txt`) Ticimax'ta ayrı bir sayfaya (ör. `hafif-rack-hesaplama`) aynı şekilde yapıştırılır. Ayak, travers ve raf fiyatları dosyanın başındaki `AYAR` bölümündedir. `hafif-rack.html` tek başına açılan sürümdür.

## Tek sayfa: Kendi Rafını Kendin Hesapla (güncel kullanım)
Sitedeki sayfaya yapıştırılan kod artık `kendi-rafini-hesapla.txt` dosyasıdır. Sayfa açılınca "Çelik Raf Hesapla" ve "Hafif Rack Hesapla" seçenekleri çıkar.
Bu dosya `python3 birlestir.py` ile `secim-ekrani.html`, `raf-hesaplama-kodu.html` ve `hafif-rack-kodu.html` dosyalarından üretilir; fiyat değişikliğinden sonra betiği yeniden çalıştırın.
Doğrudan açma linkleri: `/raf-hesaplama#celik-raf` ve `/raf-hesaplama#hafif-rack`.

## Market rafı hesaplayıcı
`market-rafi-kodu.html`: tek duvar, L, U veya dört duvarlı oda; kapı ve köşe rafı seçenekleri.
- Fiyat ünite bazında ve KDV dahil: ünite 4500 TL (köşe ünitesi dahil), her bağlı raf dizisinin sonuna 1 son ayak 1500 TL, isteğe bağlı ekstra raf 750 TL (köşe üniteleri dahil her üniteye).
- Ayak sayısı = ünite sayısı + dizi sayısı. Dizi yalnızca kapıda veya açık uçta kopar.
- Ünite ölçüleri 97, 77, 67 cm; her ünite için 1 cm ayak payı eklenir.
- Önerilen dizilim 97 önceliklidir: 97'likler, son iki ünitelik alan 136–196 cm kalacak şekilde dizilir; son iki ünite 97+77 (176–196), 97+67 (166–176), 77+77 (156–166), 77+67 (146–156), 67+67 (136–146). Alan 136 cm'den küçük kalırsa son üç ünite 77/67 ile en az boşlukla tamamlanır.
- Köşelerde iki duvardan da raf derinliği, köşe rafı varsa 70 cm düşülür. Kapı genişliği duvardan düşülür.
- Raf rengi (beyaz, siyah, antrasit) ve etiket rengi (kırmızı, turuncu, sarı, beyaz, antrasit, siyah) seçilir.
Birleşik sayfada üçüncü seçenektir; doğrudan link: `/raf-hesaplama#market-rafi`.

## Kod kontrolü
`python3 birlestir.py` birleşik kodu üretirken:
- kodda rakamdan hemen sonra kesme işareti (ör. `97'lik`) varsa durur. Bu kalıp site güvenlik duvarınca SQL saldırısı sanılıp Ticimax'ta kaydetmeyi engelliyor.
- `node` kuruluysa her betiğin sözdizimini `node --check` ile denetler.

## Siteye ekleme (güncel yöntem)
Ticimax panelinden uzun kod göndermek güvenlik duvarına takılıp IP engeline yol açtığı için hesaplayıcı tek dosyada (`raf-hesapla.js`) toplanır ve jsDelivr üzerinden yayınlanır.
Sayfa içeriğine yalnızca `sayfa-kodu.txt` dosyasındaki iki satır yapıştırılır.

Güncelleme adımları:
1. Kaynak dosyaları düzenle, `python3 birlestir.py` çalıştır, değişiklikleri gönder (push).
2. jsDelivr önbelleğini temizle: `curl https://purge.jsdelivr.net/gh/kinatawo00/D-KKAN@ccr-0392e0ab-f5pjug/raf-hesapla.js`
Yükleyici dal adını (`@ccr-0392e0ab-f5pjug`) kullandığı için sitedeki kodu değiştirmek gerekmez.

### Sayfa içeriği kaydedilemezse: Script Yönetimi yükleyicisi
Ticimax sayfa içeriğine `<script>` içeren kod kaydedilemiyorsa `script-yonetimi-yukleyici.txt` Script Yönetimi'ne (Tüm Sayfalar) eklenir.
Yükleyici yalnızca `/raf-hesaplama` sayfasında çalışır: sayfadaki eski hesaplayıcıyı (`#raf-secim`) veya "Raf hesaplayıcı yükleniyor" yazısını yeni hesaplayıcıyla değiştirir; ikisi de yoksa içeriğin sonuna ekler.
Yükleyici dal adını kullandığı için güncellemelerde sitedeki kod değişmez; yalnızca jsDelivr önbelleği temizlenir.

## Fiyat listesi PDF
`node fiyat-listesi/olustur.js` (önce `python3 birlestir.py`) üç raf sisteminin fiyat listesini `fiyat-listesi/acar-raf-fiyat-listesi.pdf` olarak üretir.
Fiyatlar hesaplayıcı dosyalarındaki `AYAR` bölümlerinden okunur, görseller hesaplayıcıların kendi çizimleridir. Fiyat değişince betiği yeniden çalıştırmak yeterlidir.

## PDF teklif
Her hesaplayıcıda "PDF olarak indir" düğmesi vardır (`pdf-teklif-kodu.html`). Düğme, sonucu (özet, oda planı, raf çizimleri, fiyat dökümü) yazdırılabilir bir teklif sayfasında açar; tarayıcının yazdırma penceresinde "PDF olarak kaydet" seçilir.
