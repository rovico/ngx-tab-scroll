import { TestBed } from '@angular/core/testing';

import { TabScrollService } from './tab-scroll.service';

describe('TabScrollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TabScrollService = TestBed.get(TabScrollService);
    expect(service).toBeTruthy();
  });
});
