import { DecimalPipe, NgFor } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {ActivatedRoute, Router} from '@angular/router';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import {CompetitionService} from "../../../../../core/services/competition.service";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector       : 'analytics',
    templateUrl    : './analytics.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatButtonModule, MatIconModule, MatMenuModule, MatButtonToggleModule, NgApexchartsModule, MatTooltipModule, NgFor, DecimalPipe],
})
export class AnalyticsComponent implements OnInit
{

    url: SafeResourceUrl;
    competition_title: string;

    constructor(private _activatedRoute: ActivatedRoute, private competitionService: CompetitionService, private _changeDetectorRef: ChangeDetectorRef, private _sanitizer: DomSanitizer) { }

    ngOnInit(): void {
        this._activatedRoute.params.subscribe(params => {
            const compId = params['compId'];
            this.competitionService.getCompetitionsById(compId).subscribe(res=>{
                this.competition_title=res.title.replace(" ", "-").toLowerCase();
                let rawUrl = `https://${this.competition_title}-grafana-visualization.hackhpc.com`;
                this.url = this._sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
                this._changeDetectorRef.detectChanges();
            });
        });
    }



    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

}
