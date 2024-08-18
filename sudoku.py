# pyright: strict
""" A simple backtracking soduko solver. """

from __future__ import absolute_import, division, print_function
from copy import deepcopy
from io import StringIO
import typing

type BoardRow = list[int]
type Board = list[BoardRow]


class InvalidBoardException(RuntimeError):
    """
    Thrown whenever an invalid board is encountered.
    """

    message: str


def solve(board: Board) -> Board | None:
    """
    Returns a solved version of the board, if it is solvable.

    :param board: The board to solve, as a list of lists, of integers from
                  top left to bottom right.
    :returns: A solved board, or None if the board cannot be solved.
    :except InvalidBoardException: If the board supplied is not in a valid
                                   format.
    """
    return _backtrack(board, 0, 0)


def pretty_print(board: Board) -> str:
    """
    Returns a string with the board pretty as a string.

    :param board: The board to print.
    :returns: A string representing the board.
    """
    result = StringIO()
    for y, row in enumerate(board):
        if y % 3 == 0 and y > 0:
            result.write("-------+-------+-------\n")

        line = StringIO()
        for x, elem in enumerate(row):
            if x % 3 == 0 and x > 0:
                line.write(" |")

            if not elem:
                line.write(" _")
            else:
                line.write(f" {elem}")
        result.write(f"{line.getvalue()}\n")
        line.close()
    return result.getvalue()


def validate_board(board: object) -> Board:
    """Checks that the argument supplied is indeed a valid board."""
    if not isinstance(board, (list)):
        raise InvalidBoardException("board is not a list.")
    board_list = typing.cast(list[object], board)

    if len(board_list) != 9:
        raise InvalidBoardException(
            f"outer list does not have a length of 9, length is: {len(board_list)}."
        )

    for y, row in enumerate(board_list):
        if not isinstance(row, list):
            raise InvalidBoardException(f"sublist on index {y} is not a list")
        row_list = typing.cast(list[object], row)

        if len(row_list) != 9:
            raise InvalidBoardException(
                f"inner list on index {y} does not have length of 9, "
                f"length is: {len(row_list)}"
            )

        for x, elem in enumerate(row_list):
            if not isinstance(elem, int):
                raise InvalidBoardException(
                    f"element on y={y}, x={x} is not int or None"
                )

    return typing.cast(Board, board)


def _backtrack(board: Board, x: int, y: int) -> Board | None:
    board = deepcopy(board)

    # Skip positions with data (ie not 0 or None).
    if board[y][x]:
        return _next(board, x, y)

    # Iterate on the current field and pass valid values to the next
    # iteration.
    for i in range(1, 10):
        if not _is_valid(board, i, x, y):
            continue
        board[y][x] = i
        result = _next(board, x, y)
        if result:
            return result

    # Nothing is valid at this point, go back.
    return None


def _next(board: Board, x: int, y: int) -> Board | None:
    if x == 8:
        if y == 8:
            return board
        else:
            return _backtrack(board, 0, y + 1)
    else:
        return _backtrack(board, x + 1, y)


def _is_valid(board: Board, val: int, x: int, y: int):
    # Check horizontal.
    for _x in range(9):
        if _x != x and board[y][_x] == val:
            return False

    # Check vertical.
    for _y in range(9):
        if _y != y and board[_y][x] == val:
            return False

    # Check the current box.
    xbox = (x // 3) * 3
    ybox = (y // 3) * 3
    for _x in range(xbox, xbox + 3):
        for _y in range(ybox, ybox + 3):
            if _y != y and _x != x and board[_y][_x] == val:
                return False

    # If all checks pass, the value in the given position is valid.
    return True


def _main():
    candidate = [
        [0, 0, 2, 0, 3, 0, 7, 4, 0],
        [6, 0, 5, 0, 9, 0, 8, 0, 0],
        [4, 0, 0, 2, 0, 0, 0, 6, 9],
        [8, 0, 9, 5, 0, 0, 1, 0, 6],
        [0, 1, 0, 0, 0, 0, 0, 7, 0],
        [7, 0, 4, 0, 0, 3, 9, 0, 8],
        [3, 7, 0, 0, 0, 9, 0, 0, 2],
        [0, 0, 1, 0, 6, 0, 4, 0, 7],
        [0, 4, 6, 0, 7, 0, 5, 0, 0],
    ]
    board = validate_board(candidate)
    result = solve(board)
    if result is not None:
        print(pretty_print(result))
    else:
        print("No solution found for board.")


if __name__ == "__main__":
    _main()
