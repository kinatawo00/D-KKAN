/* Kendi Rafını Kendin Hesapla - acarraf.com yükleyicisi (birlestir.py ile üretilir, elle düzenlemeyin) */
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
