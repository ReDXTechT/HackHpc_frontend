import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Competition} from "../models/competiton";
import {Budget} from "../models/budget";

@Injectable({
    providedIn: 'root'
})
export class SubmissionsService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getsubmissions(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/submissions`);
    }

    getsubmissionsByCompetitionsId(competitionId : string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/submissions_by_competition/${competitionId}`);
    }

    getsubmissionsByCompetitiorId(competitorId : string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/submissions_by_competitor/${competitorId}`);
    }

    createSubmission(competitionId : string ,competitorId : string, submission: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/submission_verification/${competitionId}/user/${competitorId}`, submission);
    }

}
