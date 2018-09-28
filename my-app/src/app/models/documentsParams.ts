export class DocumentParams {
    criterion: string;
    direction: string;
    searchValue: string;
    pageNumber: number;
    pageSize: number;

    constructor(criterion: string, direction: string, searchValue: string, pageNumber: number, pageSize: number ) {
        this.criterion = criterion;
        this.direction = direction;
        this.searchValue = searchValue;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}