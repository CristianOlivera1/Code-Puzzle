// Enhanced Modal Functionality for the new design
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const modal = document.getElementById('auth-modal');
    const closeBtn = modal.querySelector('.close');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const toggleRegisterPasswordBtn = document.getElementById('toggle-register-password');
    const passwordInput = document.getElementById('login-password');
    const registerPasswordInput = document.getElementById('register-password');
    const eyeIcon = document.getElementById('eye-icon');
    const eyeRegisterIcon = document.getElementById('eye-register-icon');

    // Show/Hide Modal Functions
    function showModal() {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Switch between login and register forms
    function showLoginForm() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    }

    function showRegisterForm() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }

    // Password visibility toggle
    function togglePasswordVisibility() {
        const isPasswordVisible = passwordInput.type === 'text';
        passwordInput.type = isPasswordVisible ? 'password' : 'text';
        
        // Update icon
        if (isPasswordVisible) {
            eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
        } else {
            eyeIcon.innerHTML = '<path d="M9.342 8.651l1.414 1.414A2 2 0 0 0 12 9a2 2 0 0 0-2 2 2 2 0 0 0 1.065.756l1.414 1.414A4 4 0 0 1 8 12a4 4 0 0 1 4-4z"/><path d="M12 5c-7 0-10 7-10 7a13.16 13.16 0 0 0 1.9 2.3l1.423-1.423A11.14 11.14 0 0 1 3 12s2.5-5 9-5a9.79 9.79 0 0 1 2.737.383l1.398-1.398A14.02 14.02 0 0 0 12 5z"/><path d="M12 19c7 0 10-7 10-7a13.16 13.16 0 0 0-1.9-2.3l-1.423 1.423A11.14 11.14 0 0 1 21 12s-2.5 5-9 5a9.79 9.79 0 0 1-2.737-.383l-1.398 1.398A14.02 14.02 0 0 0 12 19z"/><path d="M3 3l18 18"/>';
        }
    }

    function toggleRegisterPasswordVisibility() {
        const isPasswordVisible = registerPasswordInput.type === 'text';
        registerPasswordInput.type = isPasswordVisible ? 'password' : 'text';
        
        // Update icon
        if (isPasswordVisible) {
            eyeRegisterIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
        } else {
            eyeRegisterIcon.innerHTML = '<path d="M9.342 8.651l1.414 1.414A2 2 0 0 0 12 9a2 2 0 0 0-2 2 2 2 0 0 0 1.065.756l1.414 1.414A4 4 0 0 1 8 12a4 4 0 0 1 4-4z"/><path d="M12 5c-7 0-10 7-10 7a13.16 13.16 0 0 0 1.9 2.3l1.423-1.423A11.14 11.14 0 0 1 3 12s2.5-5 9-5a9.79 9.79 0 0 1 2.737.383l1.398-1.398A14.02 14.02 0 0 0 12 5z"/><path d="M12 19c7 0 10-7 10-7a13.16 13.16 0 0 0-1.9-2.3l-1.423 1.423A11.14 11.14 0 0 1 21 12s-2.5 5-9 5a9.79 9.79 0 0 1-2.737-.383l-1.398 1.398A14.02 14.02 0 0 0 12 19z"/><path d="M3 3l18 18"/>';
        }
    }

    // Alert system
    function showAlert(type, message) {
        const alertContainer = document.getElementById('alert-container');
        const alertBox = document.getElementById('alert-box');
        const alertIcon = document.getElementById('alert-icon');
        const alertMessage = document.getElementById('alert-message');

        // Clear existing classes
        alertBox.className = 'flex items-center p-4 rounded-lg shadow-lg w-auto';
        
        // Add appropriate classes based on type
        if (type === 'success') {
            alertBox.classList.add('bg-green-50', 'text-green-800', 'border', 'border-green-100');
            alertIcon.innerHTML = '<path d="M16.707 5.293a1 1 0 0 0-1.414 0L9 11.586 6.707 9.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414Z" />';
        } else if (type === 'error') {
            alertBox.classList.add('bg-red-50', 'text-red-800', 'border', 'border-red-100');
            alertIcon.innerHTML = '<path d="M10 2L9 3H4v2h16V3h-5l-1-1H10zM5 7v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7H5z"/>';
        }

        alertMessage.textContent = message;
        alertContainer.classList.remove('hidden');

        // Auto hide after 5 seconds
        setTimeout(() => {
            alertContainer.classList.add('hidden');
        }, 5000);
    }

    // Event Listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', hideModal);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Form switching
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterForm();
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });
    }

    // Password visibility toggles
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    }

    if (toggleRegisterPasswordBtn) {
        toggleRegisterPasswordBtn.addEventListener('click', toggleRegisterPasswordVisibility);
    }

    // Update the existing GameController methods to use new modal
    if (window.gameController) {
        // Override showAuthModal method
        window.gameController.showAuthModal = function(type = 'login') {
            if (type === 'register') {
                showRegisterForm();
            } else {
                showLoginForm();
            }
            showModal();
        };

        // Override hideAuthModal method
        window.gameController.hideAuthModal = function() {
            hideModal();
        };

        // Override showNotification to use new alert system
        const originalShowNotification = window.gameController.showNotification;
        window.gameController.showNotification = function(message, type = 'info') {
            if (type === 'success' || type === 'error') {
                showAlert(type, message);
            } else {
                // Fallback to original method for other types
                originalShowNotification.call(this, message, type);
            }
        };
    }

    // Expose functions globally for compatibility
    window.showAuthModal = function(type = 'login') {
        if (type === 'register') {
            showRegisterForm();
        } else {
            showLoginForm();
        }
        showModal();
    };

    window.hideAuthModal = hideModal;
    window.showAlert = showAlert;
});
