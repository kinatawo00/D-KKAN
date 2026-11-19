// Fiyat listesi PDF'i üretir: çelik raf, hafif rack ve market rafı.
// Fiyatlar hesaplayıcıların AYAR bölümlerinden okunur; görseller hesaplayıcıların kendi çizimleridir.
// Çalıştırma (depo kökünden):  python3 birlestir.py && node fiyat-listesi/olustur.js
// Çıktı: fiyat-listesi/acar-raf-fiyat-listesi.pdf
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const KOK = path.join(__dirname, "..");
const CIKTI = path.join(__dirname, "acar-raf-fiyat-listesi.pdf");

// ---- hesaplayıcı dosyalarından AYAR nesnesini oku
function ayarOku(dosya) {
  const s = fs.readFileSync(path.join(KOK, dosya), "utf8");
  const m = s.match(/var AYAR = (\{[\s\S]*?\n  \});/);
  if (!m) throw new Error(dosya + ": AYAR bulunamadı");
  return Function('"use strict"; return (' + m[1] + ");")();
}
const CELIK = ayarOku("raf-hesaplama-kodu.html");
const RACK = ayarOku("hafif-rack-kodu.html");
const MARKET = ayarOku("market-rafi-kodu.html");

const tl = n => n.toLocaleString("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 });
const yuvarla = n => Math.round(n * 100) / 100;
const kdvC = n => yuvarla(n * (1 + CELIK.kdv));   // çelik raf fiyatları KDV hariç girilir
const kdvR = n => yuvarla(n * (1 + RACK.kdv));    // hafif rack fiyatları KDV hariç girilir
// market rafı fiyatları zaten KDV dahil

const BUGUN = new Date().toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });

// SVG içindeki id'leri benzersiz yap (aynı belgede birden çok çizim olduğunda renkler karışmasın)
function benzersiz(svg, ek) {
  const ids = [...svg.matchAll(/id="([^"]+)"/g)].map(m => m[1]);
  ids.forEach(id => {
    svg = svg.split('id="' + id + '"').join('id="' + id + ek + '"').split("url(#" + id + ")").join("url(#" + id + ek + ")");
  });
  return svg.replace(/<svg /, '<svg preserveAspectRatio="xMidYMid meet" ');
}

async function cizimleriAl(b) {
  const p = await b.newPage({ viewport: { width: 1100, height: 1400 } });
  const sayfa = "file://" + path.join(KOK, "kendi-rafini-hesapla.html");
  const svg = async sec => p.locator(sec).first().evaluate(e => e.outerHTML);
  const c = {};

  // Çelik raf: 31 cm, 200 cm, 5 kat, 300 cm duvar (bitişik)
  await p.goto(sayfa + "#celik-raf"); await p.reload();
  await p.fill('#rh-dw [data-dw="0"][data-f="w"]', "300");
  c.celik = await svg("#raf-hesap .rh-cz svg");
  // Çelik raf: 43 cm, 250 cm, 6 kat, ayrı üniteler
  await p.selectOption('#rh-dw [data-dw="0"][data-f="d"]', "43");
  await p.selectOption('#rh-dw [data-dw="0"][data-f="p"]', "250");
  await p.check('#raf-hesap input[name="rh-t"][value="a"]');
  await p.fill('#rh-dw [data-dw="0"][data-f="w"]', "200");
  c.celik2 = await svg("#raf-hesap .rh-cz svg");

  // Hafif rack: turuncu-mavi, 0,70 mm sac
  await p.goto(sayfa + "#hafif-rack"); await p.reload();
  await p.fill('#rk-dw [data-dw="0"][data-f="w"]', "249");
  c.rack = await svg("#rack-hesap .rk-cz svg");
  // Hafif rack: beyaz, sunta
  await p.selectOption('#rk-dw [data-dw="0"][data-f="r"]', "beyaz");
  await p.selectOption('#rk-dw [data-dw="0"][data-f="t"]', "sunta");
  c.rackBeyaz = await svg("#rack-hesap .rk-cz svg");

  // Market rafı: L şeklinde 300 + 200 cm, köşe rafı
  await p.goto(sayfa + "#market-rafi"); await p.reload();
  await p.check('#mk-dw [data-kose="0"]');
  c.marketPlan = await svg("#mk-plan");
  c.market = await svg("#market-hesap .mk-cz svg");
  // Market rafı: siyah raf, kırmızı etiket, tek duvar 300 cm
  await p.check('#market-hesap input[name="mk-renk"][value="siyah"]');
  await p.check('#market-hesap input[name="mk-etiket"][value="kirmizi"]');
  await p.selectOption("#mk-dz", "1");
  await p.fill('#mk-dw [data-dw="0"][data-f="w"]', "300");
  c.marketSiyah = await svg("#market-hesap .mk-cz svg");
  await p.close();
  Object.keys(c).forEach((k, i) => { c[k] = benzersiz(c[k], "-g" + i); });
  return c;
}

