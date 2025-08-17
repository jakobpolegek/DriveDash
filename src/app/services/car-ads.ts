import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { CarAd } from '../car-ad.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarAdsService {
  private apiUrl = environment.apiUrl;
  private CAR_ADS_KEY = makeStateKey<CarAd[]>('car-ads');

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
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
}
