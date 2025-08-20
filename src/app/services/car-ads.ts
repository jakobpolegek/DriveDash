import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, from, Observable, of, switchMap} from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { CarAd } from '../car-ad.model';
import { environment } from '../../environments/environment';
import { ClerkService } from 'ngx-clerk';
import {CarAdFilters} from '../car-ad-filters.model';

@Injectable({
  providedIn: 'root'
})
export class CarAdsService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private clerk: ClerkService
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

  createAd(ad: CarAd): Observable<any> {
    return this.getToken().pipe(
      take(1),
      switchMap(token => {
        if (!token) {
          throw new Error('No authentication token available');
        }

        return this.clerk.user$.pipe(
          take(1),
          switchMap(user => {
            if (!user?.id) {
              throw new Error('User not authenticated or user ID is missing');
            }

            const adWithAuthor = {
              ...ad,
              author_id: user.id
            };

            const headers = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            });

            return this.http.post(`${this.apiUrl}/ads`, adWithAuthor, { headers });
          })
        );
      }),
      catchError(err => {
        console.error('Error in createAd stream:', err);
        throw err;
      })
    );
  }

  getAdById(id: number): Observable<CarAd> {
    return this.http.get<CarAd>(`${this.apiUrl}/ads/${id}`);
  }

  updateAd(id: number, ad: CarAd): Observable<any> {
    return this.getToken().pipe(
      take(1),
      switchMap(token => {
        if (!token) {
          throw new Error('No authentication token available');
        }
        return this.clerk.user$.pipe(
          take(1),
          switchMap(user => {
            if (!user?.id) {
              throw new Error('User not authenticated or user ID is missing');
            }

            const headers = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            });

            return this.http.put(`${this.apiUrl}/ads/${id}`, ad, { headers });
          })
        );
      }),
      catchError(err => {
        console.error('Error in updateAd stream:', err);
        throw err;
      })
    );
  }
}
