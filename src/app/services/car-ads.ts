import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, from, Observable, of, switchMap} from 'rxjs';
import { tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CarAd } from '../car-ad.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ClerkService } from 'ngx-clerk';

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

  getCarAds(): Observable<CarAd[]> {
    if (this.transferState.hasKey(this.CAR_ADS_KEY)) {
      const ads = this.transferState.get<CarAd[]>(this.CAR_ADS_KEY, []);
      this.transferState.remove(this.CAR_ADS_KEY);
      return of(ads);
    }

    return this.http.get<CarAd[]>(`${this.apiUrl}/ads`).pipe(
      tap(ads => {
        if (isPlatformServer(this.platformId)) {
          this.transferState.set(this.CAR_ADS_KEY, ads);
        }
      })
    );
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

  createAd(ad: CarAd): void {
    this.getToken().subscribe(token => {

      if (!token) {
        console.error('No token available - redirecting to login');
        this.router.navigate(['/']);
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      this.http.post(`${this.apiUrl}/ads`, ad, { headers }).subscribe({
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
  }
}
