document.addEventListener("DOMContentLoaded", () => {

    let users = JSON.parse(localStorage.getItem("users")) || [];

    // ================= REGISTER =================
    window.register = function () {
        let username = document.getElementById("regUsername")?.value.trim();
        let email = document.getElementById("regEmail")?.value.trim();
        let password = document.getElementById("regPassword")?.value;
        let confirm = document.getElementById("regConfirmPassword")?.value;

        if (!username || !email || !password || !confirm) {
            return alert("Please fill all fields");
        }

        if (password !== confirm) {
            return alert("Passwords do not match");
        }

        let exists = users.find(u => u.email === email);
        if (exists) {
            return alert("Email already registered");
        }

        users.push({
            username: username,
            email: email,
            password: password
        });

        localStorage.setItem("users", JSON.stringify(users));

        alert("Registered successfully!");
        window.location.href = "index.html";
    };

    // ================= LOGIN (EMAIL) =================
    window.login = function () {
        let email = document.getElementById("loginEmail")?.value.trim();
        let password = document.getElementById("loginPassword")?.value;

        if (!email || !password) {
            return alert("Please enter email and password");
        }

        let user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return alert("Invalid email or password");
        }

        // IMPORTANT: email ang ginagamit as currentUser
        localStorage.setItem("currentUser", email);

        window.location.href = "dashboard.html";
    };

    // ================= LOGOUT =================
    window.logout = function () {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    };

});