function tablo(basliklar, satirlar, sinif) {
  return '<table class="' + (sinif || "") + '"><thead><tr>' + basliklar.map((h, i) => '<th scope="col"' + (i ? ' class="r"' : "") + ">" + h + "</th>").join("") + "</tr></thead><tbody>" +
    satirlar.map(r => "<tr>" + r.map((c, i) => "<td" + (i ? ' class="r"' : "") + ">" + c + "</td>").join("") + "</tr>").join("") + "</tbody></table>";
}

function celikBolum(c) {
  const A = CELIK;
  const ornekler = [];
  A.derinlikler.forEach(d => {
    Object.keys(A.profilFiyati).map(Number).forEach(h => {
      const k = A.varsayilanKat[h];
      const tekli = 4 * A.profilFiyati[h] + k * A.rafFiyati[d] + k * A.civataTekli * A.civataFiyati;
      const bIlk = 4 * A.profilFiyati[h] + k * A.rafFiyati[d] + k * A.civataBitisik * A.civataFiyati;
      const bEk = 2 * A.profilFiyati[h] + k * A.rafFiyati[d] + k * A.civataBitisik * A.civataFiyati;
      ornekler.push([d + " cm × " + h + " cm, " + k + " katlı", tl(kdvC(tekli)), tl(kdvC(bIlk)), tl(kdvC(bEk))]);
    });
  });
  return '<section class="bolum">' +
    '<div class="bas"><span class="no">1</span><div><h2>Çelik Raf Sistemleri</h2><p>Arşiv, depo, ev ve işyeri için cıvatalı çelik raflar</p></div></div>' +
    '<div class="gorseller"><figure>' + c.celik + "<figcaption>300 cm duvar · 31 cm derinlik · 200 cm · 5 kat · bitişik</figcaption></figure>" +
    "<figure>" + c.celik2 + "<figcaption>200 cm duvar · 43 cm derinlik · 250 cm · 6 kat · ayrı üniteler</figcaption></figure></div>" +
    '<div class="iki"><div><h3>Ölçüler</h3><ul>' +
    "<li><b>Derinlik:</b> " + A.derinlikler.join(" · ") + " cm</li>" +
    "<li><b>Genişlik:</b> " + A.genislikler.slice().sort((a, b) => a - b).join(" · ") + " cm</li>" +
    "<li><b>Yükseklik (profil):</b> " + Object.keys(A.profilFiyati).join(" · ") + " cm</li>" +
    "<li>Raf aralıkları istenildiği gibi ayarlanabilir.</li></ul></div>" +
    "<div><h3>Birim fiyatlar <small>(KDV dahil)</small></h3>" +
    tablo(["Malzeme", "Birim fiyat"], [
      ...A.derinlikler.map(d => ["Raf tablası " + d + " cm derinlik <small>(tüm genişlikler)</small>", tl(kdvC(A.rafFiyati[d]))]),
      ...Object.keys(A.profilFiyati).map(h => ["Profil " + h + " cm", tl(kdvC(A.profilFiyati[h]))]),
      ["Somun-cıvata (adet)", tl(kdvC(A.civataFiyati))],
      ["Pabuç (ayak)", "Ücretsiz"]
    ]) + "</div></div>" +
    "<h3>Örnek ünite fiyatları <small>(KDV dahil · tüm genişlikler için aynı)</small></h3>" +
    tablo(["Ünite", "Tekli ünite", "Bitişik: ilk ünite", "Bitişik: her ek ünite"], ornekler, "kucuk") +
    '<p class="not">Tekli ünite: 4 profil, kat sayısı kadar raf, raf başına ' + A.civataTekli + " somun-cıvata. Bitişik kurulumda yan yana üniteler aradaki profilleri paylaşır; ilk ünite 4, her ek ünite 2 profil kullanır ve raf başına " + A.civataBitisik + " somun-cıvata gider.</p>" +
    "</section>";
}

