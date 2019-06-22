import WebFont from 'webfontloader';

WebFont.load({
  google: {
    families: [
      //'Caveat:700',
      //'Cormorant Infant:400,400i,700',
      //'Playfair Display SC:400,700,900:cyrillic'
      'Montserrat:400,700:cyrillic'
    ]
  },
  active: () => {
    // when fonts loaded
    console.log('fonts loaded');
  }
});
