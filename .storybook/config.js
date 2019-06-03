import { configure, addDecorator, addParameters } from '@storybook/angular';
import '@storybook/addon-console';
import { setConsoleOptions } from '@storybook/addon-console';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import { withCssResources } from '@storybook/addon-cssresources';


setConsoleOptions({
  panelExclude: [],
});

const storyAsString = (story) => `<div class="theme-wrapper default-theme">${story}</div>`;
const storyAsNode = (story) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'theme-wrapper default-theme';
    wrapper.appendChild(story);
    return wrapper;
};

addDecorator(story => {
    const tale = story();

    if(typeof tale === "string")
    {
	return  storyAsString(tale);
    }
    else if(typeof tale === "node")
    {
	return storyAsNode(tale);
    }
    else if(tale && tale.component)
    {
	//what do we do here
	return tale;
    }
    else if (tale && tale.template)
    {
	tale.template = storyAsString(tale.template);
	return tale;
    }
    else
    {
	return tale;
    }
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


const req = require.context('../src/', true, /\.stories.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
