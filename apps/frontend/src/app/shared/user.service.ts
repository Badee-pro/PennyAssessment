/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';
import { User } from './user.model';
import { environment } from '../../environments/environment';

// UserService to handle user-related operations
@Injectable({
  providedIn: 'root',
})
export class UserService {
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };

  constructor(private http: HttpClient) {}

  // Methods to interact with the backend API
  // Register a new user
  registerUser(user: User): Observable<any> {
    return this.http.post(
      `${environment.apiBaseUrl}/signup`,
      user,
      this.noAuthHeader
    );
  }
  // Login an existing user
  login(authCredentials: { email: string; password: string }): Observable<any> {
    return this.http.post(
      `${environment.apiBaseUrl}/signin`,
      authCredentials,
      this.noAuthHeader
    );
  }

  // Get user profile information
  getUserProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${environment.apiBaseUrl}/profile`, { headers });
  }

  // Set the token in local storage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get the token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Delete the token from local storage after sign out
  deleteToken(): void {
    localStorage.removeItem('token');
  }

  // Check if the user is authenticated
  getUserPayload(): any {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    return null;
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    }
    return false;
  }
}
