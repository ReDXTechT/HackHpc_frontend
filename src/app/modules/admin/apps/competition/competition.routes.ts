import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddCompetition} from "./add-competition/add-competition.component";
import {ReportComponent} from "./report/report.component";

const routes: Routes = [

  {
    path: 'add-competition',
    component: AddCompetition
  },
  {
    path: 'competition-report/:id',
    component: ReportComponent
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompetitionRoutes {}
