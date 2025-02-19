import { Component, OnInit } from '@angular/core';

import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule,CommonModule,FooterComponent,HeaderComponent,RouterLink] ,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage: any;
  
  email: string = '';
  password: string = '';
  passwordVisible: boolean = false;
  emailError: string = '';
  passwordError: string = '';

  // Inject HttpClient into the component
  constructor(private authService:AuthService, private router: Router,) {}
  ngOnInit() {
    // Subscribe to login errors
 
  }
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  storeSessionId(response: any): void {
    // Assuming the session ID is in response.sessionId
    const sessionId = response.jsessionid;
    if (sessionId) {
      sessionStorage.setItem('JSESSIONID', sessionId);
      console.log('JSESSIONID stored:', sessionId);
    } else {
      console.error('Session ID not found in the response.');
    }
  }

  onSubmit() {
    // Validate inputs
    if (!this.email || !this.password) {
      this.emailError = this.email ? '' : 'Email is required';
      this.passwordError = this.password ? '' : 'Password is required';
      return;
    }
  
    // Clear previous errors
    this.emailError = '';
    this.passwordError = '';
  
    // Prepare login data
    const loginData = {
      email: this.email,
      password: this.password,
    };
  
    this.authService.login(loginData);
    this.authService.loginError$.subscribe((error) => {
      if (error) {
        this.passwordError = error; // Display the error message
      }
    });
  }
}
