import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import {
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
} from '@angular/material';
import { NewscardActionsComponent, newsActionDataDefault } from './newscard-actions.component';



export const newsActions = {
    onChanged: action('onChanged'),
};

const data_default = newsActionDataDefault;
const data_liked = { ...newsActionDataDefault, numLikes: 5 };

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
                data: data_default,
                onChanged: newsActions.onChanged,
            },
        };
    }).add('liked by others', () => {
        return {
            template: `<newscard-actions 
[data]='data'
(onChanged)="onChanged($event)">
</newscard-actions>`,
            props: {
                data: data_liked,
                onChanged: newsActions.onChanged,
            },
        };
    });
