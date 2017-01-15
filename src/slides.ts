import {join} from 'path';
import {highlightAuto} from 'highlight.js';
import * as marked from 'marked';
import {readDir, readFile, error} from './utils';

export interface Slide {
    id: string;
    previous?: string;
    next?: string;
    content: string;
    metadata: SlideMetadata;
}
export interface SlideMetadata {
    [index: string]: string;
}
interface ExtractMetadata {
    tmp?: SlideMetadata;
    metadata?: SlideMetadata;
    content?: string;
}

const highlight = code => highlightAuto(code).value;

const onlySlide = (file): string[] => file.match(/^\d\d-(.*).(md|html)/);

const extractMetaData = (data: string): ExtractMetadata => {
    if (data.startsWith('---')) {
        const lines = data.split('\n');
        return lines.slice(1).reduce(
            (res: ExtractMetadata, line) => {
                const {tmp, metadata, content} = res;
                if (metadata) {
                    const newContent = content ? content + '\n' + line : line;
                    return {metadata, content: newContent}
                } else {
                    if (line === '---') {
                        return {metadata: tmp}
                    } else {
                        const [_, attr, value] = line.match(/^(.*):(.*)$/);
                        const newTmp = tmp || {};
                        newTmp[attr] = value.trim();
                        return {tmp: newTmp}
                    }
                }
            }, {})
    }
    return {metadata: null, content: data}
};

const buildSlide = (dir, matches): Promise<Slide> => {
    const [fileName, id, type] = matches;
    const file = join(dir, fileName);
    // const id = getId(matches);
    // const type = matches[2];
    return readFile(file)
        .then(data => extractMetaData(data))
        // .then(obj => log('extract', obj))
        .then(({metadata, content}) => {
            const newMetadata = metadata === null ? {} : metadata;
            newMetadata.type = type;
            const newContent = type === 'md' ? marked(content, {highlight}) : content;
            return {metadata: newMetadata, content: newContent}
        })
        .then(({metadata, content}) => ({id, content, metadata}))
};

const buildSlideNav = (slide: Slide, index: number, array: Slide[]): Slide => {
    const {id, content, metadata} = slide;
    const previous = index === 0 ? null : array[index - 1].id;
    const next = index === (array.length - 1) ? null : array[index + 1].id;
    return {id, previous, next, content, metadata}
};

const filterSlide = (slide, key): boolean => {
    const skip = slide.metadata.skip;
    const result = skip && skip.includes(key);
    if (result) {
        console.log(`Skip ${slide.id} for ${key}`)
    }
    return !result
};

export const slides = (dir, key): Promise<Slide[]> => readDir(dir)
    .then(files => files.sort())
    .then(files => files.map(onlySlide))
    .then(matchesList => matchesList.filter(matches => matches !== null))
    .then(matchesList => matchesList.map(matches => buildSlide(dir, matches)))
    .then(slidePromises => Promise.all(slidePromises))
    .then(slides => slides.filter(slide => filterSlide(slide, key)))
    .then(slides => slides.map(buildSlideNav))
    .catch(err => error(`️FAIL to read dir ${dir}: ${err}`));

