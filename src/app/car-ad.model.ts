export interface CarAd {
  id: number;
  make: string;
  model: string;
  fuel: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  doors: number;
  mileage: number;
  year: number;
  price: number;
  imageUrl: string;
  description: string;
}
