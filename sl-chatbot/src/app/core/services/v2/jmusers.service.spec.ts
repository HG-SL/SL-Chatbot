import { TestBed } from '@angular/core/testing';

import { JMusersService } from './jmusers.service';

describe('JMusersService', () => {
  let service: JMusersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JMusersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
