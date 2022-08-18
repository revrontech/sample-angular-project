/*
    Error Service
    Created : 2022
*/

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router'
import { CommonService } from '../common.service'
import { environment } from 'src/environments/environment'

// Some needed modules --------- trying removing one

// Export injectable module
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router, private commonService: CommonService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // let token = localStorage.getItem[req.headers["type"]]
        const token = (req.headers.get("type") == environment.auth_type.company) ? this.commonService.getCompanyAuth().auth_key : ((req.headers.get("type") == environment.auth_type.customer) ? this.commonService.getCustomerAuth().auth_key : '')

        return next.handle(req).pipe(catchError(err => {
            //if (token && (err.status == 0 || err.status == 302 || (err.status == 401 && err.statusText == "Unauthorized"))) {
            if (token && (err.status == 0 || err.status == 302)) {
                localStorage.clear()
                sessionStorage.clear()
                //this.router.navigate(['/home'])
                if (this.router.url != 'pages/home') {
                    this.router.navigate(["pages/home"]);
                }
            }
            return throwError(err)
        }))
    }
}