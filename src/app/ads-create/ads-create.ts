import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CarAd } from '../car-ad.model';
import { CarAdsService } from '../services/car-ads';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ads-create',
  templateUrl: './ads-create.html',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  styleUrl: './ads-create.css'
})
export class AdsCreate implements OnInit, OnDestroy {
  ad: Partial<CarAd> = {};
  isEditMode = false;
  private adId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  private componentSubscription = new Subscription();

  constructor(
    private carAdsService: CarAdsService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.adId = +idParam;
      this.loadAdForEditing();
    }
  }

  loadAdForEditing(): void {
    if (!this.adId) return;

    this.isLoading = true;
    this.errorMessage = null;

    const sub = this.carAdsService.getAdById(this.adId).subscribe({
      next: (adData) => {
        this.ad = adData;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Could not load the ad data. It may have been deleted or you might not have permission to view it.';
        this.cdr.detectChanges();
        console.error('Error fetching ad for editing:', err);
      }
    });
    this.componentSubscription.add(sub);
  }

  onFormSubmit(): void {
    if (!this.ad) return;

    this.isLoading = true;
    this.errorMessage = null;

    const action = this.isEditMode
      ? this.carAdsService.updateAd(this.adId!, this.ad as CarAd)
      : this.carAdsService.createAd(this.ad as CarAd);

    const sub = action.subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
        this.router.navigate(['/my-ads']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Failed to ${this.isEditMode ? 'update' : 'create'} the ad. Please try again.`;
        this.cdr.detectChanges();
        console.error(`Error on form submit:`, err);
      }
    });
    this.componentSubscription.add(sub);
  }

  ngOnDestroy(): void {
    this.componentSubscription.unsubscribe();
  }
}
