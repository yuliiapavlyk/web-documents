import { Component, OnInit, ViewChild, HostListener, OnDestroy, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { Subject, fromEvent, Observable } from 'rxjs';
import { takeUntil, startWith, map } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { PageEvent } from '@angular/material';
import { Sort, MatTable } from '@angular/material';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

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
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  options: string[] = [];
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
  hint: string;
  pageSize: number = 10;
  pageNumber: number = 0;
  activeCriteria: string = 'Id';
  direction: string = 'asc';
  IsDialogOpen: boolean;
  private unsubscribe$ = new Subject();
  selection = new SelectionModel<Document>(true, []);

  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  constructor(private documentService: DocumentService,
    public dialog: MatDialog) {
  }


  @Input() length: number;

  @Input() pageSizeOptions = [5, 10, 20, 50];

  @Output() page = new EventEmitter<PageEvent>();

  @ViewChild(MatTable) table: MatTable<any>;

  @Output('matSortChange') sortChange = new EventEmitter<Sort>();

  @ViewChild('input') input: ElementRef;

  addNewDocument(): void {
    this.IsDialogOpen = true;
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

    this.documentService.getDocumentsByPageWithSearch(new DocumentParams(activeCriteria, direction, search, pageNumber, pageSize))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => {
          this.paginator = result,
            this.dataSource.data = result.Items;
          if (result.Message != null) {
            this.hint = 'Showing results for the query: ' + result.Message;
          }
          if (result.Items.length <= 0) {
            this.hint = 'No document found for request ' + result.Message;
          }
        }
      )
  }



  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === keyCode.enter) {
      this.trigger.closePanel();
      this.Search();
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

  Search(): void {

    let searchvalue: string = this.input.nativeElement.value.replace(/\s+/g, ' ').trim().toLowerCase();

    if (searchvalue.length != 0) {
      if (this.options.filter(option => option.toLowerCase() === searchvalue).length == 0) {
        this.options.unshift(searchvalue);
        this.options.length = 10;
        localStorage.setItem('searchHistory', JSON.stringify(this.options));
      }
      else {
        let index: number = this.options.findIndex(option => option.toLowerCase() === searchvalue);
        this.options.splice(index, 1);
        this.options.unshift(searchvalue);
      }
    }

    this.hint = "";
    this.docs.length = 0;
    this.pageNumber = 0;
    this.index = 1;
    this.LoadDocuments();
  }

  onPageChange(event: PageEvent): void {
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
    if (localStorage.getItem('searchHistory') != '') {
      this.options = JSON.parse(localStorage.getItem('searchHistory'));
    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  }

  LoadDocuments(): void {
    this.updateListOfDocuments(this.pageSize, this.pageNumber, this.input.nativeElement.value, this.activeCriteria, this.direction);
  }

  private _filter(filter: string): string[] {
    const filterValue = filter.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(): void {
    localStorage.setItem('searchHistory', JSON.stringify(this.options));
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}




