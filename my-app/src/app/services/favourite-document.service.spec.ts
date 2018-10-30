import { TestBed } from '@angular/core/testing';

import { FavouriteDocumentService } from './favourite-document.service';

describe('FavouriteDocumentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavouriteDocumentService = TestBed.get(FavouriteDocumentService);
    expect(service).toBeTruthy();
  });
});
