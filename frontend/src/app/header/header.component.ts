import { Component, OnInit ,OnDestroy,ElementRef, ViewChild} from '@angular/core';
import { Router, RouterLink, } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth-service.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'] 
})
export class HeaderComponent implements OnInit {
  @ViewChild('submenu', { static: false }) submenu!: ElementRef;


  
  isAuthenticated = false;
  username: any ; 
  profilePicture:any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {

    this.fetchUserData()
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

  logout() {
    this.authService.logout(); 
    this.username=null;

  }
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  toggleMenu() {
    this.submenu?.nativeElement.classList.toggle('open-menu');
  }
}




  

