export interface Product {
  id: string;
  name: string;
  description: string;
  price: number | null; // null if "Precio por confirmar"
  priceConfirmed: boolean; // if false, displays "Precio por confirmar"
  category: 'Clásicos' | 'Especiales' | 'Acompañamientos' | 'Bebidas Calientes';
  image: string;
  badge?: string;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export type PaymentMethod = 'Yape' | 'Efectivo';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerPhone: string;
  notes?: string;
  cashAmountNeeded?: number; // Para vuelto en efectivo
  createdAt: string;
  status: 'Pendiente' | 'En preparación' | 'Completado';
}

export interface BusinessConfig {
  name: string;
  city: string;
  country: string;
  yearFounded: number;
  address: string;
  phoneWhatsapp: string;
  yapeNumber: string;
  yapeTitular: string;
  yapeQrImage: string;
  facebookUrl: string;
  instagramUrl: string;
  hours: string;
  googleMapsDirectionsUrl: string;
}
