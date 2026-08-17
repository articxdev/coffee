// Drink Catalog for Vertical Kiosk

export const DRINKS = [
  {
    id: 'coffee',
    name: 'Coffee',
    subtitle: 'Fresh espresso & steamed milk',
    price: 250,
    brewTime: 8
  },
  {
    id: 'tea',
    name: 'Tea',
    subtitle: 'Aromatic leaf infusion',
    price: 150,
    brewTime: 7
  },
  {
    id: 'blackcoffee',
    name: 'Black Coffee',
    subtitle: 'Double extraction Americano',
    price: 180,
    brewTime: 7
  }
];

export const CUP_SIZES = [
  { id: 'regular', name: 'Regular', volume: '250ml', priceMod: 0 },
  { id: 'large', name: 'Large', volume: '350ml', priceMod: 50 }
];

export const SUGAR_LEVELS = [
  { id: '0', label: '0%', text: 'No Sugar' },
  { id: '50', label: '50%', text: 'Half' },
  { id: '100', label: '100%', text: 'Full' }
];
