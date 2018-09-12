import { DocumentService } from '../services/document.service';
import { Component, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { Document } from '../models/document';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Response } from '@angular/http';



export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit ,OnDestroy {

  private ngUnsubscribe = new Subject();
  id=7;

  constructor(private documentService: DocumentService) {
    this.checkbox = false;
  }

  displayedColumns: string[] = ['Name','Description','Author', 'CreateDate', 'ModifiedDate'];
  newDocument: Document;
  documents: Document[];
  checkbox:boolean;
  dataSource = new MatTableDataSource<Document>(this.documents);

  addNewDocument() {
    // this.documentService.createDocument(this.newDocument)
    //   .pipe(
    //     takeUntil(this.ngUnsubscribe)
    //   )
    //   .subscribe(
    //     results => {
    //       this.documents = results
    //       console.log(this.documents);
    //     }

    //   );
    
    var date = new Date(Date.UTC(2012, 11, 12, 3, 0, 0));
    console.log(date.toLocaleString());
    alert(date.toLocaleString(window.navigator.language));
     
  }

  deleteDocument(){
    this.documentService.deleteDocumentById(this.id)
    .pipe(
      takeUntil(this.ngUnsubscribe)
     )
     .subscribe(
      results => 
      this.dataSource.data=results      
   );    
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.ENTER) {
      this.messageShow();
    }
  }
  messageShow() {
    alert('Hot key worked');
  }

  ngOnInit() {
    this.documentService.getDocuments()
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )     
      .subscribe(
        results => {
          this.dataSource.data = results
        }
      
      );

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
   
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}




