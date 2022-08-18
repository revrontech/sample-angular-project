/*
    Authorization Service
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Injectable } from '@angular/core'
import { JwtHelperService } from '@auth0/angular-jwt'
import { CommonService } from '../common.service'

// Export injectable module
@Injectable()
export class AuthService {

    public COMPANY_TOKEN_LOCATION = 'token0'
    public CUSTOMER_TOKEN_LOCATION = 'token1'

    constructor(private commonService: CommonService) { }

    isAuthenticated(type): boolean {
        const jwtHelperService = new JwtHelperService()

        const token = (type == this.COMPANY_TOKEN_LOCATION) ?
            this.commonService.getCompanyAuth().auth_key : ((type == this.CUSTOMER_TOKEN_LOCATION) ? this.commonService.getCustomerAuth().auth_key : '')

        try {
            return !jwtHelperService.isTokenExpired(token)
        } catch (e) {
            return false
        }
    }
}