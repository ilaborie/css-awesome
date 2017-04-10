import {join} from 'path';
import {error} from 'util';

import {css} from './css';
import {html} from './html';
import {htmlIndex} from './index-html';
import {Slide, slides} from './slides';
import {slide} from './slide';
import {copyDir, log, sep, writeFile} from './utils';


const copyAsset = (assetsDir, output) => Promise.resolve(log('- Copying assets ...'))
    .then(() => copyDir(assetsDir, output))
    .then(() => log(`✅ copying ${assetsDir}`))
    .catch(err => error(`️FAIL copying assets: ${err}`));

const buildCss = (cssDir, key, output, minify) =>
    Promise.resolve(log('- Building CSS ...', minify ? '(minified)' : ''))
        .then(() => css(cssDir, key, minify))
        .then(data => writeFile(output, data))
        .then(() => log(`✅ write CSS ${output}`))
        .catch(err => error(`️FAIL building CSS : ${err}`));

const buildIndexHtml = (slides: Slide[], title, key, output): Promise<Slide[]> =>
    Promise.resolve(log(`   Building ${output} ...`))
        .then(() => slides)
        .then(slides => htmlIndex({slides, title, key}))
        .then(data => writeFile(output, data))
        .then(() => log(`✅ write HTML ${output}`))
        .then(() => slides)
        .catch(err => error(`️FAIL Building ${output} : ${err}`));

const buildHtml = (slidesDir, title, key, output, outputIndex) =>
    Promise.resolve(log('- Building HTML ...'))
        .then(() => slides(slidesDir, key))
        .then((slides: Slide[]) => buildIndexHtml(slides, title, key, outputIndex))
        .then((slides: Slide[]) => ({slides, contents: slides.map(slide)}))
        .then(({slides, contents}) => ({slides, body: contents.join(sep)}))
        .then(({slides, body}) => html({body, slides, title, key}))
        .then(data => writeFile(output, data))
        .then(() => log(`✅ Write HTML ${output}`))
        .catch(err => error(`️FAIL building HTML: ${err}`));

const buildMain = ({src, minify, key, title, out}) => {
    const slidesDir = join(src, 'slides');
    const cssDir = join(src, 'styles');
    const outputCss = join(out, `${key}.css`);
    const outputHtml = join(out, `${key}.html`);
    const outputIndexHtml = join(out, `${key}-index.html`);
    return buildCss(cssDir, key, outputCss, minify)
        .then(() => buildHtml(slidesDir, title, key, outputHtml, outputIndexHtml));
};

const build = ({src, out, minify}) => {
    const assetsDir = join(src, 'assets');
    return copyAsset(assetsDir, out)
        .then(() => buildMain({src, minify, key: 'devoxx', title: 'CSS is Awesome !', out}))
        .then(() => buildMain({src, minify, key: 'mixit', title: 'CSS is Awesome !', out}))
};

const argv = require('yargs')
    .default({src: 'src', out: 'dist', minify: false})
    .argv;
build(argv);
