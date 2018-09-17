import { Component, Inject, OnInit, ViewChild, HostListener, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Response } from '@angular/http';
import { Observable, Subject, of } from 'rxjs';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Document } from '../models/document';
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
  dataSource = new MatTableDataSource<Document>(this.documents);
  newDocument: Document;
  subscription: Subscription;
  id: number;
  private unsubscribe$ = new Subject();

  constructor(private documentService: DocumentService,
    public dialog: MatDialog) {
  }

  addNewDocument(): void {
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      width: '300px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.documentService.getDocuments()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          results => {
            this.dataSource.data = results.reverse();
          }
        );
    });
  }

  deleteDocument() {

    // this.documentService.deleteDocumentById(this.id)
    //   .subscribe(
    //     results =>
    //       this.dataSource.data = results
    //   );
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === keyCode.enter) {
      this.messageShow();
    }
  }
  
  messageShow() {
    alert('Hot key works');
  }

  ngOnInit() {
    const subscription = this.documentService.getDocuments()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        results => {
          this.dataSource.data = results;
        }

      );

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}




