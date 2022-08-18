/*
    Wallet Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit, HostListener } from "@angular/core"
import { CommonService, CustomerService, BrandService } from 'src/app/@core/services';
import { TranslationService } from 'src/app/languages';
import { isValid } from 'cc-validate';
import { DomSanitizer } from '@angular/platform-browser'


// Essential Variables and Annotations
@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html'
})

// Export Modules
export class WalletComponent implements OnInit {

    staticContent: any

    cardList = []
    editing: boolean = false
    cardURL: any = this.sanitizer.bypassSecurityTrustResourceUrl('')
    paymentId: string
    addCardPaygreen: boolean = false
    addCardStripe: boolean = false
    paymentMethod: string = null

    // Config object for stripe form component
    configStripe = {
        orderId: '',
        stripeMode: 'save',
        clientSecret: '',
        primaryColor: '',
        fontFamilySrc: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap',
        fontFamily: 'Ubuntu',
    }

    constructor(private commonService: CommonService,
        private translationService: TranslationService,
        private customerService: CustomerService,
        private brandService: BrandService,
        private sanitizer: DomSanitizer) {
    }

    // Post-messages listener
    @HostListener('window:message', ['$event']) onMessage(event) {
        if (this.paymentMethod === '1') {
            if (event.data.id === "paygreen-insite") {
                // Result succeed
                if (event.data.message?.result === "SUCCESSED") {
                    this.cardURL = this.sanitizer.bypassSecurityTrustResourceUrl('')
                    this.customerService.saveCard(event.data.message.pid).subscribe(res => {
                        if (res['status'] === 200) {
                            this.commonService.showToast('success', res['message'], '')
                        } else {
                            this.commonService.showToast('error', res['message'], '')
                        }
                        this.editing = false
                        this.getCards();
                    })

                }
                // Result refused
                else if (event.data.message?.result === "REFUSED") {
                    this.editing = false
                    this.commonService.showToast('error', event.data.message?.result, '')
                }
                // Result expired
                else if (event.data.message?.result === "EXPIRED") {
                    this.editing = false
                    this.commonService.showToast('error', event.data.message?.result, '')
                }
            }
        }

    }

    ngOnInit() {
        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getProfileTranslations())
        })
        this.getCards();
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // view card buttons
    toggleCard(card) {
        card.show = !card.show
    }

    // Get Cards list
    getCards() {
        this.commonService.setSpinnerVisibility(true)
        this.brandService
            .fetchPaymentMethods()
            .subscribe(method => {
                if (method['status'] === 200) {
                    this.paymentMethod = method['data'][0].method_id
                    // console.log(this.paymentMethod);
                    this.customerService
                        .fetchCards(this.paymentMethod)
                        .subscribe(res => {
                            if (res['status'] === 200) {
                                this.createCardList(res['data'])
                            } else {
                                this.cardList = []
                            }
                            this.commonService.setSpinnerVisibility(false)
                        })
                }
            })
    }

    // Set the default credit card
    setDefaultCard(cardId) {
        this.customerService
            .setDefaultCard(cardId)
            .subscribe(res => {
                if (res['status'] == 200) {
                    this.getCards();
                }
            })
    }

    // Delete a credit card from the wallet
    deleteCard(cardId) {
        this.customerService
            .deleteCard(cardId)
            .subscribe(res => {
                if (res['status'] == 200) {
                    this.getCards();
                }
            })
    }

    // Add a credit card to the wallet
    addCard() {
        this.commonService.setSpinnerVisibility(true)
        this.editing = true;
        this.customerService
            .addCard(this.paymentMethod)
            .subscribe(res => {
                // console.log(res);
                if (res['status'] == 200) {
                    // this.paymentId = res['transaction_details'].id
                    // FIXME | Paygreen
                    /*if (this.paymentMethod === '1') {
                        this.cardURL = this.sanitizer.bypassSecurityTrustResourceUrl(res['transaction_details'].url + "?display=insite")
                        this.addCardPaygreen = true
                    }*/
                    // Stripe
                    if (this.paymentMethod === '2') {
                        let brandData = this.commonService.getBrand()
                        this.configStripe.primaryColor = brandData.module_parameter.color_dark
                        // this.configStripe.clientSecret = res['transaction_details'].secret
                        this.configStripe.clientSecret = res['data']
                        this.addCardStripe = true
                    }
                    this.commonService.setSpinnerVisibility(false)
                }
            })
    }

    // Process Stripe payment result
    processStripeResult(result) {
        // console.log('processStripeResult', result);
        // Go back
        if (result.setupIntent.status === 'canceled') {
            this.configStripe.clientSecret = '';
            this.addCardStripe = false;
            this.addCardPaygreen = false;
            this.editing = false;
            // Succesful operation
        } else if (result.setupIntent.status === 'succeeded') {
            // this.commonService.showToast('success', result['message'], '')
            this.getCards();
            this.editing = false;
        } else {
            return;
        }
    }

    // Create credit card list
    createCardList(cardList) {
        // console.log(cardList);
        this.cardList = cardList;
        // this.cardList = cardList.filter(card => card.payment_method_id === this.paymentMethod)
        // Paygreen
        /*if (this.paymentMethod === '1') {
            this.cardList.forEach(element => {
                element.show = false;
                let card_type = isValid(element.card_number)['cardType'];
                element.cardType = this.setCardTypeName(card_type)
                element.card_number = '••••  ••••  ••••  ' + element.card_number.slice(12);
            })
        }*/
        // Stripe
        if (this.paymentMethod === '2') {
            this.cardList.forEach(card => {
                // let cardArray = element.card_number.split('_')
                // let card_type = cardArray[0]
                // let card_number = cardArray[1]
                // element.cardType = this.setCardTypeName(card_type)
                card.card_number = '••••  ••••  ••••  ' + card.last4;
            });
        }
    }

    // Set card type name
    /*setCardTypeName(card_type): string {
        let cardType = ''
        switch (card_type) {
            case 'visa':
            case 'Visa':
                cardType = 'visa';
                break
            case 'mastercard':
            case 'Mastercard':
                cardType = 'mastercard'
                break
            case 'amex':
            case 'Amex':
                cardType = 'amex'
                break
            default:
                cardType = 'credit-card'
                break
        }
        return cardType
    }*/

    // Go to catalog
    takeHome() {
        this.commonService.navigate('pages/nav-profile')
    }
}
