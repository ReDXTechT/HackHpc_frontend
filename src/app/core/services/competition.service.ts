import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Competition} from "../models/competiton";

@Injectable({
    providedIn: 'root'
})
export class CompetitionService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }
    getCompetitionsById(competitionId : string): Observable<Competition> {
        return this.http.get<Competition>(`${this.baseUrl}/competitions/${competitionId}`);
    }
    getAllApprovedCompetitions(): Observable<Competition[]> {
        return this.http.get<Competition[]>(`${this.baseUrl}/competitions`);
    }
    getAllApprovedNotCompletedCompetitions(): Observable<Competition[]> {
        return this.http.get<Competition[]>(`${this.baseUrl}/competitions/approved_notCompleted`);
    }
    getFilteredCompetitions(status: string, title: string, code_type: string): Observable<Competition[]> {
        let params = new HttpParams();
        const url = `${this.baseUrl}/competitions/filter`;

        if (status) {
            params = params.set('status', status);
        }
        if (code_type) {
            params = params.set('code_type', code_type);
        }
        if (title) {
            params = params.set('title', title);
        }

        return this.http.get<Competition[]>(url, { params });
    }
    getAllCompetitionsBySponsor(sponsorId : string): Observable<Competition[]> {
        return this.http.get<Competition[]>(`${this.baseUrl}/competitions/sponsor/${sponsorId}`);
    }
    createCompetition(competition: any): Observable<Competition> {
        return this.http.post<Competition>(`${this.baseUrl}/create_competitions`, competition);
    }

    // update(id: number, review: Review): Observable<Review> {
    //     return this.http.put<Review>(`${this.baseUrl}${id}/`, review);
    // }
    //
    deleteCompetition(competitionId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/competitions/${competitionId}/delete`);
    }
}
