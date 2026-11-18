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

## Ticimax'a yapıştırılacak küçük kod
Birleşik kod büyüdüğü için Ticimax editörü kaydederken takılabiliyor. `kucult.js` betik kısımlarını sıkıştırır:
`npm i terser` yapılmış bir klasörü `NODE_PATH` ile göstererek `node kucult.js` çalıştırın; çıktı `kendi-rafini-hesapla-kucuk.txt` olur (yaklaşık %30 daha küçük, aynı işlev).
