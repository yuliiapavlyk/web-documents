import { Component, OnInit, ViewChild, HostListener, OnDestroy, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material';
import { Sort, MatTable } from '@angular/material';


import { Document } from '../models/document';
import { DocumentParams } from '../models/documentsParams';
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
  index: number = 1;
  lastArgument: any;
  addSuccessfully: boolean;
  addedDocument: Document;
  pageSize: number = 10;
  pageNumber: number = 0;
  activeCriteria: string = 'Id';
  direction: string = 'asc';
  IsDialogOpen: boolean;
  private unsubscribe$ = new Subject();
  selection = new SelectionModel<Document>(true, []);


  @ViewChild(MatPaginator) paginator2: MatPaginator;

  constructor(private documentService: DocumentService,
    public dialog: MatDialog) {
  }

  //@Input() length = 40;

  @Input() length: number;

  @Input() pageSizeOptions = [5, 10, 20, 50];

  @Output() page = new EventEmitter<PageEvent>();

  @ViewChild(MatTable) table: MatTable<any>;

  @Output('matSortChange') sortChange = new EventEmitter<Sort>();

  @ViewChild('input') input: ElementRef;

  addNewDocument(): void {
    const dialogRef = this.dialog.open(AddDocumentComponent, {
      width: '300px',
      data: {
        newDocument: this.addedDocument
      }
    }
    );

    dialogRef.afterClosed().subscribe(result => {

      if (result != undefined) {
        this.addedDocument = result;
        this.dataSource.data.unshift(this.addedDocument as Document);
        this.dataSource.paginator = this.paginator2;
        //this.paginator.PageSize = this.paginator.PageSize;
        this.table.renderRows();
      }
      this.IsDialogOpen = !this.IsDialogOpen;
    });
  }

  updateListOfDocuments(pageSize: number, pageNumber: number, search: string, activeCriteria: string, direction: string): void {

    this.documentService.getDocumentsByPage(new DocumentParams(activeCriteria, direction, search, pageNumber, pageSize))
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
    console.log(this.selection.selected);
    if (event.keyCode === keyCode.enter && !this.IsDialogOpen) {
      this.IsDialogOpen = !this.IsDialogOpen;
      this.addNewDocument();
    }
  }

  deleteDocuments(): void {
    if (this.selection.selected.length != 0) {
      const array = this.getIdsArray();
      this.documentService.deleteDocuments(array).subscribe(result => {
        this.index = 1;
        this.pageNumber = 0;
        this.docs.length = 0;
        this.LoadDocuments();
      }

      );
    }
  }

  getIdsArray(): number[] {
    let idsArray: number[] = new Array();

    for (let i of this.selection.selected) {
      idsArray.push(i.Id);
    }
    this.selection.clear();
    return idsArray;
  }

  onPageChange(event: PageEvent): void {
    if (event.pageIndex >= 0 && this.pageNumber - 1 === event.pageIndex && this.pageSize == event.pageSize) {
      this.index++;
      this.dataSource.data = this.docs[this.docs.length - this.index];
      this.pageNumber = event.pageIndex;
      this.pageSize = event.pageSize;
      return;
    }
    if (this.pageSize != event.pageSize) {
      this.index = 1;

      this.pageNumber = 0;
      this.pageSize = event.pageSize
      this.docs.length = 0;
      this.LoadDocuments();
      return;
    }
    if (this.index > 1) {
      this.index--;
      this.dataSource.data = this.docs[this.docs.length - this.index];
      this.pageNumber = event.pageIndex;
      this.pageSize = event.pageSize;
      return;
    }

    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.LoadDocuments();
  }

  onSortChange(event: Sort): void {
    this.activeCriteria = event.active;
    this.direction = event.direction ? event.direction : 'asc';
    this.pageNumber = 0;
    this.index = 1;
    this.docs.length = 0;
    this.LoadDocuments();
  }

  ngOnInit(): void {
    this.updateListOfDocuments(this.pageSize, this.pageNumber, '', this.activeCriteria, this.direction);
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => {
          this.docs.length = 0;
          this.pageNumber = 0;
          this.index = 1;
          this.LoadDocuments();
        })
      )
      .subscribe();

  }
  LoadDocuments(): void {
    this.updateListOfDocuments(this.pageSize, this.pageNumber, this.input.nativeElement.value, this.activeCriteria, this.direction);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}




