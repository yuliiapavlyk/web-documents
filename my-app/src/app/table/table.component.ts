import { Component, Inject, OnInit, ViewChild, HostListener, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Response } from '@angular/http';
import { Observable, Subject, of } from 'rxjs';
import { Subscription } from 'rxjs';
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
  dataSource = new MatTableDataSource<Document>(this.documents);
  newDocument: Document;
  id: number;
  pageNumber = 1;
  numberOfPages = 1;
  pageSize = 10;
  private unsubscribe$ = new Subject();
  listOfPageSize = [
    { value: 10 },
    { value: 20 },
    { value: 30 },
    { value: 50 }
  ];

  constructor(private documentService: DocumentService,
    public dialog: MatDialog) {
  }

  addNewDocument(): void {
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      width: '300px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.documentService.getDocumentsByPage(this.pageNumber, this.pageSize)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          results => {
            this.dataSource.data = results.Items.reverse();
          }
        );
    });
  }

  updateListOfDocuments() {
    this.documentService.getDocumentsByPage(this.pageNumber, this.pageSize)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => (
          this.dataSource.data = result.Items.reverse(),
          this.pageNumber = result.PageNumber,
          this.numberOfPages = result.NumberOfPages
        ))
  }

  next() {
    this.pageNumber++;
    this.updateListOfDocuments();
  }

  prev() {
    this.pageNumber--;
    this.updateListOfDocuments();

  }
  getSize(event: any) {
    this.pageSize = event.target.value;
    this.updateListOfDocuments();
  }
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === keyCode.enter) {
      this.addNewDocument();
    }
  }

  ngOnInit() {
    this.updateListOfDocuments();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}




