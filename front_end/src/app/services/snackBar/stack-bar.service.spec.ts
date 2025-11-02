import { TestBed } from '@angular/core/testing';

import { StackBarService } from './stack-bar.service';

describe('StackBarService', () => {
  let service: StackBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StackBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
