import {Document} from '../models/document';

export class PagedListDocumentWithMessage {
    PageNumber:number;
    Items:Document[];
    PageSize:number;
    TotalCount:number;
    HasPrevious:boolean;
    HasNext:boolean;
    Message: string;
}
