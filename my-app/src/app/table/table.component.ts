import { Component, OnInit, ViewChild, HostListener, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PageEvent } from '@angular/material';
import {Sort} from '@angular/material';


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
  docs = [this.documents];
  paginator: PagedListDocument;
  dataSource = new MatTableDataSource<Document>(this.documents);
  newDocument: number;
  id: number;
  lastArgument: any;
  addSuccessfully: boolean;
  addedDocument: Document;
  pageSize: number = 10;
  pageNumber: number = 0;
  activeCriteria: string = 'Id';
  direction: string = 'asc';
  IsDialogOpen: boolean;
  private unsubscribe$ = new Subject();

  constructor(private documentService: DocumentService,
    public dialog: MatDialog) {
  }

  @Input() length = 40;

  @Input() pageSizeOptions = [5, 10, 20, 50];

  @Output() page = new EventEmitter<PageEvent>();

  @Output()sortChange = new EventEmitter<Sort>();

  addNewDocument(): void {
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      width: '300px',
      data: {
        newDocument: this.addedDocument
      }
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      if(result != null){
      this.addedDocument = result;  
      let Items= this.dataSource.data;  
      Items.unshift(this.addedDocument as Document);
      this.dataSource.data = Items;    
      }
      this.IsDialogOpen = !this.IsDialogOpen; 
        
    });
  }

  updateListOfDocuments(pageSize: number, pageNumber: number, activeCriteria: string, direction: string): void {
    this.documentService.getDocumentsByPage(pageNumber, pageSize, activeCriteria, direction)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => {
          this.paginator = result,
            this.dataSource.data = result.Items;
            this.docs.push(result.Items);
        }
      )
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === keyCode.enter && !this.IsDialogOpen) {
      this.IsDialogOpen = !this.IsDialogOpen;
      this.addNewDocument();
    }
  }

  onPageChange(event: PageEvent): void {
    if(event.pageIndex>= 0 && this.pageNumber-1 === event.pageIndex && this.pageSize == event.pageSize){
      this.dataSource.data= this.docs.pop();
      this.pageNumber = event.pageIndex;
      this.pageSize = event.pageSize;
      debugger
      return; 
    }
    if (this.pageSize != event.pageSize){
      this.pageNumber = 0;
      this.pageSize = event.pageSize
      this.docs.length=0;
      this.updateListOfDocuments(this.pageSize,this.pageNumber,this.activeCriteria,this.direction);
      return;
    }
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    debugger
    this.updateListOfDocuments(this.pageSize,this.pageNumber,this.activeCriteria,this.direction);
  }

  onSortChange(event: Sort): void {
    this.activeCriteria= event.active;
    this.direction = event.direction? event.direction : 'asc';
    this.pageNumber = 0;
    this.docs.length=0;
    this.updateListOfDocuments(this.pageSize,this.pageNumber,this.activeCriteria,this.direction);
  }

  ngOnInit(): void {
    this.updateListOfDocuments(this.pageSize,this.pageNumber,this.activeCriteria,this.direction);

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}




