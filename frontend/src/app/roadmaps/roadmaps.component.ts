import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';



@Component({
  selector: 'app-roadmaps',
  standalone:true,
  imports:[CommonModule,HeaderComponent,RouterLink,FooterComponent],
  templateUrl: './roadmaps.component.html',
  styleUrls: ['./roadmaps.component.css']
})
export class RoadmapsComponent implements OnInit {
  roadmaps:any

  constructor(private http: HttpClient,private router: Router) {}

  ngOnInit(): void {
    this.http.get<any>('/assets/images/roadmaps.json').subscribe(data => {
      this.roadmaps = data.fields; // Adjusted to match JSON structure
    });
  }

}
