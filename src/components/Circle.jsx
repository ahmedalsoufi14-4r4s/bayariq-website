// One soft circle of the moving background (.circle in index.css), behind the page
// (PageBackdrop.jsx) or in the hero (Hero.jsx).
// color: the name of its color variable in index.css, like '--circle-main'.
// size, top and start: its size and its place. In Arabic, start is the right side.
// x and y: how far it swings sideways and up and down around its place.
// xTime and yTime: how long one swing takes. grow: it also slowly grows and shrinks.
// style can set CSS variables (the names that start with --), which index.css reads.
function Circle({ color, size, top, start, x, y, xTime, yTime, grow = false }) {
  return (
    <div
      className={grow ? 'circle circle-grow' : 'circle'}
      style={{
        width: size,
        height: size,
        top,
        insetInlineStart: start,
        '--circle-color': `var(${color})`,
        '--x': x,
        '--y': y,
        '--x-time': xTime,
        '--y-time': yTime,
      }}
    />
  )
}

export default Circle
