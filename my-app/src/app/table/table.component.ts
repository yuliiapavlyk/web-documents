import { DocumentService } from '../services/document.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { Document } from '../models/document';


export enum KEY_CODE {
  ENTER = 13
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor(private documentService: DocumentService) {
  }
  displayedColumns: string[] = ['State', 'Type', 'Description', 'Name', 'Author', 'CreateDate', 'ModifiedDate'];
  dataSource = new MatTableDataSource<ListOfDocuments>(ELEMENT);

  documents: Document[];//= [{Id:12, Author: 'asss', CreateDate : null, Description: 'sdasd', Name:'asdasdasd',ModDate: null}];
  getData() {

    this.documentService.getDocuments().subscribe(
      results => {
      this.documents = results
        console.log(this.documents);
        console.log(this.dataSource1);
      });
  }
  dataSource1 = new MatTableDataSource<Document>(this.documents);


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
    this.documentService.getDocuments().subscribe(
      results => this.documents = results);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}


export interface ListOfDocuments {
  Name: string;
  Author: string;
  Description: string;
  Type: string;
  CreateDate: string;
  ModifiedDate: string;
}

const ELEMENT: ListOfDocuments[] = [
  { Description: 'Math rules', Name: 'Math rules', Author: 'Olena', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Programming', Author: 'Andrew', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'CV', Author: 'Oleg', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Rules', Author: 'Vitalii', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Law', Author: 'Solomia', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'CV2', Author: 'Sofia', Type: 'pdf', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Nitrogen', Author: 'Taras', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Oxygen', Author: 'Ivan', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Fluorine', Author: 'Jon', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Neon', Author: 'Petro', Type: 'pdf', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Sodium', Author: 'Vadym', Type: 'pdf', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Magnesium', Author: 'Oleg', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Aluminum', Author: 'Ivan', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Silicon', Author: 'Ivan', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Phosphorus', Author: 'Oleg', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Sulfur', Author: 'Orest', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Chlorine', Author: 'Oleg', Type: 'pdf', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Argon', Author: 'Ivan', Type: 'pdf', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Potassium', Author: 'Yulia', Type: 'txt', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" },
  { Description: 'Math rules', Name: 'Calcium', Author: 'Oleg', Type: 'pdf', CreateDate: "02/01/2012", ModifiedDate: "02/01/2012" }
];