function rackBolum(c) {
  const A = RACK, renk = A.renkler, dz = A.derinlikler, hs = A.yukseklikler;
  const ayakSatir = hs.map(h => ["Ayak " + h + " cm"].concat(dz.map(d => tl(kdvR(A.ayakFiyati[h][d] * renk.standart.carpan)))));
  const ayakBeyaz = hs.map(h => ["Ayak " + h + " cm"].concat(dz.map(d => tl(kdvR(A.ayakFiyati[h][d] * renk.beyaz.carpan)))));
  const trav = A.traversler.slice().sort((a, b) => a - b).map(L => ["Travers " + L + " cm", tl(kdvR(A.traversFiyati[L] * renk.standart.carpan)), tl(kdvR(A.traversFiyati[L] * renk.beyaz.carpan)), Math.round(L / A.rafEni) + " tabla"]);
  const tabla = Object.keys(A.raflar).map(k => [A.raflar[k].ad].concat(dz.map(d => tl(kdvR(A.rafFiyati[d] + A.raflar[k].fark)))));
  // örnek: 2 göz × 120 cm, 50 cm, 200 cm, 4 kat, turuncu-mavi, 0,70 mm sac
  const o = { goz: 2, L: 120, d: 50, h: 200, k: 4 };
  const ayak = o.goz + 1, travers = o.goz * 2 * o.k, tbl = o.goz * Math.round(o.L / A.rafEni) * o.k;
  const ornek = [
    ["Ayak " + o.d + "×" + o.h + " cm", ayak, tl(kdvR(A.ayakFiyati[o.h][o.d])), tl(kdvR(ayak * A.ayakFiyati[o.h][o.d]))],
    ["Travers " + o.L + " cm", travers, tl(kdvR(A.traversFiyati[o.L])), tl(kdvR(travers * A.traversFiyati[o.L]))],
    ["Tabla " + o.d + "×" + A.rafEni + " cm, 0,70 mm sac", tbl, tl(kdvR(A.rafFiyati[o.d])), tl(kdvR(tbl * A.rafFiyati[o.d]))],
    ["<b>Toplam</b>", "", "", "<b>" + tl(kdvR(ayak * A.ayakFiyati[o.h][o.d] + travers * A.traversFiyati[o.L] + tbl * A.rafFiyati[o.d])) + "</b>"]
  ];
  return '<section class="bolum">' +
    '<div class="bas"><span class="no">2</span><div><h2>Hafif Rack Raf Sistemleri</h2><p>Ayak, travers ve tablalı; yüksek taşıma kapasiteli raflar</p></div></div>' +
    '<div class="gorseller"><figure>' + c.rack + "<figcaption>Turuncu-Mavi · 0,70 mm sac tabla · 2 × 120 cm göz · 50 cm · 4 kat</figcaption></figure>" +
    "<figure>" + c.rackBeyaz + "<figcaption>Beyaz · sunta tabla · 2 × 120 cm göz · 50 cm · 4 kat</figcaption></figure></div>" +
    "<h3>Ayak fiyatları <small>(KDV dahil · derinliğe göre, cm)</small></h3>" +
    "<p class='etiket'>Turuncu-Mavi (standart)</p>" + tablo(["Ayak"].concat(dz.map(d => d + " cm")), ayakSatir, "kucuk") +
    "<p class='etiket'>Beyaz (%" + Math.round((1 - renk.beyaz.carpan) * 100) + " daha uygun)</p>" + tablo(["Ayak"].concat(dz.map(d => d + " cm")), ayakBeyaz, "kucuk") +
    "<h3>Travers fiyatları <small>(KDV dahil)</small></h3>" +
    tablo(["Travers", renk.standart.ad, renk.beyaz.ad, "Kat başına tabla"], trav, "kucuk") +
    "<h3>Tabla fiyatları <small>(KDV dahil · " + A.rafEni + " cm genişlik · derinliğe göre)</small></h3>" +
    tablo(["Tabla"].concat(dz.map(d => d + " cm")), tabla, "kucuk") +
    "<h3>Örnek: 2 göz × 120 cm (kurulum genişliği " + (2 * 120 + 3 * A.ayakPayi) + " cm), 50 cm derinlik, 200 cm, 4 kat <small>(Turuncu-Mavi · KDV dahil)</small></h3>" +
    tablo(["Malzeme", "Adet", "Birim fiyat", "Tutar"], ornek, "kucuk") +
    '<p class="not">Her göz için kat başına 2 travers (ön ve arka) kullanılır. Kat başına tabla sayısı travers boyu ÷ ' + A.rafEni + " cm kadardır. Ayak sayısı göz sayısından 1 fazladır. Ayak ve tabla derinliği aynıdır.</p>" +
    "</section>";
}

