import { storiesOf, moduleMetadata, addDecorator } from '@storybook/angular';
import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ScrollingModule } from '@angular/cdk/scrolling';

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
(onChanged)="onChanged($event)">
</news-list> </div>`,
            props: {
                newsSource: text('newsSource', 'The New York Times'),
                numFetch: number('numFetch', 5),
                onViewArticle: newsCardActions.onViewArticle,
                onChanged: newsCardActions.onChanged
            },
        };
    });
