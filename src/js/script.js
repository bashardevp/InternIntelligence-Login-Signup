import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

//  Firebase Config
const firebaseConfig = {
  apiKey: "",
  authDomain: "loginapp-58501.firebaseapp.com",
  projectId: "loginapp-58501",
  storageBucket: "loginapp-58501.appspot.com",
  messagingSenderId: "527574574471",
  appId: "1:527574574471:web:f3965976de848a904d5f22",
};

//  Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//  DOM Elements
const signupFirstName = document.querySelector(".signup-first-name");
const signupLastName = document.querySelector(".signup-last-name");
const signupEmail = document.querySelector(".signup-email");
const signupPassword = document.querySelector(".signup-password");
const signupConfirmPassword = document.querySelector(
  ".signup-confirm-password"
);

const signinEmail = document.querySelector(".signin-email");
const signinPassword = document.querySelector(".signin-password");

const btnSignIn = document.querySelectorAll(".btn-signin");
const btnSignUp = document.querySelectorAll(".btn-signup");
const googleBtns = document.querySelectorAll(".google-btn");
const githubBtns = document.querySelectorAll(".github-btn");

const rememberMeCheckbox = document.querySelector(".remember-checkbox");
const messageBox = document.querySelectorAll(".message-box");

const authSignin = document.querySelector(".auth-signin");
const authSignup = document.querySelector(".auth-signup");
const infoSignin = document.querySelector(".info-signin");
const infoSignup = document.querySelector(".info-signup");

const btnBackToLogin = document.querySelector(".btn-back-to-login");
const resetEmailInput = document.querySelector(".reset-email");
const authResetPass = document.querySelector(".auth-reset-password");
const forgotLink = document.querySelector(".forgot-link");
const resetForm = document.querySelector("#reset-password-form");
const togglePasswordIcons = document.querySelectorAll(".toggle-password");

const main = document.querySelector("main");

// 🔹 Helper Functions
function showMessage(message, type = "error") {
  messageBox.forEach((box) => {
    type === "error"
      ? (box.textContent = `❌ ${message}`)
      : (box.textContent = `✅ ${message}`);
    box.className = `message-box ${type}`;
    box.style.display = "block";
    setTimeout(() => (box.style.display = "none"), 3000);
  });
}

function clearInputs(inputs) {
  inputs.forEach((input) => (input.value = ""));
}

function switchToSignup() {
  authSignin.classList.add("hidden");
  authSignup.classList.remove("hidden");
  infoSignin.classList.add("hidden");
  infoSignup.classList.remove("hidden");
}

function switchToSignin() {
  authSignup.classList.add("hidden");
  authSignin.classList.remove("hidden");
  infoSignup.classList.add("hidden");
  infoSignin.classList.remove("hidden");
}

//  Sign Up
async function handleUserSignUp(e) {
  e.preventDefault();
  const firstName = signupFirstName.value.trim();
  const lastName = signupLastName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();
  const confirmPassword = signupConfirmPassword.value.trim();

  if (!firstName || !lastName || !email || !password || !confirmPassword)
    return showMessage("Please fill in all fields");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return showMessage("Enter a valid email");

  if (password.length < 8)
    return showMessage("Password must be at least 8 characters");

  if (password !== confirmPassword)
    return showMessage("Passwords do not match");

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, {
      displayName: `${firstName} ${lastName}`,
    });
    showMessage("Signup successful!", "success");
    clearInputs([
      signupFirstName,
      signupLastName,
      signupEmail,
      signupPassword,
      signupConfirmPassword,
    ]);
    setTimeout(() => {
      switchToSignin();
    }, 1000);
  } catch (err) {
    showMessage(`Email Already In Use`);
  }
}

//  Sign In
async function handleUserSignIn(e) {
  e.preventDefault();
  const email = signinEmail.value.trim();
  const password = signinPassword.value.trim();

  if (!email || !password) return showMessage("Please fill in all fields");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
    showMessage("SignIn successful!", "success");
    setTimeout(() => (window.location.href = "dashboard.html"), 1000);
  } catch (err) {
    console.log(err);
    showMessage("Email or Password Incorrect");
  }
}

//  Reset Password
function handleFormReset() {
  authSignin.classList.add("hidden");
  authSignup.classList.add("hidden");
  infoSignin.classList.add("hidden");
  infoSignup.classList.add("hidden");
  authResetPass.classList.remove("hidden");
  main.classList.add("resetPassIn");

  resetForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const enteredEmail = resetEmailInput.value.trim();

    if (!enteredEmail) return showMessage("Enter Email to reset password");

    try {
      await sendPasswordResetEmail(auth, enteredEmail);
      showMessage("Reset link sent to your email", "success");
      resetForm.reset();
      setTimeout(() => {
        authResetPass.classList.add("hidden");
        main.classList.remove("resetPassIn");
        switchToSignin();
      }, 2000);
    } catch (err) {
      showMessage(err.message);
    }
  });
}

//  Google Sign In
googleBtns.forEach((btn) =>
  btn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = result._tokenResponse?.isNewUser;
      showMessage(
        isNewUser ? "Google account created!" : "Signed in with Google",
        "success"
      );
      setTimeout(() => (window.location.href = "dashboard.html"), 1000);
    } catch (err) {
      showMessage(err.message);
    }
  })
);

// GitHub Sign In
githubBtns.forEach((btn) =>
  btn.addEventListener("click", async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const isNewUser = result._tokenResponse?.isNewUser;
      showMessage(
        isNewUser ? "GitHub account created!" : "Signed in with GitHub",
        "success"
      );
      setTimeout(() => (window.location.href = "dashboard.html"), 1000);
    } catch (err) {
      showMessage(err.message);
    }
  })
);

// Remembered Email/Password
window.addEventListener("DOMContentLoaded", () => {
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  const rememberedPassword = localStorage.getItem("rememberedPassword");
  if (rememberedEmail && rememberedPassword) {
    signinEmail.value = rememberedEmail;
    signinPassword.value = rememberedPassword;
    rememberMeCheckbox.checked = true;
  }
  switchToSignin();
});

//  Event Listeners
btnSignIn.forEach((btn) => btn.addEventListener("click", handleUserSignIn));
btnSignUp.forEach((btn) => btn.addEventListener("click", handleUserSignUp));

document
  .querySelectorAll(".overlay-switch-signup-btn, .overlay-switch-signup-text")
  .forEach((btn) => btn.addEventListener("click", switchToSignup));
document
  .querySelectorAll(".overlay-switch-signin-btn, .overlay-switch-signin-text")
  .forEach((btn) => btn.addEventListener("click", switchToSignin));
forgotLink.addEventListener("click", (e) => {
  e.preventDefault();
  handleFormReset();
});
btnBackToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  authResetPass.classList.add("hidden");
  main.classList.remove("resetPassIn");
  switchToSignin();
  resetForm.reset();
});

//  Password Toggle
togglePasswordIcons.forEach((icon) => {
  icon.addEventListener("click", function () {
    const input = icon.previousElementSibling;
    input.type = input.type === "password" ? "text" : "password";
    icon.classList.toggle("fa-eye-slash");
    icon.classList.toggle("fa-eye");
  });
});
