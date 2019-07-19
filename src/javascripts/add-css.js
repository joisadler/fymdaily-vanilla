export default () => {
  const filename = window.location.pathname.split('/').pop();
  const link = document.createElement('link');
  const head = document.getElementsByTagName('head')[0];
  link.href = `${filename}.css`;
  link.type = 'text/css';
  link.rel = 'stylesheet';
  head.appendChild(link);

  // const style = document.createElement('style');
  // const head = document.getElementsByTagName('head')[0];
  // const url = `${filename}.css`;
  // style.textContent = `@import "${url}"`;
  // head.appendChild(style);
};