function marketBolum(c) {
  const A = MARKET;
  const ornek = (ad, unite, sonAyak) => [ad, String(unite), tl(unite * A.uniteFiyati + sonAyak * A.sonAyakFiyati)];
  return '<section class="bolum">' +
    '<div class="bas"><span class="no">3</span><div><h2>Market Rafları</h2><p>Duvar tipi market rafları ve köşe üniteleri</p></div></div>' +
    '<div class="gorseller"><figure>' + c.market + "<figcaption>Beyaz raf · turuncu etiket · köşe raflı duvar</figcaption></figure>" +
    "<figure>" + c.marketSiyah + "<figcaption>Siyah raf · kırmızı etiket · 300 cm duvar · 3 × 97 cm</figcaption></figure></div>" +
    '<div class="iki"><div><h3>Fiyatlar <small>(KDV dahil)</small></h3>' +
    tablo(["Kalem", "Fiyat"], [
      ["Market rafı ünitesi <small>(" + A.genislikler.join(" · ") + " cm)</small>", tl(A.uniteFiyati)],
      ["Köşe rafı ünitesi", tl(A.uniteFiyati)],
      ["Son ayak <small>(raf dizisinin sonuna)</small>", tl(A.sonAyakFiyati)],
      ["Ekstra raf <small>(ünite başına)</small>", tl(A.ekstraRafFiyati)]
    ]) +
    "<p class='not'>Bir ünitede: 1 ayak (" + A.ayakYuksekligi + " cm), 1 taban raf, " + A.ustRafSayisi + " raf, " + A.perdeSayisi + " perde, " + A.kolSayisi + " raf kolu. Ayak sayısı her zaman ünite sayısından 1 fazladır.</p></div>" +
    "<div><h3>Ölçü ve renkler</h3><ul>" +
    "<li><b>Ünite genişliği:</b> " + A.genislikler.join(" · ") + " cm</li>" +
    "<li><b>Ayak derinliği:</b> " + A.derinlikler.map(d => d + " cm (raflar " + A.rafDerinligi[d] + " cm)").join(" · ") + "</li>" +
    "<li><b>Yükseklik:</b> " + A.ayakYuksekligi + " cm</li>" +
    "<li><b>Raf rengi:</b> " + Object.values(A.renkler).map(r => r.ad).join(" · ") + "</li>" +
    "<li><b>Etiket rengi:</b> " + Object.values(A.etiketler).map(r => r.ad).join(" · ") + "</li>" +
    "<li><b>Köşe rafı:</b> birleşen iki duvardan da " + A.kosePayi + " cm kullanır</li></ul></div></div>" +
    '<div class="iki"><figure class="plan">' + c.marketPlan + "<figcaption>Örnek oda planı: L şeklinde 300 + 200 cm, köşe raflı</figcaption></figure>" +
    "<div><h3>Örnek fiyatlar <small>(KDV dahil)</small></h3>" +
    tablo(["Kurulum", "Ünite", "Toplam"], [
      ornek("300 cm duvar · 3 × 97 cm", 3, 1),
      ornek("440 cm duvar · 3 × 97 + 77 + 67 cm", 5, 1),
      ornek("15 ünite", 15, 1),
      ["15 ünite + her üniteye 1 ekstra raf", "15", tl(15 * A.uniteFiyati + A.sonAyakFiyati + 15 * A.ekstraRafFiyati)]
    ], "kucuk") + "</div></div>" +
    "</section>";
}

