import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL_TOKEN } from './config';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  constructor(
    @Inject(BASE_URL_TOKEN) private baseUrl: string
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> { 
    req.clone({responseType: 'json'});
    const headers: HttpHeaders = req.headers.append('Content-type', 'json')
    const jsonReq = req.clone(
      {
        headers,
        url: `${req.url}`
      }
    );
    return next.handle(jsonReq)
      .pipe(
        filter(this.isHttpResponse),
        map((res) => res.clone({body: res.body && res.body.data}))
      );
  }

  private isHttpResponse(event: HttpEvent<any>): event is HttpResponse<any> {
    if (event instanceof HttpResponse) {
      return true;
    }
    return false;
  }
}
