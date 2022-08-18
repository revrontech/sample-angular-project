/*
    Login Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { CommonService, CustomerService } from 'src/app/@core/services'
import { TranslationService } from 'src/app/languages'
import { environment } from 'src/environments/environment'

// Essential Variables and Annotations
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html'
})

// Export Modules
export class LoginComponent implements OnInit {
    staticContent

    customerEmail = ""
    customerPassword = ""
    rememberMe = false

    fromWhere = ''

    showSkip = true

    constructor(private commonService: CommonService,
        private translationService: TranslationService,
        private customerService: CustomerService) { }

    ngOnInit() {
        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getLoginTranslations())
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
        this.commonService.navigate('/pages/' + (this.fromWhere == '' ? 'catalog' : this.fromWhere))
    }

    // Go to forgot password
    forgot() {
        this.commonService.setFromWhereToLogin(this.fromWhere)
        this.commonService.navigate('/pages/forgot')
    }

    // Go to register
    register() {
        this.commonService.setFromWhereToLogin(this.fromWhere)
        this.commonService.navigate('/pages/register')
    }

    // Go to Pseudo Page
    pseudo() {
        this.commonService.setFromWhereToLogin(this.fromWhere)
        this.commonService.navigate('/pages/pseudo')
    }
}