import { Component, OnInit } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [FooterComponent, HeaderComponent,CommonModule,FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'], // Add styles if needed
})
export class ProfileComponent implements OnInit {
  currentPassword: string = '';
  newPassword: string = '';
  passwordVisible: boolean = false;
  response : string='';

  profileImageUrl: string = ''; // To store the entered URL
  profileImagePreview: string | null = null; // To store the image preview URL
  profileImageError: string | null = null; // For error message
  currentPasswordError: string = '';
  newPasswordError: string = '';
  username: any ; 
  profilePicture:any;

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) {}

  ngOnInit() {
    // Fetch the current user's data and pre-fill the form
    this.fetchUserData();
  }

  fetchUserData() {
    // Call the AuthService to fetch user data
    this.authService.getUserData().subscribe({
      next: (response: any) => {
        this.username = response.name;
        this.profilePicture = response.profilePicture;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      },
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  uploadProfilePicture(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      this.http.post('http://localhost:8081/api/auth/upload-profile-pic', formData, { 
        withCredentials: true, 
        responseType: 'text' 
      }).subscribe({
        next: (res) => {
          console.log('Upload successful', res);
          window.location.reload(); // Add this line
        },
        error: (err) => console.error('Upload failed', err)
      });
    }
  }
  

  

  onSubmit() {
    this.currentPasswordError = '';
    this.newPasswordError = '';
    this.profileImageError = '';

    if (!this.currentPassword) {
      this.currentPasswordError = 'Current password is required.';
      return;
    }
    if (!this.newPassword) {
      this.newPasswordError = 'New password is required.';
      return;
    }
    

    const data = {
      oldPassword: this.currentPassword,
      newPassword: this.newPassword,
    };
    console.log( data);
    this.authService.changePassword(data).subscribe({
      next: (response: any) => {
        this.response=response;
        console.log(response)
        this.currentPassword='';
        this.newPassword='';

      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.response=error.error;

      },
    });

  }
  
}