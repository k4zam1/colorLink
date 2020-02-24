
function init(){
    var numOfRows = 10;
    var numOfCols = 7;
    var tileSize = 60;
    board = new GameBoard(numOfRows,numOfCols,tileSize,canvas);
    canvas.addEventListener('mousedown', function(e){board.mouseDown(e);}, false);
    board.draw();
}