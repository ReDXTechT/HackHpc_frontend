import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Competition} from "../models/competiton";
import {Budget} from "../models/budget";
import {Customer} from "../models/User";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCustomerDetailsById(customerId: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.baseUrl}/customer/${customerId}`);
    }

    getAllCustomers(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/customers`);
    }

    submitScore(competitionId: any, competitiorId: any,quizId:any, score:any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/competition/${competitionId}/competitor/${competitiorId}/quiz/${quizId}/submit-score`, score);
    }
    //
    deleteCompetition(competitionId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/competitions/${competitionId}/delete`);
    }
}
