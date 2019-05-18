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


//Some data model bits and pieces
import { NewsArticle } from '../shared/news-article';
import { newsActions } from '../newscard-actions/newscard-actions.stories';
import { NewscardComponent } from './newscard.component';
import { NewscardActionsComponent } from '../newscard-actions/newscard-actions.component';


//Test Data
export const testNewsArticle: NewsArticle = {
    id: '12345657890987654321',
    sourceImage: 'http://www.nytimes.com/services/mobile/img/android-newsreader-icon.png',
    author: 'SARA BONISTEEL',
    content: 'The use of custard powder an instant custard mix, which was a pantry staple of the empire, devised for those with egg allergies gave their new dainty its distinctive yellow belt Around the same time, bakers in Canadas prairie provinces were serving up a sim… [+1067 chars]',
    publishedAt: new Date('2019-03-22T16:33:58Z'),
    title: 'Wait, How Did You Get Into College?',
    source: { id: 'the-new-york-times', name: 'The New York Times' },
    description: 'How first-generation students learn about the myth of meritocracy.',
    urlToImage: 'https://pixel.nymag.com/imgs/daily/intelligencer/2019/03/26/26-robert-mueller.w700.h467.jpg',
    url: 'https://www.nytimes.com/2019/03/16/opinion/sunday/college-admissions-merit.html',
    numLikes: 1,
    hasLiked: false,
    comments: ['Comment One', 'Comment Two', 'Comment Three'],
    isStared: false,
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
                testNewsArticle: testNewsArticle,
                onViewArticle: newsCardActions.onViewArticle,
                onChanged: newsCardActions.onChanged
            },
        };
    });
