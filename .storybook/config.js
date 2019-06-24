import { configure, addDecorator, addParameters } from '@storybook/angular';
import '@storybook/addon-console';

const req = require.context('../src/', true, /\.stories.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
