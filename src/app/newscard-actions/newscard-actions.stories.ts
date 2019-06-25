import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { object } from '@storybook/addon-knobs';

import {
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
} from '@angular/material';
import { NewscardActionsComponent } from './newscard-actions.component';
import { NewsActionsData } from '../shared/news-article';


/*
export const newsActions = {
    onChanged: action('onChanged'),
};
*/

/*
export class NewsActionsData {
    numComments: number = 0;
    numLikes: number = 0;
    hasLiked: boolean = false;
    stared: boolean = false;
}
*/

const data_default = new NewsActionsData();
const data_liked = { ...data_default, hasLiked: true, numLikes: 5 };

storiesOf('News Card Actions', module)
    .addDecorator(
        moduleMetadata({
            declarations: [
                NewscardActionsComponent
            ],
            imports: [
                MatButtonModule,
                MatIconModule,
                MatBadgeModule,
            ],
        }),
    ).add('default', () => {
        return {
            template: `<newscard-actions 
[data]='data'
(onChanged)="onChanged($event)">
</newscard-actions>`,
            props: {
                data: data_liked,
                onChanged: () => { },
            },
        };
    });
/*
    .add('liked by others', () => {
        return {
            template: `<newscard-actions
[data]='data'
(onChanged)="onChanged($event)">
</newscard-actions>`,
            props: {
                data: object('data', data_liked),
                onChanged: newsActions.onChanged,
            },
        };
    });
*/
