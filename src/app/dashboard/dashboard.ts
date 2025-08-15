import { Component } from '@angular/core';
import { CarAd } from '../car-ad.model';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  carAds: CarAd[] = [
    { id: 1, make: 'Toyota', model: 'Corolla', year: 2018, price: 15000, fuel: 'gasoline', doors: 4, mileage: 195000, imageUrl: "" , description: 'Reliable sedan' },
    { id: 3, make: 'Tesla', model: 'Model 3', year: 2020, price: 35000, fuel: 'electric', doors: 4, mileage: 15000, imageUrl: "" , description: 'Innovative electric car' },
    { id: 2, make: 'Ford', model: 'Focus', year: 2016, price: 12000, fuel: 'diesel', doors: 4, mileage: 234500, imageUrl: "" , description: 'Comfortable family car' }
  ];
}
