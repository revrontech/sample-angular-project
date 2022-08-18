/*
    Authorization Service
    Created : 2022
*/

import { Injectable } from "@angular/core"
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs'
import { CommonService } from '../common.service'
import { environment } from 'src/environments/environment'

// Some needed modules --------- trying removing one

// Export injectable module
@Injectable()
export class BearerInterceptor implements HttpInterceptor {

    constructor(private commonService: CommonService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = (req.headers.get("type") == environment.auth_type.company) ? this.commonService.getCompanyAuth().auth_key : ((req.headers.get("type") == environment.auth_type.customer) ? this.commonService.getCustomerAuth().auth_key : '')

        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
        return next.handle(req)
    }

}