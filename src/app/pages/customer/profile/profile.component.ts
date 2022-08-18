/*
    Profile Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { CommonService, CustomerService } from 'src/app/@core/services';
import { TranslationService } from 'src/app/languages';
import { environment } from 'src/environments/environment';
import { CustomerData } from 'src/app/@core/dataModel/base.data';

// Essential Variables and Annotations
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html'
})

// Export Modules
export class ProfileComponent implements OnInit {
    staticContent

    editing = false

    firstName = ''
    lastName = ''
    customerPhone = ''
    customerEmail = ''
    customerPassword = ''
    currentPassword = ''
    customerInitials = ''

    customerDetails: CustomerData

    constructor(private commonService: CommonService,
        private translationService: TranslationService,
        private customerService: CustomerService) { }

    ngOnInit() {
        this.customerDetails = JSON.parse(JSON.stringify(this.commonService.getCustomerAuth()))
        this.firstName = this.customerDetails.firstname
        this.lastName = this.customerDetails.lastname
        this.customerPhone = this.customerDetails.phone
        this.customerEmail = this.customerDetails.email

        this.customerInitials = this.customerDetails.firstname.toUpperCase().substr(0, 1) + this.customerDetails.lastname.toUpperCase().substr(0, 1)

        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getProfileTranslations())
        })
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Update Profile
    update() {
        this.commonService.setSpinnerVisibility(true)

        this.customerService.updateCustomer(this.customerEmail, this.firstName, this.lastName, this.customerPhone).subscribe(res => {
            if (res['status'] == 200) {
                this.commonService.showToast('success', res['message'], '')
                this.customerDetails.firstname = this.firstName
                this.customerDetails.lastname = this.lastName
                this.customerDetails.phone = this.customerPhone
                this.commonService.setCustomerAuth(this.customerDetails)
                localStorage.setItem(environment.keys.customer, btoa(unescape(encodeURIComponent(JSON.stringify(this.customerDetails)))))
            } else {
                this.commonService.showToast('error', res['message'], '')
            }

            this.commonService.setSpinnerVisibility(false)
        })

        if (this.currentPassword != '' && this.customerPassword != '') {
            this.customerService.updateCustomerPassword(this.customerPassword, this.currentPassword).subscribe(res => {
                if (res['status'] == 200) {
                    this.commonService.showToast('success', res['message'], '')
                } else {
                    this.commonService.showToast('error', res['message'], '')
                }
            })
        }
    }

    // Edit details
    edit() {
        this.editing = true
    }

    // Cancel edit
    cancel() {
        this.editing = false
    }

    // Go to catalog
    takeHome() {
        if (this.editing) {
            this.editing = false
        } else {
            this.commonService.navigate('pages/nav-profile')
        }
    }
}