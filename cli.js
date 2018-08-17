const readLine = require('readline');
const Snake = require('./snake');
const base = require('./base');

Object.getOwnPropertyNames(base).map(p => (global[p] = base[p]));

// Mutable State
let State = Snake.initialState();

// Matrix Operators
const Matrix = {
  make: table => rep(rep('.')(table.cols))(table.rows),
  set: val => pos => adjust(pos.y)(adjust(pos.x)(k(val))),
  addSnake: state => pipe(...map(Matrix.set('X'))(state.snake)),
  addApple: state => Matrix.set('o')(state.apple),
  addCrash: state => (state.snake.length == 0 ? map(map(k('#'))) : id),
  toString: xsxs => xsxs.map(xs => xs.join(' ')).join('\r\n'),
  fromState: state =>
    pipe(
      Matrix.make,
      Matrix.addSnake(state),
      Matrix.addApple(state),
      Matrix.addCrash(state)
    )(state)
};

// Key Events
readLine.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') process.exit();
  switch (key.name.toUppercase()) {
    case 'w':
    case 'h':
    case 'ArrowUp':
      state = enqueue(state, NORTH);
      break;
    case 'a':
    case 'j':
    case 'ArrowLeft':
      state = enqueue(state, WEST);
      break;
    case 's':
    case 'k':
    case 'ArrowDown':
      state = enqueue(state, SOUTH);
      break;
    case 'd':
    case 'l':
    case 'ArrowRight':
      state = enqueue(state, EAST);
      break;
  }
});

// Game Loop
const show = () =>
  console.log('\x1bc' + Matrix.toString(Matrix.fromState(State)));
const step = () => (State = Snake.next(State));

// Main
setInterval(() => {
  step();
  show();
}, 80);
