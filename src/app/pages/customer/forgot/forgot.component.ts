/*
    Forgot Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { CommonService, CustomerService } from 'src/app/@core/services'
import { TranslationService } from 'src/app/languages'

// Essential Variables and Annotations
@Component({
    selector: 'app-forgot',
    templateUrl: './forgot.component.html'
})

// Export Modules
export class ForgotComponent implements OnInit {
    staticContent

    forgotStep = 0

    customerEmail = ''
    customerOTP = ''
    customerPassword = ''

    constructor(
        private commonService: CommonService,
        private translationService: TranslationService,
        private customerService: CustomerService
    ) {
    }

    ngOnInit() {
        this.commonService
            .onSelectedLanguageChange()
            .subscribe(() => {
                this.updateTranslation(this.translationService.getForgotTranslations())
            })
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Go to login
    login() {
        this.commonService.navigate('pages/login')
    }

    // Go to previous step
    back() {
        if (this.forgotStep != 0) {
            this.forgotStep = 0
        }
    }

    // Forgot password function with Otp validation
    forgot() {
        if (this.forgotStep == 0) {
            this.commonService.setSpinnerVisibility(true)

            this.customerService
                .sendOTPForgotCustomer(this.customerEmail)
                .subscribe(res => {
                    if (res['status'] == 200) {
                        this.forgotStep = 1
                        this.commonService.showToast('success', res['message'], '')
                    } else {
                        this.commonService.showToast('error', res['message'], '')
                    }
                    this.commonService.setSpinnerVisibility(false)
                })
        } else {
            this.commonService.setSpinnerVisibility(true)

            this.customerService
                .forgotPassword(this.customerEmail, this.customerOTP, this.customerPassword)
                .subscribe(res => {
                    if (res['status'] == 200) {
                        this.commonService.showToast('success', res['message'], '')
                        this.login()
                    } else {
                        this.commonService.showToast('error', res['message'], '')
                    }
                    this.commonService.setSpinnerVisibility(false)
                })
        }
    }
}
