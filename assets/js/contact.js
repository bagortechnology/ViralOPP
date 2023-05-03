const form = document.getElementById("contact-form");

form.addEventListener("submit", function(event){
    if (!validateForm()) {
        event.preventDefault();
    }
});

function validateForm() {
    const nameInput = document.getElementById ("name");
    const  emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    let isValid = true;

    if (!isValidInput(nameInput)){
        isValid = false;
    }

    if (!isValidInput(emailInput)){
        isValid = false;
    }

    if (!isValidInput(messageInput)){
        isValid = false;
    }

    return isValid;
}

function isValidInput(input, validationFunction){
    const value = input.value.trim();
    const isValid = (value !=="" && (!validationFunction || validationFunction(value)));
    input.classList.toggle("is-invalid", !isValid)
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
