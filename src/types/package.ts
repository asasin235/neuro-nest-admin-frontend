export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  imagePath?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface CreatePackageDto {
  name: string;
  description: string;
  price: number;
  features: string[];
  imagePath?: string;
  imageUrl?: string;
}

export interface UpdatePackageDto {
  name?: string;
  description?: string;
  price?: number;
  features?: string[];
  imagePath?: string;
  imageUrl?: string;
}

