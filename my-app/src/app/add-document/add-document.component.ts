import { Component, OnInit, ViewChild } from '@angular/core';
import { ResponseOptions } from '@angular/http';
import { NgForm } from '@angular/forms';

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
export class AddDocumentComponent implements OnInit {

  constructor(private documentService: DocumentService) { }

  addSuccessfully: boolean;
  notCreated: boolean;
  author = '';
  description = '';
  valueType = '';
  name = '';
  id: number;

  types: Type[] = [
    { valueType: 'txt' },
    { valueType: 'pdf' },
    { valueType: 'doc' },
    { valueType: 'docs' }
  ];

  onSubmit(form: NgForm) {
    const newDocument = {
      Name: this.name, Description: this.description, Type: this.valueType, Author: this.author
    };
    this.documentService.createDocument(newDocument as Document).subscribe(
      resp => {
        if (resp.status === 200) {
          this.addSuccessfully = true;
        }
        else {
          this.addSuccessfully = false;
        }
      }
    );
  }

  ngOnInit() {
  }

}
