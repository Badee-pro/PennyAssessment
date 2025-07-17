import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  fullName: string | undefined;
  email: string | undefined;
  errorMessage: string | undefined;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/signin']);
      return;
    }

    this.http
      .get<{ user: { fullName: string; email: string } }>(
        `${environment.apiBaseUrl}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .subscribe(
        (response) => {
          this.fullName = response.user.fullName;
          this.email = response.user.email;
        },
        (error) => {
          this.errorMessage = 'Error loading profile';
          console.error('Error loading profile', error);
          if (error.status === 401) {
            this.router.navigate(['/signin']);
          }
        }
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }
}
