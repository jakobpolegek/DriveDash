import { provideRouter, Routes } from '@angular/router';
import { AdsCreate } from './ads-create/ads-create';
import { Dashboard } from './dashboard/dashboard';
import { CustomAuthGuard } from './CustomAuthGuard';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'create-ad', component: AdsCreate, canActivate: [CustomAuthGuard] },
  { path: '**', redirectTo: '' }
];

export const appConfig = {
  providers: [provideRouter(routes)]
};
