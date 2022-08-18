/*
    Common Services
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { BehaviorSubject, Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'
import { CompanyData, LanguageData, AllergenData, FontData, CustomerData } from '../dataModel/base.data'
import { ToastrService } from 'ngx-toastr'
import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { DatePipe } from '@angular/common';

// Essential Variables and Annotations
@Injectable({
    providedIn: 'root'
})


// Export Modules
export class CommonService {
    private spinnerVisible = new BehaviorSubject<boolean>(false)

    private companyAuth = new BehaviorSubject<CompanyData>({ auth_key: "", company: "" })

    private customerAuth = new BehaviorSubject<CustomerData>({ auth_key: "", email: "", firstname: "", lastname: "", phone: "" })

    private pseudo = new BehaviorSubject<any>('')

    private brandId = new BehaviorSubject<any>(0)

    private areaId = new BehaviorSubject<any>(0)

    // private subscription = { subscriptionId: '', consumptionModeId: '', slot: {} }
    private subscription = new BehaviorSubject<any>({})

    private allowOrder = new BehaviorSubject<boolean>(true)

    private areaDetails = new BehaviorSubject<any>({})

    private brand = new BehaviorSubject<any>({})

    private languageList = new BehaviorSubject<LanguageData[]>([])

    private fontList = new BehaviorSubject<FontData[]>([])

    private selectedLocation = 1

    private spaceParam = null

    private tokenParam = null
    private consumerCodeParam = null

    private idParam = null

    private selectedLanguage = new BehaviorSubject<string>("1")

    private selectedLanguageCode: string = "fr"

    private primaryColor = new BehaviorSubject<string>("#024D93")

    private bgColor = new BehaviorSubject<string>("#ffffff")

    private bgDesktopColor = new BehaviorSubject<string>("#E5E5E5")

    private bgMobileColor = new BehaviorSubject<string>("#F8F8F8")

    private filterPrimary = new BehaviorSubject<string>("invert(17%) sepia(94%) saturate(2130%) hue-rotate(196deg) brightness(95%) contrast(98%)")

    private allergenList = new BehaviorSubject<AllergenData[]>([])

    private selectedAllergen = new BehaviorSubject<any>([])

    private categoryList = new BehaviorSubject<any>([])

    private selectedCategory = new BehaviorSubject<any>({ id: "" })

    private productList = new BehaviorSubject<any>({})

    private selectedProduct = new BehaviorSubject<any>({})

    private menuList = new BehaviorSubject<any>({})

    private advertisementList = new BehaviorSubject<any>([])

    private eventList = new BehaviorSubject<any>({})

    private pictogramsList = new BehaviorSubject<any>({})

    private cartItemList = new BehaviorSubject<any>([])

    private fromWhereToLogin = ''

    private orderComment = ''

    constructor(
        private toastrService: ToastrService,
        private _location: Location,
        private router: Router,
        private datePipe: DatePipe
    ) {
    }

    // Going back to previous Page
    goBack() {
        this._location.back()
    }

    // Navigation to Route
    navigate(page) {
        this.router.navigate([page])
    }

    // Set Spinner Visibility
    setSpinnerVisibility(visibility: boolean) {
        this.spinnerVisible.next(visibility)
    }

    // Spinner Visibility Change Emitter
    onSpinnerVisibilityChange(): Observable<boolean> {
        return this.spinnerVisible
    }

    // Clear All Toast
    clearToast() {
        this.toastrService.clear()
    }

    // Show Toast
    showToast(type, message, title) {
        switch (type) {
            case 'success':
                this.toastrService.success(message, title, {
                    positionClass: 'toast-bottom-right'
                })
                break
            case 'error':
                this.toastrService.error(message, title, {
                    positionClass: 'toast-bottom-right'
                })
                break
            case 'warning':
                this.toastrService.warning(message, title, {
                    positionClass: 'toast-bottom-right'
                })
                break
            default:
                this.toastrService.info(message, title, {
                    positionClass: 'toast-bottom-right'
                })
                break
        }
    }

    // Set Company Auth
    setCompanyAuth(data: CompanyData) {
        this.companyAuth.next(data)
    }

    // Get Company Auth
    getCompanyAuth(): CompanyData {
        return this.companyAuth.value
    }

    // Company Auth Change Emitter
    onCompanyAuthChange(): Observable<CompanyData> {
        return this.companyAuth
    }

    // Clear Customer Auth
    clearCustomerAuth() {
        this.customerAuth.next({ auth_key: "", email: "", firstname: "", lastname: "", phone: "" })
    }

    // Set Customer Auth
    setCustomerAuth(data: CustomerData) {
        this.customerAuth.next(data)
    }

    // Get Company Auth
    getCustomerAuth(): CustomerData {
        return this.customerAuth.value
    }

    // Customer Auth Change Emitter
    onCustomerAuthChange(): Observable<CustomerData> {
        return this.customerAuth
    }

    // Set Customer Pseudo
    setCustomerPseudo(data: any) {
        this.pseudo.next(data)
    }

    // Get Company Pseudo
    getCustomerPseudo(): any {
        return this.pseudo.value
    }

    // Set Subscription
    setSubscription(data: any) {
        this.subscription.next(data)
    }

    // Brand Change Emitter
    onSubscriptionChange(): Observable<any> {
        return this.subscription
    }

    // Get Subscription
    getSubscription(): any {
        return this.subscription.value
    }

    // Get AllowOrder status
    getAllowOrder(): any {
        return this.allowOrder.value
    }

    // Set AllowOrder status
    setAllowOrder(allow: boolean) {
        this.allowOrder.next(allow)
    }

    // AllowOrder Change Emitter
    onAllowOrderChange(): Observable<boolean> {
        return this.allowOrder
    }

    // Set Brand ID
    setBrandId(data: any) {
        this.brandId.next(data)
    }

    // Brand ID Change Emitter
    onBrandIdChange(): Observable<any> {
        return this.brandId
    }

    // Get Brand ID
    getBrandId(): any {
        return this.brandId.value
    }

    // Set Area ID
    setAreaId(data: any) {
        this.areaId.next(data)
    }

    // Area ID Change Emitter
    onAreaIdChange(): Observable<any> {
        return this.areaId
    }

    // Get Area ID
    getAreaId(): any {
        return this.areaId.value
    }

    // Set Area Details
    setAreaDetails(data: any) {
        this.areaDetails.next(data)
    }

    // Area Details Change Emitter
    onAreaDetailsChange(): Observable<any> {
        return this.areaDetails
    }

    // Get Area Details
    getAreaDetails(): any {
        return this.areaDetails.value
    }

    // Set Brand
    setBrand(data: any) {
        // console.log(data);
        this.brand.next(data)
    }

    // Brand Change Emitter
    onBrandChange(): Observable<any> {
        return this.brand
    }

    // Get Brand
    getBrand(): any {
        return this.brand.value
    }

    // Set Language List
    setLanguageList(data: LanguageData[]) {
        this.languageList.next(data)
    }

    // Language List Change Emitter
    onLanguageListChange(): Observable<LanguageData[]> {
        return this.languageList
    }

    // Get Language List
    getLanguageList(): any {
        return this.languageList.value
    }

    // Set Font List
    setFontList(data: FontData[]) {
        this.fontList.next(data)
    }

    // Font List Change Emitter
    onFontListChange(): Observable<FontData[]> {
        return this.fontList
    }

    // Set Selected Location
    setSelectedLocation(data: any) {
        this.selectedLocation = data
    }

    // Get Selected Location
    getSelectedLocation() {
        return this.selectedLocation
    }

    // Set Space Param
    setSpaceParam(data: any) {
        this.spaceParam = data
    }

    // Get Space Param
    getSpaceParam() {
        return this.spaceParam
    }

    // Set Token Param
    setTokenParam(data: any) {
        this.tokenParam = data
    }

    // Get Token Param
    getTokenParam() {
        return this.tokenParam
    }

    // Set Space Param
    setConsumerCodeParam(data: any) {
        this.consumerCodeParam = data
    }

    // Get Space Param
    getConsumerCodeParam() {
        return this.consumerCodeParam
    }

    // Set Id Param
    setIdParam(data: any) {
        this.idParam = data
    }

    // Get Id Param
    getIdParam() {
        return this.idParam
    }


    // Set Selected Language
    setSelectedLanguage(data: any) {
        this.languageList.value.forEach(element => {
            if (element.language_id == data) {
                this.selectedLanguageCode = element.code_iso
            }
        })
        this.selectedLanguage.next(data)
        localStorage.setItem(environment.keys.language, data)
    }

    // Selected Language Change Emitter
    onSelectedLanguageChange(): Observable<any> {
        return this.selectedLanguage
    }

    // Get Selected Language
    getSelectedLanguage() {
        return this.selectedLanguage.value
    }

    // Get Selected Language Code
    getSelectedLanguageCode() {
        return this.selectedLanguageCode
    }

    // Set Primary Color
    setPrimaryColor(data: any) {
        this.primaryColor.next(data)
        document.documentElement.style.setProperty('--primary-color', data)
    }

    // Set Primary Color
    setBgColor(data: any) {
        this.bgColor.next(data)
        document.documentElement.style.setProperty('--bg-color', data)
    }

    // Set Filter Primary
    setFilterPrimary(data: any) {
        this.filterPrimary.next(data)
        document.documentElement.style.setProperty('--filter-primary', data)
    }

    // // Primary Color Change Emitter
    // onPrimaryColorChange(): Observable<any> {
    //     return this.primaryColor
    // }

    // // Get Primary Color
    // getPrimaryColor() {
    //     return this.primaryColor.value
    // }

    // Set Allergen List
    setAllergenList(data: AllergenData[]) {
        this.allergenList.next(data)
    }

    // Allergen List Change Emitter
    getAllergenList(): AllergenData[] {
        return this.allergenList.value
    }

    // Allergen List Change Emitter
    onAllergenListChange(): Observable<any> {
        return this.allergenList
    }

    // Set Selected Allergen
    setSelectedAllergen(data: any) {
        this.selectedAllergen.next(data)
    }

    // Selected Allergen Change Emitter
    onSelectedAllergenChange(): Observable<any> {
        return this.selectedAllergen
    }

    // Get Selected Allergen
    getSelectedAllergen() {
        return this.selectedAllergen.value
    }

    // Set Category List
    setCategoryList(data: any[]) {
        this.categoryList.next(data)
    }

    // Category List Change Emitter
    onCategoryListChange(): Observable<any[]> {
        return this.categoryList
    }

    // Category List Change Emitter
    getCategoryList(): any[] {
        return this.categoryList.value
    }

    // Set Selected Category
    setSelectedCategory(data: any) {
        this.selectedCategory.next(data)
    }

    // Selected Category Change Emitter
    onSelectedCategoryChange(): Observable<any> {
        return this.selectedCategory
    }

    // Get Selected Category
    getSelectedCategory() {
        return this.selectedCategory.value
    }

    // Set Product List
    setProductList(data: any) {
        this.productList.next(data)
    }

    // Product List Change Emitter
    onProductListChange(): Observable<any> {
        return this.productList
    }

    // Product List Change Emitter
    getProductList(): any {
        return this.productList.value
    }

    // Set Menu List
    setMenuList(data: any) {
        this.menuList.next(data)
    }

    // Menu List Change Emitter
    onMenuListChange(): Observable<any> {
        return this.menuList
    }

    // Menu List Change Emitter
    getMenuList(): any {
        return this.menuList.value
    }

    // Set Advertisement List
    setAdvertisementList(data: any[]) {
        this.advertisementList.next(data)
    }

    // Advertisement List Change Emitter
    onAdvertisementListChange(): Observable<any[]> {
        return this.advertisementList
    }

    // Advertisement List Change Emitter
    getAdvertisementList(): any[] {
        return this.advertisementList.value
    }

    // Set Event List
    setEventList(data: any) {
        this.eventList.next(data)
    }

    // Event List Change Emitter
    onEventListChange(): Observable<any> {
        return this.eventList
    }

    // Event List Change Emitter
    getEventList(): any {
        return this.eventList.value
    }

    // Set Pictograms List
    setPictogramsList(data: any) {
        this.pictogramsList.next(data)
    }

    // Pictograms List Change Emitter
    onPictogramsListChange(): Observable<any> {
        return this.pictogramsList
    }

    // Pictograms List Change Emitter
    getPictogramsList(): any {
        return this.pictogramsList.value
    }

    // Set Cart Item List
    setCartItemList(data: any[]) {
        // console.log(data);
        this.cartItemList.next(data);
        localStorage.setItem(environment.keys.cart, JSON.stringify(data));
        // console.log(localStorage.getItem(environment.keys.cart));
    }

    // Cart Item List Change Emitter
    onCartItemListChange(): Observable<any[]> {
        return this.cartItemList
    }

    // Cart Item List Change Emitter
    getCartItemList(): any[] {
        return this.cartItemList.value
    }

    // Set Selected Product
    setSelectedProduct(data: any) {
        this.selectedProduct.next(data)
    }

    // Selected Product Change Emitter
    onSelectedProductChange(): Observable<any> {
        return this.selectedProduct
    }

    // Get Selected Product
    getSelectedProduct() {
        return this.selectedProduct.value
    }

    // Set From Where to Login
    setFromWhereToLogin(data: any) {
        this.fromWhereToLogin = data
    }

    // Get From Where to Login
    getFromWhereToLogin() {
        return this.fromWhereToLogin
    }

    // Set Order Comment
    setOrderComment(data: any) {
        this.orderComment = data
    }

    // Get Order Comment
    getOrderComment() {
        return this.orderComment
    }

    // Return device parameter
    checkDeviceParameter(data, parameter, defaultValue) {

        if (data.device_parameter) {
            if (data.device_parameter[parameter] || data.device_parameter[parameter] === 0) {
                if (data.device_parameter[parameter] !== '') {
                    return data.device_parameter[parameter]
                }
            } else if (data.default_parameter) {
                if (data.default_parameter[parameter] || data.default_parameter[parameter] === 0) {
                    if (data.default_parameter[parameter] !== '') {
                        return data.default_parameter[parameter]
                    }
                }
            }
        } else if (data.default_parameter) {
            if (data.default_parameter[parameter] || data.default_parameter[parameter] === 0) {
                if (data.default_parameter[parameter] !== '') {
                    return data.default_parameter[parameter]
                }
            }
        }

        return defaultValue
    }

    // Check timing for subscription activation // DEPRECATED
    checkTiming(timings: any): any {
        let now = new Date();
        let nowDay = now.getDay() == 0 ? 6 : (now.getDay() - 1)
        let nowTime = (now.getHours() < 10 ? "0" + now.getHours() : now.getHours()) + ":" + (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes())
        let timingsArray = JSON.parse(timings);
        let dayTimings = timingsArray[nowDay];
        let returnValue = {}
        let open = false;
        let nextTimeOpen = '';
        if (dayTimings) {
            dayTimings.forEach(dayTiming => {
                let endTime = dayTiming.end_time == "00:00" ? "24:00" : dayTiming.end_time;
                if (dayTiming.start_time == "00:00" && endTime == "24:00") {
                    open = true;
                }
                if (dayTiming.start_time < nowTime && nowTime < endTime) {
                    open = true;
                }
            });
        }

        returnValue = {
            isOpen: open,
            nextOpenTime: nextTimeOpen
        };
        return returnValue
    }

    // Price Float Check
    floatCheck(price) {
        return price.toFixed(2)
    }

    //Format date for product detail
    orderDate(valueDate): string {
        let arrayFullDate = valueDate.split(' ');
        let date = arrayFullDate[0].split('-')
        let time = arrayFullDate[1].split(':')
        let dateTime = new Date(Date.UTC(date[0], parseInt(date[1]) - 1, date[2], time[0], time[1]))
        let dateString = this.datePipe.transform(dateTime, 'yy.MM.dd hh:mm');
        return dateString
    }
}
