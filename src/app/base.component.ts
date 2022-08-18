/*
    Base Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from '@angular/core'
import { CommonService, BrandService, GlobalService } from './@core/services'
import { environment } from 'src/environments/environment'

// Essential Variables and Annotations
@Component({
    selector: 'base-app',
    template: ``
})

// Export Modules
export class BaseComponent implements OnInit {

    constructor(
        private commonService: CommonService,
        private globalService: GlobalService,
        private brandService: BrandService,
    ) {
    }

    // Checking Brand and Company Subdomain Details
    ngOnInit(): void {

        if (window.location.hostname.indexOf(environment.base_url) > -1) {
            var subdomains = window.location.hostname.replace(environment.base_url, "").split('.')

            subdomains.splice(-1)

            subdomains = subdomains.reverse()
            subdomains.push('')

            // console.log(subdomains)

            if (subdomains.length > 1 && subdomains.length < 4) {

                this.globalService.fetchCompanyAccessToken(subdomains[0]).subscribe(res => {
                    if (res['status'] == 200) {
                        this.commonService.setCompanyAuth(res['data'])
                        localStorage.setItem(environment.keys.company, btoa(JSON.stringify(res['data'])))

                        if (subdomains.length == 2) {
                            this.commonService.setBrandId(0)
                            this.commonService.navigate('pages/home')
                        } else {
                            this.brandService.VerifyBrandSubdomain(subdomains[1]).subscribe(res => {
                                // console.log(res)
                                if (res['status'] == 200) {
                                    let brandId = this.commonService.getBrandId();
                                    if (brandId != res['data'].id) {
                                        this.commonService.setBrandId(res['data'].id)
                                    }
                                    // console.log(this.commonService.getBrandId())
                                    if (this.commonService.getConsumerCodeParam() && this.commonService.getIdParam()) {
                                        this.commonService.navigate('pages/scan/' + this.commonService.getConsumerCodeParam() + '/' + this.commonService.getIdParam())
                                    } else if (this.commonService.getTokenParam()) {
                                        this.commonService.navigate('pages/tracking/' + this.commonService.getTokenParam())
                                    } else {
                                        this.commonService.navigate('pages/home')
                                    }
                                }
                            })
                        }
                    } else {
                        //window.location.href = environment.redirect_url
                        // console.log(res)
                    }
                })

            } else {
                //window.location.href = environment.redirect_url
                // console.log(subdomains)
            }
        } else {
            //window.location.href = environment.redirect_url
            // console.log(window.location.hostname.indexOf(environment.base_url))
        }
    }
}
