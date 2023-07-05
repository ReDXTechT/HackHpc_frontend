import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddCompetition} from "./add-competition/add-competition.component";
import {ReportComponent} from "./report/report.component";
import {PendingCompetitionsListComponent} from "../pending-competitions/list/list.component";

const routes: Routes = [

  {
    path: 'add-competition',
    component: AddCompetition
  },
  {
    path: 'competition-report/:id',
    component: ReportComponent
  },
    {
        path: 'customer-pending-competition/:id',
        component: PendingCompetitionsListComponent
    },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetitionRoutes {}
