import { configure, addDecorator, addParameters } from '@storybook/angular';
import '@storybook/addon-console';
import { setConsoleOptions } from '@storybook/addon-console';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { withCssResources } from '@storybook/addon-cssresources';



setConsoleOptions({
  panelExclude: [],
});


addDecorator(withA11y);
addDecorator(withKnobs);
addDecorator(withCssResources);
addParameters({
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
});

// automatically import all files ending in *.stories.ts
const req = require.context('../src/', true, /\.stories\.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
