import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CarAd } from '../car-ad.model';
import { Subscription, filter, take } from 'rxjs';
import { CarAdsService } from '../services/car-ads';
import {Router, RouterLink} from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ClerkService } from 'ngx-clerk';

@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.html',
  imports: [DecimalPipe, RouterLink],
  styleUrl: './my-ads.css'
})
export class MyAds implements OnInit, OnDestroy {
  myAds: CarAd[] = [];
  loading = true;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  currentPage = 1;
  totalPages = 0;
  totalItems = 0;
  perPage = 10;
  sortBy: string = '';
  sortOrder: string = 'desc';

  constructor(
    private carAdsService: CarAdsService,
    protected router: Router,
    private cdr: ChangeDetectorRef,
    private clerk: ClerkService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    const sub = this.clerk.session$.pipe(
      filter(session => session !== undefined),
      take(1)
    ).subscribe(session => {
      if (session) {
        this.loadMyAds();
      } else {
        this.loading = false;
        this.error = 'You must be logged in to view this page.';
        this.cdr.detectChanges();
        this.router.navigate(['/']);
      }
    });

    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadMyAds(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      sortBy: this.sortBy || undefined,
      sortOrder: this.sortOrder,
      page: this.currentPage,
      perPage: this.perPage
    };

    const sub = this.carAdsService.getMyAds(filters).subscribe({
      next: (response) => {
        this.myAds = response.data;
        this.currentPage = response.pagination.current_page;
        this.totalPages = response.pagination.total_pages;
        this.totalItems = response.pagination.total_items;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching my ads:', err);
        if (err.status === 401) {
          this.error = 'Your session may have expired. Please log in again.';
          this.router.navigate(['/']);
        } else {
          this.error = 'Failed to load your ads. Please try again later.';
        }
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    this.subscription.add(sub);
  }

  onSortChange(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.loadMyAds();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMyAds();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadMyAds();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMyAds();
    }
  }

  deleteAd(adId: number): void {
    if (confirm('Are you sure you want to delete this ad?')) {
      const sub = this.carAdsService.deleteMyAd(adId).subscribe({
        next: () => {
          this.loadMyAds();
        },
        error: (err) => {
          console.error('Error deleting ad:', err);
          alert('Failed to delete ad. Please try again.');
        }
      });
      this.subscription.add(sub);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  getSortIcon(field: string): string {
    if (this.sortBy !== field) return '';
    return this.sortOrder === 'asc' ? '▲' : '▼';
  }
}
