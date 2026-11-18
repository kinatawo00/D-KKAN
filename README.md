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
- Fiyat ünite bazında ve KDV dahil: ünite (1 ayak + taban raf + 4 raf + 5 perde + 8 raf kolu) + her raf dizisinin sonuna 1 son ayak + isteğe bağlı ekstra raf.
- Ünite ölçüleri 97, 77, 67 cm; ünite ölçüsü ayağı kapsar (ayak payı 0).
- Köşelerde iki duvardan da raf derinliği, köşe rafı varsa 70 cm düşülür. Kapı, duvarı iki ayrı raf dizisine böler.
- Raf rengi (beyaz, siyah, antrasit) ve etiket rengi (kırmızı, turuncu, sarı, beyaz, antrasit, siyah) seçilir.
Birleşik sayfada üçüncü seçenektir; doğrudan link: `/raf-hesaplama#market-rafi`.
