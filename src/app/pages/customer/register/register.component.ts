/*
    Register Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { CommonService, CustomerService } from 'src/app/@core/services';
import { TranslationService } from 'src/app/languages';

// Essential Variables and Annotations
@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})

// Export Modules
export class RegisterComponent implements OnInit {
    staticContent

    registerStep = 0
    termsOfUse = false

    firstName = ''
    lastName = ''
    customerEmail = ''
    customerPhone = ''
    customerPassword = ''
    customerOTP = ''

    constructor(private commonService: CommonService,
        private translationService: TranslationService,
        private customerService: CustomerService) {
    }

    ngOnInit() {
        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getRegisterTranslations())
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
        if (this.registerStep != 0) {
            this.registerStep = 0
        }
    }

    // Register function for email otp validation and sending
    register() {
        if (this.registerStep == 0) {
            this.commonService.setSpinnerVisibility(true)

            this.customerService
                .sendOTPCustomer(this.customerEmail, this.firstName, this.lastName)
                .subscribe(res => {
                    if (res['status'] == 200) {
                        this.registerStep = 1
                        this.commonService.showToast('success', res['message'], '')
                    } else {
                        this.commonService.showToast('error', res['message'], '')
                    }
                    this.commonService.setSpinnerVisibility(false)
                })
        } else {
            this.commonService.setSpinnerVisibility(true)

            this.customerService.registerCustomer(this.customerEmail, this.customerPassword, this.firstName, this.lastName, this.customerPhone, this.customerOTP).subscribe(res => {
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
