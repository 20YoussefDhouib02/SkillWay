import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { RoadmapsComponent } from './roadmaps/roadmaps.component';
import { SignupComponent } from './signup/signup.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RoadmapComponent } from './roadmap/roadmap.component';
import { ProfileComponent } from './profile/profile.component';
import { FavorisComponent } from './favoris/favoris.component';
import { AiRoadmapComponent } from './ai-roadmap/ai-roadmap.component';
import { TrackProgressComponent } from './track-progress/track-progress.component';
export const routes: Routes = [
    
    {path:'roadmaps', component:RoadmapsComponent},
    {path:'signup' , component:SignupComponent},
    {path:'footer' , component:FooterComponent},
    {path:'login', component:LoginComponent},
    { path: 'roadmap/:name/:id', component: RoadmapComponent },
    {path:'roadmaps',component:RoadmapsComponent},
    {path:'profile', component:ProfileComponent},
    {path:'favorites', component:FavorisComponent},
    {path:'ai-skill', component:AiRoadmapComponent},
    {path:'track-way', component:TrackProgressComponent},
    {path:'', component  :HomepageComponent}
];
