import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CarAd } from '../car-ad.model';
import { Subscription } from 'rxjs';
import { CarAdsService } from '../services/car-ads';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  carAds: CarAd[] = [];
  loading = true;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private carAdsService: CarAdsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd && event.url === '/')
      ).subscribe(() => {
        if (this.carAdsService['transferState'].hasKey(this.carAdsService['CAR_ADS_KEY'])) {
          this.carAdsService['transferState'].remove(this.carAdsService['CAR_ADS_KEY']);
        }
        this.loadCarAds();
      })
    );

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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching car ads:', err);
        this.error = 'Failed to load car ads. Please try again later.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.subscription.add(sub);
  }
}
