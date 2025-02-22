// roadmap-renderer.component.ts
import { Component, Input, ElementRef, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { wireframeJSONToSVG } from 'roadmap-renderer';
import { Subject, takeUntil } from 'rxjs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-roadmap-renderer',
  imports:[MatProgressSpinnerModule,NgIf],
  standalone:true,
  template: `
    <div class="roadmap-container" 
         [style.aspect-ratio]="aspectRatio"
         [attr.data-resource-type]="resourceType"
         [attr.data-resource-id]="resourceId">
      <div class="loader" *ngIf="isLoading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      <div class="error-message" *ngIf="error">{{ error }}</div>
    </div>
  `,
  styleUrls: ['./roadmap-renderer.component.css']
})
export class RoadmapRendererComponent implements AfterViewInit, OnDestroy {
  @Input() resourceType: 'roadmap' | 'best-practice' = 'roadmap';
  @Input() resourceId!: string;
  @Input() jsonUrl!: string;
  @Input() dimensions?: { width: number; height: number };

  isLoading = true;
  error = '';
  private destroy$ = new Subject<void>();
  private clickListeners: (() => void)[] = [];

  get aspectRatio(): string | null {
    return this.dimensions ? `${this.dimensions.width}/${this.dimensions.height}` : null;
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  ngAfterViewInit(): void {
    this.loadRoadmap();
    this.handleUrlParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clickListeners.forEach(removeListener => removeListener());
  }

  private loadRoadmap(jsonUrl?: string): void {
    this.isLoading = true;
    this.error = '';
    
    const url = jsonUrl || this.jsonUrl;
    this.http.get(url).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: async (json: any) => {
        
        await this.renderSVG(json);
        this.handleProgress();
      },
      error: (err) => {
        this.error = `Error loading roadmap: ${err.message}`;
        this.isLoading = false;
      }
    });
  }

  private async renderSVG(json: any): Promise<void> {
    try {
      //console.log(json);
      if (typeof window !== 'undefined') {
        const { wireframeJSONToSVG } = await import('roadmap-renderer');
        console.log(wireframeJSONToSVG);
      }
      const svg = await wireframeJSONToSVG(json, {
        fontURL: '/assets/balsamiq.woff2',
      });;
      
      const container = this.el.nativeElement.querySelector('.roadmap-container');
      container.innerHTML = '';
      this.renderer.appendChild(container, svg);
      this.addClickHandlers(svg);
    } catch (err) {
      this.error = `Error rendering SVG: ${err}`;
    } finally {
      this.isLoading = false;
    }
  }

  private addClickHandlers(svg: SVGElement): void {
    // Handle external links
    const externalLinks = svg.querySelectorAll('[data-group-id^="ext_link"]');
    externalLinks.forEach(el => {
      const listener = this.renderer.listen(el, 'click', (event) => {
        event.preventDefault();
        const url = el.getAttribute('data-group-id')?.replace('ext_link:', '');
        if (url) window.open(`https://${url}`, '_blank');
      });
      this.clickListeners.push(listener);
    });

    // Handle JSON switches
    const jsonLinks = svg.querySelectorAll('[data-group-id^="json:"]');
    jsonLinks.forEach(el => {
      const listener = this.renderer.listen(el, 'click', (event) => {
        event.preventDefault();
        const newJsonUrl = el.getAttribute('data-group-id')?.replace('json:', '');
        if (newJsonUrl) this.switchRoadmap(newJsonUrl);
      });
      this.clickListeners.push(listener);
    });
  }

  private handleProgress(): void {
    // Implement your progress tracking logic here
    // Example: Add 'done' class to completed topics
  }

  private handleUrlParams(): void {
    const params = new URLSearchParams(window.location.search);
    const roadmapType = params.get('r');
    
    if (roadmapType) {
      this.switchRoadmap(`/jsons/roadmaps/${roadmapType}.json`);
    }
  }

  private switchRoadmap(newJsonUrl: string): void {
    const newSlug = newJsonUrl.split('/').pop()?.replace('.json', '') || '';
    
    // Update URL
    if (history.pushState) {
      const url = new URL(window.location.href);
      const paramKey = this.resourceType === 'roadmap' ? 'r' : 'b';
      url.searchParams.set(paramKey, newSlug);
      history.pushState(null, '', url.toString());
    }

    this.loadRoadmap(newJsonUrl);
  }
}