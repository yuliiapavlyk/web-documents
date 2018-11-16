
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject} from 'rxjs';
import { Observable, of } from 'rxjs';

import { Document } from '../../shared/models';
import { FavouriteDocumentService } from '../services/favourite-document.service';
import { TransferService } from '../services/transfer.service';


export class FavouriteDataSource extends DataSource<Document> {

    public documentSubject = new BehaviorSubject<Document[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    documents: Observable<Document[]>;
    loading: boolean = false;
    constructor(private transferService: TransferService
    ) {
        super();
    }

    connect(): Observable<Document[]> {        
    // this.documents = this.transferService.getFavourite();
    // return this.documents;

    return this.documentSubject.asObservable();

    }

    disconnect() { 
        this.documentSubject.complete();
        this.loadingSubject.complete();
    }

    loadDocuments(){
        this.loadingSubject.next(true);
        this.transferService.getFavourite()
        .subscribe(document => this.documentSubject.next(document));
    }

}
