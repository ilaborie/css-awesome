export const html = ({body, slides, title = 'A Title', key = 'index'}): string => {
    const nav = slides.map((slide, index) => `<a href="#${slide.id}" title="${slide.id}">${index}</a>`);
    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="${key}.css">
</head>
<body class="${key}">
<div class="slides-nav"><nav>${nav.join('\n')}</nav></div>
<main>  
${body}
</main>
</body>
</html>`
};