function sayfaHtml(c) {
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>Acar Raf Fiyat Listesi</title><style>
  @page{size:A4;margin:14mm 13mm 16mm}
  *{box-sizing:border-box}
  body{margin:0;font-family:"DejaVu Sans","Liberation Sans",Arial,sans-serif;color:#1b1b1b;font-size:10pt;line-height:1.4}
  .kapak{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #e2701f;padding-bottom:10px;margin-bottom:14px}
  .kapak h1{font-size:24pt;margin:0;letter-spacing:.04em}
  .kapak h1 span{color:#e2701f}
  .kapak .alt{font-size:12pt;color:#555;margin-top:2px}
  .kapak .sag{text-align:right;font-size:9pt;color:#555}
  .kapak .sag b{color:#1b1b1b;font-size:10pt}
  .bilgi{background:#fff5ee;border:1px solid #f3cfb3;border-radius:8px;padding:8px 12px;font-size:9pt;margin-bottom:14px}
  .bolum{page-break-before:always}
  .bolum:first-of-type{page-break-before:auto}
  .bas{display:flex;gap:10px;align-items:center;margin:0 0 10px}
  .bas .no{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#e2701f;color:#fff;font-weight:700;font-size:13pt}
  .bas h2{margin:0;font-size:16pt}
  .bas p{margin:0;color:#666;font-size:9.5pt}
  h3{font-size:11pt;margin:10px 0 5px}
  h3 small{font-weight:400;color:#777;font-size:8.5pt}
  .gorseller{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  figure{margin:0;background:#f6f6f6;border-radius:8px;padding:6px;break-inside:avoid}
  figure svg{display:block;width:100%;height:165px}
  figure.plan svg{height:200px}
  figcaption{font-size:8pt;color:#666;text-align:center;margin-top:3px}
  .iki{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}
  ul{margin:0;padding-left:16px}
  li{margin:2px 0}
  table{width:100%;border-collapse:collapse;font-size:9pt;break-inside:avoid}
  table.kucuk{font-size:8.5pt}
  th{text-align:left;background:#2f3338;color:#fff;font-weight:600;padding:5px 6px}
  td{padding:3px 6px;border-bottom:1px solid #e3e3e3}
  tr:nth-child(even) td{background:#fafafa}
  .r{text-align:right;white-space:nowrap}
  td small{color:#777}
  .etiket{margin:6px 0 3px;font-weight:700;font-size:9pt;color:#555}
  .not{font-size:8.5pt;color:#555;margin:6px 0 0}
  .son{margin-top:14px;border-top:1px solid #ddd;padding-top:8px;font-size:9pt;color:#444}
  .son b{color:#e2701f}
  </style></head><body>
  <div class="kapak"><div><h1>ACAR <span>RAF</span></h1><div class="alt">Raf Sistemleri Fiyat Listesi</div></div>
  <div class="sag"><b>${BUGUN}</b><br>Tel / WhatsApp: 0537 660 53 48<br>www.acarraf.com</div></div>
  <div class="bilgi"><b>Tüm fiyatlara KDV dahildir.</b> Montaj ve nakliye fiyatlara dahil değildir. Duvar ölçünüze göre raf yerleşimini ve toplam fiyatı görmek için: <b>www.acarraf.com/raf-hesaplama</b></div>
  ${celikBolum(c)}
  ${rackBolum(c)}
  ${marketBolum(c)}
  <div class="son">Sipariş ve bilgi için: <b>0537 660 53 48</b> (telefon / WhatsApp) · Çınardere Mah., Ankara Cad. No:25, Pendik / İstanbul · www.acarraf.com</div>
  </body></html>`;
}

(async () => {
  const b = await chromium.launch();
  const c = await cizimleriAl(b);
  const html = sayfaHtml(c);
  fs.writeFileSync(path.join(__dirname, "fiyat-listesi.html"), html);
  const p = await b.newPage();
  await p.setContent(html, { waitUntil: "load" });
  await p.pdf({
    path: CIKTI, format: "A4", printBackground: true, displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: '<div style="width:100%;font-size:8px;color:#888;padding:0 13mm;display:flex;justify-content:space-between"><span>Acar Raf · Fiyat Listesi · ' + BUGUN + '</span><span>Sayfa <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>',
    margin: { top: "14mm", bottom: "16mm", left: "13mm", right: "13mm" }
  });
  await b.close();
  console.log("PDF oluşturuldu:", CIKTI);
})();
