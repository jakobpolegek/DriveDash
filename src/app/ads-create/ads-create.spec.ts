import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsCreate } from './ads-create';

describe('AdsCreate', () => {
  let component: AdsCreate;
  let fixture: ComponentFixture<AdsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdsCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
