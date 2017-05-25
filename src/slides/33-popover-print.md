---
style: center
skip: devoxx mixit bbl
---

<style scoped contenteditable="true">.popover {
  position: relative;
  background: teal;
}
.popover::before {
  position: absolute;
  z-index: -1;
  content: '';
  top: 1em; left: 1em;
  border: .8em solid transparent;
  border-top-color: teal;
  transform: skew(-30deg);
}
</style>

<div class="editable">
	<div class="popover">Hello </div>
</div>
