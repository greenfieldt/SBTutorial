import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { NewsListComponent } from './news-list/news-list.component';
import { NewscardComponent } from './newscard/newscard.component';
import { NewscardActionsComponent } from './newscard-actions/newscard-actions.component';


import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        NewscardComponent,
        NewscardActionsComponent,
        NewsListComponent
    ],
    imports: [
        BrowserModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatBadgeModule,
        FlexLayoutModule,
        ScrollingModule,
        ExperimentalScrollingModule,
        HttpClientModule

    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
