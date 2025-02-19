import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiRoadmapComponent } from './ai-roadmap.component';

describe('AiRoadmapComponent', () => {
  let component: AiRoadmapComponent;
  let fixture: ComponentFixture<AiRoadmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiRoadmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiRoadmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
