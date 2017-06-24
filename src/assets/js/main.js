const data = require('./data');
const gridfolio = new Gridfolio({

  container: '#gridfolio--container',

  options: {
    animateIntoView: true,
    breakpoints: [
      { minWidth: 0, gridWidth: 1 },
      { minWidth: 700, gridWidth: 2 },
      { minWidth: 900, gridWidth: 3 },
      { minWidth: 1300, gridWidth: 4 }
    ],
    scaleFonts: true,
    theme: 'baris'
  },

  blocks: data
});
