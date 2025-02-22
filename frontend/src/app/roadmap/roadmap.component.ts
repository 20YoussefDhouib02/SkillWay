import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';
import { Form, FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-roadmap',
  standalone:true,
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css'],
  imports:[CommonModule,FooterComponent,HeaderComponent,FormsModule]
})
export class RoadmapComponent implements OnInit {
  data: any[] = [];
  selectedItem: any = null; 
  progressSum: number = 0;
  isDone: boolean = false;
  username: any ; 
  doneStates: boolean[] = [];
  progressid: number=0;
  profilePicture:any;
  totalprogress: number = 0;
  userId: number=0;



  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  roadmapName: string = '';
  roadmapId : any ; 
  ngOnInit() {
    this.fetchUserData().then(() => {
      if (this.isLoggedIn()) {
        this.loadProgress();
      }
    });
    this.route.paramMap.subscribe(params => {
      this.roadmapName = params.get('name') || '';
      this.roadmapId = params.get('id') ||
      console.log(' roadmap :', this.roadmapName);
      console.log(' roadmap :', this.roadmapId);
      this.loadRoadmapTotal()


      this.route.params.subscribe(params => {
        this.roadmapId = +params['id'];
        this.checkFavoriteStatus();
      });
      this.http.get(`assets/images/roadmap-content/${this.roadmapName}.json`)
        .subscribe(jsonData => {
          this.data = Object.values(jsonData); 
          //this.initializeDoneStates();
          //console.log('Fetched roadmap data:', this.data);
        });
    });
    
  }
   // Add this property

  // ... existing constructor and methods

  private loadRoadmapTotal() {
    if (!this.roadmapId) return;

    this.http.get<any>(`http://localhost:8081/api/roadmap/id/${this.roadmapId}`)
      .subscribe({
        next: (response) => {
          this.totalprogress = response.total;
          console.log('Total progress loaded:', this.totalprogress);
        },
        error: (error) => {
          console.error('Error loading roadmap total:', error);
          this.totalprogress = 0; // Default to 0 if error occurs
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
  loved = false;

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

  checkFavoriteStatus() {
    this.http.post<boolean>(
      'http://localhost:8081/api/favorite/check',
      { roadmapId: this.roadmapId },
      { withCredentials: true }
    ).subscribe({
      next: (isFavorite) => this.loved = isFavorite,
      error: (error) => {
        if (error.status === 403) {
          
        }
      }
    });
  }

  toggleLove(event: MouseEvent) {
    event.stopPropagation();
    if (!this.authService.isAuthenticated) {
      console.log("ToggleLove");
      //return;
    }

    const wasLoved = this.loved;
    this.loved = !this.loved; // Optimistic update
    
    this.updateFavoriteStatus(wasLoved);
  }

  private updateFavoriteStatus(previousState: boolean) {
    const endpoint = this.loved ? 'add' : 'remove';
    
    this.http.post(
      `http://localhost:8081/api/favorite/${endpoint}`,
      { roadmapId: this.roadmapId },
      { 
        withCredentials: true,
        responseType: 'text'
      }
    ).subscribe({
      next: (response) => {
        const expectedResponse = this.loved 
          ? 'Roadmap added to favorites.'
          : 'Roadmap removed from favorites.';
        
        if (response !== expectedResponse) {
          this.loved = previousState;
          console.error('Unexpected server response:', response);
        }
      },
      error: (error) => {
        this.loved = previousState;
        console.error('Error updating favorite:', error);
        if (error.status === 403) {
          console.log("update");
        }
      }
    });
  }

  isLoved(): boolean {
    return this.loved;
  }
  selectItem(item: any) {
    this.selectedItem = item;
  }


closeWindow() {
  this.selectedItem = null;
}
downloadPDF() {
  const fileName = `${this.roadmapName}.pdf`;
  const filePath = `assets/images/roadmaps-pdf/${fileName}`;

  const link = document.createElement('a');
  link.href = filePath;
  link.download = fileName;
  link.click(); 
}
onDoneChange(index: number) {
  if (!this.isLoggedIn()) return;

  const checkboxnumber = index + 1;
  
  // Delete existing progress
  this.http.delete(
    `http://localhost:8081/progress/${this.progressid}`,
    { withCredentials: true }
  ).pipe(
    // Create new progress after deletion
    switchMap(() => {
      const body = {
        user: { id: this.userId },
        roadmap: { id: this.roadmapId },
        sum: checkboxnumber
      };
      
      return this.http.post<any>(
        'http://localhost:8081/progress',
        body,
        { withCredentials: true }
      );
    })
  ).subscribe({
    next: (response) => {
      this.progressid = response.id;
      this.progressSum = response.sum;
      this.loadProgress(); // Refresh progress data
    },
    error: (error) => {
      console.error('Error updating progress:', error);
      this.loadProgress(); // Refresh to previous state
    }
  });
}



// Add this method to your component
private loadProgress() {
  this.http.get(
    `http://localhost:8081/progress/load/${this.roadmapId}`,
    { 
      responseType: 'text',
      withCredentials: true 
    }
  ).subscribe({
    next: (response) => {
      if (response === 'False') {
        this.progressSum = 0;
      } else {
        try {
          const progressData = JSON.parse(response);
          this.progressSum = progressData.sum;
          this.progressid=progressData.id
          this.initializeDoneStates();
          console.log('Loaded progress:', this.progressSum);
        } catch (e) {
          console.error('Error parsing progress data:', e);
          this.progressSum = 0;
        }
      }
      console.log(this.progressSum);
    },
    error: (error) => {
      console.error('Error loading progress:', error);
      this.progressSum = 0;
    }
  });
}
initializeDoneStates() {
  // Set first 'progressSum' items to checked
  this.doneStates = this.data.map((_, index) => index < this.progressSum);
}


  }

