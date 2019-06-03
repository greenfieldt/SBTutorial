import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { of } from 'rxjs';

import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatBadgeModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { object } from '@storybook/addon-knobs';


//Some data model bits and pieces
import { NewsArticle, NewsActionsData } from '../shared/news-article';
import { newsActions } from '../newscard-actions/newscard-actions.stories';
import { NewscardComponent } from './newscard.component';
import { NewscardActionsComponent } from '../newscard-actions/newscard-actions.component';


//Test Data
export const testNewsArticle: NewsArticle = {
    id: '12345657890987654321',
    author: 'ANGELA WATERCUTTER',
    content: "Bryan Bundesen posted a picture of his sister Tabatha's cat, Tardar Sauce, an 11-month old tabby with feline dwarfism that perpetually looked annoyed. The internet was enraptured with Grumpy Cat.",
    publishedAt: new Date('2019-03-22T16:33:58Z'),
    title: "Death of Grumpy Cat Marks the End of the Joyful Internet",
    source: { id: 'wired', name: 'Wired' },
    description: 'Tardar Sauce was an avatar of the days of the goofy web.',
    urlToImage: 'https://media.wired.com/photos/5cded55c2c90a35c66b7dacf/191:100/pass/Culture_GrumpyCat_Obit-484518362.jpg',
    url: 'https://www.wired.com/story/grumpy-cat-obit/',
    newsActionData: new NewsActionsData()
};

export const newsCardActions = {
    onViewArticle: action('onViewArticle'),
    ...newsActions
};


storiesOf('Composite/News Card', module)
    .addDecorator(
        moduleMetadata({
            declarations: [
                NewscardComponent,
                NewscardActionsComponent
            ],
            imports: [
                MatButtonModule,
                MatCardModule,
                MatIconModule,
                MatBadgeModule,
                FlexLayoutModule
            ],
        }),
    ).add('default', () => {
        return {
            template: `<newscard 
[newsArticle]="testNewsArticle"
(onViewArticle)="onViewArticle($event)"
(onChanged)="onChanged($event)">
</newscard>`,
            props: {
                testNewsArticle: object('testNewsArticle', testNewsArticle),
                onViewArticle: newsCardActions.onViewArticle,
                onChanged: newsCardActions.onChanged
            },
        };
    });
