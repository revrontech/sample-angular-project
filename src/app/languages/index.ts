/*
    Translation Service
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Injectable } from '@angular/core'
import { TRANSLATIONS_EN } from './en-us'
import { TRANSLATIONS_FR } from './fr'
import { CommonService } from '../@core/services'
import { TRANSLATIONS_AR_ARB } from './ar-arb'

// Essential Variables and Annotations
@Injectable({
    providedIn: 'root',
})

// Export Modules
export class TranslationService {

    private translations = {
        'en-us': TRANSLATIONS_EN,
        'fr': TRANSLATIONS_FR,
        'ar-arb': TRANSLATIONS_AR_ARB
    }

    constructor(private commonService: CommonService) { }

    // Get Translations
    getTranslation(): any {
        /* Use this for multi linguistics */
        let languageCode = this.commonService.getSelectedLanguageCode()
        if (this.translations.hasOwnProperty(languageCode)) {
            return this.translations[languageCode]
        } else {
            // return this.translations['en-us']
            return this.translations['fr']
        }
        /* Use this to fix French Language as the only language */
        // return this.translations['fr']
    }

    // Get Home Translations
    getHomeTranslations(): any {
        return this.getTranslation()['home']
    }

    // Get Header Translations
    getHeaderTranslations(): any {
        return this.getTranslation()['header']
    }

    // Get Catalog Translations
    getCatalogTranslations(): any {
        return this.getTranslation()['catalog']
    }

    // Get Detail Translations
    getDetailTranslations(): any {
        return this.getTranslation()['detail']
    }

    // Get Cart Translations
    getCartTranslations(): any {
        return this.getTranslation()['cart']
    }

    // Get Allergen Modal Translations
    getAllergenModalTranslations(): any {
        return this.getTranslation()['allergens']
    }
    // Get Order Modal Translations
    getOrderTypeTranslations(): any {
        return this.getTranslation()['ordertype']
    }

    // Get Pick up time Modal Translations
    getPickupTranslations(): any {
        return this.getTranslation()['pickup']
    }

    // Get Menu Translations
    getMenuTranslations(): any {
        return this.getTranslation()['menu'];
    }

    // Get Suggestion Translations
    getSuggestionTranslations(): any {
        return this.getTranslation()['suggestions'];
    }

    // Get Login Translations
    getLoginTranslations(): any {
        return this.getTranslation()['login'];
    }

    // Get Register Translations
    getRegisterTranslations(): any {
        return this.getTranslation()['register'];
    }

    // Get Forgot Translations
    getForgotTranslations(): any {
        return this.getTranslation()['forgot'];
    }

    // Get Pseudo Translations
    getPseudoTranslations(): any {
        return this.getTranslation()['pseudo'];
    }

    // Get Order Translations
    getOrderTranslations(): any {
        return this.getTranslation()['order'];
    }

    // Get Profile Translations
    getProfileTranslations(): any {
        return this.getTranslation()['profile'];
    }

    // Get Scan Translations
    getScanTranslations(): any {
        return this.getTranslation()['scan'];
    }
}
