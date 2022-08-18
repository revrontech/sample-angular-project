/*
    Modal Pseudo Component
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
    selector: 'app-modal-pseudo',
    templateUrl: './modal-pseudo.component.html'
})

// Export Modules
export class ModalPseudoComponent implements OnInit {

    staticContent

    brandLogo = 'assets/logo.png'

    customerEmail = ""
    customerOTP = "852456"

    validateStep = 0

    constructor(public modal: NgbActiveModal,
        private modalService: NgbModal,
        private commonService: CommonService,
        private customerService: CustomerService,
        private translationService: TranslationService) { }

    ngOnInit() {
        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getPseudoTranslations())
        })

        this.commonService.onBrandChange().subscribe(data => {
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

    // Go back to previous step
    goBack() {
        if (this.validateStep != 0) {
            this.validateStep = 0
        } else {
            this.modal.close()
            this.modalService.open(ModalLoginComponent, { windowClass: 'bill-modal signup', scrollable: true, centered: true })
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
                    this.modal.close()
                    this.commonService.navigate('/pages/order')
                } else {
                    this.commonService.showToast('error', res['message'], '')
                }
                this.commonService.setSpinnerVisibility(false)
            })
        }
    }
}