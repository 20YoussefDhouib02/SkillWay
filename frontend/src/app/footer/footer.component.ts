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
    { name: "ai-data-scientist" },
    { name: "ai-engineer" },
    { name: "android" },
    { name: "angular" },
    { name: "api-design" },
    { name: "backend" },
    { name: "blockchain" },
    { name: "computer-science" },
    { name: "cyber-security" },
    { name: "data-analyst" },
    { name: "devops" },
    { name: "devrel" },
    { name: "engineering-manager" },
    { name: "frontend" },
    { name: "full-stack" },
    { name: "game-developer" },
    { name: "git-github" },
    { name: "ios" },
    { name: "javascript" },
    { name: "mlops" },
  ];
}
