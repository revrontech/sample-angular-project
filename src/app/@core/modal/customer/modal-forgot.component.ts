/*
    Modal Forgot Password Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CommonService, CustomerService } from '../../services'
import { TranslationService } from 'src/app/languages'
import { ModalCartComponent } from '../catalog/modal-cart.component'
import { ModalLoginComponent } from './modal-login.component'

// Essential Variables and Annotations
@Component({
    selector: 'app-modal-forgot',
    templateUrl: './modal-forgot.component.html'
})

// Export Modules
export class ModalForgotComponent implements OnInit {

    staticContent

    brandLogo = 'assets/logo.png'

    forgotStep = 0

    customerEmail = ''
    customerOTP = ''
    customerPassword = ''

    constructor(public modal: NgbActiveModal,
        private modalService: NgbModal,
        private commonService: CommonService,
        private customerService: CustomerService,
        private translationService: TranslationService) {
    }

    ngOnInit() {
        this.commonService
            .onSelectedLanguageChange()
            .subscribe(() => {
                this.updateTranslation(this.translationService.getForgotTranslations())
            })

        this.commonService
            .onBrandChange()
            .subscribe(data => {
                if (Object.entries(data).length > 0) {
                    this.brandLogo = (data.asset.logo) ? data.asset.logo : 'assets/logo.png'
                }
            })
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Open Cart Modal
    openCart() {
        this.modal.close()
        this.modalService.open(ModalCartComponent, { windowClass: 'bill-modal', scrollable: true, centered: true })
    }

    // Go to login
    login() {
        this.modal.close()
        this.modalService.open(ModalLoginComponent, { windowClass: 'bill-modal signup', scrollable: true, centered: true })
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
