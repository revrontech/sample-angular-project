/*
    Side Profile Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { CommonService } from 'src/app/@core/services';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/languages';
import { environment } from 'src/environments/environment';

// Essential Variables and Annotations
@Component({
    selector: 'app-side-profile',
    templateUrl: './side-profile.component.html'
})

// Export Modules
export class SideProfileComponent implements OnInit {
    staticContent

    profileSelected = ''
    myordersSelected = ''
    walletSelected = ''
    customerName = ''
    customerInitials = ''

    constructor(private commonService: CommonService,
        private translationService: TranslationService,
        private router: Router) { }

    ngOnInit() {
        this.checkActive()

        var customerData = this.commonService.getCustomerAuth()
        this.customerName = customerData.firstname + ' ' + customerData.lastname
        this.customerInitials = customerData.firstname.toUpperCase().substr(0, 1) + customerData.lastname.toUpperCase().substr(0, 1)

        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getProfileTranslations())
        })
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Select Active as per navigation
    checkActive(): void {
        this.profileSelected = ''
        this.myordersSelected = ''
        this.walletSelected = ''
        switch (this.router.url.split('/').reverse()[0]) {
            case 'my-orders':
                this.myordersSelected = 'active'
                break
            case 'wallet':
                this.walletSelected = 'active'
                break
            default:
                this.profileSelected = 'active'
                break
        }
    }

    // go to profile
    profile() {
        this.commonService.navigate('pages/profile')
    }

    // go to my orders
    myorders() {
        this.commonService.navigate('pages/my-orders')
    }

    // go to wallet
    wallet() {
        this.commonService.navigate('pages/wallet')
    }

    // Logout
    logout() {
        this.commonService.clearCustomerAuth()
        localStorage.removeItem(environment.keys.customer)
        this.commonService.navigate('pages/catalog')
    }
}