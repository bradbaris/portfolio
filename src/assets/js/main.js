const aos = require('aos');
aos.init();

const gridfolio = new Gridfolio({

  container: '#gridfolio--container',

  options: {
    animateIntoView: true,
    breakpoints: [          // REQUIRED (at least one!)
      { minWidth: 0, gridWidth: 1 },
      { minWidth: 700, gridWidth: 2 },
      { minWidth: 900, gridWidth: 3 },
      { minWidth: 1300, gridWidth: 4 }
    ],
    scaleFonts: true,
    theme: 'baris'
  },

  blocks: [
    {
      title: 'Brad Baris',
      description: 'Designer by trade, developer by nature. Hailing from Honolulu, Hawai&lsquo;i.<br><br> Here is a collection of graphic design work I&rsquo;ve done for clients.<br><br><b><a href="https://www.bradbaris.com/resume" target="_blank">View CV <img class="baseline-icon" src="assets/img/icons/external-link.svg"></a></b>',
      // url: '#',
      tags: [],
      classname: 'headline solid-white'
    },
    {
      title: 'Emails for Chaminade',
      description: 'Cross-platform email designs done for inaugural constituent campaigns at Chaminade University',
      tags: ['email', 'ui', 'data', 'html'],
      url: '#',
      classname: 'solid-red'
    },
    {
      title: 'Natural Science Posters',
      description: 'Designed large subject posters for each of the Natural Science departments.',
      tags: ['design', 'print'],
      url: '#',
      classname: 'solid-blue'
    },
    {
      title: 'CNS Annual Reports',
      description: 'Assembled and designed annual reports for the College of Natural Sciences.',
      url: '#',
      tags: ['catalog', 'design', 'print'],
      classname: 'solid-orange'
    },
    {
      title: 'Astronomy & Astrophysics',
      description: 'Designed multipage mailers for the Institute for Astronomy, promoting space studies.',
      tags: ['design', 'print'],
      url: '#',
      classname: 'solid-yellow'
    },
    {
      title: 'Navy Ombudsman',
      description: 'Designed comprehensive collateral for Navy Ombudsman event, including event signage and branding and challenge coins.',
      tags: ['design', 'print', 'branding'],
      url: '#',
      classname: 'solid-beige'
    },
    {
      title: 'Aloha Street Magazine',
      description: 'Helmed the migration and production of Aloha Street Magazine, refactoring workflows and overhauling the magazine&lsquo;s internal workflow.',
      tags: ['production', 'design', 'catalog', 'print'],
      url: '#',
      classname: 'solid-black'
    },
    {
      title: 'Great Life Hawaii Magazine Ads',
      description: 'A curated set from the hundreds of multiformat ads created for Great Life Hawaii magazine.',
      url: '#',
      tags: ['design', 'print', 'misc'],
      classname: 'solid-red'
    },
    {
      title: 'Ilikai 50th Anniversary',
      description: 'Collateral design for a special event for Ilikai Hotel, including signage and stationery.',
      tags: ['design', 'print', 'branding', 'misc'],
      url: '#',
      classname: 'solid-orange'
    },
    {
      title: 'Design for UH Manoa',
      description: 'Miscellaneous design work done for the University of Hawai&lsquo;i at M&amacr;noa, at the College of Natural Sciences and the UH Honors Program.',
      url: '#',
      tags: ['design', 'print', 'branding', 'misc'],
      classname: 'solid-yellow'
    },
    {
      title: 'Followgraphic',
      description: 'An ancient entry into 10K Apart, creating a web app in under 10kb. Followgraphic is a simple dataviz of Twitter followers as pixels.',
      tags: ['html', 'css', 'javascript'],
      url: '#',
      classname: 'solid-beige'
    },
    {
      title: 'Ancient stuff',
      description: 'Old logos and miscellaneous work from over the years, including college design work.',
      tags: ['design', 'branding', 'misc'],
      url: '#',
      classname: 'solid-blue'
    }
  ]
});
