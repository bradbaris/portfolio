const aos = require('aos');
const blazy = require('blazy');
const blz = new blazy();
aos.init();
window.onbeforeunload = function() {window.scrollTo(0,0);}