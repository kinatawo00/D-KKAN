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
(d / "raf-hesapla.js").write_text(paket, encoding="utf-8")
if shutil.which("node"):
    sonuc = subprocess.run(["node", "--check", str(d / "raf-hesapla.js")], capture_output=True, text=True)
    if sonuc.returncode != 0:
        raise SystemExit("raf-hesapla.js sözdizimi hatası:\n" + sonuc.stderr)
print("raf-hesapla.js oluşturuldu (" + str(len(paket.encode("utf-8"))) + " bayt)")

