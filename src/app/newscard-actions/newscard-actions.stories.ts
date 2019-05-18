import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import {
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
} from '@angular/material';
import { NewscardActionsComponent } from './newscard-actions.component';



export const newsCardActions = {
    onLiked: action('onLiked'),
    onComment: action('onComment'),
    onStar: action('onStar'),
};


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
[numComments]='ncomments'
[stared]='star'
(onLiked)="onLiked($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)">
</newscard-actions>`,
            props: {
                ncomments: 3,
                star: true,
                onLiked: newsCardActions.onLiked,
                onComment: newsCardActions.onComment,
                onStar: newsCardActions.onStar
            },
        };
    }).add('liked by others', () => {
        return {
            template: `<newscard-actions 
[numComments]='ncomments'
[stared]='star'
[numLikes]='5'
(onLiked)="onLiked($event)"
(onStar)="onStar($event)"
(onComment)="onComment($event)">
</newscard-actions>`,
            props: {
                ncomments: 3,
                star: true,
                numLikes: 4,
                onLiked: newsCardActions.onLiked,
                onComment: newsCardActions.onComment,
                onStar: newsCardActions.onStar
            },
        };
    });
