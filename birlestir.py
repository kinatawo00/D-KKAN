"""Seçim ekranı + çelik raf + hafif rack + market rafı kodlarını tek dosyada birleştirir.

Çalıştırma:  python3 birlestir.py
Çıktılar:    kendi-rafini-hesapla.txt  (Ticimax sayfasına yapıştırılacak kod)
             kendi-rafini-hesapla.html (tarayıcıda tek başına açılan deneme sayfası)
"""
from pathlib import Path

d = Path(__file__).parent
kod = (d / "secim-ekrani.html").read_text(encoding="utf-8")
kod = kod.replace("<!--CELIK-->", (d / "raf-hesaplama-kodu.html").read_text(encoding="utf-8").strip())
kod = kod.replace("<!--RACK-->", (d / "hafif-rack-kodu.html").read_text(encoding="utf-8").strip())
kod = kod.replace("<!--MARKET-->", (d / "market-rafi-kodu.html").read_text(encoding="utf-8").strip())
kod = kod.replace("<!--MAGAZA-->", (d / "magaza-kodu.html").read_text(encoding="utf-8").strip())
kod = kod.replace("<!--PDF-->", (d / "pdf-teklif-kodu.html").read_text(encoding="utf-8").strip())
import re


def guvenli_betik(m):
    # Betik içindeki "</" dizileri HTML denetleyicilerinde ve sayfa editörlerinde hata sayılır;
    # JavaScript'te aynı anlama gelen "<\/" ile yazılır.
    return "<script>" + m.group(1).replace("</", "<\\/") + "</script>"


# Not: "</" -> "<\\/" dönüşümü kapalı. HTML5'te betik içindeki "</div>" geçerlidir ve sitede sorunsuz
# kaydedilen sürümde bu dönüşüm yoktu; çok sayıda "<\\/" güvenlik duvarına gizlenmiş kod gibi görünebilir.
# kod = re.sub(r"<script>([\s\S]*?)</script>", guvenli_betik, kod)
assert "<!--" not in kod, "birleşik kodda HTML yorumu kaldı"
# Rakamdan hemen sonra gelen kesme işareti (ör. 97'lik) site güvenlik duvarlarınca SQL saldırısı sanılıp
# kaydetme isteğini engelleyebilir; bu kalıp kodda olmamalı.
riskli = re.findall(r"[0-9]'", kod)
assert not riskli, f"kodda rakam + kesme işareti var ({len(riskli)} adet); metni kesme işaretsiz yazın"
(d / "kendi-rafini-hesapla.txt").write_text(kod, encoding="utf-8")
(d / "kendi-rafini-hesapla.html").write_text(
    '<!doctype html>\n<html lang="tr"><head><meta charset="utf-8">'
    '<meta name="viewport" content="width=device-width, initial-scale=1">'
    "<title>Kendi Rafını Kendin Hesapla</title>"
    '<style>body{margin:0;padding:16px;background:#f4f4f4;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}</style>'
    "</head><body>\n" + kod + "\n</body></html>\n",
    encoding="utf-8",
)
print("kendi-rafini-hesapla.txt ve .html oluşturuldu")

# Sözdizimi kontrolü: her <script> bloğu node --check ile denetlenir (node yoksa atlanır).
import shutil
import subprocess
import tempfile

if shutil.which("node"):
    for i, js in enumerate(re.findall(r"<script>([\s\S]*?)</script>", kod)):
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
            f.write(js)
        sonuc = subprocess.run(["node", "--check", f.name], capture_output=True, text=True)
        if sonuc.returncode != 0:
            raise SystemExit(f"{i + 1}. betikte sözdizimi hatası:\n{sonuc.stderr}")
    print("sözdizimi kontrolü: tüm betikler hatasız")

# ---- Tek dosyalık JavaScript sürümü (raf-hesapla.js) ----
# Ticimax panelinden uzun kod göndermek güvenlik duvarına takıldığı için, hesaplayıcının tamamı
# tek bir .js dosyasında toplanır. Sayfaya yalnızca bir <div> ve bu dosyayı çağıran <script src> konur.
import json

