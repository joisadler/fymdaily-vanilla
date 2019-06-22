import renderHomePage from './render-home-page';
import foodsEatenTodayTemplate from '../../views/foods-eaten-today.pug';
import homepageTemplate from '../../views/homepage.pug';

const app = document.getElementById('app');

const routes = {
  '/home': homepageTemplate,
  '/homepage': homepageTemplate,
  '/foods-eaten-today': foodsEatenTodayTemplate,
};

if (window.location.pathname === '/home') {
  window.history.pushState(null, null, '/homepage');
}
if (window.location.pathname === '/homepage') {
  app.innerHTML = homepageTemplate;
  setTimeout(() => {
    renderHomePage();
  }, 50);
}
app.innerHTML = routes[window.location.pathname];
window.addEventListener('popstate', () => {
  if (window.location.pathname === '/home') {
    window.history.pushState(null, null, '/homepage');
  }
  if (window.location.pathname === '/homepage') {
    app.innerHTML = homepageTemplate;
    setTimeout(() => {
      renderHomePage();
    }, 50);
  }
  app.innerHTML = routes[window.location.pathname];
});
