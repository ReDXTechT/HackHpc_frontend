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

    getLeaderBoard(competitionId : string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/competitions/${competitionId}/leaderboard`);
    }
    getFilteredCandidatsOnLeaderBoard( competitionId : string ,name: string): Observable<any> {
        let params = new HttpParams();
        const url = `${this.baseUrl}/competitions/${competitionId}/leaderboard`;

        if (name) {
            params = params.set('search', name);
        }
        return this.http.get<any>(url, { params });
    }

    getsubmissionsCountPerDay(competitionId: any, competitorId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/competitions/${competitionId}/competitor/${competitorId}/submissions_count_per_day`);
    }

    getsubmissionsById(submissionId : string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/submission/${submissionId}`);
    }

    getsubmissionsByCompetitiorId(competitorId : string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/submissions_by_competitor/${competitorId}`);
    }

    createSubmission(competitionId : string ,competitorId : string, submission: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/submission_verification/${competitionId}/user/${competitorId}`, submission);
    }

}
