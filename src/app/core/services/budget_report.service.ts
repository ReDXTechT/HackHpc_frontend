import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Competition} from "../models/competiton";
import {Budget} from "../models/budget";

@Injectable({
    providedIn: 'root'
})
export class Budget_reportService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }
    getBudgetDetailsByCompetitionsId(competitionId : string): Observable<Budget[]> {
        return this.http.get<Budget[]>(`${this.baseUrl}/retrieve_competition_budget/${competitionId}`);
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
