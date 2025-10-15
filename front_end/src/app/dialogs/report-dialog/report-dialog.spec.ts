import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDialogComponent } from './report-dialog';

describe('ReportDialog', () => {
  let component: ReportDialogComponent;
  let fixture: ComponentFixture<ReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
