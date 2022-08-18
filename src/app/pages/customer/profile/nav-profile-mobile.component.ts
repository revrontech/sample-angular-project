/*
    Nav Profile Mobile Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { CommonService, CustomerService } from 'src/app/@core/services';
import { TranslationService } from 'src/app/languages';
import { environment } from 'src/environments/environment';

// Essential Variables and Annotations
@Component({
    selector: 'app-nav-profile-mobile',
    templateUrl: './nav-profile-mobile.component.html'
})

// Export Modules
export class NavProfileMobileComponent implements OnInit {
    staticContent

    customerName = ''
    customerInitials = ''

    constructor(private commonService: CommonService,
        private translationService: TranslationService) { }

    ngOnInit() {
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

    // go to profile
    profile() {
        this.commonService.navigate('pages/profile')
    }

    // go to my orders
    myorders() {
        this.commonService.navigate('pages/my-orders')
    }

    // go to my qr code
    myqrcode() {
        this.commonService.navigate('pages/my-qr-code')
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

    // Go to catalog
    takeHome() {
        this.commonService.navigate('pages/catalog')
    }
}