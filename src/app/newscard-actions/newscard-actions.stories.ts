import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { object, withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { withCssResources } from '@storybook/addon-cssresources';

import {
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
} from '@angular/material';
import { NewscardActionsComponent } from './newscard-actions.component';
import { NewsActionsData } from '../shared/news-article';


const data_default = new NewsActionsData();
const data_liked = { ...data_default, hasLiked: true, numLikes: 5 };

storiesOf('News Card Actions', module)
    .addDecorator(withA11y)
    .addDecorator(withKnobs)
    .addDecorator(withCssResources)
    .addParameters({
        cssresources: [
            {
                id: `actions:outline`,
                code: `<style>.actions { border: 1px solid black; }</style>`,
                picked: false,
            },
            {
                id: `card:outline`,
                code: `<style>.mat-card { border: 1px solid black }</style>`,
                picked: false,
            },
        ],
    })
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
                data: object('data', data_default),
                onChanged: () => { },
            },
        };
    }).add('with likes', () => {
        return {
            template: `<newscard-actions 
[data]='data'
(onChanged)="onChanged($event)">
</newscard-actions>`,
            props: {
                data: object('data', data_liked),
                onChanged: () => { },
            },
        };
    });
