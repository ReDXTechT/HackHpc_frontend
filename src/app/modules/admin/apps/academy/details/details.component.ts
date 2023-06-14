import { CdkScrollable } from '@angular/cdk/scrolling';
import { DOCUMENT, NgClass, NgFor, NgIf } from '@angular/common';
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

@Component({
    selector       : 'academy-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports: [MatSidenavModule, FormsModule, ReactiveFormsModule, RouterLink, MatIconModule, NgIf, NgClass, NgFor, MatButtonModule, MatProgressBarModule, CdkScrollable, MatTabsModule, FuseFindByKeyPipe, FuseAlertComponent, MatFormFieldModule, MatInputModule],
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

    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private competitionService: CompetitionService,
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
            const competitionId = this.route.snapshot.paramMap.get('id');
            this.competition = await this.getCompetitionById(competitionId);
            console.log(this.competition);
        } catch (error) {
            console.error('Error fetching competition:', error);
        }
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
