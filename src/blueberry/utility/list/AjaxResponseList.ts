class AjaxResponseList extends List<AjaxResponse> {

    public allData(key?: string): Object[] {
        let data: Object[] = [];
        this.each(item => {
            if (key) {
                item = Blueberry.query(key, item.data);
            } else {
                item = <any>item.data;
            }
            if (Array.isArray(item)) {
                item.forEach(itm => data.push(itm));
            } else {
                data.push(item);
            }
        });
        return data;
    }

    public get allHeaders(): AjaxHeader[] {
        let headers: AjaxHeader[] = [];
        this.each(item => {
            if (Array.isArray(item.headers)) {
                item.headers.forEach(itm => headers.push(itm));
            } else {
                headers.concat(item.headers);
            }
        });
        return headers;
    }

}