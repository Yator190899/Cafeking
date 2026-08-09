import { Product, BusinessConfig } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Café Americano',
    description: 'Un café clásico, intenso y aromático para comenzar el día con energía.',
    price: 7.00,
    priceConfirmed: true, // Editable por administración o se muestra "Precio por confirmar" si se desactiva
    category: 'Clásicos',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    badge: 'Más Popular',
    isAvailable: true,
  },
  {
    id: 'prod-2',
    name: 'Café Suave',
    description: 'Una opción equilibrada y agradable para disfrutar en cualquier momento de la tarde.',
    price: 6.50,
    priceConfirmed: true,
    category: 'Clásicos',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
    badge: 'Recomendación de la Casa',
    isAvailable: true,
  },
  {
    id: 'prod-3',
    name: 'Café con Leche',
    description: 'La combinación perfecta entre café y leche cremosita para un sabor suave y reconfortante.',
    price: 8.00,
    priceConfirmed: true,
    category: 'Clásicos',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=800',
    badge: 'Tradicional',
    isAvailable: true,
  },
];

export const INITIAL_CONFIG: BusinessConfig = {
  name: 'Cafeking',
  city: 'Cusco',
  country: 'Perú',
  yearFounded: 2000,
  address: 'Portal de Panes #123, Centro Histórico de Cusco, Perú',
  phoneWhatsapp: '+51 984 123 456',
  yapeNumber: '984 123 456',
  yapeTitular: 'Cafeking Cusco E.I.R.L.',
  yapeQrImage: '/src/assets/images/cafeking_yape_qr_1786207039252.jpg',
  facebookUrl: 'https://facebook.com/cafekingcusco',
  instagramUrl: 'https://instagram.com/cafeking.cusco',
  hours: 'Lunes a Domingo: 7:00 AM - 9:00 PM',
  googleMapsDirectionsUrl: 'https://maps.google.com/?q=Cusco+Peru',
};
