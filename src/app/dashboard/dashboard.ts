import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CarAd } from '../car-ad.model';
import { Subscription } from 'rxjs';
import { CarAdsService } from '../services/car-ads';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {FormsModule} from '@angular/forms';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.html',
  imports: [
    FormsModule,
    DecimalPipe
  ],
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {
  carAds: CarAd[] = [];
  uniqueMakes: string[] = [];
  loading = true;
  error: string | null = null;
  private subscription: Subscription = new Subscription();

  filterMake: string = '';
  filterPriceMin: number | null = null;
  filterPriceMax: number | null = null;

  sortBy: string = '';
  sortOrder: string = 'asc';

  currentPage = 1;
  totalPages = 0;
  totalItems = 0;
  perPage = 10;

  constructor(
    private carAdsService: CarAdsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCarAds();
    this.loadUniqueMakes();

    this.subscription.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd && event.url === '/')
      ).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public loadCarAds(): void {
    this.loading = true;
    this.error = null;

    const filters = {
      sortBy: this.sortBy || undefined,
      sortOrder: this.sortOrder || undefined,
      filterMake: this.filterMake || undefined,
      filterPriceMin: this.filterPriceMin || undefined,
      filterPriceMax: this.filterPriceMax || undefined,
      page: this.currentPage,
      perPage: this.perPage
    };

    const sub = this.carAdsService.getCarAds(filters).subscribe({
      next: (response) => {
        this.carAds = response.data;
        this.currentPage = response.pagination.current_page;
        this.totalPages = response.pagination.total_pages;
        this.totalItems = response.pagination.total_items;
        this.perPage = response.pagination.per_page;
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

  private loadUniqueMakes(): void {
    const sub = this.carAdsService.getUniqueMakes().subscribe({
      next: (makes) => {
        this.uniqueMakes = makes;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching unique makes:', err);
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
    this.loadCarAds();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadCarAds();
  }

  resetFilters(): void {
    this.filterMake = '';
    this.filterPriceMin = null;
    this.filterPriceMax = null;
    this.sortBy = '';
    this.sortOrder = 'asc';
    this.currentPage = 1;
    this.loadCarAds();
  }

  getSortIcon(field: string): string {
    if (this.sortBy !== field) return '';
    return this.sortOrder === 'asc' ? '▲' : '▼';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCarAds();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCarAds();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCarAds();
    }
  }
}
