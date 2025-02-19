import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';


@Component({
  selector: 'app-favoris',
  standalone:true,
  imports:[CommonModule,HeaderComponent,RouterLink,FooterComponent],
  templateUrl: './favoris.component.html',
  styleUrl: './favoris.component.css'
})
export class FavorisComponent {
  roadmaps: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // First get all possible roadmaps with icons
    this.http.get<any>('/assets/images/roadmaps.json').subscribe({
      next: (localData) => {
        // Then get user's favorites from API
        this.http.get<any[]>('http://localhost:8081/api/favorite/me', { 
          withCredentials: true 
        }).subscribe({
          next: (apiData) => {
            // Merge the data to get favorites with icons
            this.roadmaps = apiData.map(favorite => {
              const fullData = localData.fields.find((item: any) => item.id === favorite.id);
              return { ...favorite, icon: fullData?.icon || 'fa-solid fa-question' };
            });
          },
          error: (error) => {
            console.error('Error fetching favorites:', error);
            if (error.status === 403) {
              this.router.navigate(['/login']);
            }
          }
        });
      },
      error: (localError) => {
        console.error('Error loading roadmap data:', localError);
      }
    });
  }
}
