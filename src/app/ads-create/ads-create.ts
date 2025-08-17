import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ads-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './ads-create.html',
  styleUrl: './ads-create.css'
})
export class AdsCreate {
  ad = {
    make: '',
    model: '',
    fuel: 'gasoline' as 'gasoline' | 'diesel' | 'electric' | 'hybrid',
    doors: 4,
    mileage: 0,
    year: new Date().getFullYear(),
    price: 0,
    imageUrl: '',
    description: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  createAd() {
    this.http.post('http://localhost:5000/ads', this.ad).subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error creating ad:', err);
        alert("Failed to create ad. Ensure you're logged in and try again.");
      }
    });
  }
}
