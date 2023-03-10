// @ts-check

/**
 * Thrown whenever an invalid board is encountered.
 */
class InvalidBoardException extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = "InvalidBoardException";
  }
}

/**
 * Returns a solved version of the board, if it is solvable.
 *
 * @param {Array<Array<number|null>>} board - The board to solve, as a list of lists, of integers from
 *              top left to bottom right.
 * @returns {Array<Array<number>>|null} - A solved board, or null if the board cannot be solved.
 * @throws {InvalidBoardException} - If the board supplied is not in a valid format.
 */
export function solve(board) {
  _validate_board(board);
  return backtrack(board, 0, 0);
}

/**
 * @param {Array<Array<number|null>>} board
 * @returns {void}
 */
function _validate_board(board) {
  if (!Array.isArray(board)) {
    throw new InvalidBoardException("board is not an array.");
  }

  if (board.length !== 9) {
    throw new InvalidBoardException(
      `outer array does not have a length of 9, length is: ${board.length}.`
    );
  }

  for (let y = 0; y < board.length; y++) {
    const sub = board[y];
    if (!Array.isArray(sub)) {
      throw new InvalidBoardException(
        `sub-array on index ${y} is not an array.`
      );
    }

    if (sub.length !== 9) {
      throw new InvalidBoardException(
        `inner array on index ${y} does not have length of 9, length is: ${sub.length}`
      );
    }

    for (let x = 0; x < sub.length; x++) {
      const elem = sub[x];
      if (elem !== null && typeof elem !== "number") {
        throw new InvalidBoardException(
          `element on y=${y}, x=${x} is not int or null`
        );
      }
    }
  }
}

/**
 * @param {Array<Array<number|null>>} board
 * @param {number} x
 * @param {number} y
 * @returns {Array<Array<number|null>> | null}
 */
function backtrack(board, x, y) {
  board = JSON.parse(JSON.stringify(board));

  // Skip positions with data (ie not 0 or null).
  if (board[y][x]) {
    return next(board, x, y);
  }

  // Iterate on the current field and pass valid values to the next iteration.
  for (let i = 1; i <= 9; i++) {
    if (!isValid(board, i, x, y)) {
      continue;
    }
    board[y][x] = i;
    const result = next(board, x, y);
    if (result) {
      return result;
    }
  }

  // Nothing is valid at this point, go back.
  return null;
}

/**
 *
 * @param {Array<Array<number|null>>} board
 * @param {number} x
 * @param {number} y
 * @returns {Array<Array<number|null>>|null}
 */
function next(board, x, y) {
  if (x === 8) {
    if (y === 8) {
      return board;
    } else {
      return backtrack(board, 0, y + 1);
    }
  } else {
    return backtrack(board, x + 1, y);
  }
}

/**
 *
 * @param {Array<Array<number|null>>} board
 * @param {number} val
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
function isValid(board, val, x, y) {
  // Check horizontal.
  for (let _x = 0; _x < 9; _x++) {
    if (_x !== x) {
      if (board[y][_x] === val) {
        return false;
      }
    }
  }

  // Check vertical.
  for (let _y = 0; _y < 9; _y++) {
    if (_y !== y) {
      if (board[_y][x] === val) {
        return false;
      }
    }
  }

  const xbox = Math.floor(x / 3) * 3;
  const ybox = Math.floor(y / 3) * 3;
  for (let _x = xbox; _x < xbox + 3; _x++) {
    for (let _y = ybox; _y < ybox + 3; _y++) {
      if (_x !== x && _y !== y) {
        if (board[_y][_x] === val) {
          return false;
        }
      }
    }
  }

  return true;
}
