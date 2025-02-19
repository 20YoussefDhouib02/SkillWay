import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; // ✅ Import this module
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';  // Import HttpClientModule
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ReactiveFormsModule,HttpClientModule,FooterComponent,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-end';
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

  }
}
