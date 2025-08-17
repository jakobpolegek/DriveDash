import { Component } from '@angular/core';
import {SignIn} from "../sign-in/sign-in";
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {ClerkService} from 'ngx-clerk';
import type {UserResource} from '@clerk/types';

@Component({
  selector: 'app-header',
  imports: [
    SignIn,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  isSignedIn = false;
  user: UserResource | undefined | null = null;

  constructor(public clerk: ClerkService, private router: Router) {
    this.clerk.user$.subscribe({
      next: (user: any) => {
        this.isSignedIn = !!user;
        this.user = user ?? null;
      },
      error: (err) => console.error('Subscription error:', err)
    });
  }

  navigateToDashboard() {
    this.router.navigate(['']);
  }
}
