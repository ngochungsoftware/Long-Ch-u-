// Profile Module
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profileForm = document.getElementById('profileForm');
    const nameInput = document.getElementById('profileName');
    const userDetails = document.querySelector('.user-details');
    const userNameDisplay = userDetails ? userDetails.querySelector('h3') : null;
    const userPhoneDisplay = userDetails ? userDetails.querySelector('p') : null;
    const phoneInput = document.querySelector('.phone-input input[type="tel"]');
    const emailInput = document.querySelector('input[type="email"]');
    const dateInput = document.querySelector('input[type="date"]');
    const genderInputs = document.querySelectorAll('input[name="gender"]');

    // Load user data from localStorage
    function loadUserData() {
        const userData = localStorage.getItem('currentUser');
        
        try {
            if (userData) {
                const user = JSON.parse(userData);
                
                // Update form fields
                nameInput.value = user.name || '';
                phoneInput.value = user.phone ? user.phone.replace(/^\+84|^84|^0/, '') : '';
                emailInput.value = user.email || '';
                dateInput.value = user.birthDate || '';
                
                // Update gender selection
                const gender = user.gender || 'male';
                const genderInput = document.querySelector(`input[value="${gender}"]`);
                if (genderInput) {
                    genderInput.checked = true;
                }

                // Update sidebar display
                if (userNameDisplay) {
                    userNameDisplay.textContent = user.name || 'Người dùng';
                } else {
                    console.warn('Không tìm thấy thẻ h3 trong .user-details');
                }
                if (userPhoneDisplay) {
                    userPhoneDisplay.textContent = user.phone || '';
                } else {
                    console.warn('Không tìm thấy thẻ p trong .user-details');
                }
            } else {
                // Nếu chưa đăng nhập, hiển thị thông tin mặc định
                if (userNameDisplay) userNameDisplay.textContent = 'Khách';
                if (userPhoneDisplay) userPhoneDisplay.textContent = 'Vui lòng đăng nhập';
                
                // Disable form fields
                nameInput.disabled = true;
                phoneInput.disabled = true;
                emailInput.disabled = true;
                dateInput.disabled = true;
                genderInputs.forEach(input => input.disabled = true);
                
                // Disable submit button
                const submitBtn = profileForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                }
                
                showNotification('Vui lòng đăng nhập để chỉnh sửa thông tin');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            showNotification('Có lỗi xảy ra khi tải thông tin người dùng');
        }
    }

    // Handle form submission
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const userData = localStorage.getItem('currentUser');
            if (!userData) {
                showNotification('Vui lòng đăng nhập để cập nhật thông tin');
                return;
            }

            try {
                const currentUser = JSON.parse(userData);
                const updatedUser = {
                    ...currentUser,
                    name: nameInput.value,
                    phone: '+84' + phoneInput.value.replace(/^\+84|^84|^0/, ''),
                    email: emailInput.value,
                    birthDate: dateInput.value,
                    gender: document.querySelector('input[name="gender"]:checked')?.value || 'male'
                };

                // Update in localStorage
                localStorage.setItem('currentUser', JSON.stringify(updatedUser));

                // Update users array if exists
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const userIndex = users.findIndex(u => u.id === currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex] = updatedUser;
                    localStorage.setItem('users', JSON.stringify(users));
                }

                // Update display
                if (userNameDisplay) {
                    userNameDisplay.textContent = updatedUser.name;
                }
                if (userPhoneDisplay) {
                    userPhoneDisplay.textContent = updatedUser.phone;
                }

                showNotification('Cập nhật thông tin thành công!');
            } catch (error) {
                console.error('Error updating user data:', error);
                showNotification('Có lỗi xảy ra khi cập nhật thông tin');
            }
        });
    }

    // Show notification
    function showNotification(message) {
        const notification = document.getElementById('notificationPopup');
        const notificationMessage = document.getElementById('notificationMessage');
        if (notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.classList.add('active');
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        } else {
            alert(message);
        }
    }

    // Initialize
    loadUserData();
}); 