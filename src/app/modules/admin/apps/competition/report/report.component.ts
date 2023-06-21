import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
    FormArray, FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators
} from '@angular/forms';
import {CompetitionService} from "../../../../../core/services/competition.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Budget_reportService} from "../../../../../core/services/budget_report.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Competition} from "../../../../../core/models/competiton";
import html2pdf from 'html2pdf.js';
import {catchError, of, startWith} from "rxjs";
import {DatePipe} from "@angular/common";
import {UsersService} from "../../../../../core/services/users.service";
import {Customer} from "../../../../../core/models/User";

@Component({
    selector     : 'report',
    templateUrl  : './report.component.html',
})
export class ReportComponent implements OnInit
{
    horizontalStepperForm: UntypedFormGroup;
    loading = false;
    budgetForm: FormGroup;
    feedbackContent: string;
    competition : Competition;
    competitionId : string
    budget: any;
    totalCost : any
    customer : Customer
    constructor(private _formBuilder: UntypedFormBuilder,
                private budgetReportService: Budget_reportService,
                private competitionService: CompetitionService,
                private usersService: UsersService,
                private _snackBar: MatSnackBar,
                private route: ActivatedRoute,
                private router: Router,
                private datePipe: DatePipe,
                private _changeDetectorRef: ChangeDetectorRef,)
    {
    }
    async ngOnInit(): Promise<void> {
        console.log(this.budget)

        this.competitionId = this.route.snapshot.paramMap.get('id');
        this.competition = await this.getCompetitionById(this.competitionId);
        this.getBudgetDetailsByCompetitionId(this.competitionId);
        this.budgetForm = this._formBuilder.group({
            feedback : [this.budget?.feedback || '', Validators.required],
            starting_date : [this.competition?.starting_date || '', Validators.required],
            submission_deadline : [this.competition?.submission_deadline || '', Validators.required],
            instance_type : [this.competition?.instance_type || '', Validators.required],
            custom_ami : [this.competition?.ami || '', Validators.required],
            winner_announcement_date : [this.competition?.winner_announcement_date || '', Validators.required],
            budget_items: this._formBuilder.array([])
        });

        this.budgetForm.valueChanges.pipe(
            startWith(null) // Emit initial value to trigger the calculation
        ).subscribe(() => {
            this.calculateTotalCost();
        });
    }
    async  getCompetitionById(competitionId : string): Promise<Competition>{
        return new Promise((resolve, reject) => {
            this.competitionService.getCompetitionsById(competitionId).subscribe(res=>{
                    console.log(res)
                    this.competition =res
                this.usersService.getCustomerDetailsById(res.sponsor).subscribe(customer=>{
                    this.customer=customer
                    console.log( this.customer)

                })
                    resolve(res);
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }
    getBudgetDetailsByCompetitionId(competitionId) {
        this.budgetReportService.getBudgetDetailsByCompetitionsId(competitionId)
            .pipe(
                catchError(error => {
                    const service = this._formBuilder.group({
                        item: ['', Validators.required],
                        cost: ['', Validators.required],
                        description: ['', Validators.required],
                    });
                    this.budgetItems.push(service);
                    console.error('Error retrieving budget details:', error);
                    throw error;  // Throwing the error stops the subscription from continuing
                })
            )
            .subscribe(res => {
                console.log(res);
                this.budget = res;
                this.budgetForm.get('feedback').setValue(this.budget?.feedback || '');

                if (this.budget && this.budget.budget_items) { // Check if budget_items exists
                    this.budget.budget_items.forEach(item => {
                        const service = this._formBuilder.group({
                            item: [item.item, Validators.required],
                            cost: [item.cost, Validators.required],
                            description: [item.description, Validators.required],
                        });
                        this.budgetItems.push(service);
                    });
                }
            });
    }

    get budgetItems(): FormArray {
        return this.budgetForm.get('budget_items') as FormArray;
    }
    addService(item?: any): void {
        let serviceGroup;

        if (item) {
            // If item data provided, initialize form group with data
            serviceGroup = this._formBuilder.group({
                item: [item.item, Validators.required],
                cost: [item.cost, Validators.required],
                description: [item.description, Validators.required]
            });
        } else {
            // Otherwise, initialize with empty values
            serviceGroup = this._formBuilder.group({
                item: ['', Validators.required],
                cost: ['', Validators.required],
                description: ['', Validators.required]
            });
        }

        const services = this.budgetForm.get('budget_items') as FormArray;
        services.push(serviceGroup);

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }


    updateDescriptionContent(content: string): void {
        this.feedbackContent = content;

    }

    formatDate(date: string): string {
        if (date) {
            const formattedDate = new Date(date);
            return this.datePipe.transform(formattedDate, 'yyyy-MM-dd');
        }
        return '';
    }

    removeService(index: number): void {

        const services = this.budgetForm.get('budget_items') as FormArray;
        services.removeAt(index);
        this._changeDetectorRef.markForCheck();
    }
    showNotification(colorName, text, placementFrom, placementAlign) {
        this._snackBar.open(text, 'close', {
            duration: 5000,
            verticalPosition: placementFrom,
            horizontalPosition: placementAlign,
            panelClass: colorName,
        });
    }
    navigateToCompetitionDetailsTab(tabId: string) {
        this.router.navigateByUrl('/apps/pending-competitions/' +this.competitionId+'#'+ tabId);
    }

    calculatePeriod(): number {
        const startDate = new Date(this.budgetForm.value.starting_date); // Replace 'random date' with the actual starting date
        const winnerDate = new Date(this.budgetForm.value.winner_announcement_date);
        const differenceInTime = winnerDate.getTime() - startDate.getTime();
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays;
    }

    calculateTotalCost(): void {
        let total = 0;
        const budgetItems = this.budgetForm.get('budget_items') as FormArray;

        for (let i = 0; i < budgetItems.controls.length; i++) {
            const item = budgetItems.controls[i];
            total += +item.value.cost; // Convert cost to number using the '+' operator
        }
        this.totalCost = total;
    }
    generatePDF(): void {
        const element = document.getElementById('report-section'); // Replace 'report-section' with the id of the div containing the report
        const opt = {
            margin: [0.3, 0.3, 0.3, 0.3], // Set the margins (in inches) for the PDF
            filename: 'report.pdf', // Set the filename for the downloaded PDF
            image: { type: 'jpeg', quality: 0.98 }, // Set the image quality for the PDF
            html2canvas: { scale: 2 }, // Set the scale for the HTML to Canvas conversion
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }, // Set the PDF format and orientation
        };

        html2pdf().set(opt).from(element).save(); // Generate and save the PDF
    }
    onSubmit(): void {
        if (this.budgetForm.valid) {
            const winnerAnnouncementDate = this.formatDate(this.budgetForm.value.winner_announcement_date);
            const submissionDeadline = this.formatDate(this.budgetForm.value.submission_deadline);
            const starting_date = this.formatDate(this.budgetForm.value.starting_date);
            const payload = {
                id: 1,
                feedback: this.budgetForm.value.feedback,
                starting_date: starting_date,
                submission_deadline:submissionDeadline,
                winner_announcement_date:winnerAnnouncementDate,
                instance_type: this.budgetForm.value.instance_type,
                custom_ami: this.budgetForm.value.custom_ami,
                competition: this.competitionId,
                budget_items: this.budgetForm.value.budget_items
            };

            console.log(this.budgetForm.value);
            this.loading = true;
            console.log(this.budget)
            if (this.budget !== undefined) {
                console.log(this.budget)
                console.log("update")
                // Update report
                this.updateReport(this.competitionId, payload);
            } else {
                console.log("create")

                // Create new report
                this.budgetReportService.createCompetitionBudget(payload, this.competitionId).subscribe(
                    (res) => {
                        this.loading = false;
                        this.showNotification('snackbar-success', 'Budget report added successfully!', 'bottom', 'center');
                        this.navigateToCompetitionDetailsTab('Budget');
                    },
                    (error) => {
                        console.error('Error occurred while creating budget report:', error.error.error);
                        this.loading = false;
                        this.showNotification('snackbar-danger', error.error.error, 'bottom', 'center');
                    }
                );
            }
        }
    }

    updateReport(competitionId: any, payload: any){
        this.budgetReportService.updateCompetitionReport(competitionId,payload).subscribe(res=>{
            console.log(res)
        })
    }

}
