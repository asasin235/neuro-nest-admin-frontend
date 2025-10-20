export interface Component {
  id: string;
  category: string;
  name: string;
  priceRange: string;
  priceMin: number;
  priceMax: number;
  quantityRange: string;
  options: string;
  description: string;
  icon: string;
  quantity: number;
  lowStockThreshold: number;
  imagePath?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductStats {
  total: number;
  outOfStock: number;
  lowStock: number;
  totalInventoryValue: number;
}

