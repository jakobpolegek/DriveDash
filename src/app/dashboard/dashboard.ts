import { Component, OnDestroy, OnInit } from '@angular/core';
import { CarAd } from '../car-ad.model';
import { Subscription } from 'rxjs';
import { CarAdsService } from '../services/car-ads';

@Component({
  selector: 'dashboard', // Keep your naming convention
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  carAds: CarAd[] = [];
  loading = true;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private carAdsService: CarAdsService) { }

  ngOnInit(): void {
    this.loadCarAds();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public loadCarAds(): void {
    this.loading = true;
    this.error = null;

    const sub = this.carAdsService.getCarAds().subscribe({
      next: (ads) => {
        this.carAds = ads;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching car ads:', err);
        this.error = 'Failed to load car ads. Please try again later.';
        this.loading = false;
      }
    });

    this.subscription.add(sub);
  }
}
