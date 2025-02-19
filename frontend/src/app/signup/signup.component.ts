import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [FormsModule, CommonModule,FooterComponent,HeaderComponent,RouterLink] 
})
export class SignupComponent {
  errorMessage: any;
  constructor( private http:HttpClient) {}
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  terms = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  nameError = '';
  emailError = '';
  passwordError = '';
  confirmPasswordError = '';


  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }


  validateForm() {
    this.nameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    if (this.name.length < 3) {
      this.nameError = 'Username must be at least 3 characters long.';
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.email)) {
      this.emailError = 'Enter a valid email address.';
    }
    if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters long.';
    } else if (!/[A-Z]/.test(this.password) || !/\d/.test(this.password)) {
      this.passwordError = 'Password must contain at least one uppercase letter and one number.';
    }
    if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match.';
    }
  }


  onSubmit() {
    this.validateForm();
    if (this.nameError || this.emailError || this.passwordError || this.confirmPasswordError) {
      return;
    }
    console.log('Form Submitted:', {
      name: this.name,
      email: this.email,
      password: this.password
    });
    const newUser = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.http.post('http://localhost:8081/api/auth/signup', newUser).subscribe(
      (response) => {
        console.log('User created successfully:', response);
        this.errorMessage = '';  
      },
      (error) => {
        console.error('Error creating user:', error);
        this.errorMessage = error.error?.message || 'An error occurred while creating the user.';
      }
    );
    this.name = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.terms = false;
  }
}
