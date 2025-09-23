// --------------------- Tracking User Details ------------------------//

let registeringUser = true; // Flag to check if user is currently being registered. Game runs only when this is false.
let username = "";   // optional username

// DOM Elements
const registrationOverlay = document.getElementById('registrationOverlay');
const passwordScreen = document.getElementById('passwordScreen');
const usernameScreen = document.getElementById('usernameScreen');
const passwordInput = document.getElementById('passwordInput');
const passwordBtn = document.getElementById('passwordBtn');
const usernameInput = document.getElementById('usernameInput');
const submitBtn = document.getElementById('submitBtn');
const guestBtn = document.getElementById('guestBtn');
const resetBtn = document.getElementById('resetBtn');
const showRegisterBtn = document.getElementById('showRegisterBtn');
const errorMessage = document.getElementById('errorMessage');

// Hardcoded password
const INSTRUCTOR_PASSWORD = "RedHatPixy";

// Event Listeners
passwordBtn.addEventListener('click', handlePasswordSubmit);
passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handlePasswordSubmit();
});

submitBtn.addEventListener('click', () => handleUsernameSubmit());
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUsernameSubmit();
});

guestBtn.addEventListener('click', () => handleGuestRegistration());

resetBtn.addEventListener('click', () => {
    if (typeof towerPair !== 'undefined' && typeof towerPair.reset === 'function') {
        towerPair.reset();
    }
});

showRegisterBtn.addEventListener('click', () => {
    showPasswordScreen();
});

// Password submission handler
function handlePasswordSubmit() {
    const enteredPassword = passwordInput.value.trim();
    
    if (enteredPassword === INSTRUCTOR_PASSWORD) {
        errorMessage.textContent = "";
        showUsernameScreen();
    } else {
        errorMessage.textContent = "Incorrect password. Please try again.";
        passwordInput.value = "";
        passwordInput.focus();
    }
}

// Username submission handler
function handleUsernameSubmit() {
    const enteredUsername = usernameInput.value.trim();
    
    if (enteredUsername === "") {
        errorMessage.textContent = "Username cannot be blank.";
        return;
    }
    
    errorMessage.textContent = "";
    completeRegistration(enteredUsername);
}

// Guest registration handler
function handleGuestRegistration() {
    completeRegistration("Guest");
}

// Complete registration process
function completeRegistration(userName) {
    username = userName;
    registeringUser = false;
    registrationOverlay.style.display = 'none';

    // Store the username in localStorage
    localStorage.setItem('gameUsername', username);
    console.log('User registered as:', username);

    if(hasSetupStarted) {
        // Resetting the towerPair and data if a new registration is done after 
        towerPair.reset();
        resetUserData();
        sendDataToBackend("User joined: " + username);
    }
}

// Show password screen
function showPasswordScreen() {
    registeringUser = true;
    registrationOverlay.style.display = 'flex';
    passwordScreen.style.display = 'flex';
    usernameScreen.style.display = 'none';
    passwordInput.value = "";
    usernameInput.value = "";
    errorMessage.textContent = "";
    passwordInput.focus();
}

// Show username screen
function showUsernameScreen() {
    passwordScreen.style.display = 'none';
    usernameScreen.style.display = 'flex';
    usernameInput.focus();
}

// Initialize registration system
function initRegistration() {
    // Always show password screen on initial load
    showPasswordScreen();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initRegistration);