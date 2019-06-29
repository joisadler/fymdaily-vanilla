export default (el, s, fn) => {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
};
