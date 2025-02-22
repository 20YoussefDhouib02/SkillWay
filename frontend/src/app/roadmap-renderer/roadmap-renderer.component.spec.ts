import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapRendererComponent } from './roadmap-renderer.component';

describe('RoadmapRendererComponent', () => {
  let component: RoadmapRendererComponent;
  let fixture: ComponentFixture<RoadmapRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadmapRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoadmapRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
