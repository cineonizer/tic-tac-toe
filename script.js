const createPlayer = (name, symbol) => {
    return {name, symbol};
}

const playerOne = createPlayer('playerOne', 'X');
const playerTwo = createPlayer('playerTwo', 'O');

const gameBoard = (() => {
    const _board = new Array(9);

    const setBoardArr = (index, symbol) => {
        if (_board[index]) return;
        _board[index] = symbol;
    };

    const getBoardArr = (index) => {
        return _board[index];
    };

    const clearBoardArr = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = '';
        }
    };

    return {setBoardArr, getBoardArr, clearBoardArr};
})();

const gameController = (() => {
    let _round = 0;
    let _xPlayerScore = 0;
    let _oPlayerScore = 0;
    let _isWinner = false;

    const playRound = () => {
        _checkOutcomes();
        _updateScore();
        _round++;
    };

    const _checkOutcomes = () => {
        const winOutcomes = [
            [0, 1, 2], 
            [0, 4, 8], 
            [0, 3, 6], 
            [1, 4, 7], 
            [2, 4, 6],
            [2, 5, 8], 
            [3, 4, 5], 
            [6, 7, 8]
        ];

        winOutcomes.filter(outcome => {
            let currentOutcome = [];
            outcome.filter(element => currentOutcome.push(gameBoard.getBoardArr(element)));
            if (currentOutcome.every(element => element === 'X') || currentOutcome.every(element => element === 'O')) {
                _isWinner = true;
            }
        });
    };

    const _updateScore = () => {
        if (_isWinner) {
            if (getPlayersTurn() === 'X') {
                _xPlayerScore++;
                displayController.updateScoreBoard(_xPlayerScore);
            }
            else {
                _oPlayerScore++;
                displayController.updateScoreBoard(_oPlayerScore);
            }
            displayController.displayResult();
        }
        else if (_round === 8)  displayController.displayResult();
    };

    const gameOver = () => {
        return _isWinner;
    };

    const getPlayersTurn = () => {
        return _round % 2 === 1 ? 'O' : 'X';
    };

    const resetRounds = () => {
        _round = 0;
        _isWinner = false;
    };

    return {playRound, gameOver, getPlayersTurn, resetRounds};
})();

const displayController = (() => {
    let _isRoundStart = false;

    const gameBoardContainer = document.querySelector('.gameboard');
    const resultContainer = document.querySelector('.result');
    const cells = document.querySelectorAll('.cell');
    const restartButton = document.querySelector('.restart-button');
    const xScoreContainer = document.querySelector('#x-score-container');
    const oScoreContainer = document.querySelector('#o-score-container');
    const xScoreDiv = document.querySelector('#x-number');
    const oScoreDiv = document.querySelector('#o-number');

    cells.forEach(cell => cell.addEventListener('click', () => {
        _isRoundStart = true;
        if (cell.textContent || gameController.gameOver()) return;
        if (gameController.getPlayersTurn() === 'X') {
            _toggleScoreboard();
            cell.classList.add('x-symbol');
            cell.textContent = playerOne.symbol;
            gameBoard.setBoardArr(cell.getAttribute('data'), cell.textContent);
        }
        else {
            _toggleScoreboard();
            cell.classList.add('o-symbol');
            cell.textContent = playerTwo.symbol;
            gameBoard.setBoardArr(cell.getAttribute('data'), cell.textContent);
        }
        gameController.playRound();
    }));

    const _toggleScoreboard = () => {
        if (gameController.getPlayersTurn() === 'X') {
            if (!_isRoundStart) {
                xScoreContainer.style.borderBottom = 'solid';
                xScoreContainer.style.borderColor = 'rgb(0, 181, 162)'
                oScoreContainer.style.borderBottom = '';
            }
            else {
                xScoreContainer.style.borderBottom = '';
                oScoreContainer.style.borderBottom = 'solid';
                oScoreContainer.style.borderColor = 'rgb(0, 181, 162)'
            }
        }
        else {
            oScoreContainer.style.borderBottom = '';
            xScoreContainer.style.borderBottom = 'solid';
            xScoreContainer.style.borderColor = 'rgb(0, 181, 162)'
        }
    };

    const updateScoreBoard = (score) => {
        if (gameController.getPlayersTurn() === 'X') xScoreDiv.textContent = score;
        else oScoreDiv.textContent = score;
    }

    const displayResult = () => {
        const resultSymbolDiv = document.querySelector('#result-symbol');
        const resultTextDiv = document.querySelector('#result-text');

        gameBoardContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        resultContainer.classList.remove('x-symbol', 'o-symbol');
        resultSymbolDiv.textContent = '';
        resultTextDiv.classList.remove('x-symbol');
        if (gameController.gameOver()) {
            resultTextDiv.textContent = 'WINNER!';
            if (gameController.getPlayersTurn() === 'X') {
                resultContainer.classList.add('x-symbol');
                resultSymbolDiv.textContent = 'X';
            }
            else {
                resultContainer.classList.add('o-symbol');
                resultSymbolDiv.textContent = 'O';
            } 
        }
        else {
            resultSymbolDiv.appendChild(document.createElement('div'));
            resultSymbolDiv.appendChild(document.createElement('div'));
            resultSymbolDiv.firstChild.textContent = 'X';
            resultSymbolDiv.lastChild.textContent = 'O';
            resultSymbolDiv.firstChild.classList.add('x-symbol');
            resultSymbolDiv.lastChild.classList.add('o-symbol');
            resultTextDiv.textContent = 'DRAW!';
            resultTextDiv.classList.add('x-symbol');
        }
    }

    restartButton.addEventListener('click', () => {
        _isRoundStart = false;
        gameBoard.clearBoardArr();
        gameController.resetRounds();
        _updateCells();
        _removeClasses();
        _toggleScoreboard();
        gameBoardContainer.style.display = 'grid';
        resultContainer.style.display = 'none';
    });

    const _removeClasses = () => {
        cells.forEach(cell => cell.classList.remove('x-symbol', 'o-symbol'));
    };

    const _updateCells = () => {
        for (let i = 0; i < cells.length; i++) {
            cells[i].textContent = gameBoard.getBoardArr(i);
        }
    };

    _toggleScoreboard();
    return {updateScoreBoard, displayResult};
})();

