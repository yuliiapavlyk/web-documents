import { Component, OnInit, OnDestroy, Output, EventEmitter, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DocumentService } from '../services/document.service';
import { Document } from '../models/document';


export interface Type {
  valueType: string;
}

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit, OnDestroy {

  constructor(private documentService: DocumentService,
    public dialogRef: MatDialogRef<AddDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Document
  ) { }

  addSuccessfully: boolean;
  notCreated: boolean;
  author: string = '';
  description: string = '';
  valueType: string = '';
  name: string = '';
  id: number;
  newDocuments: Document;
  private unsubscribe$ = new Subject();

  types: Type[] = [
    { valueType: 'txt' },
    { valueType: 'pdf' },
    { valueType: 'doc' },
    { valueType: 'docx' }
  ];

  onSubmit(form: NgForm, event) {
    const newDocument = {
      Name: this.name, Description: this.description, Type: this.valueType, Author: this.author
    };
    this.documentService.createDocument(newDocument as Document)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        resp => {
          if (resp.status === 200) {

            this.addSuccessfully = true;
            this.dialogRef.close(resp);
          }
          else {
            this.addSuccessfully = false;
          }
        }
      );
  }
  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
