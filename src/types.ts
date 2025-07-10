
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId?: string;
  soldCount?: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  userName: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'returned';
  date?: string;
}

export interface Review {
  id: string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}