import UserInfoTemplate from '../../views/user-info.pug';
import renderHomePage from './render-homepage';
import listenToButtons from './listen-to-buttons';
import addCSS from './load-css';

const listenToFormSubmit = () => {
  const userInfoForm = document.querySelector('.user-info-form');
  userInfoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const height = document.getElementById('height').value;
      const bodyWeight = document.getElementById('bodyWeight').value;
      const gender = document.getElementById('gender').value;
      const hipCircumference = document
        .getElementById('hipCircumference').value;
      const waistCircumference = document
        .getElementById('waistCircumference').value;
      const neckCircumference = document
        .getElementById('neckCircumference').value;
      const physicalActivityLevel = document
        .getElementById('physicalActivityLevel').value;
      const goal = document.getElementById('goal').value;
      // eslint-disable-next-line max-len
      const queryString = `/api/user?height=${height}&bodyWeight=${bodyWeight}&gender=${gender}&hipCircumference=${hipCircumference || 0}&waistCircumference=${waistCircumference}&neckCircumference=${neckCircumference}&physicalActivityLevel=${physicalActivityLevel}&goal=${goal}`;
      // await fetch(queryString, {
      //   method: 'PUT',
      //   credentials: 'include',
      // });
      window.history.pushState(null, null, '/homepage');
      renderHomePage();
    } catch (err) {
      console.log(err);
    }
  });
}

const render = async () => {
  const app = document.getElementById('app');
  const data = await fetch('/user', {
    method: 'GET',
    credentials: 'include',
  });
  const info = await data.json();
  const userInfoHadBeenSet = !!info.height;
  const { username } = info;
  const height = info.height || '';
  const bodyWeight = info.bodyWeight || '';
  const gender = info.gender || 'male';
  const hipCircumference = info.hipCircumference || '';
  const waistCircumference = info.waistCircumference || '';
  const neckCircumference = info.neckCircumference || '';
  const physicalActivityLevel = info.physicalActivityLevel || 'Moderate';
  const goal = info.goal || 'normalWeightLoss';

  app.innerHTML = UserInfoTemplate({
    username,
    height,
    bodyWeight,
    gender,
    hipCircumference,
    waistCircumference,
    neckCircumference,
    physicalActivityLevel,
    goal,
    userInfoHadBeenSet,
    path: 'user-info',
  });

  const genderInput = document.getElementById('gender');
  const hipCircumferenceContainer = document
    .querySelector('.hip-circumference-container');
  const hipCircumferenceInput = document.getElementById('hipCircumference');
  if (genderInput.value === 'female') {
    hipCircumferenceContainer.style.display = 'flex';
    hipCircumferenceInput.setAttribute('required', 'required');
  }
  genderInput.addEventListener('change', (event) => {
    if (event.target.value === 'female') {
      hipCircumferenceContainer.style.display = 'flex';
      hipCircumferenceInput.setAttribute('required', 'required');
    } else {
      hipCircumferenceContainer.style.display = 'none';
      hipCircumferenceInput.removeAttribute('required');
    }
  });
};

export default () => {
  addCSS();
  render();
  setTimeout(listenToButtons, 500);
  setTimeout(listenToFormSubmit, 500);
};
