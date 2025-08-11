import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBfiwyCGXeolzeNiZp6mGv-E4J7zrTrbfo",
  authDomain: "loginapp-58501.firebaseapp.com",
  projectId: "loginapp-58501",
  storageBucket: "loginapp-58501.appspot.com",
  messagingSenderId: "527574574471",
  appId: "1:527574574471:web:f3965976de848a904d5f22",
};

//  Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//  DOM elements
const welcomeText = document.querySelector(".welcome-text");
const dateText = document.querySelector(".date-text");
const btnLogout = document.querySelector("#logout-btn");
const mainBody = document.querySelector("main");

//  Hide dashboard initially
mainBody.classList.add("hidden");

//  Auth state check
onAuthStateChanged(auth, (user) => {
  if (user) {
    const name = user?.displayName || "User";
    const [firstName, lastName = ""] = name.split(" ");

    const formattedName = `${firstName
      .charAt(0)
      .toUpperCase()}${firstName.slice(1)} ${
      lastName.charAt(0)?.toUpperCase() || ""
    }${lastName.slice(1)}`;

    welcomeText.innerText = `Welcome, ${formattedName.trim()}`;

    const dateNow = new Date();
    const dateOptions = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
      hour12: true,
      dayPeriod: "short",
    };

    dateText.textContent = `Login successful at ${new Intl.DateTimeFormat(
      "en-UK",
      dateOptions
    ).format(dateNow)}`;

    setTimeout(() => {
      mainBody.classList.remove("hidden");
    }, 500);
  } else {
    // Not logged in — redirect
    window.location.href = "index.html";
  }
});

//  Logout
btnLogout.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (err) {
    alert("Logout failed: " + err.message);
  }
});
