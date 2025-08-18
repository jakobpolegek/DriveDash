import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ClerkService } from 'ngx-clerk';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CustomAuthGuard implements CanActivate {
  constructor(
    private clerk: ClerkService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean | UrlTree {
    if (isPlatformServer(this.platformId)) {
      return this.router.parseUrl('');
    }

    return this.clerk.user$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        } else {
          return this.router.parseUrl('');
        }
      })
    );
  }
}
