import {join} from 'path';
import {error} from 'util';

import {css} from './css';
import {html} from './html';
import {Slide, slides} from './slides';
import {slide} from './slide';
import {copyDir, log, sep, writeFile} from './utils';


const copyAsset = (assetsDir, output) => Promise.resolve(log('- Copying assets ...'))
    .then(() => copyDir(assetsDir, output))
    .then(() => log(`✅ copying ${assetsDir}`))
    .catch(err => error(`️FAIL copying assets: ${err}`));

const buildCss = (src, key, out, minify) =>{
    const cssDir = join(src, 'styles');
    const output = join(out, `${key}.css`);
    return Promise.resolve(log('- Building CSS ...', minify ? '(minified)' : ''))
        .then(() => css(cssDir, key, minify))
        .then(data => writeFile(output, data))
        .then(() => log(`✅ write CSS ${output}`))
        .catch(err => error(`️FAIL building CSS : ${err}`));
};

const buildHtml = (slidesDir, title, key, output, outputIndex) =>
    Promise.resolve(log('- Building HTML ...'))
        .then(() => slides(slidesDir, key))
        .then((slides: Slide[]) => ({slides, contents: slides.map(slide)}))
        .then(({slides, contents}) => ({slides, body: contents.join(sep)}))
        .then(({slides, body}) => html({body, slides, title, key}))
        .then(data => writeFile(output, data))
        .then(() => log(`✅ Write HTML ${output}`))
        .catch(err => error(`️FAIL building HTML: ${err}`));

const buildMain = ({src, minify, key, title, out}) => {
    const slidesDir = join(src, 'slides');
    const outputHtml = join(out, `${key}.html`);
    const outputIndexHtml = join(out, `${key}-index.html`);
    return buildCss(src, key, out, minify)
        .then(() => buildHtml(slidesDir, title, key, outputHtml, outputIndexHtml));
};

const build = ({src, out, minify}) => {
    const assetsDir = join(src, 'assets');
    const keys = ['devoxx', 'mixit', 'bbl', 'print'];
    return copyAsset(assetsDir, out)
        .then(() => keys.map(key => buildMain({src, minify, key, title: 'CSS is Awesome !', out})))
        .then(promises => Promise.all(promises))
};

const argv = require('yargs')
    .default({src: 'src', out: 'dist', minify: false})
    .argv;
build(argv);
