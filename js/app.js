// Shared data & helpers for the MPK 2026 election.
const DEFAULT_VOTING_SETTINGS = {
  votingTitle: "Pemilihan Ketua & Wakil Ketua MPK",
  votingYear: "2026/2027",
  heroMessage: "Satu suara untuk masa depan MPK.",
  countdownTarget: "2026-12-31T15:00:00",
  resultsVisible: true,
  showAspirasi: false,
  resultsMessage:
    "Hasil realtime saat ini disembunyikan oleh panitia. Silakan kembali setelah pengumuman resmi.",
  primaryColor: "#071a33",
  accentColor: "#c69a42",
};
let votingSettings = { ...DEFAULT_VOTING_SETTINGS };
const CANDIDATES = [
  {
    id: "paslon-01",
    order: "01",
    chair: "Kamila Thalita Athaya",
    deputy: "Iryaning Ayu Bakhtiar",
    shortName: "Paslon 01",
    kelas: "XI SAINS D · X-A",
    initials: "01",
    photo: "assets/paslon1.jpg",
    chairPhoto: "assets/paslon1.jpg",
    deputyPhoto: "assets/paslon1.jpg",
    slogan: "Transparan, aspiratif, dan berkarakter islami.",
    accent: "#9e3347",
    vision: "Mewujudkan MPK MAN 3 Jember yang transparan, aspiratif, dan berkarakter islami untuk madrasah yang maju dan berkeadilan.",
    missions: [
      "Mewujudkan MPK yang cerdas dan kritis dalam mengawasi, mengevaluasi program OSIM dan kebijakan madrasah, serta memberikan solusi terbaik.",
      "Menjalankan tugas dan tanggung jawab dengan amanah, transparan, bertanggung jawab, serta berlandaskan nilai-nilai Islami dan musyawarah untuk menciptakan keadilan dan keharmonisan.",
      "Menampung, menyalurkan, dan mengawal aspirasi siswa/siswi MAN 3 Jember dengan cepat dan adil.",
      "Menjadi MPK yang berintegritas, berakhlakul karimah sebagai teladan, serta mendorong terciptanya program kerja yang adaptif, inovatif, dan peduli lingkungan madrasah.",
    ],
  },
  {
    id: "paslon-02",
    order: "02",
    chair: "Shofira Yogi Privilia",
    deputy: "Ilzamulhaq Ainun Najib",
    shortName: "Paslon 02",
    kelas: "XI SOSHUM D · X-B",
    initials: "02",
    photo: "assets/paslon2.jpg",
    chairPhoto: "assets/paslon2.jpg",
    deputyPhoto: "assets/paslon2.jpg",
    slogan: "Aktif, aspiratif, dan berintegritas.",
    accent: "#237a67",
    vision: "Menjadikan MPK MAN 3 Jember yang aktif, aspiratif, dan berintegritas untuk menciptakan lingkungan madrasah yang harmonis.",
    missions: [
      "Aktif mengawal dan mengevaluasi setiap program kerja organisasi madrasah secara optimal.",
      "Aspiratif dalam menampung dan menyalurkan suara siswa kepada pihak madrasah.",
      "Berintegritas dengan menjunjung tinggi kejujuran, disiplin, dan tanggung jawab kepengurusan.",
    ],
  },
  {
    id: "paslon-03",
    order: "03",
    chair: "Izza Amira Ahmad",
    deputy: "Mohammad Amirul Rifqi",
    shortName: "Paslon 03",
    kelas: "XI AGAMA · X-G",
    initials: "03",
    photo: "assets/paslon3.jpg",
    chairPhoto: "assets/paslon3.jpg",
    deputyPhoto: "assets/paslon3.jpg",
    slogan: "Aspiratif, transparan, tegas, dan bertanggung jawab.",
    accent: "#c69a42",
    vision: "Mewujudkan MPK MAN 3 Jember yang aspiratif, transparan, tegas, dan bertanggung jawab untuk warga madrasah.",
    missions: [
      "Membangun sistem penampungan aspirasi yang mudah diakses secara digital dan fisik.",
      "Menyampaikan informasi program kerja, hasil kegiatan, dan evaluasi MPK secara terbuka kepada seluruh warga madrasah.",
      "Mengawal dan mengevaluasi kinerja OSIM.",
      "Melaksanakan evaluasi berulang-ulang terhadap program kerja MPK.",
    ],
  },
];
const Store = {
  get(key, def = null) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch {
      return def;
    }
  },
  set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  },
};
function demoInit() {
  if (!Store.get("mpk26_initialized")) {
    const votes = {};
    CANDIDATES.forEach((c) => (votes[c.id] = 0));
    Store.set("mpk26_votes", votes);
    Store.set("mpk26_aspirasi", []);
    Store.set("mpk26_isOpen", true);
    Store.set("mpk26_settings", { ...DEFAULT_VOTING_SETTINGS });
    const tokens = {};
    for (let i = 1; i <= 30; i++) {
      const t = `009${String(i).padStart(7, "0")}`;
      tokens[t] = { used: false, usedAt: null };
    }
    Store.set("mpk26_tokens", tokens);
    Store.set("mpk26_initialized", true);
  }
}
async function firestoreGetVotes() {
  const snap = await db.collection("candidates").get();
  const votes = {};
  snap.forEach((d) => (votes[d.id] = d.data().voteCount || 0));
  return votes;
}
function showToast(msg, type = "success") {
  const old = document.getElementById("pm-toast");
  if (old) old.remove();
  const el = document.createElement("div");
  el.id = "pm-toast";
  el.className = `pm-toast pm-toast--${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("show"), 15);
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 350);
  }, 3300);
}
function getTokenFromSession() {
  return sessionStorage.getItem("mpk26_token");
}
function setTokenSession(token) {
  sessionStorage.setItem("mpk26_token", token);
}
function clearSession() {
  sessionStorage.removeItem("mpk26_token");
  sessionStorage.removeItem("mpk26_voted");
  sessionStorage.removeItem("mpk26_demo");
}
function getTotalVotes(votes) {
  return Object.values(votes).reduce((a, b) => a + b, 0);
}
function getCandidateById(id) {
  return CANDIDATES.find((c) => c.id === id);
}
function initCountdown(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const tick = () => {
    const target = new Date(votingSettings.countdownTarget).getTime();
    const d = target - Date.now();
    if (d <= 0) {
      el.textContent = "SESI VOTING TELAH BERAKHIR";
      return;
    }
    const days = Math.floor(d / 86400000);
    const hours = Math.floor((d % 86400000) / 3600000);
    const mins = Math.floor((d % 3600000) / 60000);
    el.textContent = `${days} HARI · ${String(hours).padStart(2, "0")} JAM · ${String(mins).padStart(2, "0")} MENIT`;
  };
  tick();
  setInterval(tick, 1000);
}
function applyVotingSettings(settings = {}) {
  votingSettings = { ...DEFAULT_VOTING_SETTINGS, ...settings };
  document.querySelectorAll("[data-setting]").forEach((el) => {
    const key = el.dataset.setting;
    if (votingSettings[key] !== undefined) el.textContent = votingSettings[key];
  });
  document.querySelectorAll("[data-results-content]").forEach((el) => {
    el.hidden = votingSettings.resultsVisible === false;
  });
  document.querySelectorAll("[data-aspirasi-content]").forEach((el) => {
    el.hidden = votingSettings.showAspirasi === false;
  });
  const resultsNotice = document.getElementById("resultsPrivateNotice");
  const resultsMessage = document.getElementById("resultsPrivateMessage");
  if (resultsNotice) {
    resultsNotice.hidden = votingSettings.resultsVisible !== false;
  }
  if (resultsMessage)
    resultsMessage.textContent = votingSettings.resultsMessage;
  document.documentElement.style.setProperty(
    "--navy",
    votingSettings.primaryColor,
  );
  document.documentElement.style.setProperty(
    "--gold",
    votingSettings.accentColor,
  );
  document.title = `${votingSettings.votingTitle} · ${votingSettings.votingYear}`;
}
function watchVotingSettings() {
  if (DEMO_MODE) {
    applyVotingSettings(Store.get("mpk26_settings", {}));
    return;
  }
  db.collection("settings")
    .doc("config")
    .onSnapshot((doc) => applyVotingSettings(doc.exists ? doc.data() : {}));
}
function initParticles() {
  const box = document.querySelector(".particles-bg");
  if (!box) return;
  for (let i = 0; i < 13; i++) {
    const p = document.createElement("i");
    p.className = "particle";
    p.style.cssText = `left:${Math.random() * 100}%;animation-delay:${Math.random() * 12}s;animation-duration:${9 + Math.random() * 8}s;transform:scale(${0.6 + Math.random()})`;
    box.appendChild(p);
  }
}
function initTiltCards() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll("[data-tilt],.candidate-card").forEach((card) => {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = "true";
    card.classList.add("tilt-card");
    const move = (e) => {
        const r = card.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--tilt-x", `${(y - 0.5) * -7}deg`);
        card.style.setProperty("--tilt-y", `${(x - 0.5) * 7}deg`);
        card.style.setProperty("--shine-x", `${x * 100}%`);
        card.style.setProperty("--shine-y", `${y * 100}%`);
        card.classList.add("is-tilting");
      },
      reset = () => {
        card.classList.remove("is-tilting");
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      };
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", reset);
    card.addEventListener("pointerup", reset);
  });
}
function initOrbitalScene() {
  if (
    !document.querySelector(".landing") ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const scene = document.createElement("div");
  scene.className = "orbital-scene";
  scene.setAttribute("aria-hidden", "true");
  scene.innerHTML = '<i class="orbital-core"></i>';
  document.body.appendChild(scene);
}
function initTypedMessage() {
  const el = document.getElementById("typedMessage");
  if (!el) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = "Suarakan aspirasi. Wujudkan perubahan.";
    return;
  }
  const phrases = [
    "Suarakan aspirasi. Wujudkan perubahan.",
    "Satu NISN. Satu pilihan. Satu masa depan.",
    "MPK hadir untuk mewakili setiap suara.",
  ];
  let phrase = 0,
    char = 0,
    deleting = false;
  const type = () => {
    const current = phrases[phrase];
    el.textContent = current.slice(0, char);
    if (!deleting && char < current.length) {
      char++;
      setTimeout(type, 48);
      return;
    }
    if (!deleting) {
      deleting = true;
      setTimeout(type, 1900);
      return;
    }
    if (char > 0) {
      char--;
      setTimeout(type, 26);
      return;
    }
    deleting = false;
    phrase = (phrase + 1) % phrases.length;
    setTimeout(type, 300);
  };
  type();
}
function initFooter() {
  if (document.querySelector(".site-footer")) return;
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `<div class="container footer-inner"><div><strong>MPK MAN 3 JEMBER</strong><p>Portal resmi Pemilihan Ketua & Wakil Ketua MPK 2026/2027.</p></div><div class="footer-links"><a href="index.html">Beranda</a><a href="candidates.html">Profil Kandidat</a><a href="results.html">Hasil</a></div><small>© 2026 Panitia Pemilihan MPK · Satu NISN, satu suara. <a class="footer-credit" href="https://www.instagram.com/stevyuss_/" target="_blank" rel="noopener noreferrer">Designed &amp; developed by stevyuss_</a></small></div>`;
  document.body.appendChild(footer);
}
document.addEventListener("DOMContentLoaded", () => {
  if (DEMO_MODE) demoInit();
  initParticles();
  initTypedMessage();
  watchVotingSettings();
  initFooter();
  setTimeout(initTiltCards, 0);
});
