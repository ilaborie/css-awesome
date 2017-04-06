import {join} from 'path';
import * as sass from 'node-sass';
import * as postcss from 'postcss';
import * as autoprefixer from 'autoprefixer';
import * as assets from 'postcss-assets';
import * as cssnano from 'cssnano';
import * as customProperties from 'postcss-custom-properties';
import {error} from './utils';


const scss = (file): Promise<sass.Result> => new Promise((resolve, reject) => {
    sass.render({file}, (err, data) => err ? reject(err) : resolve(data))
});

export const css = (dir, minify = false): Promise<string> => {
    const file = join(dir, 'index.scss');
    const plugins = [
        customProperties({preserve: false}),
        autoprefixer(),
        assets({basePath: dir})
    ];
    if (minify) {
        plugins.push(cssnano());
    }
    return scss(file)
        .then(result => postcss(plugins).process(result.css))
        .then(result => result['content'])
        .catch(err => error(`️FAIL to create CSS ${dir}: ${err}`));
};

