import images from './images'
const wines = [
  {
    title: 'Chapel Hill Shiraz',
    price: '$56',
    tags: 'AU | Bottle'
  },
  {
    title: 'Catena Malbee',
    price: '$59',
    tags: 'AU | Bottle'
  },
  {
    title: 'La Vieillw Rose',
    price: '$44',
    tags: 'FR | 750 ml'
  },
  {
    title: 'Rhino Pale Ale',
    price: '$31',
    tags: 'CA | 750 ml'
  },
  {
    title: 'Irish Guinness',
    price: '$26',
    tags: 'IE | 750 ml'
  }
]

const cocktails = [
  {
    title: 'Aperol Sprtiz',
    price: '$20',
    tags: 'Aperol | Villa Marchesi prosecco | soda | 30 ml'
  },
  {
    title: "Dark 'N' Stormy",
    price: '$16',
    tags: 'Dark rum | Ginger beer | Slice of lime'
  },
  {
    title: 'Daiquiri',
    price: '$10',
    tags: 'Rum | Citrus juice | Sugar'
  },
  {
    title: 'Old Fashioned',
    price: '$31',
    tags: 'Bourbon | Brown sugar | Angostura Bitters'
  },
  {
    title: 'Negroni',
    price: '$26',
    tags: 'Gin | Sweet Vermouth | Campari | Orange garnish'
  }
]

const awards = [
  {
    imgUrl: images.award02,
    title: 'Bib Gourmond',
    subtitle: '美食指南的崛起之星'
  },
  {
    imgUrl: images.award01,
    title: 'Rising Star',
    subtitle: '炙手可熱的亞洲廚師'
  },
  {
    imgUrl: images.award05,
    title: 'AA Hospitality',
    subtitle: '傑出廚師肯定'
  },
  {
    imgUrl: images.award03,
    title: 'Outstanding Chef',
    subtitle: '卓越廚師，出眾之選'
  }
]

export default { wines, cocktails, awards }
