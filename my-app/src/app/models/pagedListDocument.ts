import {Document} from '../models/document';

export class PagedListDocument {
    PageNumber:number;
    Items:Document[];
    PageSize:number;
    NumberOfPages:number;
}
