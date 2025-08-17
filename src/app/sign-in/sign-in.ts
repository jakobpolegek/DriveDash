import { Component } from '@angular/core';
import { ClerkService, ClerkUserButtonComponent } from 'ngx-clerk';
import { AsyncPipe } from '@angular/common';
import type { UserResource } from '@clerk/types';

@Component({
  selector: 'app-sign-in',
  imports: [ClerkUserButtonComponent, AsyncPipe],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  isSignedIn = false;
  user: UserResource | undefined | null = null;

  constructor(public clerk: ClerkService) {
    this.clerk.user$.subscribe({
      next: (user: any) => {
        this.isSignedIn = !!user;
        this.user = user ?? null;
      },
      error: (err) => console.error('Subscription error:', err)
    });
  }

  openSignIn() {
    this.clerk.openSignIn();
  }
}
