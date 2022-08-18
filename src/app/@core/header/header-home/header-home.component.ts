/*
    Home Header Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, Input, OnInit } from "@angular/core"
import { CommonService } from '../../services'

// Essential Variables and Annotations
@Component({
    selector: 'app-header-home',
    templateUrl: './header-home.component.html'
})

// Export Modules
export class HeaderHomeComponent implements OnInit {

    @Input() checkBlock: any
    @Input() enableOrderButton: boolean = false

    companyNameFirst: string = ''
    companyNameLast: string = ''
    brandLogo: string = ''
    icon: string = ''

    constructor(private commonService: CommonService) { }

    ngOnInit() {
        if (this.commonService.getBrandId() == 0) {
            this.commonService.onCompanyAuthChange().subscribe(data => {
                let companyName = (data.company == '') ? 'Awesome restaurant' : data.company

                this.companyNameFirst = companyName.split(' ')[0]
                this.companyNameLast = companyName.split(' ').splice(1).join(' ')
            })
        } else {
            this.commonService.onBrandChange().subscribe(data => {
                if (Object.keys(data).length > 0) {
                    this.icon = data.asset.icon
                    let companyName = data.brand_label
                    this.companyNameFirst = companyName.split(' ').slice(0, -1).join(' ')
                    this.companyNameLast = companyName.split(' ').splice(-1).join(' ')
                }
            })
        }
    }

    navigateRestaurantHome() {
        this.commonService.navigate('pages/home')
    }

    homeListener() {
        if (!this.checkBlock) {
            var host = window.location.hostname
            window.location.href = "https://" + ((host.split('.').slice(1)).join('.'))
        }
    }
}