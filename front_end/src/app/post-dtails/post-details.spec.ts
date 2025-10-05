import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDtails } from './post-dtails';

describe('PostDtails', () => {
  let component: PostDtails;
  let fixture: ComponentFixture<PostDtails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDtails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDtails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
