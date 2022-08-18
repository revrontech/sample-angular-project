export interface CompanyData {
    company: string;
    auth_key: string;
}

export interface CustomerData {
    email: string,
    lastname: string,
    phone: string,
    firstname: string,
    auth_key: string
}

export interface LanguageData {
    language_id: string;
    label: string;
    code_iso: string;
    icon_path: string;
}

export interface AllergenData {
    id: string;
    label: string;
    picto_url: string;
}

export interface FontData {
    id: string;
    label: string;
}