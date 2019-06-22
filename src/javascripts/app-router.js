import foodsEatenTodayTemplate from '../../views/foods-eaten-today.pug';
import homepageTemplate from '../../views/homepage.pug';

const app = document.getElementById('app');

export default () => {
  const routes = {
    '/home': homepageTemplate,
    '/homepage': homepageTemplate,
    '/fooods-eaten-today': foodsEatenTodayTemplate,
  };
  if (window.location.pathname === '/home') {
    window.history.pushState(null, null, '/homepage');
  }
  app.innerHTML = routes[window.location.pathname];
};
