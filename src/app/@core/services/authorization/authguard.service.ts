/*
    Authorization Guard Service
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from './auth.service'
import { CommonService } from '../common.service'

// Export injectable module
@Injectable()
export class AuthGuardCompany implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate() {
        if (this.authService.isAuthenticated(this.authService.COMPANY_TOKEN_LOCATION)) {
            return true
        }
        this.router.navigate(['/'])
        return false
    }
}

@Injectable()
export class AuthGuardCatalog implements CanActivate {
    constructor(private commonService: CommonService, private router: Router) { }

    canActivate() {
        if (this.commonService.getSubscription()['subscriptionId']) {
            return true
        }
        this.router.navigate(['/pages/home'])
        return false
    }
}

@Injectable()
export class AuthGuardCustomer implements CanActivate {
    constructor(private authService: AuthService) { }

    canActivate() {
        if (this.authService.isAuthenticated(this.authService.CUSTOMER_TOKEN_LOCATION)) {
            return true
        }
        // this.router.navigate(['/pages/catalog'])
        return false
    }
}

@Injectable()
export class OrderGuardCustomer implements CanActivate {
    constructor(private authService: AuthService, private commonService: CommonService) { }

    canActivate() {
        if ((this.authService.isAuthenticated(this.authService.CUSTOMER_TOKEN_LOCATION) || (this.commonService.getCustomerPseudo() != '')) && (this.commonService.getCartItemList().length > 0)) {
            return true
        }
        return false
    }
}

@Injectable()
export class DeGuardCustomer implements CanActivate {
    constructor(private authService: AuthService) { }

    canActivate() {
        if (this.authService.isAuthenticated(this.authService.CUSTOMER_TOKEN_LOCATION)) {
            return false
        }
        return true
    }
}

@Injectable()
export class AllowOrderGuard implements CanActivate {
    constructor(private commonService: CommonService) { }

    canActivate() {
        if (this.commonService.checkDeviceParameter(this.commonService.getBrand(), "allow_ordering", '1') == '1') {
            return true
        }
        return false
    }
}