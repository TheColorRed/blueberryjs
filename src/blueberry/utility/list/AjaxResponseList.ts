interface AjaxResponseObject {
    headers: AjaxHeader[]
}
class AjaxResponseList extends List<AjaxResponse> {

    public get(index: number): AjaxResponse {
        return this.list[index];
    }

    public get responses(): Object[] {
        let data: Object[] = [];
        this.each(item => {
            item = <any>item.data;
            if (Array.isArray(item)) {
                item.forEach(itm => data.push(itm));
            } else {
                data.push(item);
            }
        });
        return data;
    }

    public findInEach(key: string): Object[] {
        let data: Object[] = [];
        this.each(item => {
            data.push(Blueberry.query(key, item.data));
        });
        return data;
    }

    public getResponseHeaders(index: number): AjaxHeader[] | null {
        let resp = this.list[index];
        if (!resp) { return null; }
        return resp.headers;
    }

    public get headers(): Object[] {
        let headers: Object[] = [];
        this.each(item => {
            headers.push(item.headers);
            // if (Array.isArray(item.headers)) {
            //     item.headers.forEach(itm => headers.push(itm));
            // } else {
            //     headers.concat(item.headers);
            // }
        });
        return headers;
    }

}