import serve from 'rollup-plugin-serve';
import cfg from './rollup.config';

cfg[0].plugins.push(serve('dist'));

export default cfg
