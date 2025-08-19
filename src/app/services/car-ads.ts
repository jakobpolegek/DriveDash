import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, from, Observable, of, switchMap} from 'rxjs';
import { tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/core';
import { CarAd } from '../car-ad.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ClerkService } from 'ngx-clerk';
import {CarAdFilters} from '../car-ad-filters.model';

@Injectable({
  providedIn: 'root'
})
export class CarAdsService {
  private apiUrl = environment.apiUrl;
  private CAR_ADS_KEY = makeStateKey<CarAd[]>('car-ads');

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    private router: Router,
    private clerk: ClerkService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getCarAds(filters?: CarAdFilters): Observable<CarAd[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.sortBy) {
        params = params.set('sort_by', filters.sortBy);
        params = params.set('sort_order', filters.sortOrder || 'asc');
      }
      if (filters.filterMake) {
        params = params.set('filter_make', filters.filterMake);
      }
      if (filters.filterPriceMin !== undefined) {
        params = params.set('filter_price_min', filters.filterPriceMin.toString());
      }
      if (filters.filterPriceMax !== undefined) {
        params = params.set('filter_price_max', filters.filterPriceMax.toString());
      }
    }

    return this.http.get<CarAd[]>(`${this.apiUrl}/ads`, { params });
  }

  getUniqueMakes(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/ads/makes`);
  }

  private getToken(): Observable<string | null> {
    return this.clerk.session$.pipe(
      switchMap(session => {
        if (session) {
          return from(session.getToken()).pipe(
            tap()
          );
        }
        return of(null);
      }),
      catchError(error => {
        console.error('Error getting token:', error);
        return of(null);
      })
    );
  }

  getMyAds(filters?: {
    sortBy?: string,
    sortOrder?: string,
    page?: number,
    perPage?: number
  }): Observable<any> {
    return this.getToken().pipe(
      switchMap(token => {
        if (!token) {
          throw new Error('No authentication token available');
        }

        let params = new HttpParams();

        if (filters?.sortBy) {
          params = params.set('sort_by', filters.sortBy);
          params = params.set('sort_order', filters.sortOrder || 'desc');
        }
        if (filters?.page) {
          params = params.set('page', filters.page.toString());
        }
        if (filters?.perPage) {
          params = params.set('per_page', filters.perPage.toString());
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/my-ads`, { headers, params });
      })
    );
  }

  deleteMyAd(adId: number): Observable<any> {
    return this.getToken().pipe(
      switchMap(token => {
        if (!token) {
          throw new Error('No authentication token available');
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.delete(`${this.apiUrl}/ads/${adId}`, { headers });
      })
    );
  }

  createAd(ad: CarAd): void {
    this.getToken().subscribe(token => {
      if (!token) {
        console.error('No token available - redirecting to login');
        this.router.navigate(['/']);
        return;
      }

      this.clerk.user$.subscribe(user => {
        if (!user?.id) {
          console.error('No user ID available - user not properly authenticated');
          alert('Authentication error. Please try logging in again.');
          this.router.navigate(['/']);
          return;
        }

        const adWithAuthor = {
          ...ad,
          author_id: user.id
        };

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });

        this.http.post(`${this.apiUrl}/ads`, adWithAuthor, { headers }).subscribe({
          next: (response) => {
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Error creating ad - Full error:', err);
            console.error('Error status:', err.status);
            console.error('Error message:', err.message);
            console.error('Error body:', err.error);
            alert("Failed to create ad. Check console for details.");
          }
        });
      });
    });
  }
}
