import { storiesOf, moduleMetadata, addDecorator } from '@storybook/angular';
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

import { withA11y } from '@storybook/addon-a11y';
import { text, number, withKnobs } from '@storybook/addon-knobs';




storiesOf('Composite/News Card List', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
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
    .add('default', () => {
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
    });
