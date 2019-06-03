import { storiesOf, moduleMetadata, addDecorator } from '@storybook/angular';
import { Component } from '@angular/core';

import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';

import { Observable, of } from 'rxjs';
import { NewsListComponent } from './news-list.component';
import { NewscardComponent } from '../newscard/newscard.component';
import { NewscardActionsComponent } from '../newscard-actions/newscard-actions.component';


import { HttpClientModule } from '@angular/common/http';
import { newsCardActions } from '../newscard/newscard.stories';

import { text, number } from '@storybook/addon-knobs';


//HMR tick to inject state
@Component({
    template: `<div class='theme-wrapper default-theme'> 
<news-list
[newsSourceName]="newsSource"
[numFetch]="numFetch"
(onViewArticle)="onViewArticle($event)"
[newsAPIKey]="newsAPIKey"
(onChanged)="onChanged($event)">
</news-list> </div>`,
})
class HostDispatchComponent {
    constructor() {
        //Inject your state here
    }
}




storiesOf('Composite/News Card List', module)
    .addDecorator(
        moduleMetadata({
            declarations: [
                NewsListComponent,
                NewscardComponent,
                NewscardActionsComponent
            ],
            imports: [
                MatButtonModule,
                MatCardModule,
                MatIconModule,
                MatBadgeModule,
                FlexLayoutModule,
                ScrollingModule,
                ExperimentalScrollingModule,
                HttpClientModule

            ],
        }),
    )
    .add('default as template', () => {
        return {
            template: `<div class='theme-wrapper default-theme'> 
<news-list
[newsSourceName]="newsSource"
[numFetch]="numFetch"
(onViewArticle)="onViewArticle($event)"
[newsAPIKey]="newsAPIKey"
(onChanged)="onChanged($event)">
</news-list> </div>`,
            props: {
                newsAPIKey: text('newsAPIKey', '22d9615962774038a7fda97bb5b8ca2f'),
                newsSource: text('newsSource', 'The New York Times'),
                numFetch: number('numFetch', 50),
                onViewArticle: newsCardActions.onViewArticle,
                onChanged: newsCardActions.onChanged
            },
        };
    }).add('default as component', () => {
        return {
            component: HostDispatchComponent,
            props: {
                newsAPIKey: text('newsAPIKey', '22d9615962774038a7fda97bb5b8ca2f'),
                newsSource: text('newsSource', 'Wired'),
                numFetch: number('numFetch', 50),
                onViewArticle: newsCardActions.onViewArticle,
                onChanged: newsCardActions.onChanged
            },
        };
    });

