// Contact Form Validation and Functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // Character counters
    const subjectCounter = document.getElementById('subjectCounter');
    const messageCounter = document.getElementById('messageCounter');
    
    // Error message elements
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const subjectError = document.getElementById('subjectError');
    const messageError = document.getElementById('messageError');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Phone validation regex (09xxxxxxxxx format)
    const phoneRegex = /^09[0-9]{9}$/;

    // Character counter updates
    subjectInput.addEventListener('input', function() {
        subjectCounter.textContent = this.value.length;
        if (this.value.length > 30) {
            subjectCounter.style.color = '#dc3545';
        } else {
            subjectCounter.style.color = '#666';
        }
    });

    messageInput.addEventListener('input', function() {
        messageCounter.textContent = this.value.length;
        if (this.value.length > 300) {
            messageCounter.style.color = '#dc3545';
        } else {
            messageCounter.style.color = '#666';
        }
    });

    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    subjectInput.addEventListener('blur', validateSubject);
    messageInput.addEventListener('blur', validateMessage);

    // Validation functions
    function validateEmail() {
        const email = emailInput.value.trim();
        if (!email) {
            emailError.textContent = 'Email is required.';
            return false;
        } else if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address.';
            return false;
        } else {
            emailError.textContent = '';
            return true;
        }
    }

    function validatePhone() {
        const phone = phoneInput.value.trim();
        if (!phone) {
            phoneError.textContent = 'Phone number is required.';
            return false;
        } else if (!phoneRegex.test(phone)) {
            phoneError.textContent = 'Please enter a valid phone number (09xxxxxxxxx).';
            return false;
        } else {
            phoneError.textContent = '';
            return true;
        }
    }

    function validateSubject() {
        const subject = subjectInput.value.trim();
        if (!subject) {
            subjectError.textContent = 'Subject is required.';
            return false;
        } else if (subject.length > 30) {
            subjectError.textContent = 'Subject must be 30 characters or less.';
            return false;
        } else {
            subjectError.textContent = '';
            return true;
        }
    }

    function validateMessage() {
        const message = messageInput.value.trim();
        if (!message) {
            messageError.textContent = 'Message is required.';
            return false;
        } else if (message.length > 300) {
            messageError.textContent = 'Message must be 300 characters or less.';
            return false;
        } else {
            messageError.textContent = '';
            return true;
        }
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();
        
        // If all validations pass
        if (isEmailValid && isPhoneValid && isSubjectValid && isMessageValid) {
            // Disable submit button
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Simulate sending (in real app, you'd send to server)
            setTimeout(() => {
                // Reset form
                form.reset();
                subjectCounter.textContent = '0';
                messageCounter.textContent = '0';
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
                
                // Show success modal
                showModal();
            }, 1000);
        }
    });

    // Phone input formatting
    phoneInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        if (value.length >= 2 && !value.startsWith('09')) {
            value = '09' + value.slice(2);
        }
        this.value = value;
    });
});

// Modal functions
function showModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});
