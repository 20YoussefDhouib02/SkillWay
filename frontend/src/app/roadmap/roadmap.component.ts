import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-roadmap',
  standalone:true,
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.css'],
  imports:[CommonModule,FooterComponent,HeaderComponent]
})
export class RoadmapComponent implements OnInit {
  data: any[] = [];
  selectedItem: any = null; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  roadmapName: string = '';
  roadmapId : any ; 
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.roadmapName = params.get('name') || '';
      this.roadmapId = params.get('id') ||
      console.log(' roadmap :', this.roadmapName);
      console.log(' roadmap :', this.roadmapId);


      this.route.params.subscribe(params => {
        this.roadmapId = +params['id'];
        this.checkFavoriteStatus();
      });
      this.http.get(`assets/images/roadmap-content/${this.roadmapName}.json`)
        .subscribe(jsonData => {
          this.data = Object.values(jsonData); 

          console.log('Fetched roadmap data:', this.data);
        });
    });
  }
  loved = false;



  checkFavoriteStatus() {
    this.http.post<boolean>(
      'http://localhost:8081/api/favorite/check',
      { roadmapId: this.roadmapId },
      { withCredentials: true }
    ).subscribe({
      next: (isFavorite) => this.loved = isFavorite,
      error: (error) => {
        if (error.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
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

  }

