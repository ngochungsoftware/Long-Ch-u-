// Auth Module
const auth = (function() {
    // DOM Elements
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const userMenu = document.querySelector('.user-menu');
    const userStatus = document.getElementById('userStatus');
    const logoutBtn = document.getElementById('logoutBtn');
    const userMenuToggle = document.getElementById('userMenuToggle');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    const openRegisterModal = document.getElementById('openRegisterModal');
    const registerModal = document.getElementById('registerModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const registerForm = document.getElementById('registerForm');
    const registerErrorMessage = document.getElementById('registerErrorMessage');
    const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const registerPasswordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const openLoginModal = document.getElementById('openLoginModal');
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotPasswordModal = document.getElementById('closeForgotPasswordModal');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    const forgotPasswordErrorMessage = document.getElementById('forgotPasswordErrorMessage');
    const backToLogin = document.getElementById('backToLogin');

    // State
    let isLoggedIn = false;
    let currentUser = null;

    // Event Listeners
    function init() {
        // Login Modal
        loginButton.addEventListener('click', openModal);
        closeLoginModal.addEventListener('click', closeModal);
        loginForm.addEventListener('submit', handleLogin);
        togglePassword.addEventListener('click', () => togglePasswordVisibility(passwordInput, togglePassword));
        logoutBtn.addEventListener('click', handleLogout);

        // User Menu Toggle
        userMenuToggle.addEventListener('click', toggleUserMenu);

        // Register Modal
        openRegisterModal.addEventListener('click', openRegisterModalHandler);
        closeRegisterModal.addEventListener('click', closeRegisterModalHandler);
        registerForm.addEventListener('submit', handleRegister);
        toggleRegisterPassword.addEventListener('click', () => togglePasswordVisibility(registerPasswordInput, toggleRegisterPassword));
        toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword));
        openLoginModal.addEventListener('click', openLoginModalHandler);

        // Forgot Password Modal
        forgotPasswordLink.addEventListener('click', openForgotPasswordModalHandler);
        closeForgotPasswordModal.addEventListener('click', closeForgotPasswordModalHandler);
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
        backToLogin.addEventListener('click', backToLoginHandler);

        // Close modals and dropdowns when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                closeModal();
            }
            if (e.target === registerModal) {
                closeRegisterModalHandler();
            }
            if (e.target === forgotPasswordModal) {
                closeForgotPasswordModalHandler();
            }
            if (!e.target.closest('.user-menu') && userMenuDropdown.classList.contains('active')) {
                userMenuDropdown.classList.remove('active');
            }
        });

        // Check if user is already logged in
        checkAuthStatus();
    }

    // User Menu Toggle
    function toggleUserMenu(e) {
        e.preventDefault();
        if (isLoggedIn) {
            userMenuDropdown.classList.toggle('active');
        } else {
            openModal();
        }
    }

    // Modal Handlers
    function openModal() {
        loginModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        loginModal.classList.remove('active');
        document.body.style.overflow = '';
        errorMessage.textContent = '';
        loginForm.reset();
    }

    function openRegisterModalHandler(e) {
        e.preventDefault();
        closeModal();
        registerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeRegisterModalHandler() {
        registerModal.classList.remove('active');
        document.body.style.overflow = '';
        registerErrorMessage.textContent = '';
        registerForm.reset();
    }

    function openLoginModalHandler(e) {
        e.preventDefault();
        closeRegisterModalHandler();
        openModal();
    }

    function openForgotPasswordModalHandler(e) {
        e.preventDefault();
        closeModal();
        forgotPasswordModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeForgotPasswordModalHandler() {
        forgotPasswordModal.classList.remove('active');
        document.body.style.overflow = '';
        forgotPasswordErrorMessage.textContent = '';
        forgotPasswordForm.reset();
    }

    function backToLoginHandler(e) {
        e.preventDefault();
        closeForgotPasswordModalHandler();
        openModal();
    }

    // Password Visibility Toggle
    function togglePasswordVisibility(input, button) {
        const icon = button.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    // Form Handlers
    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;

        // Validate email format
        if (!isValidEmail(email)) {
            errorMessage.textContent = 'Email không hợp lệ';
            return;
        }

        // Validate password
        if (!isValidPassword(password)) {
            errorMessage.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
            return;
        }

        // Simulate API call
        simulateLogin(email, password, remember)
            .then(user => {
                currentUser = user;
                isLoggedIn = true;
                updateUI();
                closeModal();
                showNotification('Đăng nhập thành công!');
            })
            .catch(error => {
                errorMessage.textContent = error;
            });
    }

    function handleRegister(e) {
        e.preventDefault();
        let name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const birthDate = document.getElementById('registerBirthDate').value;
        const terms = document.getElementById('terms').checked;

        // If name is empty, use the part before @ in email
        if (!name && email) {
            name = email.split('@')[0];
        }

        // Validate form
        if (!name || !email || !phone || !password || !confirmPassword || !birthDate) {
            registerErrorMessage.textContent = 'Vui lòng điền đầy đủ thông tin';
            return;
        }

        if (!isValidEmail(email)) {
            registerErrorMessage.textContent = 'Email không hợp lệ';
            return;
        }

        if (!isValidPhone(phone)) {
            registerErrorMessage.textContent = 'Số điện thoại không hợp lệ';
            return;
        }

        if (!isValidPassword(password)) {
            registerErrorMessage.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
            return;
        }

        if (password !== confirmPassword) {
            registerErrorMessage.textContent = 'Mật khẩu không khớp';
            return;
        }

        if (!terms) {
            registerErrorMessage.textContent = 'Vui lòng đồng ý với điều khoản sử dụng';
            return;
        }

        // Simulate API call
        simulateRegister({ name, email, phone, password, birthDate })
            .then(user => {
                // Auto login after successful registration
                currentUser = user;
                isLoggedIn = true;
                localStorage.setItem('currentUser', JSON.stringify(user));
                updateUI();
                closeRegisterModalHandler();
                showNotification('Đăng ký và đăng nhập thành công!');
            })
            .catch(error => {
                registerErrorMessage.textContent = error;
            });
    }

    function handleLogout() {
        // Chỉ xóa currentUser, giữ lại users array
        localStorage.removeItem('currentUser');
        currentUser = null;
        isLoggedIn = false;
        updateUI();
        showNotification('Đăng xuất thành công!');
    }

    function handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value;

        // Validate email format
        if (!isValidEmail(email)) {
            forgotPasswordErrorMessage.textContent = 'Email không hợp lệ';
            return;
        }

        // Simulate API call
        simulateForgotPassword(email)
            .then(() => {
                closeForgotPasswordModalHandler();
                showNotification('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn');
            })
            .catch(error => {
                forgotPasswordErrorMessage.textContent = error;
            });
    }

    // Validation Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^[0-9]{10,11}$/;
        return phoneRegex.test(phone);
    }

    function isValidPassword(password) {
        return password.length >= 6;
    }

    // UI Update
    function updateUI() {
        if (isLoggedIn && currentUser) {
            if (loginButton) loginButton.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userStatus) userStatus.textContent = currentUser.name || 'Người dùng';
        } else {
            if (loginButton) loginButton.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
            if (userMenuDropdown) userMenuDropdown.classList.remove('active');
        }
    }

    // Auth Status Check
    function checkAuthStatus() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                currentUser = JSON.parse(storedUser);
                isLoggedIn = true;
                updateUI();
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('currentUser');
                isLoggedIn = false;
                currentUser = null;
                updateUI();
            }
        }
    }

    // Simulated API Calls
    function simulateLogin(email, password, remember) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Get users array from localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Store current user
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    resolve(user);
                } else {
                    reject('Email hoặc mật khẩu không đúng');
                }
            }, 1000);
        });
    }

    function simulateRegister(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Get existing users
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                
                // Check if email already exists
                if (users.some(user => user.email === userData.email)) {
                    reject('Email đã được sử dụng');
                    return;
                }

                // Create new user
                const newUser = {
                    id: Date.now(),
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    birthDate: userData.birthDate,
                    gender: 'male'
                };

                // Add to users array
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Set as current user
                localStorage.setItem('currentUser', JSON.stringify(newUser));
                resolve(newUser);
            }, 1000);
        });
    }

    function simulateForgotPassword(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Get users array from localStorage
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email);
                
                if (user) {
                    // In a real application, you would send an email with a reset link
                    // For this demo, we'll just simulate success
                    resolve();
                } else {
                    reject('Email không tồn tại trong hệ thống');
                }
            }, 1000);
        });
    }

    // Notification
    function showNotification(message) {
        const notification = document.getElementById('notificationPopup');
        const notificationMessage = document.getElementById('notificationMessage');
        notificationMessage.textContent = message;
        notification.classList.add('active');
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    }

    // Public API
    return {
        init,
        isLoggedIn: () => isLoggedIn,
        getCurrentUser: () => currentUser
    };
})();

// Initialize auth module
document.addEventListener('DOMContentLoaded', auth.init); 