statik = re.sub(r"<script>[\s\S]*?</script>", "", kod).strip()
betikler = re.findall(r"<script>([\s\S]*?)</script>", kod)
paket = (
    "/* Kendi Rafını Kendin Hesapla - acarraf.com (birlestir.py ile üretilir, elle düzenlemeyin) */\n"
    "(function () {\n"
    "  function baslat() {\n"
    "    var kok = document.getElementById(\"raf-hesapla-uygulama\");\n"
    "    if (!kok || kok.dataset.ok) return;\n"
    "    kok.dataset.ok = \"1\";\n"
    "    kok.innerHTML = " + json.dumps(statik, ensure_ascii=False) + ";\n"
    + "\n".join(betikler) +
    "\n  }\n"
    "  if (document.readyState === \"loading\") document.addEventListener(\"DOMContentLoaded\", baslat); else baslat();\n"
    "})();\n"
)
(d / "raf-hesapla-uygulama.js").write_text(paket, encoding="utf-8")

# ---- raf-hesapla.js: sabit küçük yükleyici ----
# jsDelivr dal adresini (@dal) uç sunucularında saatlerce eski sürümle önbelleğe alabiliyor. Bu yüzden sitenin
# çağırdığı raf-hesapla.js hiç değişmeyen küçük bir dosyadır: GitHub'dan dalın son kayıt numarasını (commit) öğrenir
# ve uygulamayı o kayda sabitlenmiş adresten (@<sha>) yükler; bu adres her zaman doğru sürümü verir.
# GitHub'a ulaşılamazsa dal adresinden yükler.
yukleyici = """/* Kendi Rafını Kendin Hesapla - acarraf.com yükleyicisi (birlestir.py ile üretilir, elle düzenlemeyin) */
(function () {
  if (window.AcarRafYukleyici) return;
  window.AcarRafYukleyici = 1;
  var DEPO = "kinatawo00/D-KKAN", DAL = "ccr-0392e0ab-f5pjug", DOSYA = "raf-hesapla-uygulama.js", ANAHTAR = "acarRafSurum";
  var yuklendi = false, zaman;
  function yukle(surum) {
    if (yuklendi) return;
    yuklendi = true;
    clearTimeout(zaman);
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/gh/" + DEPO + "@" + surum + "/" + DOSYA + (surum === DAL ? "?v=" + Math.floor(Date.now() / 600000) : "");
    document.head.appendChild(s);
  }
  try {
    var k = JSON.parse(localStorage.getItem(ANAHTAR) || "null");
    if (k && /^[0-9a-f]{40}$/.test(k.s) && Date.now() - k.t < 300000) return yukle(k.s);
  } catch (e) {}
  zaman = setTimeout(function () { yukle(DAL); }, 4000);
  if (!window.fetch) return yukle(DAL);
  fetch("https://api.github.com/repos/" + DEPO + "/commits/" + DAL, { headers: { Accept: "application/vnd.github.sha" } })
    .then(function (r) { if (!r.ok) throw new Error("durum " + r.status); return r.text(); })
    .then(function (sha) {
      sha = sha.trim();
      if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error("geçersiz");
      try { localStorage.setItem(ANAHTAR, JSON.stringify({ s: sha, t: Date.now() })); } catch (e) {}
      yukle(sha);
    })
    .catch(function () { yukle(DAL); });
})();
"""
(d / "raf-hesapla.js").write_text(yukleyici, encoding="utf-8")
# raf-yukle.js: aynı yükleyici yeni adla (Script Yönetimi bunu çağırır; eski adın jsDelivr önbelleği takılı kalmıştı)
(d / "raf-yukle.js").write_text(yukleyici, encoding="utf-8")
if shutil.which("node"):
    for ad in ["raf-hesapla-uygulama.js", "raf-hesapla.js"]:
        sonuc = subprocess.run(["node", "--check", str(d / ad)], capture_output=True, text=True)
        if sonuc.returncode != 0:
            raise SystemExit(ad + " sözdizimi hatası:\n" + sonuc.stderr)
print("raf-hesapla-uygulama.js oluşturuldu (" + str(len(paket.encode("utf-8"))) + " bayt) ve raf-hesapla.js yükleyicisi yazıldı")

