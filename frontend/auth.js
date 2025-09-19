const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const registerLink = document.getElementById("registerLink");
const loginLink = document.getElementById("loginLink");

// Switch forms
registerLink.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
});
loginLink.addEventListener("click", () => {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Register
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value.trim();

  if (!username || !password) {
    alert("Please fill all fields!");
    return;
  }

  localStorage.setItem(username, password);
  alert("Registration successful!");
  registerForm.reset();
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const storedPassword = localStorage.getItem(username);

  if (storedPassword === password) {
    window.location.href = "app.html";
  } else {
    alert("Invalid username or password!");
  }
});
