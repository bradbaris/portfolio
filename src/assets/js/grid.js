const data = require('./data');
const gridfolio = new Gridfolio({

  container: '#gridfolio--container',

  options: {
    animateIntoView: true,
    breakpoints: [
      { minWidth: 0, gridWidth: 1 },
      { minWidth: 600, gridWidth: 2 },
      { minWidth: 900, gridWidth: 3 },
      { minWidth: 1200, gridWidth: 4 },
      { minWidth: 1500, gridWidth: 5 }
    ],
    scaleFonts: true,
    theme: 'baris'
  },

  blocks: data
});
