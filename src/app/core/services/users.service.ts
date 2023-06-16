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

    createCompetitionBudget(budget: any, competitionId: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/add_competition_budget/${competitionId}`, budget);
    }

    updateCompetitionReport(competitionId: any, competition: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/competition-budget-report/${competitionId}`, competition);
    }
    //
    deleteCompetition(competitionId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/competitions/${competitionId}/delete`);
    }
}
