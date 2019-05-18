import { storiesOf, moduleMetadata } from '@storybook/angular';
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
                HttpClientModule

            ],
        }),
    )
    .add('default', () => {
        return {
            template: `<div class='theme-wrapper default-theme'> 
<news-list
(onViewArticle)="onViewArticle($event)"
(onChanged)="onChanged($event)">
</news-list> </div>`,
            props: {
                onViewArticle: newsCardActions.onViewArticle,
                onChanged: newsCardActions.onChanged
            },
        };
    });
