/*
    Single Product Menu Mobile Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CommonService } from '../../services'
import { ModalCartComponent, ModalMenuComponent } from '../../modal'

// Essential Variables and Annotations
@Component({
    selector: 'app-header-single-mobile',
    templateUrl: './header-single-mobile.component.html',
    styleUrls: ['./header-single-mobile.component.scss']
})

// Export Modules
export class HeaderSingleMobileComponent implements OnInit {

    brandLogo = 'assets/logo.png'
    allowOrder: boolean
    cartListSize: number = 0

    constructor(private modalService: NgbModal,
        private commonService: CommonService) { }

    ngOnInit() {
        this.allowOrder = this.commonService.getAllowOrder()

        this.commonService.onBrandChange().subscribe(data => {
            if (Object.entries(data).length > 0) {
                this.brandLogo = (data.asset.logo) ? data.asset.logo : 'assets/logo.png'
            }
        })
        this.commonService.onCartItemListChange().subscribe(cartList => {
            this.cartListSize = 0
            cartList.forEach(cartElement => {
                this.cartListSize += cartElement.quantity
            });
        })
    }

    openModal(selection) {
        if (selection == 'menu') {
            this.modalService.open(ModalMenuComponent, { windowClass: 'bill-modal', scrollable: true, centered: true })
        } else if (selection == 'cart') {
            this.modalService.open(ModalCartComponent, { windowClass: 'bill-modal', scrollable: true, centered: true })
        }
    }
}
