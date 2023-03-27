import { TestBed } from '@angular/core/testing';

import { NluService } from './nlu.service';

describe('NluService', () => {
  let service: NluService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NluService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
