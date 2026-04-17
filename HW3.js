/*
Program name: HW3.js
Name: Mikhail Maredia
Date Created: 4/16/26
Version: 3.0
Description: JS validation for HW3
*/

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. Top Header Date ---
    const d = new Date();
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    document.getElementById("date-display").innerHTML = 
        "Today is: " + days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();

    // --- 2. Dynamic Date Min/Max for DOB ---
    const dobInput = document.getElementById('dob');
    let todayDate = new Date();
    let maxDateStr = todayDate.toISOString().split('T')[0];
    dobInput.max = maxDateStr;

    let minDateObj = new Date();
    minDateObj.setFullYear(todayDate.getFullYear() - 120);
    let minDateStr = minDateObj.toISOString().split('T')[0];
    dobInput.min = minDateStr;

    // --- 3. Dynamic Slide Bar Value ---
    const painSlider = document.getElementById('pain');
    const painValDisplay = document.getElementById('pain-val');
    painSlider.addEventListener('input', function() {
        painValDisplay.innerText = this.value;
    });

    // --- 4. Validation Functions & Event Listeners ---

    // Utility: Show/Clear Errors
    function showError(inputId, msg) {
        document.getElementById('err-' + inputId).innerText = msg;
    }
    function clearError(inputId) {
        document.getElementById('err-' + inputId).innerText = "";
    }

    // RegEx Patterns
    const patterns = {
        name: /^[A-Za-z'\-]{1,30}$/,
        mi: /^[A-Za-z]?$/,
        email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
        zip: /^\d{5}$/,
        phone: /^\d{3}-\d{3}-\d{4}$/,
        uid: /^[A-Za-z][A-Za-z0-9_\-]{4,19}$/,
        pwd: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,30}$/
    };

    // Auto-format SSN as user types
    const ssnInput = document.getElementById('ssn');
    ssnInput.addEventListener('input', function(e) {
        let val = this.value.replace(/\D/g, ''); // Strip non-digits
        if (val.length > 9) val = val.slice(0, 9);
        let formatted = val;
        if (val.length > 3) formatted = val.slice(0, 3) + '-' + val.slice(3);
        if (val.length > 5) formatted = val.slice(0, 3) + '-' + val.slice(3, 5) + '-' + val.slice(5);
        this.value = formatted;
        validateField(this);
    });

    // Force lowercase for User ID and Email
    ['uid', 'email'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            this.value = this.value.toLowerCase();
            validateField(this);
        });
    });

    // Main Validation Logic for individual fields
    function validateField(field) {
        const val = field.value.trim();
        const id = field.id;
        let isValid = true;

        if (field.required && val === "") {
            showError(id, "This field is required.");
            return false;
        }

        switch (id) {
            case 'uid':
                if (!patterns.uid.test(val)) {
                    showError(id, "5-20 chars. Must start with a letter. No spaces/special chars.");
                    isValid = false;
                } else clearError(id);
                break;

            case 'email':
                if (!patterns.email.test(val)) {
                    showError(id, "Invalid email format (name@domain.tld).");
                    isValid = false;
                } else clearError(id);
                break;

            case 'pwd1':
                if (!patterns.pwd.test(val)) {
                    showError(id, "Min 8 chars, 1 uppercase, 1 lowercase, 1 number required.");
                    isValid = false;
                } else if (val === document.getElementById('uid').value) {
                    showError(id, "Password cannot equal User ID.");
                    isValid = false;
                } else clearError(id);
                
                // Re-trigger pwd2 check in case it was already typed
                if(document.getElementById('pwd2').value) validateField(document.getElementById('pwd2'));
                break;

            case 'pwd2':
                if (val !== document.getElementById('pwd1').value) {
                    showError(id, "Passwords do not match.");
                    isValid = false;
                } else clearError(id);
                break;

            case 'fname':
            case 'lname':
                if (!patterns.name.test(val)) {
                    showError(id, "Letters, apostrophes, and dashes only.");
                    isValid = false;
                } else clearError(id);
                break;

            case 'mi':
                if (val && !patterns.mi.test(val)) {
                    showError(id, "1 letter only.");
                    isValid = false;
                } else clearError(id);
                break;

            case 'dob':
                let dobDate = new Date(val);
                if (dobDate > todayDate || dobDate < minDateObj) {
                    showError(id, "Invalid date range.");
                    isValid = false;
                } else clearError(id);
                break;

            case 'ssn':
                if (val.length !== 11) { // includes dashes
                    showError(id, "Must be 9 digits.");
                    isValid = false;
                } else clearError(id);
                break;

            case 'phone':
                if (!patterns.phone.test(val)) {
                    showError(id, "Format must be 000-000-0000.");
                    isValid = false;
                } else clearError(id);
                break;

            case 'addr1':
            case 'city':
                if (val.length < 2) {
                    showError(id, "Minimum 2 characters required.");
                    isValid = false;
                } else clearError(id);
                break;

            case 'addr2':
                if (val.length > 0 && val.length < 2) {
                    showError(id, "If provided, minimum 2 characters required.");
                    isValid = false;
                } else clearError(id);
                break;

            case 'state':
                if (val === "") {
                    showError(id, "Please select a state.");
                    isValid = false;
                } else clearError(id);
                break;

            case 'zip':
                if (!patterns.zip.test(val)) {
                    showError(id, "Must be exactly 5 digits.");
                    isValid = false;
                } else clearError(id);
                break;
                
            case 'symptoms':
                if (val.includes('"')) {
                    showError(id, 'Double quotes (") are not allowed.');
                    isValid = false;
                } else clearError(id);
                break;
        }

        return isValid;
    }

    // Attach real-time validation to all inputs
    const inputs = document.querySelectorAll('#single-line-form input, #single-line-form select, #single-line-form textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() { validateField(this); });
        input.addEventListener('input', function() { 
            // Only validate on input if there's an existing error (to clear it fast)
            if (document.getElementById('err-' + this.id) && document.getElementById('err-' + this.id).innerText !== "") {
                validateField(this);
            }
        });
    });

    // --- 5. Validate Button Logic ---
    const validateBtn = document.getElementById('validateBtn');
    const submitBtn = document.getElementById('submitBtn');
    const globalErr = document.getElementById('global-error');

    validateBtn.addEventListener('click', function() {
        let allValid = true;
        inputs.forEach(input => {
            // Validate fields that have an ID and an associated error span
            if (input.id && document.getElementById('err-' + input.id)) {
                if (!validateField(input)) {
                    allValid = false;
                }
            }
        });

        // Check required Radio groups manually
        const genderChecked = document.querySelector('input[name="gender"]:checked');
        const vaxChecked = document.querySelector('input[name="vax"]:checked');
        if (!genderChecked || !vaxChecked) {
            allValid = false;
        }

        if (allValid) {
            globalErr.innerText = "All fields look good! You may now submit.";
            globalErr.style.color = "green";
            validateBtn.style.display = "none";
            submitBtn.style.display = "inline-block";
        } else {
            globalErr.innerText = "Please fix the errors above before submitting.";
            globalErr.style.color = "#c8102e";
        }
    });

    // Reset button should reset the form state
    document.querySelector('input[type="reset"]').addEventListener('click', function() {
        document.querySelectorAll('.error-msg').forEach(el => el.innerText = "");
        globalErr.innerText = "";
        submitBtn.style.display = "none";
        validateBtn.style.display = "inline-block";
        document.getElementById('review-area').style.display = 'none';
    });

});
