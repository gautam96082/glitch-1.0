const usernameEl = document.getElementById('username');
const passwordEl = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

loginBtn.addEventListener('click', () => {
    const user = usernameEl.value.trim();
    const pass = passwordEl.value.trim();
    if (!user || !pass) { alert('Enter username and password'); return; }

    const stored = JSON.parse(localStorage.getItem('users') || '{}');
    if (stored[user] && stored[user] === pass) {
        localStorage.setItem('loggedIn', user);
        window.location.href = 'app.html';
    } else alert('Invalid credentials');
});

registerBtn.addEventListener('click', () => {
    const user = usernameEl.value.trim();
    const pass = passwordEl.value.trim();
    if (!user || !pass) { alert('Enter username and password'); return; }

    const stored = JSON.parse(localStorage.getItem('users') || '{}');
    if (stored[user]) { alert('User already exists'); return; }
    stored[user] = pass;
    localStorage.setItem('users', JSON.stringify(stored));
    alert('Registered successfully! You can now login.');
});
