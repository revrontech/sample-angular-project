/*
    Home Component
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Component, OnInit, AfterViewInit, HostListener } from "@angular/core"
import { Select2OptionData } from 'ng-select2'
import { CommonService, BrandService, GlobalService, convertHexToFilter } from '../../@core/services'
import { environment } from 'src/environments/environment'
import { TranslationService } from 'src/app/languages'

// Essential Variables and Annotations
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})

// Export Modules
export class HomeComponent implements OnInit {

    staticContent: any
    restaurantList: Array<Select2OptionData> = []
    selectedRestaurant: any = ''

    showBlockOne = true
    showBlockTwo = false

    subscriptions: any = []

    spotEnabled = false
    takeAwayEnabled = false
    deliveryEnabled = false

    spotOpen = false
    takeAwayOpen = false
    deliveryOpen = false

    remoteSelected = false
    spotSelected = false
    takeAwaySelected = false
    deliverySelected = false

    locationId: string = ""
    backgroundImage: string
    backgroundImageDesktop: string
    backgroundImageMobile: string
    screenWidth: number = 0;

    companyName = ''
    companyDescription = ''

    slideSlotsLists: any = []
    slotSliderId: number = 0
    selectedSlot: any = {}
    selectedSlotSliderId: number = 0

    showScanner = false

    constructor(private commonService: CommonService,
        private globalService: GlobalService,
        private brandService: BrandService,
        private translationService: TranslationService) { }

    // Change background when changing screen width
    // Change background depending page width
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.screenWidth = window.innerWidth;
        if (this.screenWidth < 1092) {
            if (this.backgroundImageMobile) {
                this.backgroundImage = this.backgroundImageMobile
            }
        } else {
            if (this.backgroundImageDesktop) {
                this.backgroundImage = this.backgroundImageDesktop
            }
        }
    }

    ngOnInit(): void {
        this.screenWidth = window.innerWidth;
        this.commonService.onSelectedLanguageChange().subscribe(() => {
            this.updateTranslation(this.translationService.getHomeTranslations())
        })

        this.commonService.onBrandIdChange().subscribe(brandId => {
            this.commonService.setSpinnerVisibility(true)
            this.showBlock('0')
            if (brandId == 0) {
                this.brandService.fetchBrandList().subscribe(res => {
                    if (res['status'] == 200) {
                        var data = res['data']
                        this.restaurantList = []
                        data.forEach(element => {
                            this.restaurantList.push({ id: element.id, text: element.label, additional: element.subdomain })
                        })
                    }
                    this.commonService.setSpinnerVisibility(false)
                })
                this.showBlock('1')
            } else {
                this.commonService.onSelectedLanguageChange().subscribe(language => {
                    this.brandService.fetchBrandDetails().subscribe(res => {

                        if (res['status'] == 200) {
                            this.commonService.setBrand(res['data'])
                            var data = res['data']

                            this.backgroundImage = 'assets/restaurant-bg.png'
                            this.backgroundImageDesktop = data?.module_parameter.background_set['1920W'];
                            this.backgroundImageMobile = data?.module_parameter.background_set['1080W'];

                            if (this.screenWidth < 1092) {
                                if (this.backgroundImageMobile) {
                                    this.backgroundImage = this.backgroundImageMobile
                                }
                            } else {
                                if (this.backgroundImageDesktop) {
                                    this.backgroundImage = this.backgroundImageDesktop
                                }
                            }
                            // var primaryColor = environment.default_primary_color
                            var primaryColor;
                            if (data.module_parameter) {
                                if (data.module_parameter.theme == '0') {
                                    primaryColor = data.module_parameter.color_light
                                    this.commonService.setBgColor("#ffffff")
                                } else {
                                    primaryColor = data.module_parameter.color_dark
                                    this.commonService.setBgColor("#222b45")
                                }
                            }
                            else {
                                primaryColor = environment.default_primary_color
                            }
                            this.commonService.setPrimaryColor(primaryColor)
                            this.commonService.setFilterPrimary(convertHexToFilter(primaryColor))
                            this.companyName = res['data'].module_parameter.home_title
                            this.companyDescription = res['data'].module_parameter.home_desc

                            this.checkQueryParams()
                        }
                    })
                })

                this.brandService.fetchLanguageList().subscribe(res => {
                    if (res['status'] == 200) {
                        this.commonService.setLanguageList(res['data'])
                    }
                })
                this.brandService.fetchSubscriptions().subscribe(res => {
                    if (res['status'] == 200) {
                        this.subscriptions = res['data'].sort((a, b) => (a.consumption_mode_id < b.consumption_mode_id) ? 1 : -1)
                        this.verifyActiveSubscriptions(this.subscriptions)
                        if (this.subscriptions.length > 0) {
                            this.showBlock('2')
                        } else {
                            window.location.href = environment.redirect_url
                            //this.commonService.navigate('base')
                        }
                    }
                    else {
                        window.location.href = environment.redirect_url
                    }
                    this.commonService.setSpinnerVisibility(false)
                })

            }
        })

        this.globalService.fetchFontList().subscribe(res => {
            if (res['status'] == 200) {
                this.commonService.setFontList(res['data'])
            }
        })
    }
    // Verify active subscriptions
    verifyActiveSubscriptions(subscriptions) {
        // console.log(subscriptions)
        subscriptions.forEach(subscription => {
            if (typeof (subscription) !== 'undefined') {
                // On Spot Mode
                if (subscription.consumption_mode_id === environment.subscriptionId.onSpot) {
                    this.spotEnabled = true
                    this.spotOpen = subscription.is_open
                }
                // Take away Mode
                else if (subscription.consumption_mode_id === environment.subscriptionId.takeAway) {
                    this.takeAwayEnabled = true
                    this.takeAwayOpen = subscription.is_open
                }
                // Delivery Mode
                else if (subscription.consumption_mode_id === environment.subscriptionId.delivery) {
                    this.deliveryEnabled = true
                    this.deliveryOpen = subscription.is_open
                }
                // Catalog without cart mode
                else if (subscription.consumption_mode_id === environment.subscriptionId.noCart) {
                    if (!((this.spotEnabled && this.spotOpen) || (this.takeAwayEnabled && this.takeAwayOpen) || (this.deliveryEnabled && this.deliveryOpen))) {
                        this.commonService.setAllowOrder(false);
                        this.commonService.setAreaId(0);
                        let subscriptionNoCart = this.subscriptions.find(subscription => {
                            return subscription.consumption_mode_id == environment.subscriptionId.noCart;
                        })
                        this.commonService.setSubscription({ subscriptionId: subscriptionNoCart.id, consumptionModeId: subscription.consumption_mode_id, slot: {}, slotsEnabled: false });
                        this.commonService.setAreaDetails({ area_label: '', area_location_label: '' });
                        this.setArea('', '', '', '0');
                        this.commonService.setSpaceParam(null);
                        this.loadBaseData();
                        this.commonService.navigate('pages/catalog');

                    }
                    else {
                        this.commonService.setAllowOrder(true);
                    }
                }
            }
        });


        // Show/Hide Enable/Disable consumption mode buttons
        if (this.spotEnabled && this.spotOpen && !(this.takeAwayOpen || this.deliveryOpen)) {
            this.remoteSelected = false;
            this.spotSelected = true;
        }
        else if (this.takeAwayEnabled || this.deliveryEnabled) {
            this.remoteSelected = true;
            this.spotSelected = false;
            if (this.takeAwayEnabled && this.takeAwayOpen) {
                this.deliverySelected = false;
                this.takeAwaySelected = true;
                let subscriptionTakeAway = this.subscriptions.find(subscription => {
                    return subscription.consumption_mode_id == environment.subscriptionId.takeAway
                })
                if (subscriptionTakeAway) {
                    this.createSlotsList(subscriptionTakeAway.slots)
                }
            }
            if (this.deliveryEnabled && (!this.takeAwayEnabled || !this.takeAwayOpen)) {
                this.takeAwaySelected = false;
                this.deliverySelected = true;
                let subscriptionDelivery = this.subscriptions.find(subscription => {
                    return subscription.consumption_mode_id == environment.subscriptionId.delivery
                })
                if (subscriptionDelivery) {
                    this.createSlotsList(subscriptionDelivery.slots)
                }
            }
        }
    }

    // Create list of slots
    createSlotsList(slots) {
        let slotsBySlider = 6
        if (!this.takeAwayEnabled || !this.deliveryEnabled) {
            slotsBySlider = 12
        }
        this.slideSlotsLists = []
        let numberOfSlides = Math.floor(slots.length / slotsBySlider)
        let reminder = slots.length % slotsBySlider
        if (reminder != 0) {
            numberOfSlides = numberOfSlides + 1
        }
        for (let i = 0; i < numberOfSlides; i++) {
            let groupSlots = []
            for (let j = 0; j < slotsBySlider; j++) {
                let slot = slots[(i * slotsBySlider) + j]
                if (slot) {
                    let start = slot.start.split(" ");
                    let end = slot.end.split(" ");
                    let date = start[1].split("/").reverse().join("-");
                    groupSlots.push({
                        id: (i * slotsBySlider) + j,
                        current_order: slot.current_order,
                        end: end[3],
                        max_order: slot.max_order,
                        start: start[3],
                        date: date,
                        selected: false,
                    });
                }
            }
            this.slideSlotsLists.push({
                slideNumber: i,
                slots: groupSlots
            })
        }
    }

    // Select a slot ofr take away or delivery
    selectSlot(slot) {
        if (this.selectedSlot != slot) {
            var changeoldSlot = this.slideSlotsLists[this.selectedSlotSliderId].slots.find(s => s.id === this.selectedSlot.id);
            if (changeoldSlot) {
                changeoldSlot.selected = false;
            }
        }
        var changeSlot = this.slideSlotsLists[this.slotSliderId].slots.find(s => s.id === slot.id);
        if (changeSlot) {
            if (changeSlot.selected) {
                changeSlot.selected = false;
                this.selectedSlot = {};
            } else {
                changeSlot.selected = true;
                this.selectedSlot = slot
                this.selectedSlotSliderId = this.slotSliderId
            }
        }
    }


    // Get the current slide ID
    onSlide(event) {
        this.slotSliderId = event.current
    }

    // Update Translations
    updateTranslation(translations: any) {
        this.staticContent = translations
    }

    // Check local storage for saved details
    redirectOnSaved() {
        if (localStorage.getItem(environment.keys.area)) {
            try {
                var area_details = JSON.parse(atob(localStorage.getItem(environment.keys.area)))
                this.commonService.setAreaId(area_details.area_id)
                this.commonService.setSelectedLocation(area_details.area_location_id)
                this.commonService.setAreaDetails({ area_label: area_details.area_label, area_location_label: area_details.area_location_label })
                this.commonService.setSubscription(area_details.subscription)
                if (area_details.subscription.consumptionModeId == '0') {
                    this.commonService.setAllowOrder(false);
                }
                this.loadBaseData()
                this.commonService.navigate('pages/catalog')
            } catch (e) {
                localStorage.removeItem(environment.keys.area)
            }
        }
    }

    // Redirect url with area location ID
    checkQueryParams() {
        var space = this.commonService.getSpaceParam()
        // console.log(space)
        if (space) {
            try {
                var details: any = atob(space)
                details = JSON.parse(details)
                if (details.area_location) {
                    // console.log('here')
                    localStorage.removeItem(environment.keys.area)
                    localStorage.removeItem(environment.keys.catalog)
                    this.locationId = details.area_location
                    this.selectOrderLocation('1')
                    this.redirectBlock('2')
                } else {
                    this.redirectOnSaved()
                }
            } catch (e) {
                this.redirectOnSaved()
            }
        }
        else {
            this.redirectOnSaved()
        }
    }

    // Restaurant Selection
    valueChanged(selection): void {
        if (selection) { this.selectedRestaurant = selection }
    }

    // Redirect to required step or catalog after selecting area
    redirectBlock(position): void {

        var host = window.location.hostname

        switch (position) {
            case '0':
                window.location.href = "https://" + ((host.split('.').slice(1)).join('.'))
                break
            case '1':
                window.location.href = "https://" + this.restaurantList.find(element => element.id == this.selectedRestaurant).additional + "." + host
                break
            case '2':
                if (this.spotSelected) {
                    if (this.spotEnabled && this.spotOpen) {
                        this.brandService.VerifyAreaLocation(this.locationId).subscribe(res => {
                            if (res['status'] == 200) {
                                let subscription = this.subscriptions.find(subscription => {
                                    return subscription.consumption_mode_id == environment.subscriptionId.onSpot
                                })
                                if (subscription) {
                                    this.commonService.setSubscription({ subscriptionId: subscription.id, consumptionModeId: subscription.consumption_mode_id, slot: {} });
                                }
                                this.commonService.setAreaId(res['data'].area_id)
                                this.commonService.setSelectedLocation(res['data'].area_location_id)
                                this.commonService.setAreaDetails({ area_label: res['data'].area_label, area_location_label: res['data'].area_location_label })
                                this.setArea(this.locationId, res['data'].area_label, res['data'].area_location_label, res['data'].area_location_id);
                                this.commonService.setSpaceParam(null)
                                this.loadBaseData()
                                this.commonService.navigate('pages/catalog')
                            } else {
                                this.commonService.showToast('error', 'Invalid Area Location', 'Message')
                            }
                        })
                    }
                    else {
                        this.commonService.navigate('base')
                    }

                } else if (this.remoteSelected) {
                    if (this.takeAwaySelected && this.takeAwayEnabled && this.takeAwayOpen) {
                        this.commonService.setSelectedLocation(0)
                        this.commonService.setAreaId(0)
                        this.commonService.setAreaDetails({ area_label: '', area_location_label: '' })
                        let subscriptionTakeAway = this.subscriptions.find(subscription => {
                            return subscription.consumption_mode_id == environment.subscriptionId.takeAway
                        })
                        this.commonService.setSubscription({ subscriptionId: subscriptionTakeAway.id, consumptionModeId: subscriptionTakeAway.consumption_mode_id, slot: this.selectedSlot, slotsEnabled: subscriptionTakeAway.slots != 0 ? true : false });
                        this.createSlotsList(subscriptionTakeAway.slots)
                        this.setArea('', '', '', '0');
                        this.commonService.setSpaceParam(null)
                        this.loadBaseData()
                        this.commonService.navigate('pages/catalog')

                    } else if (this.deliverySelected && this.deliveryEnabled && this.deliveryOpen) {
                        this.commonService.setSelectedLocation(0)
                        this.commonService.setAreaId(0)
                        this.commonService.setAreaDetails({ area_label: '', area_location_label: '' })
                        let subscriptionDelivery = this.subscriptions.find(subscription => {
                            return subscription.consumption_mode_id == environment.subscriptionId.delivery
                        })
                        this.commonService.setSubscription({ subscriptionId: subscriptionDelivery.id, consumptionModeId: subscriptionDelivery.consumption_mode_id, slot: this.selectedSlot, slotsEnabled: subscriptionDelivery.slots != 0 ? true : false });
                        this.createSlotsList(subscriptionDelivery.slots)
                        this.setArea('', '', '', '0');
                        this.commonService.setSpaceParam(null)
                        this.loadBaseData()
                        this.commonService.navigate('pages/catalog')
                    }
                    else {
                        this.commonService.navigate('base')
                    }
                } else {
                    this.commonService.navigate('base')
                }
                break
            default:
                break
        }
    }
    // Set area variable in local storage
    setArea(areaLocation, areaLabel, areaLocationLabel, areaLocationId) {
        localStorage.setItem(environment.keys.area, btoa(JSON.stringify({
            area_id: this.commonService.getAreaId(),
            area_location: areaLocation,
            area_location_id: areaLocationId,
            area_label: areaLabel,
            area_location_label: areaLocationLabel,
            subscription: this.commonService.getSubscription()
        })))
    }

    // Load base catalog data and other required data
    loadBaseData() {
        this.commonService.setCategoryList([])
        this.commonService.setAllergenList([])

        if (this.commonService.getSelectedLanguage() != '0') {
            this.globalService.fetchAllergenList(this.commonService.getSelectedLanguage()).subscribe(res => {
                if (res['status'] == 200) {
                    this.commonService.setAllergenList(res['data'])
                }
            })

            this.checkCatalogSaved()
        }
    }

    // Check Local storage for previously saved data
    checkCatalogSaved() {
        var hasCatalog = false
        if (localStorage.getItem(environment.keys.catalog)) {
            try {
                hasCatalog = true
                var catalogData = JSON.parse(localStorage.getItem(environment.keys.catalog))
                this.commonService.setCategoryList(catalogData.categories)
                this.checkCart()
            } catch (e) {
                hasCatalog = false
                localStorage.removeItem(environment.keys.catalog)
            }
        }

        if (!hasCatalog) {
            this.commonService.setSpinnerVisibility(true)
        }

        this.brandService.fetchCategories().subscribe(res => {
            if (res['status'] == 200) {
                let categoryList = res['data']
                // console.log(categoryList)
                this.commonService.setCategoryList(categoryList)
                this.commonService.setSelectedCategory(categoryList[0])
                this.checkCart()
            }
        })
    }

    // Check local storage for previously saved cart details
    checkCart() {
        if (localStorage.getItem(environment.keys.cart)) {
            try {
                var cartItems = JSON.parse(localStorage.getItem(environment.keys.cart))
                this.commonService.setCartItemList(cartItems)
            } catch (e) {
                localStorage.removeItem(environment.keys.cart)
            }
        }
    }

    // Display respective block
    showBlock(position): void {
        this.showBlockOne = false
        this.showBlockTwo = false

        switch (position) {
            case '2':
                this.showBlockOne = false
                this.showBlockTwo = true
                break
            case '1':
                this.showBlockOne = true
                this.showBlockTwo = false
                break
            case '0':
                this.showBlockOne = false
                this.showBlockTwo = false
                break
            default:
                this.showBlockOne = false
                this.showBlockTwo = false
                break
        }
    }

    // Select Order Location
    selectOrderLocation(position): void {
        this.remoteSelected = false
        this.spotSelected = false

        switch (position) {
            case '1':
                this.spotSelected = true
                break
            default:
                this.remoteSelected = true
        }
    }

    // Select Remote Location Position
    selectRemoteLocation(position): void {
        this.takeAwaySelected = false
        this.deliverySelected = false

        switch (position) {
            case '1':
                this.deliverySelected = true
                let subscriptionDelivery = this.subscriptions.find(subscription => {
                    return subscription.consumption_mode_id == environment.subscriptionId.delivery
                })
                if (subscriptionDelivery) {
                    this.commonService.setSubscription({ subscriptionId: subscriptionDelivery.id, consumptionModeId: subscriptionDelivery.consumption_mode_id, slot: this.selectedSlot, slotsEnabled: subscriptionDelivery.slots != 0 ? true : false });
                    this.createSlotsList(subscriptionDelivery.slots)
                }
                break
            default:
                this.takeAwaySelected = true
                let subscriptionTakeAway = this.subscriptions.find(subscription => {
                    return subscription.consumption_mode_id == environment.subscriptionId.takeAway
                })
                if (subscriptionTakeAway) {
                    this.commonService.setSubscription({ subscriptionId: subscriptionTakeAway.id, consumptionModeId: subscriptionTakeAway.consumption_mode_id, slot: this.selectedSlot, slotsEnabled: subscriptionTakeAway.slots != 0 ? true : false });
                    this.createSlotsList(subscriptionTakeAway.slots)
                }
        }
        this.slotSliderId = 0;
        this.selectedSlotSliderId = 0;
        this.selectedSlot = {};
    }
}
