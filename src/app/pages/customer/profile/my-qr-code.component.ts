import { Component, OnInit } from '@angular/core';
import { CommonService, CustomerService, BrandService } from 'src/app/@core/services';
import { TranslationService } from 'src/app/languages';

@Component({
  selector: 'app-my-qr-code',
  templateUrl: './my-qr-code.component.html'
})
export class MyQrCodeComponent implements OnInit {

  staticContent
  customerName = ''
  customerInitials = ''
  public myQrCode: any = '';
  points: number = 0
  constructor(private commonService: CommonService, private translationService: TranslationService, private customerService: CustomerService, private brandService: BrandService) { 
    
  }

  ngOnInit(): void {
    this.commonService.onSelectedLanguageChange().subscribe(() => {
      this.updateTranslation(this.translationService.getProfileTranslations())
    })
    var customerData = this.commonService.getCustomerAuth()
    this.customerName = customerData.firstname + ' ' + customerData.lastname
    this.customerInitials = customerData.firstname.toUpperCase().substr(0, 1) + customerData.lastname.toUpperCase().substr(0, 1)

    this.customerService.customerDetails().subscribe(res => {
      if(res['status']=== 200){
        let loyaltyArray = res['data'].loyalty_points
        if(loyaltyArray.length > 0){
            this.points = parseInt(loyaltyArray[0].balance)
        }
        this.myQrCode = res['data'].qr_code;
      }
    })
  }

  // Update Translations
  updateTranslation(translations: any) {
    this.staticContent = translations
  }
  // Go to catalog
  takeHome() {
    this.commonService.navigate('pages/nav-profile')
}
}
