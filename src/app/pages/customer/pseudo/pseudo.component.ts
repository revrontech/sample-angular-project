/*
    Pseudo Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { CommonService, CustomerService } from 'src/app/@core/services'
import { TranslationService } from 'src/app/languages'

// Essential Variables and Annotations
@Component({
    selector: 'app-pseudo',
    templateUrl: './pseudo.component.html'
})

// Export Modules
export class PseudoComponent implements OnInit {
    staticContent

    customerEmail = ""
    customerOTP = "852456"

    validateStep = 0

    constructor(private commonService: CommonService,
        private translationService: TranslationService,
        private customerService: CustomerService) { }

    ngOnInit() {
        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getPseudoTranslations())
        })
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Go back to previous step
    goBack() {
        if (this.validateStep != 0) {
            this.validateStep = 0
        } else {
            this.commonService.goBack()
        }
    }

    // Vaildation function for email
    validate() {
        if (this.validateStep == 1) {
            this.commonService.setSpinnerVisibility(true)

            this.customerService.sendOTPCustomer(this.customerEmail).subscribe(res => {
                if (res['status'] == 200) {
                    this.validateStep = 1
                    this.commonService.showToast('success', res['message'], '')
                } else {
                    this.commonService.showToast('error', res['message'], '')
                }
                this.commonService.setSpinnerVisibility(false)
            })
        } else {
            this.commonService.setSpinnerVisibility(true)

            this.customerService.pseudoCustomer(this.customerEmail, this.customerOTP).subscribe(res => {
                if (res['status'] == 200) {
                    this.commonService.showToast('success', res['message'], '')
                    this.commonService.setCustomerPseudo(this.customerEmail)
                    this.commonService.navigate('/pages/order')
                } else {
                    this.commonService.showToast('error', res['message'], '')
                }
                this.commonService.setSpinnerVisibility(false)
            })
        }
    }
}