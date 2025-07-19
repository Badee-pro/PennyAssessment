import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../frontend/src/environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  noAuthHeader = { headers: new HttpHeaders({ NoAuth: 'True' }) };

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<unknown> {
    return this.http.post(
      `${environment.apiBaseUrl}/signup`,
      user,
      this.noAuthHeader
    );
  }

  login(authCredentials: {
    email: string;
    password: string;
  }): Observable<unknown> {
    return this.http.post(
      `${environment.apiBaseUrl}/signin`,
      authCredentials,
      this.noAuthHeader
    );
  }

  getUserProfile(): Observable<unknown> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${environment.apiBaseUrl}/profile`, { headers });
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  deleteToken(): void {
    localStorage.removeItem('token');
  }

  getUserPayload(): unknown {
    const token = this.getToken();
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    return null;
  }

  isLoggedIn(): boolean {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    }
    return false;
  }
}
