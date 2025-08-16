import { TestBed } from '@angular/core/testing';

import { CarAdsService } from './car-ads';

describe('CarAds', () => {
  let service: CarAdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarAdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
