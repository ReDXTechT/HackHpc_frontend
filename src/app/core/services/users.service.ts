import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {Competition} from "../models/competiton";
import {Budget} from "../models/budget";
import {Competitor, Customer, User} from "../models/User";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getCustomerDetailsById(customerId: number): Observable<Customer> {
        return this.http.get<Customer>(`${this.baseUrl}/customer/${customerId}`);
    }
    getCompetitorDetailsById(competitorId: number): Observable<Competitor> {
        return this.http.get<Competitor>(`${this.baseUrl}/competitor/${competitorId}`);
    }
    getUserById(userId: number): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/users/${userId}`);
    }

    getAllCustomers(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/customers`);
    }
    getAllPendingCustomers(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/pending-customers`);
    }
    approveCustomerAccount(CustomerId: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/customer/${CustomerId}/approve-account`,{});
    }
    rejectCustomerAccount(CustomerId: any): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/customer/${CustomerId}/reject-account`,{});
    }

    submitScore(competitionId: any, competitiorId: any,quizId:any, score:any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/competition/${competitionId}/competitor/${competitiorId}/quiz/${quizId}/submit-score`, score);
    }
    //
    deleteCompetition(competitionId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/competitions/${competitionId}/delete`);
    }
    getCompetition(competitionId: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/competitions/${competitionId}`);
    }
    getFilteredCustomers( name: string): Observable<any> {
        let params = new HttpParams();
        const url = `${this.baseUrl}/customers/filter`;

        if (name) {
            params = params.set('name', name);
        }
        return this.http.get<any>(url, { params });
    }

    updateProfilePicture(userId: number, image: FormData): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/update-profile-picture/${userId}`, image);
    }

    updateCustomer(customer:any,userId:any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/update-customer/${userId}`, customer);
    }

    updateCompetitor(competitor:any,userId:any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/update-competitor/${userId}`, competitor);
    }

    getCompetitorContributions(userId : any): Observable<Competition[]> {
        return this.http.get<Competition[]>(`${this.baseUrl}/competitors-contributions/${userId}`);
    }

    getCompetitorAchievements(userId : any): Observable<Competition[]> {
        return this.http.get<Competition[]>(`${this.baseUrl}/competitor-achievements/${userId}`);
    }
    getCustomerActivities(userId : any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/customer-activities/${userId}`);
    }
    getCustomerCompetitions(userId : any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/competitions/sponsor/${userId}`);
    }

    getCustomerPendingCompetitions(userId : any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/pending-competitions/customer/${userId}`);
    }
    getCustomerActiveCompetitions(userId : any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/active-competitions/customer/${userId}`);
    }
    getCustomerTerminatedCompetitions(userId : any): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/terminated-competitions/customer/${userId}`);
    }
}
