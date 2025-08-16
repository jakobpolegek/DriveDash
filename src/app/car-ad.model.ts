export interface CarAd {
  id: number;
  make: string;
  model: string;
  fuel: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  doors: number;
  mileage: number;
  year: number;
  price: number;
  imageUrl: string;
  description: string;
}
