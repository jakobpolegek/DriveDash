import { Component } from '@angular/core';
import { CarAd } from '../car-ad.model';
import { CarAdsService } from '../services/car-ads';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'ads-create',
  templateUrl: './ads-create.html',
  imports: [
    FormsModule,
    RouterLink,
  ],
  styleUrl: './ads-create.css'
})
export class AdsCreate {
  ad: CarAd = {id:0, make: '', model: '', fuel: 'Gasoline', doors: 0, mileage: 0, year: 0, price: 0, description: '', author_id: '', updated_on: new Date() };

  constructor(private carAdsService: CarAdsService) {}

  createAd(): void {
    this.carAdsService.createAd(this.ad);
  }
}
