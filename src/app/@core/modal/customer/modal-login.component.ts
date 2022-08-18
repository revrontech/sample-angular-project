/*
    Modal Login Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CommonService, CustomerService } from '../../services'
import { TranslationService } from 'src/app/languages'
import { environment } from 'src/environments/environment'
import { ModalCartComponent } from '../catalog/modal-cart.component'
import { ModalRegisterComponent } from './modal-register.component'
import { ModalForgotComponent } from './modal-forgot.component'
import { ModalPseudoComponent } from './modal-pseudo.component'

// Essential Variables and Annotations
@Component({
    selector: 'app-modal-login',
    templateUrl: './modal-login.component.html'
})

// Export Modules
export class ModalLoginComponent implements OnInit {

    staticContent

    brandLogo = 'assets/logo.png'

    customerEmail = ""
    customerPassword = ""
    rememberMe = false

    fromWhere = ''

    showSkip = true

    constructor(public modal: NgbActiveModal,
        private modalService: NgbModal,
        private commonService: CommonService,
        private customerService: CustomerService,
        private translationService: TranslationService) { }

    ngOnInit() {
        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getLoginTranslations())
        })

        this.commonService.onBrandChange().subscribe(data => {
            if (Object.entries(data).length > 0) {
                this.brandLogo = (data.asset.logo) ? data.asset.logo : 'assets/logo.png'
            }
        })

        this.fromWhere = this.commonService.getFromWhereToLogin().slice()
        this.commonService.setFromWhereToLogin('')
        this.commonService.setCustomerPseudo('')

        this.showSkip = !(this.fromWhere == '')
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Login with email and password
    login() {
        this.commonService.setSpinnerVisibility(true)
        this.customerService.loginCustomer(this.customerEmail, this.customerPassword, this.rememberMe).subscribe(res => {
            if (res['status'] == 200) {
                this.commonService.setCustomerAuth(res['data'])
                localStorage.setItem(environment.keys.customer, btoa(unescape(encodeURIComponent(JSON.stringify(res['data'])))))
                this.navigateTo()
            } else {
                this.commonService.showToast('error', res['message'], '')
            }
            this.commonService.setSpinnerVisibility(false)
        })
    }

    // Go to requested pages
    navigateTo() {
        this.modal.close()
        this.commonService.navigate('/pages/' + (this.fromWhere == '' ? 'catalog' : this.fromWhere))
    }

    // Go to forgot password
    forgot() {
        this.modal.close()
        this.commonService.setFromWhereToLogin(this.fromWhere)
        this.modalService.open(ModalForgotComponent, { windowClass: 'bill-modal signup', scrollable: true, centered: true })
    }

    // Go to register
    register() {
        this.modal.close()
        this.commonService.setFromWhereToLogin(this.fromWhere)
        this.modalService.open(ModalRegisterComponent, { windowClass: 'bill-modal signup', scrollable: true, centered: true })
    }

    // Go to Pseudo Page
    pseudo() {
        this.modal.close()
        this.commonService.setFromWhereToLogin(this.fromWhere)
        this.modalService.open(ModalPseudoComponent, { windowClass: 'bill-modal signup', scrollable: true, centered: true })
    }

    // Open Cart Modal
    openCart() {
        this.modal.close()
        this.commonService.setFromWhereToLogin(this.fromWhere)
        this.modalService.open(ModalCartComponent, { windowClass: 'bill-modal', scrollable: true, centered: true })
    }
}