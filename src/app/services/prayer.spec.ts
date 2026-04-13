import { TestBed } from '@angular/core/testing';

import { Prayer } from './prayer';

describe('Prayer', () => {
  let service: Prayer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Prayer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
