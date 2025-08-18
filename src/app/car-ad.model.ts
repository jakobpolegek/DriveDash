export interface CarAd {
  id: number;
  author_id: string;
  updated_on: Date;
  make: string;
  model: string;
  fuel: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid';
  doors: number;
  mileage: number;
  year: number;
  price: number;
  description: string;
}
