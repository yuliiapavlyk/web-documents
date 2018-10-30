import { Component, OnInit, ViewChild, HostListener, OnDestroy, ElementRef, Output, EventEmitter, Input, Renderer2,ViewChildren,QueryList} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import {  MatTableDataSource, MatPaginator } from '@angular/material';
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
import { FavouriteDocumentService } from '../services/favourite-document.service';
import { FavouriteDocument } from '../models/favouriteDocument';
import { HistoryService } from '../services/history.service';
import { AddDocumentComponent } from '../add-document/add-document.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

export enum keyCode {
  enter = 13
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnDestroy {
  @ViewChildren("mytable") mytable: QueryList<ElementRef>;

  displayedColumns: string[] = ['Select', 'Favourite', 'Name', 'Description', 'Author', 'CreateDate', 'ModifiedDate'];
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  options: string[] = [];
  documents: Document[];
  paginator: PagedListDocument;
  dataSource = new MatTableDataSource<Document>(this.documents);
  newDocument: number;
  dropId: number;
  updDocument: Document;
  updName: string = "";
  updDescription: string = "";
  updAuthor: string = "";
  updCreateDate: Date;
  updId: number;
  updatePossibility: boolean = false;
  index: number = 1;
  indexPosition: number = 1;
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
  messageForAdding: string = "";
  favourites: number[] = [];


  @ViewChild(MatAutocompleteTrigger) trigger: MatAutocompleteTrigger;
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  constructor(private documentService: DocumentService,
    private historyService: HistoryService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    public snackBar: MatSnackBar,
    private favouriteDocumentService:FavouriteDocumentService) {
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

  loadFavourites(): void {
    this.favouriteDocumentService.getFavouriteDocuments(1).subscribe(res => {
      if (res != null) {
        res.forEach(i => {
          this.favourites.push(i.Id)
        }
        )
      }
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

  chooseActionWithFavouriteDoc(id: number, indexPosition: number): void {
   
    let favourite = { UserId: 1, DocumentId: id };
    this.favourites.indexOf(id) != -1 ? this.deleteFromFavourite(favourite, indexPosition) : this.addToFavourite(favourite, indexPosition);
  }
  
  addToFavourite(favouriteDocument, indexPosition: number) {
    this.favouriteDocumentService.addToFavouriteDocuments(favouriteDocument as FavouriteDocument).subscribe()
    this.favourites.push(favouriteDocument.DocumentId);
    let image = this.mytable.toArray()[indexPosition];
    this.renderer.setProperty(image.nativeElement, 'src', "assets/yellowStar.png");
  }

  deleteFromFavourite(favouriteDocument, indexPosition: number) {
    this.favouriteDocumentService.deleteFromFavouriteDocuments(favouriteDocument as FavouriteDocument).subscribe()
    this.favourites.splice(this.favourites.indexOf(favouriteDocument.DocumentId), 1);
    let image = this.mytable.toArray()[indexPosition];
    this.renderer.setProperty(image.nativeElement, 'src', "assets/whiteStar.png");
  }

  setImage(id: number) {
    if (this.favourites.indexOf(id) != -1) {
      return "assets/yellowStar.png"
    }
    else return "assets/whiteStar.png";
  }


  updateListOfDocuments(pageSize: number, pageNumber: number, search: string, activeCriteria: string, direction: string): void {
    this.documentService.getDocumentsByPageWithSearch(new DocumentParams(activeCriteria, direction, search, pageNumber, pageSize))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        result => {
          this.historyService.getSearcHistory().subscribe(
            respone => {
              if (respone.length != 0) {
                this.options = respone.map(i => i.SearchQuery);
              }
            }
          );
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
    this.renderer.removeClass(this.inputUpdate.nativeElement,'hovered' );
    ev.preventDefault();
    this.getDocument(this.dropId);
    this.updatePossibility = false;
    this.dropElement = true;
  }

  handleDragStart(ev, row): void {
    this.dropId = row.Id;
    this.dropElement = false;
    this.selection.clear();
    this.selection.select(row);
    ev.target.style.opacity = '0.4';
    let image = this.renderer.createElement('img');
    this.renderer.setProperty(image, 'src','http://cdn.canadiancontent.net/t/icon/70/indeep-notes.png' );
    ev.dataTransfer.setDragImage(image, 0, 0);
  }

  handleDragEnd(ev): void {
    ev.target.style.opacity = '1';
    if(!this.dropElement) {
      this.selection.clear();
    }
  }

  handleDragOver(ev): void {
    ev.preventDefault();
    this.renderer.addClass(this.inputUpdate.nativeElement,'hovered' );
  }

  handleDragEnter(ev): void {
    this.renderer.addClass(this.inputUpdate.nativeElement,'hovered' );
  }

  handleDragLeave(ev): void {
    this.renderer.removeClass(this.inputUpdate.nativeElement,'hovered' );
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
        this.selection.select(res);
        this.selection.toggle(res);
        return this.previousDocument = res;   
      });
  }

  transformDescription(description: string): string {
    let columnSize = document.getElementsByClassName("mat-column-Description")[0].clientWidth;
    let element = document.createElement("canvas");
    element.style.font = document.getElementsByTagName("td")[0].style.font;
    let context = element.getContext("2d");
    let metrics = context.measureText(description);
    let descriptionSize = metrics.width;
    if (descriptionSize > columnSize) {
      let lenght = description.length;
      let symbolSize = descriptionSize / description.length;
      let containSymbols = columnSize / symbolSize;
      let partSize = Math.round((containSymbols - 6) / 2);
      let newDescription = description.slice(0, partSize);
      newDescription += " ... ";
      newDescription += description.slice(lenght - partSize - 1, lenght - 1);
      return newDescription;
    }
    else {
      return description;
    }
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
      const data = { title: 'Delete', message: `Are sure you want to delete ${array.length} document${array.length>1?'s':'' }?` };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: data
      }
      );
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.documentService.deleteDocuments(array)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(result => {
              this.pageNumber = 0;
              this.LoadDocuments();
            }
            );
        }
      });
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
    let searchvalue: string = this.input.nativeElement.value.replace(/\s+/g, ' ').trim().toLowerCase();
    this.hint = "";
    this.pageNumber = 0;
    this.LoadDocuments(searchvalue);
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
    this.LoadDocuments();
  }

  ngOnInit(): void {
    this.loadFavourites();
    this.historyService.getSearcHistory().subscribe(
      respone => {
        if (respone.length != 0) {
          this.options = respone.map(i => i.SearchQuery);
          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value))
          );
        }
      }
    );
    this.updateListOfDocuments(this.pageSize, this.pageNumber, '', this.activeCriteria, this.direction);

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

  LoadDocuments(searchvalue: string = this.input.nativeElement.value): void {
    this.updateListOfDocuments(this.pageSize, this.pageNumber, searchvalue, this.activeCriteria, this.direction);
  }

  private _filter(filter: string): string[] {
    const filterValue = filter.toLowerCase();
    if (this.options.length === 0) {
      return null;
    }
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
