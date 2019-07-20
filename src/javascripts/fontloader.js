import WebFont from 'webfontloader';

export default () => {
  WebFont.load({
    google: {
      families: [
        'Montserrat:400,700:cyrillic',
      ]
    },
    active: () => {
      // when fonts loaded
      console.log('fonts loaded');
    }
  });
};
