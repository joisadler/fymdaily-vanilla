const usernameOrEmailField = document.getElementById('username-or-email');
const passwordField = document.getElementById('login-password');
const message = document.getElementById('message');

if (message) {
  const messageText = message.textContent;

  if (messageText.includes('User not found')) {
    usernameOrEmailField.style.backgroundColor = '#f8d7da';
    usernameOrEmailField.style.borderColor = '#f5c6cb';
  }
  if (messageText.includes('password')) {
    usernameOrEmailField.autofocus = false;
    passwordField.autofocus = true;
    passwordField.style.backgroundColor = '#f8d7da';
    passwordField.style.borderColor = '#f5c6cb';
  }
  if (messageText.includes('Account has been successfully deleted!')) {
    message.firstElementChild.classList.remove('alert-danger');
    message.firstElementChild.classList.add('alert-success');
  }
}
