import { Document } from '../models/document';

export class PagedListDocument {
    PageNumber: number;
    Items: Document[];
    PageSize: number;
    TotalCount: number;
    HasPrevious: boolean;
    HasNext: boolean;
}
