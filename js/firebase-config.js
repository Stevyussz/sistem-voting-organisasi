// ============================================================
// FIREBASE CONFIGURATION
// Isi dengan config dari Firebase Console kamu:
// Firebase Console → Project Settings → Your Apps → Web App
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyBh43k_YWVXGGxpjcopJUQBxCEtkLYU9Fo",
  authDomain: "voting-pm26.firebaseapp.com",
  projectId: "voting-pm26",
  storageBucket: "voting-pm26.firebasestorage.app",
  messagingSenderId: "241867093185",
  appId: "1:241867093185:web:d72fd8350210617b851040",
};

// ============================================================
// DEMO MODE — set true jika belum setup Firebase
// Data akan disimpan di localStorage (hanya untuk testing)
// ============================================================
const DEMO_MODE =
  new URLSearchParams(window.location.search).has("demo") ||
  sessionStorage.getItem("mpk26_demo") === "true";

if (new URLSearchParams(window.location.search).has("demo")) {
  sessionStorage.setItem("mpk26_demo", "true");
}

// ============================================================
// ADMIN PASSWORD — ganti sesuai keinginan
// ============================================================
const ADMIN_PASSWORD = "bismilahlambo";

// ============================================================
// VOTING SETTINGS
// ============================================================
const APP_CONFIG = {
  organizationName: "Majelis Perwakilan Kelas",
  schoolName: "MAN 3 Jember",
  votingTitle: "Pemilihan Ketua & Wakil Ketua MPK",
  votingYear: "2026",
  voterIdentifier: "NISN",
};

// ============================================================
// Init Firebase (only if not DEMO_MODE)
// ============================================================
let db = null;
if (!DEMO_MODE) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}
