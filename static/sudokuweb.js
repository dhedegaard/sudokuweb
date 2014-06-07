/*global $*/
$(function() {
    "use strict";

    $('button').click(function(e) {
        e.preventDefault();

        /* Assemble the board into a data structure. */
        var board = []
        $.each($('[data-x][data-y]'), function(idx, elem) {
            var $elem = $(elem);
            var x = $elem.data('x');
            var y = $elem.data('y');
            var val = $elem.val();

            if (val === '') {
                val = null;
            } else {
                val = parseInt(val);
            }

            if (x === 0) {
                board.push([]);
            }
            board[y].push(val);
        });

        /* Make the request. */
        $.post('solve', {board: JSON.stringify(board)}, function(result) {
            /* On success, fill out the empty spots and mark them. */
            $.each(result, function(y, sublist) {
                $.each(sublist, function(x, elem) {
                    var input = $('[data-x=' + x + '][data-y=' + y + ']');
                    if (input.val() === '') {
                        input.val(result[y][x]);
                        input.addClass('non-bold');
                    }
                });
            });
            console.log(resp);
        })
    });
});