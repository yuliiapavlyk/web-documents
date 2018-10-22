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
import { MatSnackBar } from '@angular/material';

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

  displayedColumns: string[] = ['Select', 'Name', 'Description', 'Author', 'CreateDate', 'ModifiedDate'];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  options: string[] = [];
  documents: Document[];
  docs = [this.documents];
  paginator: PagedListDocument;
  dataSource = new MatTableDataSource<Document>(this.documents);
  newDocument: number;
  dropId: number;
  updDocument:Document;
  updName: string = "";
  updDescription: string = "";
  updAuthor: string = "";
  updCreateDate: Date;
  updId: number;
  updatePossibility: boolean = false;
  index: number = 1;
  lastArgument: any;
  addSuccessfully: boolean;
  addedDocument: Document;
  hint: string;
  pageSize: number = 10;
  pageNumber: number = 0;
  activeCriteria: string = 'Id';
  direction: string = 'asc';
  nameElement: string = "";
  IsDialogOpen: boolean;
  idForUpdate: number = 0;
  previousDocument: Document;
  dropElement: boolean = false;
  private unsubscribe$ = new Subject();
  selection = new SelectionModel<Document>(true, []);


  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  constructor(private documentService: DocumentService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) {
  }


  @Input() length: number;

  @Input() pageSizeOptions = [5, 10, 20, 50];

  @Output() page = new EventEmitter<PageEvent>();

  @ViewChild(MatTable) table: MatTable<any>;

  @Output('matSortChange') sortChange = new EventEmitter<Sort>();

  @ViewChild('input') input: ElementRef;
  @ViewChild('inputUpdate') inputUpdate: ElementRef;

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

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

      if (result !== undefined) {
        this.addedDocument = result;
        this.dataSource.data.unshift(this.addedDocument as Document);
        this.dataSource.paginator = this.paginator2;
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

  handleDrop(ev): void {
    document.getElementById("update-block").classList.remove("hovered");
    ev.preventDefault();
    this.getDocument(this.dropId);
  
    this.dropElement = true;
  }

  handleDragStart(ev, id: number): void {
    this.dropId = id;
    ev.target.style.opacity = '0.4';       
    const img = document.createElement("img");
    img.src = "http://cdn.canadiancontent.net/t/icon/70/indeep-notes.png";
    ev.dataTransfer.setDragImage(img, 0, 0);    
  }

  handleDragEnd(ev): void {
    ev.target.style.opacity = '1';
  }

  handleDragOver(ev): void {
    ev.preventDefault();
    document.getElementById("update-block").classList.add("hovered");
  }

  handleDragEnter(ev): void {
    document.getElementById("update-block").classList.add("hovered");
  }

  handleDragLeave(ev): void {
    document.getElementById("update-block").classList.remove("hovered");
  }

  isAllSelected(): boolean {
    let numSelected = this.selection.selected.length;
    let numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }


  getDocument(id: number): any {  
    this.documentService.getDocumentById(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.updName = res.Name;
        this.updDescription = res.Description;
        this.updCreateDate = res.CreateDate;
        this.updAuthor = res.Author;
        this.updId = res.Id;
        this.previousDocument = res;   
        console.log(this.selection);
        console.log(this.selection.selected);
        console.log(this.selection.hasValue());
        console.log( this.selection.isSelected(res));
        this.selection.select(res);
        console.log( this.selection.isSelected(res));
        this.selection.toggle(res);
        return this.previousDocument=res;        
      });     
  }


  transformDescription(description:string):string{
    let lenght= description.length;     
    if(lenght>30){
      let newDescription=description.slice(0,15);
      newDescription+=" ... ";
      newDescription+=description.slice(lenght-1-15,lenght-1);
      return newDescription;
    }
    else
    return description;     
  }  

  updateDocument(): void {
    let updDocument = {
      Id: this.updId,
      Name: this.updName,
      Description: this.updDescription,
      Author: this.updAuthor,
      Type: this.previousDocument.Type,
      CreateDate: this.previousDocument.CreateDate,
      ModifiedDate: this.previousDocument.ModifiedDate
    };
    this.documentService.updateDocument(updDocument)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.LoadDocuments();
      });
    this.selection.clear();
    this.updatePossibility = false;
    this.openSnackBar("Document '" + this.updName + "' was updated", "Ok");
  }

  cancelUpdate(): void {
    this.updName = this.previousDocument.Name;
    this.updDescription = this.previousDocument.Description;
    this.updCreateDate = this.previousDocument.CreateDate;
    this.updAuthor = this.previousDocument.Author;
    this.updId = this.previousDocument.Id;
    this.previousDocument = this.previousDocument;
    this.updatePossibility = false;
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.keyCode === keyCode.enter) {
      this.trigger.closePanel();
      this.Search();
    }
  }

  deleteDocuments(): void {
    if (this.selection.selected.length !== 0) {
      const array = this.getIdsArray();
      this.documentService.deleteDocuments(array)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(result => {
          this.index = 1;
          this.pageNumber = 0;
          this.docs.length = 0;
          this.LoadDocuments();
        }
        );
    }
  }

  getIdsArray(): number[] {
    const idsArray: number[] = new Array();
    for (const i of this.selection.selected) {
      idsArray.push(i.Id);
    }
    this.selection.clear();
    return idsArray;
  }

  Search(): void {
    const searchvalue: string = this.input.nativeElement.value.replace(/\s+/g, ' ').trim().toLowerCase();
    if (searchvalue.length !== 0) {
      if (this.options.filter(option => option.toLowerCase() === searchvalue).length === 0) {
        this.options.unshift(searchvalue);
        if (this.options.length > 10) {
          this.options.length = 10;
        }
        localStorage.setItem('searchHistory', JSON.stringify(this.options));
      }
      else {
        const index: number = this.options.findIndex(option => option.toLowerCase() === searchvalue);
        this.options.splice(index, 1);
        this.options.unshift(searchvalue);
      }
    }
    this.hint = '';
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
    if (localStorage.getItem('searchHistory') != null) {
      this.options = JSON.parse(localStorage.getItem('searchHistory'));

    }
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );


    fromEvent(this.inputUpdate.nativeElement, 'keyup')
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => {
          let updDocument = {
            Id: this.updId, Name: this.updName, Description: this.updDescription, Author: this.updAuthor, Type: this.previousDocument.Type, CreateDate: this.previousDocument.CreateDate, ModifiedDate: this.previousDocument.ModifiedDate,
          };       
          if (JSON.stringify(this.previousDocument) === JSON.stringify(updDocument)) {
            this.updatePossibility = false;
          }
          else
            this.updatePossibility = true
        })
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  LoadDocuments(): void {
    this.updateListOfDocuments(this.pageSize, this.pageNumber, this.input.nativeElement.value, this.activeCriteria, this.direction);
    
  }
  private _filter(filter: string): string[] {
    const filterValue = filter.toLowerCase();
    if (this.options.length === 0) {
      return null;
    }
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(): void {
    localStorage.setItem('searchHistory', JSON.stringify(this.options));
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}




