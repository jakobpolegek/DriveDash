import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ClerkService} from 'ngx-clerk';
import {environment} from '../environments/environment';
import {Header} from './header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(private clerkService: ClerkService) {
    this.clerkService.__init({ publishableKey: environment.clerkPublicKey });
    this.clerkService.clerk$.subscribe();
  }
}
