import {Slide} from './slides';
export const slide = (slide: Slide): string => {
    const {id, previous, next, content = '', metadata} = slide;
    const prevFun = previous ? `<a href="#${previous}" class="previous"></a>` : '';
    const nextFun = next ? `<a href="#${next}" class="next"></a>` : '';
    const style = (metadata && metadata.style) || '';
    return `
<!-- Slide -->
<section id="${id}" class="${style}">
  ${content}
  ${prevFun}
  ${nextFun}
</section>`
};