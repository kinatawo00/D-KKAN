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
