/*
    Product Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { CommonService, CartService } from 'src/app/@core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAllergenDetailsComponent, ModalSuggestionComponent } from 'src/app/@core/modal';
import { TranslationService } from 'src/app/languages';

// Essential Variables and Annotations
@Component({
    selector: 'app-product-single',
    templateUrl: './product.component.html'
})

// Export Modules
export class ProductComponent implements OnInit {

    staticContent

    brand: any;

    item: any = {}
    itemListOptions = []
    allergenList = []
    pictogramList = []
    selectedAllergen = []

    allowNext = false

    allowOrder: boolean

    constructor(public modalService: NgbModal,
        private commonService: CommonService,
        private cartService: CartService,
        private translationService: TranslationService) { }

    ngOnInit() {

        this.allowOrder = this.commonService.getAllowOrder()
        this.pictogramList = Object.assign([], this.commonService.getPictogramsList())
        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getDetailTranslations())
        })
        this.brand = this.commonService.getBrand();
        // console.log('product', this.brand);

        window.scroll(0, 0)

        this.item = this.commonService.getSelectedProduct()
        this.itemListOptions = this.item.options.sort((a, b) => (a.position > b.position) ? 1 : -1)
        const list = this.commonService.getAllergenList()

        this.allergenList = []

        this.item.allergens.forEach(element => {
            for (const elementAllergen of list) {
                if (elementAllergen.id == element) {
                    this.allergenList.push(elementAllergen)
                    return
                }
            }
        })

        this.commonService.onSelectedAllergenChange().subscribe(allergens => {
            this.selectedAllergen = allergens
        })

        this.checkNext()
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Float Check Price
    floatCheck(price) {
        return this.commonService.floatCheck(parseFloat(price))
    }

    // Navigate to other Pages
    navigate(page) {
        this.commonService.navigate('pages/' + page)
    }

    // Add to Cart
    addToCart() {
        if (this.item.suggestions.length > 0) {
            this.modalService.open(ModalSuggestionComponent, { windowClass: 'menu-modal', scrollable: true, centered: true })
        } else {
            this.cartService.addItemToCart(this.item)
            //this.commonService.showToast('success', this.staticContent.added_to_cart, '')
        }
    }
    //Button cart animation desktop
    cartClickAnimation(e) {
        e.target.classList.remove("start-selected");
        e.target.classList.toggle("start-selected");
        e.target.disabled = true;
        setTimeout(function () {
            e.target.classList.toggle("start-selected");
        }, 1200);
        setTimeout(() => {
            e.target.disabled = false;
            this.commonService.navigate('pages/catalog')
        }
            , 1000)

    }
    //Button cart animation mobile view
    cartClickAnimationMobile(e) {
        e.target.classList.remove("mobile-start-selected");
        e.target.classList.toggle("mobile-start-selected");
        e.target.disabled = true;
        setTimeout(function () {
            e.target.classList.toggle("mobile-start-selected");
        }, 1200);
        setTimeout(() => {
            e.target.disabled = false;
            this.commonService.navigate('pages/catalog')
        }
            , 1000)

    }
    // Select Option in product
    selectOption(optionItem, option) {
        if (option.maximum == 1) {
            if (optionItem.selected) {
                option.max_selected = false
            } else {
                option.option_items.forEach(item => {
                    item.selected = false
                })
                option.max_selected = true
            }
            optionItem.selected = !(optionItem.selected)
            this.checkHasOption()
            this.calculateCategoryPrice()
            this.checkNext()
        } else {
            if (optionItem.selected || (!option.max_selected && !optionItem.selected)) {
                optionItem.selected = !(optionItem.selected)
                this.checkHasOption()
                this.calculateCategoryPrice()
                this.checkNext()

                let count_selected = 0
                option.option_items.forEach(item => {
                    if (item.selected) {
                        count_selected++
                    }
                })
                if (count_selected == option.maximum) {
                    option.max_selected = true
                } else {
                    option.max_selected = false
                }
            }
        }
    }

    // Check if product has options
    checkHasOption() {
        this.item.has_option = false
        this.item.options.forEach(option => {
            option.option_items.forEach(optionItem => {
                if (optionItem.selected) {
                    this.item.has_option = true
                    return
                }
            })
        })
    }

    // Calculate options prices
    calculateCategoryPrice() {
        if (this.item.has_option) {
            let optionPrice = 0
            this.item.options.forEach(option => {
                let has_option = false
                option.option_items.forEach(optionItem => {
                    if (optionItem.selected) {
                        optionPrice += parseFloat(optionItem.price)
                        has_option = true
                    }
                })
                if (has_option) { optionPrice += parseFloat(option.price) }
            })
            this.item.option_price = optionPrice
        }
    }

    // Check if next is allowed
    checkNext() {
        this.allowNext = true
        this.item.options.forEach(option => {
            let min = option.fixed_number
            let max = option.maximum
            let count = 0
            option.option_items.forEach(optionItem => {
                if (optionItem.selected) { count++ }
            })
            if (!(count >= min && count <= max)) {
                this.allowNext = false
                return
            }
        })
    }

    // Open Allergen Modal
    openModal() {
        this.modalService.open(ModalAllergenDetailsComponent, { windowClass: 'menu-modal mobile-product-allergens-modal', centered: true })
    }
}
