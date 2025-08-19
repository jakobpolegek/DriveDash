import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CarAd } from '../car-ad.model';
import { CarAdsService } from '../services/car-ads';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ads-create',
  templateUrl: './ads-create.html',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    CommonModule
  ],
  styleUrl: './ads-create.css'
})
export class AdsCreate implements OnDestroy {
  ad: Omit<CarAd, 'id' | 'author_id' | 'updated_on'> = {
    make: '',
    model: '',
    fuel: 'Gasoline',
    doors: 4,
    mileage: 0,
    year: new Date().getFullYear(),
    price: 0,
    description: ''
  };

  isLoading = false;
  errorMessage: string | null = null;
  private creationSubscription: Subscription = new Subscription();

  constructor(
    private carAdsService: CarAdsService,
    private router: Router
  ) {}

  onFormSubmit(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.creationSubscription = this.carAdsService.createAd(this.ad as CarAd).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to create the ad. Please check the details and try again.';
        console.error('Error creating ad:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.creationSubscription.unsubscribe();
  }
}
