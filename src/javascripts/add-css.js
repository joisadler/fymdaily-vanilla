export default () => {
  const filename = window.location.pathname.split('/').pop();
  const link = document.createElement('link');
  const head = document.getElementsByTagName('head')[0];
  link.href = `${filename}.css`;
  link.type = 'text/css';
  link.rel = 'stylesheet';
  const links = [...document.querySelectorAll('link')];
  const isCurrenLinkAlreadyExists = links
    .map((lnk => lnk.href.split('/')[lnk.href.split('/').length - 1]))
    .filter(url => url === `${filename}.css`)
    .length > 0;
  if (!isCurrenLinkAlreadyExists) {
    head.appendChild(link);
  }

  // const style = document.createElement('style');
  // const head = document.getElementsByTagName('head')[0];
  // const url = `${filename}.css`;
  // style.textContent = `@import "${url}"`;
  // head.appendChild(style);
};
