import { join } from 'path';

export default {
  plugins: [
    // join(__dirname, '..', require('../package').main || 'index.js'),
    [join(__dirname, '../src/index.js'), {
      build: join(__dirname, './src/layouts/menus.json'),
    }],
  ],
}
