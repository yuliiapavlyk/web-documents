import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSelect, MatSnackBar } from '@angular/material';

import { DocumentService } from '../services/document.service';
import { Document } from '../../shared/models';

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
    public dialogRef: MatDialogRef<AddDocumentComponent>, public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Document,
    private renderer: Renderer2,
    public dialog: MatDialog
  ) { }
  @ViewChild('file') inputFile: ElementRef;
  @ViewChild(MatSelect) Select: MatSelect;
  public files: Set<File> = new Set();
  accept: string = 'None';
  addSuccessfully: boolean;
  notCreated: boolean;
  regexp: RegExp = new RegExp('^[^><:"/|?*\]+(.doc|.docx|.pdf|.txt)$');
  author: string = '';
  description: string = '';
  valueType: string = '';
  name: string = '';
  id: number;
  newDocuments: Document;
  uploadFile: File;
  formData: FormData = new FormData();
  private unsubscribe$ = new Subject();

  onSubmit(form: NgForm, event): void {
    const newDocument = {
      Name: this.name, Description: this.description, Type: this.uploadFile.name.split('.').pop().toString(), Author: this.author
    };
    console.log(newDocument.Name);
    this.documentService.createDocument(newDocument as Document)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        resp => {
          if (resp.status === 201) {
            this.documentService.uploadDocument(this.formData).subscribe();

            this.addSuccessfully = true;
            this.dialogRef.close(resp.body);
          }
          else {
            this.addSuccessfully = false;
            this.dialogRef.close(null);
          }
        }
      );
  }

  ngOnInit() {
  }

  onFilesAdded(event) {
    const selected: File = event.target.files[0];
    if (selected == null) {
      if (this.formData) {
        return null;
      }
      this.snackBar.open('You should choose  the file', '', {
        duration: 2000
      });
      this.addSuccessfully = false;
      return null;
    }

    if (this.regexp.test(selected.name)) {

      this.uploadFile = selected;
      this.name = this.uploadFile.name.slice(0, this.uploadFile.name.lastIndexOf('.'));
      this.formData = new FormData();
      this.formData.append('uploadFile', this.uploadFile, this.uploadFile.name);
      this.addSuccessfully = true;

    } else {
      this.openSnackBar();
      this.addSuccessfully = false;
      return null;

    }
  }

  setAccept(event): void {
    this.renderer.setProperty(this.inputFile.nativeElement, 'accept', event.value );
      const element: HTMLElement = this.inputFile.nativeElement as HTMLElement;
    this.Select.value = this.accept;
    element.click();
  }

  openSnackBar(): void {
    this.snackBar.open(' Type could be only [txt, pdf, doc, docx] and Name without[><:"/|?*\] ', 'Ok', {
      duration: 4000
    });
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
