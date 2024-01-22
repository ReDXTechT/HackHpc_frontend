import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Competition} from "../models/competiton";
import {user} from "../../mock-api/common/user/data";

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
    getAllPendingCompetitions(): Observable<Competition[]> {
        return this.http.get<Competition[]>(`${this.baseUrl}/competitions/pending`);
    }
    getAllComingSoonCompetitions(): Observable<Competition[]> {
        return this.http.get<Competition[]>(`${this.baseUrl}/competitions/starting_soon`);
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

    updateCompetitionOverview(competitionId: number, competition: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/competition-update-overview/${competitionId}`, competition);
    }

    updateCompetitionAMIForTest(competitionId: number, body: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/competition/${competitionId}/update_ami_instance_type`, body);
    }

    testCompetition(competitionId: string,userId :any): Observable<any> {
        return this.http.post(`${this.baseUrl}/testCompetitionInstance/admin/${userId}/competition/${competitionId}`,{});
    }
    launchCompetition(competitionId: string,userId :any): Observable<any> {
        return this.http.post(`${this.baseUrl}/launch_competition/competition/${competitionId}/user/${userId}`,{});
    }
    endCompetition(competitionId: string,userId :any): Observable<any> {
        return this.http.post(`${this.baseUrl}/end_competition/competition/${competitionId}/user/${userId}`,{});
    }
    approveCompetition(competitionId: string): Observable<any> {
        return this.http.post(`${this.baseUrl}/competition/${competitionId}/approve`,{});
    }
    rejectCompetition(competitionId: string,body: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/competition/${competitionId}/reject`,body);
    }

    getAllWaitingListByCompetitionId(competitionId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/competitions/${competitionId}/competitors/waiting`);
    }
    getTeamByCompetitionId(competitionId : any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/competitions/${competitionId}/approved-competitors`);
    }
    checkCompetitorApprovedByInCompetition(competitorId: number, competitionId : any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/check-competitor-approval-status/${competitorId}/${competitionId}`);
    }
    approveJoinRequest(requestId: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/join-request/${requestId}/approve`,{});
    }
    rejectJoinRequest(requestId: string): Observable<any> {
        return this.http.put(`${this.baseUrl}/join-request/${requestId}/reject`,{});
    }

    getActiveCompetitions(): Observable<Competition[]> {
        return this.http.get<Competition[]>(`${this.baseUrl}/competitions/running`);
    }
    getTerminatedCompetitions(): Observable<Competition[]> {
        return this.http.get<Competition[]>(`${this.baseUrl}/competitions/terminated`);
    }
    getCompetitorContributions(userId : any): Observable<Competition[]> {
        return this.http.get<Competition[]>(`${this.baseUrl}/competitors-contributions/${userId}`);
    }

    update_winner_annoucement(competition_id: string, payload): Observable<any> {
        return this.http.put(`${this.baseUrl}/update-achievement/${competition_id}`,payload);
    }

    winner_annoucement(competition_id: number, payload): Observable<any> {
        return this.http.post(`${this.baseUrl}/add-achievement/${competition_id}`,payload);
    }
    getWinnersByCompetitionId(competitionId : any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/winners/${competitionId}`);
    }

    getamis(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/custom-amis`);
    }
}
