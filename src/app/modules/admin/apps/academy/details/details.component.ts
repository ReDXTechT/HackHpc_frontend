import { CdkScrollable } from '@angular/cdk/scrolling';
import {CurrencyPipe, DOCUMENT, NgClass, NgFor, NgIf} from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Subject, takeUntil } from 'rxjs';
import {CompetitionService} from "../../../../../core/services/competition.service";
import {Competition} from "../../../../../core/models/competiton";
import {FuseAlertComponent} from "../../../../../../@fuse/components/alert";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";

import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Note} from "../../notes/notes.types";
import {MatTableModule} from "@angular/material/table";
import {Budget_reportService} from "../../../../../core/services/budget_report.service";
import {ApexOptions, NgApexchartsModule} from "ng-apexcharts";

@Component({
    selector       : 'academy-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [MatSidenavModule, FormsModule, ReactiveFormsModule, RouterLink, MatIconModule, NgIf, NgClass, NgFor, MatButtonModule, MatProgressBarModule, CdkScrollable, MatTabsModule, FuseFindByKeyPipe, FuseAlertComponent, MatFormFieldModule, MatInputModule, MatTableModule, CurrencyPipe, NgApexchartsModule],
})
export class AcademyDetailsComponent implements OnInit
{

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    competition : Competition
    submissionForm: UntypedFormGroup;
    public endsInText: string;
    public days: number;
    public hours: number;
    public minutes: number;
    data: any;
    datasource: any;
    chartBudgetDistribution: ApexOptions = {};
    selectedIndex = 0;


    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private competitionService: CompetitionService,
        private budgetReportService: Budget_reportService,
        private route: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: UntypedFormBuilder,

        private _elementRef: ElementRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    )
    {
        this.submissionForm = this._formBuilder.group({
            git_repo_url  : ['',Validators.required],
            validate_script  : ['',Validators.required],
            expected_output  : ['',Validators.required],
            solution_description  : ['',Validators.required],

        });
    }

    async ngOnInit(): Promise<void> {
        try {
            this.route.fragment.subscribe(fragment => {
                if (fragment === 'Rules') {
                    this.selectedIndex = 1;
                } else if (fragment === 'Budget') {
                    this.selectedIndex = 2;
                } else if (fragment === 'Team') {
                    this.selectedIndex = 3;
                } else if (fragment === 'Leaderboard') {
                    this.selectedIndex = 4;
                } else if (fragment === 'Solution_Checker') {
                    this.selectedIndex = 5;
                } else {
                    this.selectedIndex = 0; // Set the index of the default tab
                }
            });
            const competitionId = this.route.snapshot.paramMap.get('id');
            this.competition = await this.getCompetitionById(competitionId);
            this.getBudgetDetailsByCompetitionId(competitionId);
        } catch (error) {
            console.error('Error fetching competition:', error);
        }
        this.datasource = {
            budgetDetails: {
                columns: ['Item', 'Description', 'Total_cost']
            }
        };
    }
    getDotColor(index: number): string {
        const dotColors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-amber-500', 'bg-indigo-500'];
        const dotColorIndex = index % dotColors.length;
        return dotColors[dotColorIndex];
    }
    getTotalCost(): number {
        let totalCost = 0;
        for (const budget of this.data.budget_items) {
            totalCost += Number(budget.cost);
        }
        return totalCost;
    }

    getBudgetDetailsByCompetitionId(competitionId){
        this.budgetReportService.getBudgetDetailsByCompetitionsId(competitionId).subscribe(res=>{
            console.log(res)
            this.data = res
            this.prepareChartData()
        })
    }

    private prepareChartData(): void
    {
        this.chartBudgetDistribution = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                width:'100%',
                height: '700px',
                type: 'radar',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#818CF8'],
            dataLabels: {
                enabled: true,
                formatter: (val: number): string | number => `${val}%`,
                textAnchor: 'start',
                style: {
                    fontSize: '13px',
                    fontWeight: 500,
                },
                background: {
                    borderWidth: 0,
                    padding: 4,
                },
                offsetY: -15,
            },
            markers: {
                strokeColors: '#818CF8',
                strokeWidth: 4,
            },
            plotOptions: {
                radar: {
                    polygons: {
                        strokeColors: 'var(--fuse-border)',
                        connectorColors: 'var(--fuse-border)',
                    },
                },
            },
            series: [
                {
                    name: 'Budget Distribution',
                    data: this.calculateBudgetDistribution(),
                },
            ],
            stroke: {
                width: 2,
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: (val: number): string => `${val}%`,
                },
            },
            xaxis: {
                labels: {
                    show: true,
                    style: {
                        fontSize: '15px',
                        fontWeight: '500',
                    },
                },
                categories: this.data.budget_items.map((budget: any) => budget.item),
            },
            yaxis: {
                max: (max: number): number => parseInt((max + 10).toFixed(0), 10),
                tickAmount: 7,
            },
        };



    }
    calculateBudgetDistribution(): number[] {
        const totalCost = this.data.budget_items.reduce((sum: number, budget: any) => sum + parseFloat(budget.cost), 0);
        return this.data.budget_items.map((budget: any) => Math.round((parseFloat(budget.cost) / totalCost) * 100 * 10) / 10);
    }




    async  getCompetitionById(competitionId : string): Promise<Competition>{
        return new Promise((resolve, reject) => {
        this.competitionService.getCompetitionsById(competitionId).subscribe(res=>{
            console.log(res)
            this.competition =res
            if (this.competition.status === 'Terminated') {
                this.endsInText = 'Ended In';
                // Calculate the difference between the winner announcement date and the current date
                const winnerAnnouncementDate = new Date(this.competition.winner_announcement_date);
                const currentDate = new Date();
                const diff = winnerAnnouncementDate.getTime() - currentDate.getTime();
                this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
            } else if (this.competition.status === 'About_to_start') {
                this.endsInText = 'Starting In';
                // Calculate the difference between the competition starting date and the current date
                const startingDate = new Date(this.competition.starting_date);
                const currentDate = new Date();
                const diff = startingDate.getTime() - currentDate.getTime();
                this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
                this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            } else {
                this.endsInText = 'Ends In';
                // Calculate the difference between the winner announcement date and the current date
                const winnerAnnouncementDate = new Date(this.competition.winner_announcement_date);
                const currentDate = new Date();
                const diff = winnerAnnouncementDate.getTime() - currentDate.getTime();
                this.days = Math.floor(diff / (1000 * 60 * 60 * 24));
                this.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                this.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            }
            resolve(res);

            },
            (error) => {
                reject(error);
            }
        );
        });
    }
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    uploadFile(fileList: FileList): void {
        // Return if canceled
        if (!fileList.length) {
            return;
        }

        const allowedTypes = ['text/plain'];
        const file = fileList[0];

        // Return if the file is not allowed
        if (!allowedTypes.includes(file.type)) {
            return;
        }

        this._readAsText(file).then((data) => {
            // Handle the uploaded file data
            console.log(data);

            // Update the note
        });
    }

    private _readAsText(file: File): Promise<any> {
        // Return a new promise
        return new Promise((resolve, reject) => {
            // Create a new reader
            const reader = new FileReader();

            // Resolve the promise on success
            reader.onload = (): void => {
                resolve(reader.result);
            };

            // Reject the promise on error
            reader.onerror = (e): void => {
                reject(e);
            };

            // Read the file as text
            reader.readAsText(file);
        });
    }

}
