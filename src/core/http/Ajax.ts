class Ajax {

    private _options: { url: string, method?: AjaxMethod, data?: any, query?: any } = {
        url: '',
        method: AjaxMethod.Get
    };
    private _response: AjaxResponse = new AjaxResponse();
    private _success: (response: AjaxResponse) => void;
    private _complete: (response: AjaxResponse) => void;
    private _error: (response: AjaxResponse) => void;

    public static request(options: { url: string, method?: AjaxMethod, data?: any, query?: any } | string): Ajax {
        let http = new Ajax();
        http.options(options);
        http.makeRequest();
        return http;
    }

    public success(callback: (response: AjaxResponse) => void): this {
        this._success = callback;
        return this;
    }

    public complete(callback: (response: AjaxResponse) => void): this {
        this._complete = callback;
        return this;
    }

    public error(callback: (response: AjaxResponse) => void): this {
        this._error = callback;
        return this;
    }

    private options(options) {
        var opts: { url: string, method?: AjaxMethod, data?: any, query?: any } = {
            url: '',
            method: AjaxMethod.Get
        };
        if (typeof options == 'string') {
            opts.url = options;
            opts.method = AjaxMethod.Get;
        } else {
            opts = options;
            opts.method = !options.method ? AjaxMethod.Get : options.method;
        }
        this._options = opts;
    }

    private makeRequest() {
        let method = this._options.method == AjaxMethod.Get ? 'GET' : 'POST';
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                this._response['_code'] = xhttp.status;
                let headers = xhttp.getAllResponseHeaders().split('\n');
                headers.forEach(header => {
                    header = header.trim();
                    if (header.length > 0) {
                        let keyval = header.split(':', 2);
                        if (keyval.length == 2) {
                            let httpHeader = new AjaxHeader(keyval[0].trim(), keyval[1].trim());
                            this._response.headers.push(httpHeader);
                        }
                    }
                });
                if (this._response.getHeaderValue('Content-Type').match(/\/json$/i)) {
                    this._response['_data'] = JSON.parse(xhttp.responseText);
                } else {
                    this._response['_data'] = xhttp.responseText;
                }
            }
            if (xhttp.readyState == 4 && xhttp.status == 200 && typeof this._success == 'function') {
                this._success(this._response);
            } else if (xhttp.readyState == 4 && xhttp.status != 200 && typeof this._error == 'function') {
                this._error(this._response);
            }

            if (xhttp.readyState == 4 && typeof this._complete == 'function') {
                this._complete(this._response);
            }
        };

        // Build the query string
        let querystring: string[] = [];
        if (this._options.method == AjaxMethod.Get) {
            querystring.push(serialize(this._options.data));
        }
        if (this._options.query) {
            querystring.push(serialize(this._options.query));
        }

        // Send the request
        xhttp.open(method, this._options.url + (querystring.length > 0 ? '?' + querystring.join('&') : ''));
        if (this._options.method != AjaxMethod.Get) {
            xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhttp.send(JSON.stringify(this._options.data));
        } else {
            xhttp.send();
        }
    }

}

class AjaxResponse {
    private _headers: AjaxHeader[] = [];
    private _data: Object = null;
    private _code: number = null;

    public get data(): Object {
        return this._data;
    }

    public get code(): number {
        return this._code;
    }

    public get headers(): AjaxHeader[] {
        return this._headers;
    }

    public get contentType(): string | null {
        return this.getHeaderValue('Content-Type');
    }

    public get contentLength(): string | null {
        return this.getHeaderValue('Content-Length');
    }

    public get server(): string | null {
        return this.getHeaderValue('Server');
    }

    public get date(): string | null {
        return this.getHeaderValue('Date');
    }

    public get lastModified(): string | null {
        return this.getHeaderValue('Last-Modified');
    }

    public getHeader(key: string): AjaxHeader | null {
        for (let i = 0, l = this.headers.length; i < l; i++) {
            if (this.headers[i].name.toLowerCase() == key.toLowerCase()) {
                return this.headers[i];
            }
        }
        return null;
    }

    public getHeaderValue(key: string): string | null {
        let header = this.getHeader(key);
        if (header instanceof AjaxHeader) {
            return header.value;
        }
        return null;
    }
}

class AjaxHeader {
    private _name: string = '';
    private _value: string = '';

    public get name(): string { return this._name }
    public get value(): string { return this._value; }

    public constructor(name, value) {
        this._name = name;
        this._value = value;
    }
}