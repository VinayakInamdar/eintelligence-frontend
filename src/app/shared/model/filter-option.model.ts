export class FilterOptionModel {
    pageNumber: number;
    pageSize: number;
    searchQuery: string;
    orderBy: string;
    fields: string;

    constructor(data?) {
        data = data || {};
        this.pageNumber = data.pageNumber || 1;
        this.pageSize = data.pageSize || 20;
        this.searchQuery = data.searchQuery || '';
        this.orderBy = data.orderBy || '';
        this.fields = data.fields || '';
    }
}
