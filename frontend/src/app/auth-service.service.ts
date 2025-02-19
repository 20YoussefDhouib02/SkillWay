import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userDataSubject = new BehaviorSubject<any>(null);
  private loginErrorSubject = new BehaviorSubject<string | null>(null);
  loginError$ = this.loginErrorSubject.asObservable(); // Observable for login errors
  userData$ = this.userDataSubject.asObservable();
  isAuthenticated = false;



  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Log in the user.
   */
  login(credentials: { email: string; password: string }) {
    this.http
      .post('http://localhost:8081/api/auth/login', credentials, { withCredentials: true })

      .subscribe({
        next: (response) => {
          this.setAuthenticationState(true, response); // Update state on success
          this.router.navigate(['/']); // Redirect to home page or dashboard
          
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.loginErrorSubject.next(error.error || error.message || 'Login failed. Please try again.'); // Emit the error
        },
      });
  }

  /**
   */
  logout() {
    this.http
      .post('http://localhost:8081/api/auth/logout', {}, { 
        withCredentials: true, 
        responseType: 'text' 
      })
      .subscribe({
        next: (response) => {
          console.log('Logout response:', response); 
          this.setAuthenticationState(false, null);
          this.router.navigate(['/login']); 
        },
        error: (error) => {
          console.error('Error during logout:', error);
        },
      });
  }
  private setAuthenticationState(isAuthenticated: boolean, userData: any) {
    this.isAuthenticated = isAuthenticated;
    this.userDataSubject.next(userData); 
  }

  getUserData() {
    return this.http.get('http://localhost:8081/api/auth/get', { withCredentials: true });
  }

  changePassword(data: { oldPassword: string; newPassword: string; }) {
    return this.http.post(
      'http://localhost:8081/api/auth/change-password', 
      data,  
      { 
        withCredentials: true, 
        responseType: 'text'  // Specify that the response should be plain text
      }
    );
  }
  
  

}