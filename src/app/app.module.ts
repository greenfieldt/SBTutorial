import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NewscardComponent } from './newscard/newscard.component';
import { NewscardActionsComponent } from './newscard-actions/newscard-actions.component';
import { NewsListComponent } from './news-list/news-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NewscardComponent,
    NewscardActionsComponent,
    NewsListComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
