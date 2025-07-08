// Contact Form Validation and Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Google Apps Script URL - Replace with your actual URL
    const GOOGLE_SCRIPT_URL = "https://script.google.com/a/macros/fit.edu.ph/s/AKfycbwmD6b3qq9WuXzZ_F5l10M7CvW2BC_E7p_7MxQ-p1___Bzw48fXnsDTuR-7MSi2NSER/exec"; // Google Apps Script URL
    
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    
    // Character counters
    const subjectCounter = document.getElementById('subjectCounter');
    const messageCounter = document.getElementById('messageCounter');
    
    // Error message elements
    const nameError = document.getElementById('nameError');
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
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    phoneInput.addEventListener('blur', validatePhone);
    subjectInput.addEventListener('blur', validateSubject);
    messageInput.addEventListener('blur', validateMessage);

    // Validation functions
    function validateName() {
        const name = nameInput.value.trim();
        if (!name) {
            nameError.textContent = 'Name is required.';
            return false;
        } else if (name.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters long.';
            return false;
        } else {
            nameError.textContent = '';
            return true;
        }
    }
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
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();
        
        // If all validations pass
        if (isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid) {
            // Disable submit button
            const submitBtn = form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Prepare data for Google Sheets
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                subject: subjectInput.value.trim(),
                message: messageInput.value.trim(),
                timestamp: new Date().toLocaleString()
            };
            
            console.log('Sending data:', formData);
            console.log('To URL:', GOOGLE_SCRIPT_URL);
            
            // Send to Google Sheets
            if (GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_URL") {
                fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify(formData),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    console.log('Response received:', response);
                    console.log('Response status:', response.status);
                    console.log('Response type:', response.type);
                    
                    // With no-cors mode, we can't read the response
                    // But if we get here, the request was sent successfully
                    if (response.type === 'opaque') {
                        // This means the request was sent but we can't read the response
                        // This is normal with no-cors mode
                        return { result: 'success' };
                    }
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    return response.json();
                })
                .then(data => {
                    console.log('Response data:', data);
                    
                    if (data.result === 'success') {
                        // Reset form
                        form.reset();
                        subjectCounter.textContent = '0';
                        messageCounter.textContent = '0';
                        
                        // Clear any error messages
                        clearAllErrors();
                        
                        // Re-enable button
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Send Message';
                        
                        // Show success modal
                        showModal();
                    } else {
                        throw new Error('Failed to submit form');
                    }
                })
                .catch(error => {
                    console.error('Error details:', error);
                    console.error('Error message:', error.message);
                    
                    // For CORS errors with Google Apps Script, the request might still succeed
                    // even though we get an error in the browser
                    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
                        console.log('CORS error detected - this is normal with Google Apps Script');
                        console.log('The data was likely still sent successfully');
                        
                        // Ask user to check their Google Sheet
                        const checkSheet = confirm(
                            'There was a CORS error (this is normal with Google Sheets).\n\n' +
                            'The data was likely still sent successfully.\n\n' +
                            'Click OK if you want to proceed as if it worked, or Cancel to try again.'
                        );
                        
                        if (checkSheet) {
                            // Treat as success
                            form.reset();
                            subjectCounter.textContent = '0';
                            messageCounter.textContent = '0';
                            clearAllErrors();
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Send Message';
                            showModal();
                            return;
                        }
                    }
                    
                    // More detailed error message
                    let errorMsg = 'Error sending message. ';
                    if (error.message.includes('Failed to fetch')) {
                        errorMsg += 'Network issue or CORS error. Check console for details.';
                    } else if (error.message.includes('Failed to submit form')) {
                        errorMsg += 'Server returned an error. Check your Google Apps Script.';
                    } else {
                        errorMsg += 'Please try again or check the console for details.';
                    }
                    
                    alert(errorMsg);
                    
                    // Re-enable button
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                });
            } else {
                // If Google Script URL is not set, show warning
                alert('Please set up your Google Apps Script URL first. Check the console for instructions.');
                console.log('To set up Google Sheets integration:');
                console.log('1. Create a Google Sheet with headers: Name, Email, Phone, Subject, Message, Timestamp');
                console.log('2. Go to Extensions > Apps Script');
                console.log('3. Replace the code with the provided Google Apps Script code');
                console.log('4. Deploy as web app and get the URL');
                console.log('5. Replace GOOGLE_SCRIPT_URL in contact.js with your actual URL');
                
                // Re-enable button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
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
    
    // Helper function to clear all error messages
    function clearAllErrors() {
        nameError.textContent = '';
        emailError.textContent = '';
        phoneError.textContent = '';
        subjectError.textContent = '';
        messageError.textContent = '';
    }
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
