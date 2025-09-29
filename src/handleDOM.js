// --------------------- Tracking User Details ------------------------//

let registeringUser = true; // Flag to check if user is currently being registered. Game runs only when this is false.
let username = "";   // optional username
let schoolID = "";
let dayID = "";

// Problem Number Management
let currentProblemNumber = 1;
let isProcessing = false; // Flag to prevent multiple rapid clicks

// DOM Elements
const registrationOverlay = document.getElementById('registrationOverlay');
const passwordScreen = document.getElementById('passwordScreen');
const usernameScreen = document.getElementById('usernameScreen');
const passwordInput = document.getElementById('passwordInput');
const passwordBtn = document.getElementById('passwordBtn');
const usernameInput = document.getElementById('usernameInput');
const schoolInput = document.getElementById('schoolInput');
const dayInput = document.getElementById('dayInput');
const submitBtn = document.getElementById('submitBtn');
const guestBtn = document.getElementById('guestBtn');
const resetBtn = document.getElementById('resetBtn');
// const showRegisterBtn = document.getElementById('showRegisterBtn');
const errorMessage = document.getElementById('errorMessage');



const problemNumberElement = document.getElementById('problemNumber');
const problemIncrementBtn = document.getElementById('problemIncrement');
const problemDecrementBtn = document.getElementById('problemDecrement');
const problemResetBtn = document.getElementById('problemReset');


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

// showRegisterBtn.addEventListener('click', () => {
//     showPasswordScreen();
// });

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
    const enteredSchool = schoolInput.value.trim();
    const enteredDay = dayInput.value.trim();
    
    if (enteredUsername === "") {
        errorMessage.textContent = "Username cannot be blank.";
        return;
    }
    let enteredDetails ={
        username: enteredUsername,
        schoolID: enteredSchool,
        dayID: enteredDay
    }

    errorMessage.textContent = "";
    completeRegistration(enteredDetails);
}

// Guest registration handler
function handleGuestRegistration() {
    completeRegistration({username: "Guest", schoolID: "N/A", dayID: "N/A"});
}

// Complete registration process
function completeRegistration(details) {
    username = details.username;
    schoolID = details.schoolID;
    dayID = details.dayID;

    registeringUser = false;
    registrationOverlay.style.display = 'none';

    // Store the username in localStorage
    localStorage.setItem('gameUsername', username);
    console.log('User registered as:', username);

    if(hasSetupStarted) {
        // Resetting the towerPair and data if a new registration is done after 
        towerPair.reset();
        resetUserData();
        sendActionDataToBackend("User joined: " + username);
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


// Problem Number Display

// Initialize problem number display
function initializeProblemDisplay() {
    updateProblemDisplay();
    setupProblemEventListeners();
}

// Update the display with current problem number
function updateProblemDisplay() {
    // Ensure number stays within 2-digit limit (0-99)
    if (currentProblemNumber > 99) currentProblemNumber = 99;
    if (currentProblemNumber < 0) currentProblemNumber = 0;
    
    problemNumberElement.textContent = currentProblemNumber;
}

// Set up event listeners with click prevention
function setupProblemEventListeners() {
    // Increment button with click prevention
    problemIncrementBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isProcessing) {
            isProcessing = true;
            currentProblemNumber = Math.min(currentProblemNumber + 1, 99);
            updateProblemDisplay();
            animateButtonPress(problemIncrementBtn);
            
            setTimeout(() => {
                isProcessing = false;
            }, 150);
        }
    }, { passive: false });

    // Decrement button with click prevention
    problemDecrementBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isProcessing) {
            isProcessing = true;
            currentProblemNumber = Math.max(currentProblemNumber - 1, 0);
            updateProblemDisplay();
            animateButtonPress(problemDecrementBtn);
            
            setTimeout(() => {
                isProcessing = false;
            }, 150);
        }
    }, { passive: false });

    // Reset button with click prevention
    problemResetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isProcessing) {
            isProcessing = true;
            currentProblemNumber = 0;
            updateProblemDisplay();
            animateButtonPress(problemResetBtn);
            
            setTimeout(() => {
                isProcessing = false;
            }, 150);
        }
    }, { passive: false });

}


// Button press animation
function animateButtonPress(button) {
    button.style.transform = 'translateY(2px)';
    setTimeout(() => {
        button.style.transform = '';
    }, 150);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeProblemDisplay);