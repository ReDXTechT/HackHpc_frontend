import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject, map, Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";
import {User} from "../models/User";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private baseUrl = environment.apiUrl;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(
            JSON.parse(localStorage.getItem('currentUser'))
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http
            .post<any>(`${environment.apiUrl}/login`, {
                email,
                password,
            })
            .pipe(
                map((user) => {
                    // Check if the returned object is an error message
                    if(user && user.msg && user.msg === 'Invalid Credentials'){
                        console.log(user);
                        return {msg: 'Invalid Credentials'};
                    } else {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('jwt_token', user.access);
                        localStorage.setItem('id', user.id);
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                        return user;
                    }
                })
            );
    }

    public registerCustomer(customer : any) {
        return this.http.post<any>(`${environment.apiUrl}/register_customer`, customer)
            .pipe(
                map((res)=>{
                    return res;
                })
            );
    }
    public registerCompetitor(competitor : any) {
        return this.http.post<any>(`${environment.apiUrl}/register_competitor`, competitor)
            .pipe(
                map((res)=>{
                    return res;
                })
            );
    }
    public changePassword(userId: number, email: string, password: string[], new_password: string[]):any {
        return this.http.post(`${environment.apiUrl}/user/${userId}/change-password`, {email, password, new_password})

    }
    public resetPassword(userId: string, token: string, password: string, confirm_password: string) {
        return this.http.post(`${environment.apiUrl}/set-new-password/${userId}/${token}`, { password, confirm_password})

    }
    public forgetPassword(email: string) {
        return this.http.get(`${environment.apiUrl}/forget-password/${email}`)

    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('jwt_token');
        this.currentUserSubject.next(null);
        return of({ success: false });
    }

}
