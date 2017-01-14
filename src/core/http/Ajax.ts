class Ajax {

    private _options: { url: string, method?: HttpMethod, data?: any };
    private _response: HttpResponse = new HttpResponse();
    private _success: (response: HttpResponse) => void;
    private _complete: (response: HttpResponse) => void;
    private _error: (response: HttpResponse) => void;

    public static request(options: { url: string, method?: HttpMethod, data?: any }): Ajax {
        let http = new Ajax();
        http.options(options);
        http.makeRequest();
        return http;
    }

    public success(callback: (response: HttpResponse) => void): this {
        this._success = callback;
        return this;
    }

    public complete(callback: (response: HttpResponse) => void): this {
        this._complete = callback;
        return this;
    }

    public error(callback: (response: HttpResponse) => void): this {
        this._error = callback;
        return this;
    }

    private options(options) {
        this._options = options;
    }

    private makeRequest() {
        let method = this._options.method == HttpMethod.Get ? 'GET' : 'POST';
        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4) {
                this._response.code = xhttp.status;
                let headers = xhttp.getAllResponseHeaders().split('\n');
                headers.forEach(header => {
                    header = header.trim();
                    if (header.length > 0) {
                        let keyval = header.split(':', 2);
                        if (keyval.length == 2) {
                            let httpHeader = new HttpHeader();
                            httpHeader.name = keyval[0].trim();
                            httpHeader.value = keyval[1].trim();
                            this._response.headers.push(httpHeader);
                        }
                    }
                });
                if (this._response.getHeaderValue('Content-Type').match(/\/json$/i)) {
                    this._response.data = JSON.parse(xhttp.responseText);
                } else {
                    this._response.data = xhttp.responseText;
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

        xhttp.open(method, this._options.url);
        if (this._options.method != HttpMethod.Get) {
            xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhttp.send(JSON.stringify(this._options.data));
        } else {
            xhttp.send();
        }
    }

}

class HttpResponse {
    public headers: HttpHeader[] = [];
    public data = null;
    public code: number = null;

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

    public getHeader(key: string): HttpHeader | null {
        for (let i = 0, l = this.headers.length; i < l; i++) {
            if (this.headers[i].name.toLowerCase() == key.toLowerCase()) {
                return this.headers[i];
            }
        }
        return null;
    }

    public getHeaderValue(key: string): string | null {
        let header = this.getHeader(key);
        if (header instanceof HttpHeader) {
            return header.value;
        }
        return null;
    }
}

class HttpHeader {
    public name: string = '';
    public value: string = '';
}