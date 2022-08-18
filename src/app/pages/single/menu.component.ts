/*
    Menu Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit } from "@angular/core"
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CommonService, CartService } from 'src/app/@core/services'
import { ModalSuggestionComponent, ModalAllergenDetailsComponent } from 'src/app/@core/modal'
import { TranslationService } from 'src/app/languages'

// Essential Variables and Annotations
@Component({
    selector: 'app-menu-single',
    templateUrl: './menu.component.html'
})

// Export Modules
export class MenuComponent implements OnInit {

    staticContent

    brand: any;

    item: any = {}

    submenuList = []
    selectedSubmenu
    selectedProduct
    showSubmenuProduct

    stepCount = 0

    allowNext = false

    allowOrder: boolean

    constructor(public modalService: NgbModal,
        private commonService: CommonService,
        private cartService: CartService,
        private translationService: TranslationService) { }

    ngOnInit() {
        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getDetailTranslations())
        })

        window.scroll(0, 0)

        this.selectedSubmenu = {}
        this.showSubmenuProduct = []
        this.selectedProduct = null
        this.allowOrder = this.commonService.getAllowOrder()
        this.brand = this.commonService.getBrand();

        this.item = this.commonService.getSelectedProduct()
        if (this.item.submenu) {
            this.submenuList = this.item.submenu
            if (this.submenuList.length > 0) {
                this.selectedSubmenu = this.submenuList[this.stepCount]
                this.createShowSubmenuProduct()
            }
        }

        this.checkNext()
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Navigation to other pages
    navigate(page) {
        this.commonService.navigate('pages/' + page)
    }

    // Float Check Price
    floatCheck(price) {
        return this.commonService.floatCheck(parseFloat(price))
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
            , 1200)
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
            , 1200)
    }
    // Add to cart along with suggestions
    addToCart() {
        if (this.item.suggestions.length > 0) {
            this.modalService.open(ModalSuggestionComponent, { windowClass: 'menu-modal', scrollable: true, centered: true }).result.then(result => {
                this.stepCount = 0
                this.selectedSubmenu = this.item.submenu[this.stepCount]
                this.createShowSubmenuProduct()
                this.selectedProduct = {}
            })
        } else {
            this.cartService.addItemToCart(this.item)
            //this.commonService.showToast('success', this.staticContent.added_to_cart, '')
            this.stepCount = 0
            this.selectedSubmenu = this.item.submenu[this.stepCount]
            this.createShowSubmenuProduct()
            this.selectedProduct = {}
        }
    }

    // Menu Product selection and viewing
    selectProduct(product) {
        this.selectedProduct = null
        if (product.selected) {
            product.selected = false
            product.options.forEach(option => {
                option.max_selected = false
                option.option_items.forEach(optionItem => {
                    optionItem.selected = false
                })
            })
        } else {
            this.selectedSubmenu.product_list.forEach(item => {
                item.selected = false
                item.options.forEach(option => {
                    option.max_selected = false
                    option.option_items.forEach(optionItem => {
                        optionItem.selected = false
                    })
                })
            })
            product.selected = true
            this.selectedProduct = product
        }
        this.checkHasProduct()
        this.checkNext()
    }

    // Product option selection
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

    // Check if submenu has product
    checkHasProduct() {
        this.selectedSubmenu.has_product = false
        this.selectedSubmenu.product_list.forEach(product => {
            if (product.selected) {
                this.selectedSubmenu.has_product = true
                return
            }
        })
    }

    // Check if product has options
    checkHasOption() {
        this.selectedProduct.has_option = false
        this.selectedProduct.options.forEach(option => {
            option.option_items.forEach(optionItem => {
                if (optionItem.selected) {
                    this.selectedProduct.has_option = true
                    return
                }
            })
        })
    }

    // Calculate Submenu Price
    calculateCategoryPrice() {
        let optionPrice = 0
        this.selectedSubmenu.product_list.forEach(product => {
            if (product.has_option) {
                product.options.forEach(option => {
                    let has_option = false
                    option.option_items.forEach(optionItem => {
                        if (optionItem.selected) {
                            optionPrice += parseFloat(optionItem.price)
                            has_option = true
                        }
                    })
                    if (has_option) { optionPrice += parseFloat(option.price) }
                })
            }
        })
        this.selectedSubmenu.option_price = optionPrice
    }

    // Previous Submenu
    previousCategory() {
        this.stepCount--
        this.selectedSubmenu = this.item.submenu[this.stepCount]
        this.createShowSubmenuProduct()
    }

    // Next Submenu
    nextCategory() {
        this.stepCount++
        this.selectedSubmenu = this.item.submenu[this.stepCount]
        this.createShowSubmenuProduct()
        this.checkNext()
    }

    // Create submenu product display
    createShowSubmenuProduct() {
        this.selectedProduct = null
        let list = []
        let index = 0
        let singleRow = []
        this.selectedSubmenu.product_list.forEach(product => {
            if (index % 3 == 0) {
                if (singleRow.length > 0) {
                    list.push(singleRow)
                }
                singleRow = []
            }
            singleRow.push(product)
            index++
            if (product.selected) {
                this.selectedProduct = product
            }
        })
        if (singleRow.length > 0) {
            list.push(singleRow)
        }
        this.showSubmenuProduct = list
    }

    // Check if next is allowed
    checkNext() {
        this.allowNext = true
        this.selectedSubmenu.product_list.forEach(product => {
            if (product.selected) {
                product.options.forEach(option => {
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
                if (!this.allowNext) {
                    return
                }
            }
        })
    }

    // Open Allergen Modal
    openModal() {
        this.modalService.open(ModalAllergenDetailsComponent, { windowClass: 'menu-modal', scrollable: true, centered: true })
    }
}
