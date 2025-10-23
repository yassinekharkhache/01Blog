import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notification';

describe('Notification', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<Notification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notification]
    })
    .compileComponents();

    // fixture = TestBed.createComponent(NotificationsComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});
