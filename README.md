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
Yükleyici dal adını kullandığı için güncellemelerde sitedeki kod değişmez; yalnızca jsDelivr önbelleği temizlenir. Adresin sonundaki `?v=` değeri 10 dakikada bir değişir; böylece tarayıcılar (jsDelivr 7 gün sakla dese de) en geç 10 dakika içinde yeni sürümü alır.

## Fiyat listesi PDF
`node fiyat-listesi/olustur.js` (önce `python3 birlestir.py`) üç raf sisteminin fiyat listesini `fiyat-listesi/acar-raf-fiyat-listesi.pdf` olarak üretir.
Fiyatlar hesaplayıcı dosyalarındaki `AYAR` bölümlerinden okunur, görseller hesaplayıcıların kendi çizimleridir. Fiyat değişince betiği yeniden çalıştırmak yeterlidir.

## PDF teklif
Her hesaplayıcıda "PDF olarak indir" düğmesi vardır (`pdf-teklif-kodu.html`). Düğme, sonucu (özet, oda planı, raf çizimleri, fiyat dökümü) doğrudan PDF dosyası olarak indirir (html2pdf.js 0.10.1, jsDelivr). Çizimler PDF'e konmadan önce PNG resme çevrilir. Kütüphane yüklenemezse yedek olarak yazdırma penceresi açılır.

## Mağaza sistemleri (giyim mağazaları)
`magaza-kodu.html`: dördüncü grup. Boş oda (tek duvar, L, U, dört duvar), kapı ve tavan yüksekliği.
Bir sistem (bölme) iki F dikmenin arasıdır: 1 AB1 borusu + 1 baston (üstte), 1 UB1 borusu (altta), 1 raf + 2 raf kolu (UB1 borusunun biraz üstünde).
Yan yana sistemler aradaki dikmeyi paylaşır: dikme = sistem + 1 (her dizi için). Ünite genişlikleri yalnızca 60 ve 90 cm: önce 60 cm üniteler dizilir, kalan boşluk yetiyorsa bazıları 90 cm üniteye çevrilir. Köşede bir duvar tam ölçü kullanılır, sonraki duvardan 50 cm düşülür (`AYAR.kosePayi`).
Fiyatlar (`AYAR.fiyat`, `AYAR.raflar`): dikme 1500, AB1 300, UB1 360, baston 120, raf kolu 60, kanca 22 (25 adetlik paket 549,99 TL); raf 1,8 sunta 400, 3 cm sunta 600, 1,8 cm MDF 520, 1,8 cm siperli MDF (fiyatı henüz yok).
Renk/kaplama yalnızca metal parçaları etkiler: siyah/beyaz/antrasit ×1, gold/bakır/krom boya ×1,5, gold/bakır kaplama ×1,8, rose kaplama ×2.
Modeller (`AYAR.modeller`). Sayfanın başındaki seçim bütün ünitelere uygulanır; sonra her ünitenin modeli ayrı seçilebilir (çizimde üniteye tıklayarak veya ünite listesinden):
1. Raflı askı sistemi: AB1 + baston, UB1, 1 raf + 2 raf kolu
2. Rafsız askı sistemi: AB1 + baston, UB1
3. 5 UB1 borulu sistem: 5 UB1
4. 5 raflı sistem: 5 raf + 10 raf kolu
5. 2 UB1 borulu sistem: 2 UB1
6. 2 AB1 bastonlu sistem: 2 AB1 + 2 baston (her AB1 için 1)
7. 5 AB1 bastonlu sistem: 5 AB1 + 15 baston (her AB1 için 3)
8. 5 AB1 kancalı sistem: 5 AB1 + 35 kanca (her AB1 için 7; 10x30 profil kancası)
Dizilim: 60 cm ünite sayısı çiftse 90 cm üniteler ortaya konur (ör. 60-60-90-60-60), değilse sona (ör. 60-60-60-90); +/− ile adet değişince de bu kural uygulanır. Çizimde üniteye basılı tutup sürükleyerek aynı duvar bölümünde yeri değiştirilebilir (fare ve dokunmatik).
Renkler üç ayrı seçilir: metal aksam (dikme, AB1, UB1, baston, kanca, raf kolu; fiyat çarpanı bundan), raf rengi (`AYAR.rafRenkleri`: doğal / beyaz / siyah / antrasit, fiyatı etkilemez) ve dekor rengi (çesan ve kubbe; dekor fiyatı girildiğinde çarpanı bundan).
Kapının olduğu duvara raf sistemi kurulmaz: kapının yanlarına podyum ve cansız manken çizilir (`AYAR.podyum`, sadece görsel, fiyata girmez).
Kolon, girinti ve engeller (`AYAR.engelTipleri`): kapı gibi istenen duvara, başından uzaklık, genişlik ve derinlik (diğer engelde yükseklik) ile eklenir. Kolon / çıkıntı ve diğer engellerin (radyatör, pano vb.) önüne sistem kurulmaz, duvar o noktada bölünür; girintinin (niş) içine ayrı bölüm olarak sistem kurulur. Planda ve duvar çiziminde gösterilir.
3D görünüm: Yerleşim bölümündeki "3D görünümü aç" düğmesi three.js (0.147, jsDelivr) kütüphanesini yalnızca o an yükler; oda, duvarlar, kapı, kolon/girinti/engeller, dikmeler, borular, baston/kanca, raflar, çesan, kubbe, podyum ve mankenler gerçek ölçülerle çizilir. Fareyle / parmakla döndürülür ve yakınlaştırılır; kameraya bakan duvarlar otomatik gizlenir (maket evi görünümü). Seçimler değiştikçe 3D görünüm kendiliğinden yenilenir.
Dikme sistemi her duvar için ayrı seçilir (`AYAR.dikmeler`): F dikme (yerden başlar) veya C dikme (her zaman yerden 60 cm yüksekte; altına dolap / çekmece konabilir). Boy, profil (30x30 / 40x40) ve kulak mesafesi F ve C için ayrı girilir; renkler ortaktır. C dikme fiyatı henüz yok (`fiyat: null`). Sayfa sırası: duvarlar ve dikme sistemi, model, seçenekler, yerleşim, fiyat. Her duvarın üstünde "Bu duvarın bütün üniteleri" model seçimi vardır.
Dekorlar (fiyatları henüz yok, `fiyat: null`: tabloda adet ve "Fiyat sorunuz" yazar, toplamın yanında "dekor fiyatı hariç" notu çıkar):
- Arkaya çesan (`AYAR.cesanlar`): baklava çesan veya 5x5 (kare) çesan; her ünite ya da aralıklı (duvardaki 1., 3., 5. ... ünite).
- Üste kubbe (`AYAR.kubbe`): dikmelerin üst ucuna takılan kemer; her ünite ya da aralıklı.
Ekstralar (bütün ünitelere): AB1 borulu her üniteye ekstra baston ve/veya kanca (en üstteki AB1 borusundan başlayarak dağıtılır); istenirse her ünitenin en üstüne 1 raf + 2 raf kolu.
Yeni model eklemek için `AYAR.modeller` içine parça adetleriyle bir satır eklemek yeterlidir.
Doğrudan link: `/raf-hesaplama#magaza-sistemleri`.
