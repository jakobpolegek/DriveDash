import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarAd } from '../car-ad.model';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarAdsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCarAds(): Observable<CarAd[]> {
    return this.http.get<CarAd[]>(`${this.apiUrl}/ads`);
  }
}
