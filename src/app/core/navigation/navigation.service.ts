import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }
    get(): Observable<Navigation>
    {
        return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) =>
            {
                this._navigation.next(navigation);
            }),
        );
    }
}
