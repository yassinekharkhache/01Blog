import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogEditorComponent } from './post-editor';

describe('BlogEditorComponent', () => {
  let component: BlogEditorComponent;
  let fixture: ComponentFixture<BlogEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
