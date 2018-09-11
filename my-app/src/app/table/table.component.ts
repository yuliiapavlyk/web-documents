import { DocumentService } from '../services/document.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { Document } from '../models/document';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';



export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  private ngUnsubscribe = new Subject();

  constructor(private documentService: DocumentService) {
  }
  displayedColumns: string[] = ['State', 'Type', 'Description', 'Name', 'Author', 'CreateDate', 'ModifiedDate'];
  
  documents: Document[];//= [{Id:12, Author: 'asss', CreateDate : null, Description: 'sdasd', Name:'asdasdasd',ModDate: null}];
  dataSource = new MatTableDataSource<Document>(this.documents);
  getData() {

    this.documentService.getDocuments().subscribe(
      results => {
      this.documents = results
        console.log(this.documents);
      });
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
        this.dataSource = new MatTableDataSource(results)    
      });      

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(){

  }
}




