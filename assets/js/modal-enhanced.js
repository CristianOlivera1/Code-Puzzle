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
            eyeIcon.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.275 15.296C2.425 14.192 2 13.639 2 12c0-1.64.425-2.191 1.275-3.296C4.972 6.5 7.818 4 12 4s7.028 2.5 8.725 4.704C21.575 9.81 22 10.361 22 12c0 1.64-.425 2.191-1.275 3.296C19.028 17.5 16.182 20 12 20s-7.028-2.5-8.725-4.704Z"/><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"/></g>';
        } else {
            eyeIcon.innerHTML = '<path fill="currentColor" d="M17.883 19.297A10.95 10.95 0 0 1 12 21c-5.392 0-9.878-3.88-10.818-9A11 11 0 0 1 4.52 5.935L1.394 2.808l1.414-1.414l19.799 19.798l-1.414 1.415zM5.936 7.35A8.97 8.97 0 0 0 3.223 12a9.005 9.005 0 0 0 13.201 5.838l-2.028-2.028A4.5 4.5 0 0 1 8.19 9.604zm6.978 6.978l-3.242-3.241a2.5 2.5 0 0 0 3.241 3.241m7.893 2.265l-1.431-1.431A8.9 8.9 0 0 0 20.778 12A9.005 9.005 0 0 0 9.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.95 10.95 0 0 1-2.012 4.593m-9.084-9.084Q11.86 7.5 12 7.5a4.5 4.5 0 0 1 4.492 4.778z" />';
        }
    }

    function toggleRegisterPasswordVisibility() {
        const isPasswordVisible = registerPasswordInput.type === 'text';
        registerPasswordInput.type = isPasswordVisible ? 'password' : 'text';
        
        // Update icon
        if (isPasswordVisible) {
            eyeRegisterIcon.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.275 15.296C2.425 14.192 2 13.639 2 12c0-1.64.425-2.191 1.275-3.296C4.972 6.5 7.818 4 12 4s7.028 2.5 8.725 4.704C21.575 9.81 22 10.361 22 12c0 1.64-.425 2.191-1.275 3.296C19.028 17.5 16.182 20 12 20s-7.028-2.5-8.725-4.704Z"/><path d="M15 12a3 3 0 1 1-6 0a3 3 0 0 1 6 0Z"/></g>';
        } else {
            eyeRegisterIcon.innerHTML = '<path fill="currentColor" d="M17.883 19.297A10.95 10.95 0 0 1 12 21c-5.392 0-9.878-3.88-10.818-9A11 11 0 0 1 4.52 5.935L1.394 2.808l1.414-1.414l19.799 19.798l-1.414 1.415zM5.936 7.35A8.97 8.97 0 0 0 3.223 12a9.005 9.005 0 0 0 13.201 5.838l-2.028-2.028A4.5 4.5 0 0 1 8.19 9.604zm6.978 6.978l-3.242-3.241a2.5 2.5 0 0 0 3.241 3.241m7.893 2.265l-1.431-1.431A8.9 8.9 0 0 0 20.778 12A9.005 9.005 0 0 0 9.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.95 10.95 0 0 1-2.012 4.593m-9.084-9.084Q11.86 7.5 12 7.5a4.5 4.5 0 0 1 4.492 4.778z" />';
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
