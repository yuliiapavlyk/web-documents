
import { DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';

import { Document } from '../../shared/models';
import { FavouriteDocumentService } from '../services/favourite-document.service';
import { TransferService } from '../services/transfer.service';


export class FavouriteDataSource extends DataSource<Document> {

    documents: Observable<Document[]>;
    constructor(private transferService: TransferService
    ) {
        super();

    }

    connect(): Observable<Document[]> {
        this.documents = this.transferService.getFavourite();
        return this.documents;
    }


    disconnect() { }
}
