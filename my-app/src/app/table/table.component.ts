import { Component, OnInit, ViewChild, HostListener, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material';

import { Document } from '../models/document';
import { PagedListDocument } from '../models/pagedListDocument';
import { DocumentService } from '../services/document.service';
import { AddDocumentComponent } from '../add-document/add-document.component';

export enum keyCode {
  enter = 13
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['Name', 'Description', 'Author', 'CreateDate', 'ModifiedDate'];
  documents: Document[];
  paginator: PagedListDocument;
  dataSource = new MatTableDataSource<Document>(this.documents);
  newDocument: number;
  id: number;
  lastArgument: any;
  addSuccessfully: boolean;
  addedDocument: Document;
  lastFunction: (pageSize: number, pageNumber: number) => void;

  private unsubscribe$ = new Subject();

  constructor(private documentService: DocumentService,
    public dialog: MatDialog) {
  }

  @Input() length = 40;

  @Input() pageIndex = 0;

  @Input() pageSize = 10;

  @Input() pageSizeOptions = [5, 10, 20];

  @Output() page = new EventEmitter<PageEvent>();

  addNewDocument(): void {
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      width: '300px',
      data: {
        newDocument: this.addedDocument
      }
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      this.addedDocument = result;    
      this.dataSource.data.unshift(this.addedDocument as Document);       
        
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   this.documentService.getDocumentsByPage(this.pageNumber, this.pageSize)
    //     .pipe(takeUntil(this.unsubscribe$))
    //     .subscribe(
    //       results => {                     
    //       this.paginator=result,
    //       this.dataSource.data = results.Items;
    //       }
    //     );
    //     this.lastFunction = this.addNewDocument;
    //     this.lastArgument = null;
    // });
  }

  updateListOfDocuments(pageSize = 10, pageNumber = 0) {
    this.documentService.getDocumentsByPage(pageNumber, pageSize)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => {
          this.paginator = result,
            this.dataSource.data = result.Items;
        }
      )
    this.lastFunction = this.updateListOfDocuments;
  }

  handlePage(event: PageEvent) {
    this.page.emit(event);

  }

  @ViewChild(MatSort) sort: MatSort;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === keyCode.enter) {
      this.addNewDocument();
    }
  }

  onPageChange(event: PageEvent) {
    if (this.lastFunction != null) {
      this.lastFunction(event.pageSize, event.pageIndex);
    }
  }

  ngOnInit() {
    this.updateListOfDocuments();
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}




