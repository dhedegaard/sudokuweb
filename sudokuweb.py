import json
import os

from flask import Flask, request, render_template, Response

from sudoku import Board, solve as sudoku_solve, InvalidBoardException


app = Flask(__name__)


@app.route("/")
def hello_world():
    return render_template("index.html")


@app.route("/solve", methods=["POST"])
def solve():
    board_string = request.values.get("board")

    if not board_string:
        return "No board parameter found", 403

    board: Board = json.loads(board_string)

    try:
        result = sudoku_solve(board)
    except InvalidBoardException as e:
        return Response(
            e.message,
            status=403,
        )

    return Response(
        response=json.dumps(result),
        mimetype="application/json; utf-8",
    )


if __name__ == "__main__":
    PORT = os.environ.get("PORT")
    app.run(debug=PORT is None, host="0.0.0.0" if PORT is not None else None, port=PORT)
