/*
    App Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'
import { CommonService, BrandService, CustomerService } from './@core/services'
import { CompanyData, CustomerData } from './@core/dataModel/base.data'
import { environment } from 'src/environments/environment'
import { ActivatedRoute } from '@angular/router'

// Essential Variables and Annotations
@Component({
    selector: 'sample-angular-project',
    template: `
        <router-outlet></router-outlet>
        <ngx-spinner type="ball-clip-rotate" size="medium"><p class="load-spinner">Chargement...</p></ngx-spinner>`
})

// Export Modules
export class AppComponent implements OnInit {
    title = 'sample-angular-project'

    constructor(
        private spinnerService: NgxSpinnerService,
        private brandService: BrandService,
        private customerService: CustomerService,
        private activatedRoute: ActivatedRoute,
        private commonService: CommonService,
    ) {
    }

    // Local Storage and Initialization of subdomains
    ngOnInit(): void {
        this.activatedRoute.queryParams
            .subscribe(params => {
                if (params.space) {
                    this.commonService.setSpaceParam(params.space)
                }
                if (params.token) {
                    this.commonService.setTokenParam(params.token)
                } else {
                    this.commonService.setTokenParam('')
                }
                if (params.consumer_code && params.id) {
                    this.commonService.setConsumerCodeParam(params.consumer_code)
                    this.commonService.setIdParam(params.id)
                } else {
                    this.commonService.setConsumerCodeParam('')
                    this.commonService.setIdParam('')
                }
            })

        this.commonService
            .onSpinnerVisibilityChange()
            .subscribe(visibility => {
                if (visibility) {
                    this.spinnerService.show()
                } else {
                    this.spinnerService.hide()
                }
            })

        if (window.location.hostname.indexOf(environment.base_url) > -1) {
            var subdomains = window.location.hostname.replace(environment.base_url, "").split('.')

            subdomains.splice(-1)
            subdomains = subdomains.reverse()
            subdomains.push('')

            if (subdomains.length > 1 && subdomains.length < 4) {

                if (subdomains.length != 2) {
                    if (localStorage.getItem(environment.keys.company)) {
                        try {
                            var company_data: CompanyData = JSON.parse(atob(localStorage.getItem(environment.keys.company)))
                            this.commonService.setCompanyAuth(company_data)
                            this.brandService
                                .VerifyBrandSubdomain(subdomains[1])
                                .subscribe(res => {
                                    if (res['status'] == 200) {
                                        this.commonService.setBrandId(res['data'].id)
                                    } else {
                                        localStorage.removeItem(environment.keys.customer)
                                    }
                                })
                        } catch (e) {
                            localStorage.removeItem(environment.keys.customer)
                        }
                    }

                    if (localStorage.getItem(environment.keys.customer)) {
                        try {
                            var user_data: CustomerData = JSON.parse(atob(localStorage.getItem(environment.keys.customer)))
                            this.commonService.setCustomerAuth(user_data)
                            this.customerService
                                .customerDetails()
                                .subscribe(res => {
                                    if (res['status'] == 200) {
                                        user_data.firstname = res['data'].firstname
                                        user_data.lastname = res['data'].lastname
                                        user_data.phone = res['data'].phone
                                        this.commonService.setCustomerAuth(user_data)
                                    } else {
                                        localStorage.removeItem(environment.keys.customer)
                                        this.commonService.setCustomerAuth({ auth_key: "", email: "", firstname: "", lastname: "", phone: "" })
                                    }
                                })
                        } catch (e) {
                            localStorage.removeItem(environment.keys.customer)
                        }
                    }

                }
            }
        }

    }
}
