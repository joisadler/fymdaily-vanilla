const usernameOrEmailField = document.getElementById('username-or-email');
const passwordField = document.getElementById('login-password');
const message = document.getElementById('message');

if (message) {
  const messageText = message.textContent;

  if (messageText.includes('User not found')) {
    // place cursor at the end of the field:
    const strLength = usernameOrEmailField.value.length * 2;
    usernameOrEmailField.focus();
    usernameOrEmailField.setSelectionRange(strLength, strLength);

    usernameOrEmailField.style.backgroundColor = '#f8d7da';
    usernameOrEmailField.style.borderColor = '#f5c6cb';
  }
  if (messageText.includes('password')) {
    // place cursor at the end of the field:
    const strLength = passwordField.value.length * 2;
    passwordField.focus();
    passwordField.setSelectionRange(strLength, strLength);

    passwordField.style.backgroundColor = '#f8d7da';
    passwordField.style.borderColor = '#f5c6cb';
  }
  if (messageText.includes('Account has been successfully deleted!')) {
    message.firstElementChild.classList.remove('alert-danger');
    message.firstElementChild.classList.add('alert-success');
  }
}

const yearSpan = document.getElementById('year');
const year = new Date().getFullYear();
const yearSpanText = year === 2019 ? year : `2019-${year}`;
yearSpan.textContent = `\xA9 ${yearSpanText} `;
