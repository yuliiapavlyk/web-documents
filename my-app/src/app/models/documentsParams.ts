export class DocumentParams {
    criterion: string;
    direction: string;
    searchValue: string;
    constructor(criterion: string, direction: string, searchValue: string ) {
        this.criterion = criterion;
        this.direction = direction;
        this.searchValue = searchValue;
    }
}