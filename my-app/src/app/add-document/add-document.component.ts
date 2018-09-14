import { Component, OnInit } from '@angular/core';
import { ResponseOptions } from '@angular/http';

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
  notCreated:boolean;
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


  checkInputFields(name, description, valueType, author) {
      if (this.name.trim().length === 0 || this.description.trim().length === 0 || this.valueType.trim().length === 0  || this.author.trim().length===0) {
      alert('You must enter data for creating document');
      this.addSuccessfully = false;
    }
  }
  addDocument() {
    this.checkInputFields(this.name, this.description, this.valueType, this.author);
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