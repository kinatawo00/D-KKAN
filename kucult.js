// Sayfa kodundaki <script> bloklarını sıkıştırır (Ticimax editörüne daha küçük kod yapıştırmak için).
// Kullanım: NODE_PATH=<terser kurulu node_modules> node kucult.js
// Girdi: kendi-rafini-hesapla.txt  Çıktı: kendi-rafini-hesapla-kucuk.txt
const fs = require("fs");
const { minify } = require("terser");
(async () => {
  let kod = fs.readFileSync(__dirname + "/kendi-rafini-hesapla.txt", "utf8");
  const parcalar = kod.split(/(<script>[\s\S]*?<\/script>)/);
  for (let i = 0; i < parcalar.length; i++) {
    const p = parcalar[i];
    if (p.startsWith("<script>")) {
      const js = p.slice(8, -9);
      const m = await minify(js, { compress: { passes: 2 }, mangle: true, format: { ascii_only: false, comments: false } });
      parcalar[i] = "<script>" + m.code + "</script>";
    } else {
      parcalar[i] = p.replace(/\n\s*/g, "\n").replace(/<!--[\s\S]*?-->/g, "");
    }
  }
  const sonuc = parcalar.join("").trim() + "\n";
  fs.writeFileSync(__dirname + "/kendi-rafini-hesapla-kucuk.txt", sonuc);
  console.log("eski:", kod.length, "yeni:", sonuc.length);
})();
