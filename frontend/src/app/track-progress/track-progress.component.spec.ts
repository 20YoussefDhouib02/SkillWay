import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackProgressComponent } from './track-progress.component';

describe('TrackProgressComponent', () => {
  let component: TrackProgressComponent;
  let fixture: ComponentFixture<TrackProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
