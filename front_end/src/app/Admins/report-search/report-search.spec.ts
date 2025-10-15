import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSearch } from './report-search';

describe('ReportSearch', () => {
  let component: ReportSearch;
  let fixture: ComponentFixture<ReportSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
