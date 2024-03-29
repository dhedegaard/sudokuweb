import json
import os

from flask import Flask, request, render_template, Response

from sudoku import solve as sudoku_solve, InvalidBoardException


app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/solve', methods=['POST'])
def solve():
    board = request.values.get('board')

    if not board:
        return 'No board parameter found', 403

    board = json.loads(board)

    try:
        result = sudoku_solve(board)
    except InvalidBoardException as e:
        return e.message, 403

    return Response(
        response=json.dumps(result),
        mimetype='application/json; utf-8',
    )

if __name__ == '__main__':
    PORT = os.environ.get('PORT')
    app.run(debug=PORT is None, host='0.0.0.0' if PORT is not None else None, port=PORT)
