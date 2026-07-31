import { TestBed } from '@angular/core/testing';

import { CategoryOptionsState } from './category-options-state';

describe('CategoryService', () => {
  let service: CategoryOptionsState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryOptionsState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
