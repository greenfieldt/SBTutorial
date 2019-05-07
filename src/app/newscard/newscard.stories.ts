import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';


export const newsCardActions = {
};


storiesOf('Composite/News Card', module)
    .addDecorator(
        moduleMetadata({
            declarations: [],
            imports: [],
        }),
    )
    .add('default', () => {
        return {
            template: ``,
            props: {},
        };
    });

