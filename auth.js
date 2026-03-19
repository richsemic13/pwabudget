let users = JSON.parse(localStorage.getItem("users")) || [];

function register() {
let username = regUsername.value.trim();
let email = regEmail.value.trim();
let password = regPassword.value;
let confirm = regConfirmPassword.value;

if (!username || !email || !password || !confirm) return alert("Fill all");

if (password !== confirm) return alert("Passwords not match");

if (users.find(u => u.email === email)) return alert("Email exists");

users.push({ username, email, password });

localStorage.setItem("users", JSON.stringify(users));

alert("Registered!");
window.location.href = "index.html";
}

function login() {
let email = loginEmail.value.trim();
let password = loginPassword.value;

let user = users.find(u => u.email === email && u.password === password);

if (!user) return alert("Invalid");

localStorage.setItem("currentUser", email);
window.location.href = "dashboard.html";
}

function logout() {
localStorage.removeItem("currentUser");
window.location.href = "index.html";
}
