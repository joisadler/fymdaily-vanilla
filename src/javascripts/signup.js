const usernameField = document.getElementById('username');
const emailField = document.getElementById('email');
const passwordConfirmationField = document.getElementById('confirm-password');
const message = document.getElementById('message');

if (message) {
  const messageText = message.textContent;

  if (messageText.includes('username')) {
    usernameField.style.backgroundColor = '#f8d7da';
    usernameField.style.borderColor = '#f5c6cb';
  }
  if (messageText.includes('Email')) {
    usernameField.autofocus = false;
    emailField.autofocus = true;
    emailField.style.backgroundColor = '#f8d7da';
    emailField.style.borderColor = '#f5c6cb';
  }
  if (messageText.includes('password')) {
    usernameField.autofocus = false;
    passwordConfirmationField.autofocus = true;
    passwordConfirmationField.style.backgroundColor = '#f8d7da';
    passwordConfirmationField.style.borderColor = '#f5c6cb';
  }
}
