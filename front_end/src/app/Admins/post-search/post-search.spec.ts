import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSearch } from './post-search';

describe('PostSearch', () => {
  let component: PostSearch;
  let fixture: ComponentFixture<PostSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
