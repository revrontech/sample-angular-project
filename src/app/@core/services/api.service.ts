/*
    Base Api Service
    Created : 2022
*/

// Some needed modules --------- trying removing one
import { Injectable, } from '@angular/core'
import {
    HttpClient,
    HttpParams,
    HttpHeaders,
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, } from 'rxjs/internal/operators/catchError'
import { environment } from '../../../environments/environment'

// Essential Variables and Annotations
@Injectable({
    providedIn: 'root',
})

// Export Modules
export class ApiService {

    constructor(private http: HttpClient) { }

    // Error Handling
    private formatErrors(error: any) {
        try {
            if (error.error.message) {
                return [{ error: error, status: error.status, message: error.error.message }]
            } else {
                return [{ error: error, status: error.status, message: 'I think you have been disconnected!' }]
            }
        } catch (e) {
            return [{ error: error, status: error.status, message: 'I think you have been disconnected!' }]
        }
    }

    // GET Request Handler
    get(type: string, path: string, params: HttpParams = new HttpParams()): Observable<any> {
        const HttpUploadOptions = {
            headers: new HttpHeaders({
                'type': type
            }),
            params
        }
        return this.http.get(
            `${environment.api_url}${path}`, HttpUploadOptions)
            .pipe(catchError(this.formatErrors))
    }

    // POST Request Handler
    post(type: string, path: string, body: Object = {}): Observable<any> {
        const HttpUploadOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'type': type
            }),
        }
        return this.http.post(
            `${environment.api_url}${path}`,
            body, HttpUploadOptions,
        ).pipe(catchError(this.formatErrors))
    }

    // PUT Request Handler
    put(type: string, path: string, body: Object = {}): Observable<any> {
        const HttpUploadOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'type': type
            }),
        }
        return this.http.put(
            `${environment.api_url}${path}`,
            body, HttpUploadOptions,
        ).pipe(catchError(this.formatErrors))
    }

    // DELETE Request Handler
    delete(type: string, path: string, body: any = {}): Observable<any> {
        const HttpUploadOptions = {
            headers: new HttpHeaders({
                'type': type
            }),
            body: body
        }
        return this.http.delete(
            `${environment.api_url}${path}`, HttpUploadOptions
        ).pipe(catchError(this.formatErrors))
    }

}
