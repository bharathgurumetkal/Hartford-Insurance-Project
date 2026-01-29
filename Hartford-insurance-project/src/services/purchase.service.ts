import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PurchaseService {

    private apiUrl = 'http://localhost:3000/purchases';

    constructor(private http: HttpClient) { }

    submitPurchase(purchaseData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, purchaseData);
    }

    getPurchases(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getPurchaseById(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    calculatePremium(basePremium: number, paymentMode: string, age?: number): number {
        let premium = basePremium;

        // Age-based adjustment (optional)
        if (age) {
            if (age > 60) {
                premium *= 1.2; // 20% increase for seniors
            } else if (age < 25) {
                premium *= 1.1; // 10% increase for young adults
            }
        }

        // Payment mode adjustment
        if (paymentMode === 'Monthly') {
            premium = Math.round(premium / 12);
        }

        return Math.round(premium);
    }
}
