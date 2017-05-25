---
skip: devoxx mixit bbl
---

### Holy Grail Layout

```html
<body>
 <header>Header</header>
 <div>
   <nav>Menu</nav>
   <main>Content</main>
   <aside>Side</aside>    
 </div>
 <footer>Footer</footer>
</body>
```

```css
* { margin: 0; padding: 0;}
header { height: 80px;}
nav { width: 15vw;}
aside { width: 10vw;}
footer { height: 1.5em;}
body>div {
    min-height: calc(100vh - 80px - 1.5em);
    display: flex;
}
main {
    flex: 1 1 auto;
    overflow: auto;
}
```