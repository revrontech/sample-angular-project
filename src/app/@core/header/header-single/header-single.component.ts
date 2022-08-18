/*
    Single Product Menu Header Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit, ViewChild, ElementRef, HostListener } from "@angular/core"
import { CommonService } from '../../services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAllergenComponent } from '../../modal';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/languages';
import { environment } from 'src/environments/environment';

// Essential Variables and Annotations
@Component({
    selector: 'app-header-single',
    templateUrl: './header-single.component.html'
})

// Export Modules
export class HeaderSingleComponent implements OnInit {

    staticContent

    brandLogo = 'assets/logo.png'

    categoryList = []
    selectedCategory = { id: "" }

    customerName = ""

    allowOrder: boolean

    showMenu: boolean = false
    menuCounter = 0
    maxMenuCount = environment.menu_length.with
    maxWithMenuCount = environment.menu_length.without

    widthAreaMenu: number = 0;
    showSeeMoreMenu: boolean = false
    seeMoreMenuItemsCount: number = 0
    oldSeeMoreMenuItemsCount: number = 0
    dropdownMenuCategoryList = []
    @ViewChild('stickyMenu') stickyMenu: ElementRef;

    @HostListener('window:resize') onResize() {
        // guard against resize before view is rendered
        if (this.stickyMenu) {
            this.widthAreaMenu = parseFloat(getComputedStyle(this.stickyMenu.nativeElement).width);
        }
        this.calculateMenu(false);
    }

    constructor(
        private commonService: CommonService,
        public modalService: NgbModal,
        private translationService: TranslationService,
    ) {
    }

    // Go back to catalog page
    goBack() {
        // console.log('goBack');
        this.commonService.navigate('pages/catalog');
    }

    ngOnInit() {

        this.allowOrder = this.commonService.getAllowOrder()

        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getHeaderTranslations())
        })

        this.commonService.onBrandChange().subscribe(data => {
            if (Object.entries(data).length > 0) {
                this.brandLogo = (data.asset.logo) ? data.asset.logo : 'assets/logo.png'
            }
        })

        this.commonService.onCategoryListChange().subscribe(data => {
            this.categoryList = data
        })

        this.selectedCategory = this.commonService.getSelectedCategory()
        this.commonService.onCustomerAuthChange().subscribe(data => {
            this.customerName = (data.email == '') ? this.staticContent.login : data.firstname
        })
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Select Category of items
    selectCategory(selection: any) {
        this.selectedCategory = selection
        this.commonService.setSelectedCategory(this.selectedCategory)
        this.commonService.navigate('pages/catalog')
    }

    // Open Allergen Modal
    openModal() {
        this.modalService.open(ModalAllergenComponent, { windowClass: 'bill-modal', scrollable: true, centered: true })
    }

    // Check if user is logged in 
    loginCheck() {
        if (this.customerName == this.staticContent.login) {
            this.commonService.navigate('/pages/login')
        } else {
            this.commonService.navigate('/pages/profile')
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.widthAreaMenu = parseFloat(getComputedStyle(this.stickyMenu.nativeElement).width);
            this.calculateMenu(true);
        });

    }

    calculateMenu(onInit: boolean) {

        //calculate size on init
        if (onInit) {
            this.widthAreaMenu = parseFloat(getComputedStyle(this.stickyMenu.nativeElement).width);
        }

        let widthValues = [];
        let collectionToArray = [];

        //if show Menu is active
        let showMenuActive = 1
        if (this.showMenu) {
            showMenuActive = 0
        }
        let widthCalculated = 0;

        Array.from(this.stickyMenu.nativeElement.children).forEach(function (element) {
            collectionToArray.push(element)
        });


        collectionToArray.forEach(element => {
            widthValues.push(parseFloat(parseFloat(getComputedStyle(element).width).toFixed(2)))

        });

        for (let i = 0; i < widthValues.length; i++) {
            widthCalculated += widthValues[i];
            if (this.widthAreaMenu > widthCalculated) {
                this.seeMoreMenuItemsCount = i + showMenuActive;
            }
        }
        if (this.seeMoreMenuItemsCount != this.oldSeeMoreMenuItemsCount) {
            this.dropdownMenuCategoryList = [];
            for (let i = 0; i < this.categoryList.length; i++) {
                if (i >= this.seeMoreMenuItemsCount) {
                    this.dropdownMenuCategoryList.push(this.categoryList[i])
                }
            }
            this.oldSeeMoreMenuItemsCount = this.seeMoreMenuItemsCount
        }
    }
}
