import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  roadmaps = [
    { "id": 1, "name": "ai-data-scientist", "icon": "fa-solid fa-brain" },
    { "id": 2, "name": "ai-engineer", "icon": "fa-solid fa-robot" },
    { "id": 3, "name": "android", "icon": "fa-brands fa-android" },
    { "id": 4, "name": "angular", "icon": "fa-brands fa-angular" },
    { "id": 5, "name": "api-design", "icon": "fa-solid fa-cogs" },
    { "id": 6, "name": "backend", "icon": "fa-solid fa-server" },
    { "id": 7, "name": "blockchain", "icon": "fa-solid fa-cogs" },
    { "id": 8, "name": "computer-science", "icon": "fa-solid fa-laptop-code" },
    { "id": 9, "name": "cyber-security", "icon": "fa-solid fa-shield-alt" },
    { "id": 10, "name": "data-analyst", "icon": "fa-solid fa-chart-line" },

  ];
}
