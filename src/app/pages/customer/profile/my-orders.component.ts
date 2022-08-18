/*
    MyOrders Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { CommonService, OrderService } from 'src/app/@core/services';
import { environment } from 'src/environments/environment';
import { TranslationService } from 'src/app/languages';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { stringify } from "@angular/compiler/src/util";

// Essential Variables and Annotations
@Component({
    selector: 'app-my-orders',
    templateUrl: './my-orders.component.html',
    animations: [
        trigger('heightAnimation', [
            transition(':enter', [
                style({ height: 0, }), animate('200ms', style({ height: '*', }))]
            ),
            transition(':leave',
                [style({ height: '*', }), animate('200ms', style({ height: 0, }))]
            )
        ]),
    ]
})

// Export Modules
export class MyOrdersComponent implements OnInit {

    staticContent
    activeList = []
    showTab = 1

    selectedOrder

    constructor(private commonService: CommonService,
        private translationService: TranslationService,
        private orderService: OrderService) { }

    ngOnInit() {
        // Load on going order list
        this.getActiveOrderList('1,2,3,4')

        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getProfileTranslations())
        })
    }

    // Get active order list
    getActiveOrderList(stringOrderStatus) {
        this.commonService.setSpinnerVisibility(true)
        let brandName = this.getBrandName()
        this.orderService.fetchOrder(stringOrderStatus).subscribe(res => {
            if (res['status'] == 200) {
                let data = res['data']
                this.activeList = []
                data.forEach(order => {
                    order.show = false
                    order.brand_label = brandName
                    order.consumption_mode = ''
                    order.order_status_text = this.getOrderStatusText(order.order_status_id)
                    order.payment_status_text = this.getPaymentStatusText(order.payment_status_id)
                    this.activeList.push(order)
                })
                this.calculatePrice(this.activeList)
                this.commonService.setSpinnerVisibility(false)
            } else {
                this.commonService.showToast('error', res['message'], '')
            }
        })
    }


    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Get ongoing orders
    showOngoing() {
        this.showTab = 1
        this.getActiveOrderList('1,2,3,4')
    }

    // Get previous orders
    showHistory() {
        this.showTab = 2
        this.getActiveOrderList('5,6')
    }

    // view order details
    toggleOrder(order) {
        order.show = !order.show
    }

    // Get order status text
    getOrderStatusText(orderStatusId: string, orderWantedAt?: string): string {
        let orderStatus = ''
        switch (orderStatusId) {
            case environment.orderStatus.in_progress:
                orderStatus = this.staticContent.order_status_message.in_progress
                break
            case environment.orderStatus.ready:
                orderStatus = this.staticContent.order_status_message.ready
                break
            case environment.orderStatus.completed:
                orderStatus = this.staticContent.order_status_message.completed
                break
            case environment.orderStatus.created:
                orderStatus = this.staticContent.order_status_message.received
                break

            case environment.orderStatus.upcoming:
                // Order Wanted At: in case we want to show the order time in upcoming orders
                if (orderWantedAt) {
                    let date = new Date(orderWantedAt);
                    let orderDate = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "/" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1)
                    let orderTime = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
                    orderStatus = this.staticContent.order_status_message.upcoming + ' ' + orderTime + ' ' + orderDate
                } else {
                    orderStatus = this.staticContent.order_status_message.upcoming
                }
                break
            default:
                orderStatus = this.staticContent.order_status_message.cancelled
                break
        }
        return orderStatus
    }

    // Get Payment status text
    getPaymentStatusText(paymentStatusId: string): string {
        let paymentStatus = ''
        switch (paymentStatusId) {
            case environment.paymentStatus.payment_success:
                paymentStatus = this.staticContent.payment_status_message.paid
                break
            case environment.paymentStatus.payment_failed:
                paymentStatus = this.staticContent.payment_status_message.failed
                break
            case environment.paymentStatus.payment_refund:
                paymentStatus = this.staticContent.payment_status_message.refunded
                break
            default:
                paymentStatus = ''
                break
        }
        return paymentStatus
    }

    // Calculate Price of Items
    calculatePrice(orderList) {
        orderList.forEach(order => {
            for (const item of order.order_items) {
                var total_price = parseFloat(item.price)

                if (item.type == environment.product && item.options) {
                    for (const options of item.options) {
                        let has_option = false
                        for (const optionItems of options.option_items) {
                            if (optionItems.selected) {
                                total_price += parseFloat(optionItems.price)
                                has_option = true
                            }
                        }
                        if (has_option) { total_price += parseFloat(options.price) }
                    }
                }
                if (item.type == environment.menu) {
                    if (item.submenu) {
                        for (const category of item.submenu) {
                            for (const product of category.product_list) {
                                if (product.selected) {
                                    total_price += parseFloat(product.additional_price)
                                    if (product.options) {
                                        for (const options of product.options) {
                                            let has_option = false
                                            for (const optionItems of options.option_items) {
                                                if (optionItems.selected) {
                                                    total_price += parseFloat(optionItems.price)
                                                    has_option = true
                                                }
                                            }
                                            if (has_option) { total_price += parseFloat(options.price) }
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
                item.total_price = (total_price * item.quantity)
            }
        })
    }

    // change date format for using in pipe
    changeDateFormat(dateString): string {
        let dateNewFormat = dateString.replace(/-/g, "/")
        return dateNewFormat
    }

    // Float Check Price
    floatCheck(price) {
        return this.commonService.floatCheck(parseFloat(price))
    }

    // Go to catalog
    takeHome() {
        this.commonService.navigate('pages/nav-profile')
    }

    // Navigate to the order tracking
    viewTracking(order: any) {
        let trakingObject = {
            consumer_code: order.consumer_code,
            id: order.id
        }
        let trackingString = btoa(JSON.stringify(trakingObject))
        this.commonService.navigate('pages/tracking/' + trackingString)
    }

    // Get brand name // Add API call for recovering brand information if we are getting order from different restaurants same company and different brand.
    getBrandName(): string {
        let brand = this.commonService.getBrand()
        return brand.brand_label
    }
}