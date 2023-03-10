// @ts-check

const button = document.querySelector("button");
if (button) {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    /* Assemble the board into a data structure. */
    /** @type {Array<Array<number | null>>} */
    const board = [];
    document.querySelectorAll("input[data-x][data-y]").forEach((element) => {
      if (!(element instanceof HTMLInputElement)) {
        return;
      }
      const x = parseInt(element.getAttribute("data-x") ?? "");
      const y = parseInt(element.getAttribute("data-y") ?? "");

      const val = element.value === "" ? null : parseInt(element.value);

      if (!board[y]) {
        board.push([]);
      }
      board[y][x] = val;
    });

    /* Make the request. */
    fetch("/solve", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        board: JSON.stringify(board),
      }).toString(),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((/** @type {Array<Array<number>>} */ payload) => {
        payload.forEach((sublist, y) =>
          sublist.forEach((elem, x) => {
            /** @type {HTMLInputElement | null} */
            const input = document.querySelector(
              `input[data-x="${x}"][data-y="${y}"]`
            );
            if (input && input.value.trim() === "") {
              input.value = elem.toString();
              input.classList.add("non-bold");
            }
          })
        );
      });
  });
}
