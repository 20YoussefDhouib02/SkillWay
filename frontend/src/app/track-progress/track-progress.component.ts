
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../auth-service.service';
import { forkJoin, of } from 'rxjs';




@Component({
  selector: 'app-track-progress',
  standalone:true,
  imports:[CommonModule,HeaderComponent,RouterLink,FooterComponent],
  templateUrl: './track-progress.component.html',
  styleUrl: './track-progress.component.css'
})
export class TrackProgressComponent {

roadmaps: any[] = [];
  progressPercentages: { [key: number]: number } = {};
  loading: { [key: number]: boolean } = {};
  username: any ; 
  doneStates: boolean[] = [];
  progressid: number=0;
  profilePicture:any;
  totalprogress: number = 0;
  userId: number=0;


  constructor(
    private authService: AuthService,
    private http: HttpClient,private router: Router
  ) {}

  ngOnInit(): void {

    this.fetchUserData().then(() => {
      if (this.isLoggedIn()) {
        this.loadRoadmaps();
        console.log(1111);
      }
      else{
        this.router.navigate(['/login']);
      }
    });
    
  }
  fetchUserData(): Promise<void> {
    return new Promise((resolve) => {
      this.authService.getUserData().subscribe({
        next: (response: any) => {
          this.userId=response.id;
          this.username = response.name;
          this.profilePicture = response.profilePicture;
          resolve();  // Ensure that the next steps execute only after user data is set
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
          resolve();  // Even if an error occurs, resolve to continue execution
        }
      });
    });}
  isLoggedIn(): boolean {
    // Check for authentication token in cookies or localStorage
    // Example using localStorage:
    if(this.username != null)
      return true;
    else 
      return false;
    // Or if using cookies:
    // return document.cookie.split(';').some((item) => item.trim().startsWith('yourCookieName='));
  }
  loadRoadmaps() {
    this.http.get<any>('/assets/images/roadmaps.json').subscribe({
      next: (response) => {
        if (response && response.fields) {
          this.roadmaps = response.fields; // Extracting fields array
          this.loadProgressForAll();
        } else {
          console.error('Invalid roadmaps structure:', response);
        }
      },
      error: (error) => console.error('Error loading roadmaps:', error)
    });
  }
  loadProgressForAll() {
    this.roadmaps.forEach(roadmap => {
      this.loading[roadmap.id] = true;
  
      const requests = [
        this.http.get<any>(`http://localhost:8081/api/roadmap/id/${roadmap.id}`),
        this.isLoggedIn()? 
          this.http.get<any>(`http://localhost:8081/progress/load/${roadmap.id}`,{ withCredentials: true }) : 
          of(null)
      ];
  
      forkJoin(requests).subscribe({
        next: ([roadmapRes, progressRes]) => {
          // Extract total and progress sum from the responses
          let progressSum=0
          if (progressRes && progressRes !== 'false') {
            progressSum = progressRes?.sum || 0;
          }
          const total = roadmapRes.total;
          progressSum = progressRes?.sum || 0;
          
          // Attach total and progressSum as new properties on the roadmap object
          roadmap.total = total;
          roadmap.progressSum = progressSum;
  
          // Calculate the percentage if needed
          this.progressPercentages[roadmap.id] = total > 0 ? 
            Math.round((progressSum / total) * 100) : 0;
        },
        error: (error) => {
          console.error(`Error loading progress for roadmap ${roadmap.id}:`, error);
          this.progressPercentages[roadmap.id] = 0;
        },
        complete: () => this.loading[roadmap.id] = false
      });
    });
  }
  

  getProgressStyle(percentage: number) {
    return {
      'width': `${percentage}%`,
      'background': `linear-gradient(90deg, #4CAF50 ${percentage}%, #ddd ${percentage}%)`
    };
  }
}
