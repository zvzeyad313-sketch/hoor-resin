export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

export type OrderItem = Product;

export type CustomerInfo = {
  name: string;
  phone: string;
  address: string;
  notes: string;
};

export type CustomOrder = {
  colorShape: string;
  nameMessage: string;
  glitterType: string;
  size: 'small' | 'medium' | 'large';
  details: string;
};

export type Order = {
  id: string;
  items: string; // JSON string of Product[]
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
};
