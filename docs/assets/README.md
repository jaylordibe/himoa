# README visual assets

Hand-written SVG, no build step. Each diagram exists because it shows
something prose shows worse, and the text next to it in `README.md` still
says everything the picture does — the picture reinforces the documentation;
it never replaces it.

| File | Shows | Mirrors |
|---|---|---|
| `workflow.svg` | The lifecycle, and which two decisions are yours | `README.md` → *How a change flows* |
| `risk-ladder.svg` | Rigor accumulating tier by tier | `README.md` → *Risk decides the rigor* |

A diagram is a second statement of what its README section says, so change
them together. Keep a diagram's text to names and short labels; the policy
belongs in the prose, which cites its source in `plugins/himoa/`.

## The system

- **One accent, one meaning.** Amber marks a decision a human owns — the
  approval, the ship, the human security review at Critical. Everything the
  agent does is neutral. Do not use the accent for emphasis.
- **Shapes.** Solid card: a stage the agent performs. Dashed card: an input,
  or the tier below the ladder. Pill: an annotation on a connector.
- **Type.** The system sans-serif stack; titles 20–21px, labels 15px, captions
  12px spaced capitals, in an 840px-wide viewBox. Nothing smaller: GitHub scales
  the image to about 360px on a phone, and these sizes are the floor that stays
  legible there.
- **Colours** are GitHub's own neutrals, so the diagrams sit in the page rather
  than on it.

## Light and dark

Each SVG carries its dark palette in an internal
`@media (prefers-color-scheme: dark)` block, so one file serves both themes and
no second copy can drift.

That media query follows the viewer's operating system, not GitHub's theme
setting, and some renderers (Safari, the GitHub mobile apps) do not apply it
inside an `<img>` at all. So the diagrams are built to survive the mismatch:
**every label sits on its own opaque card**, and the only marks drawn directly
on the page — connectors and arrowheads — use a mid-grey that reads on both
white and GitHub's dark background. A viewer in the wrong palette sees a
bright diagram, never an unreadable one.

## Checking a change

```bash
xmllint --noout docs/assets/*.svg
```

Then look at it at full width and at a phone width, in both colour schemes. In
headless Chrome, `--blink-settings=preferredColorScheme=0` forces dark and `=1`
forces light.
