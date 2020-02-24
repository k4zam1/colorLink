class GameBoard {
    constructor(hTileNum,wTileNum,tileSize,canvas){
        // 基本設定
        this.hTileNum = hTileNum;
        this.wTileNum = wTileNum;
        this.tileSize = tileSize;
        this.isSelecting = false;
        this.canvas = canvas;
        this.lines = [];

        // click時の情報格納用
        this.clicked1 = {tile:null,row:null,col:null};
        this.clicked2 = {tile:null,row:null,col:null};

        // 問題のロード
        var mapNum = Math.floor(Math.random()*maps.length);
        this.tiles = maps[mapNum].map;
        this.answer = maps[mapNum].answer;

        // 使用されているタイルの数を調べて色を用意する
        var tileNum = 0;
        for(var row of maps[mapNum].map){
            var m = Math.max.apply(null,row);
            if(tileNum < m){
                tileNum = m;
            }
        }
        var colors = [];
        for(var i=0;i<tileNum+1;i++){
            colors.push(new Color());
        }

        // タイル&パイプ生成
        for(var i=0;i<hTileNum;i++){
            for(var j=0;j<wTileNum;j++){
                if(this.tiles[i][j] != 0){
                    this.tiles[i][j] = new Rectangle(i*60,j*60,this.tileSize-2,this.tileSize-2,colors[this.tiles[i][j]]);
                }
                else{
                    var pipe = new Pipe(i*60,j*60,this.tileSize-2,this.tileSize-2);
                    this.tiles[i][j] = pipe;
                }
            }
        }
    }

    draw(){
        for(var tiles of this.tiles){
            for(var tile of tiles){
                tile.fill();
            }
        }
    }

    // 中間タイルをハイライトする
    highLightBetween(clicked1,clicked2){
        // 列が同じ
        if(clicked1.col === clicked2.col){
            // clicked1がclicked2の左側
            if(clicked1.row < clicked2.row){
                var start = clicked1.row+1;
                var end = clicked2.row;
            }
            else {
                var start = clicked2.row+1;
                var end = clicked1.row;
            }
            for(var r=start;r<end;r++){
                var tile = this.tiles[clicked1.col][r];
                if(tile instanceof Pipe){
                    tile.top = true;
                    tile.bottom = true;
                    tile.fill();
                }
            }
        }
        // 行が同じ
        else if(clicked1.row === clicked2.row){
            if(clicked1.col < clicked2.col){
                var start = clicked1.col+1;
                var end = clicked2.col;
            }
            else {
                var start = clicked2.col+1;
                var end = clicked1.col;
            }
            for(var c=start;c<end;c++){
                var tile = this.tiles[c][clicked1.row];
                if(tile instanceof Pipe){
                    tile.left = true;
                    tile.right = true;
                    tile.fill();
                }
            }
        }
    }

    mouseDown(e){
        // mouseDownの位置 = (posX,posY)
        var posX = parseInt(e.clientX - canvas.offsetLeft);
        var posY = parseInt(e.clientY - canvas.offsetTop);

        // 1枚目クリック
        if(!this.isSelecting){
            // クリックした位置がタイル内か？
            this.__onBoard(posX,posY,function(tile,indexCol,indexRow){
                this.isSelecting = true;
                tile.highlightFill();
                this.clicked1.tile = tile;
                this.clicked1.col = indexCol;
                this.clicked1.row = indexRow;
            }.bind(this));
        }
        // 2枚目クリック
        else {
            // クリックした位置がタイル内か？
            this.__onBoard(posX,posY,function(tile,indexCol,indexRow){
                this.clicked2.tile = tile;
                this.clicked2.col = indexCol;
                this.clicked2.row = indexRow;
                this.clicked1.tile.highlightOff();
            }.bind(this));
            
            // パイプとタイルが選ばれたとき
            if(this.clicked1.tile instanceof Rectangle && this.clicked2.tile instanceof Rectangle){
                this.__onRectangleAndRectangle();
            }
            else if(this.clicked1.tile instanceof Pipe && this.clicked2.tile instanceof Pipe){
                this.__onPipeAndPipe();
            }
            else {
                this.__onPipeAndRectangle();
            }

            // 状態変化後の再描画
            this.clicked1.tile.fill();
            this.clicked2.tile.fill();

            // 値をリリース
            this.clicked1.tile = null;
            this.clicked2.tile = null;
            this.isSelecting = false;

            if(this.__gameClear()){
                context.font = "60px serif";
                context.fillStyle = "red";
                context.fillText("CLEAR!",200,200);
            }
        }
    }

    __getMapInfo(){
        var getPipeInfo = function(pipe){
            if(!pipe.top && !pipe.bottom && !pipe.left && !pipe.right){
                return "a";
            }
            else if(pipe.top && !pipe.bottom && !pipe.left && !pipe.right){
                return "b";
            }
            else if(!pipe.top && pipe.bottom && !pipe.left && !pipe.right){
                return "c";
            }
            else if(!pipe.top && !pipe.bottom && pipe.left && !pipe.right){
                return "d";
            }
            else if(!pipe.top && !pipe.bottom && !pipe.left && pipe.right){
                return "d";
            }
            else if(pipe.top && pipe.bottom && !pipe.left && !pipe.right){
                return "e";
            }
            else if(pipe.top && !pipe.bottom && pipe.left && !pipe.right){
                return "f";
            }
            else if(pipe.top && !pipe.bottom && !pipe.left && pipe.right){
                return "g";
            }
            else if(!pipe.top && pipe.bottom && pipe.left && !pipe.right){
                return "h";
            }
            else if(!pipe.top && pipe.bottom && !pipe.left && pipe.right){
                return "i";
            }
            else if(!pipe.top && !pipe.bottom && pipe.left && pipe.right){
                return "j";
            }
            else if(pipe.top && pipe.bottom && pipe.left && !pipe.right){
                return "k";
            }
            else if(pipe.top && pipe.bottom && !pipe.left && pipe.right){
                return "l";
            }
            else if(pipe.top && !pipe.bottom && pipe.left && pipe.right){
                return "m";
            }
            else if(!pipe.top && pipe.bottom && pipe.left && pipe.right){
                return "n";
            }
            else{
                return "o";
            }
        }
        var mapInfo = "";
        for(var i=0;i<this.hTileNum;i++){
            for(var j=0;j<this.wTileNum;j++){
                if(this.tiles[i][j] instanceof Pipe){
                    mapInfo += getPipeInfo(this.tiles[i][j]);
                }
                else {
                    mapInfo += "■";
                }
            }
            mapInfo += ",";
        }
        mapInfo = mapInfo.slice(0,-1);
        return mapInfo;
    }

    __gameClear(){
        if(this.__getMapInfo() === this.answer){
            return true;
        }
        return false;
    }

    __onBoard(posX,posY,callback){
        for(var [indexCol,row] of this.tiles.entries()){
            for(var [indexRow,tile] of row.entries()){
                if( posX >= tile.x && posX <= (tile.x + tile.width) &&
                    posY >= tile.y && posY <= (tile.y + tile.height)){
                    callback(tile,indexCol,indexRow);
                    break;
                }
            }
        }
    }

    __operate(operations){
        if(Tile.onTop(this.clicked1.tile,this.clicked2.tile)){
            operations.onTop();
        }
        else if(Tile.onBottom(this.clicked1.tile,this.clicked2.tile)){
            operations.onBottom();
        }
        else if(Tile.onRight(this.clicked1.tile,this.clicked2.tile)){
            operations.onRight();
        }
        else if(Tile.onLeft(this.clicked1.tile,this.clicked2.tile)){
            operations.onLeft();
        }
    }

    __onRectangleAndRectangle(){
        // 中間のタイルをハイライトする
        this.highLightBetween(this.clicked1,this.clicked2);
    }

    __onPipeAndRectangle(){
        var operations = {};
        // clicked1が上
        operations.onTop = function(){
            if(this.clicked1.tile instanceof Pipe)
                this.clicked1.tile.bottom = true;
            else
                this.clicked2.tile.top = true;
        }.bind(this);
        // clicked1が下
        operations.onBottom = function(){
            if(this.clicked1.tile instanceof Pipe)
                this.clicked1.tile.top = true;
            else 
                this.clicked2.tile.bottom = true;
        }.bind(this);
        // clicked1が左
        operations.onLeft = function(){
            if(this.clicked1.tile instanceof Pipe)
                this.clicked1.tile.left = true;
            else
                this.clicked2.tile.right = true;
        }.bind(this);
        // clicked1が右
        operations.onRight = function(){
            if(this.clicked1.tile instanceof Pipe)
                this.clicked1.tile.right = true;
            else
                this.clicked2.tile.left = true;
        }.bind(this);
        this.__operate(operations);

        // 中間のタイルもハイライトする
        this.highLightBetween(this.clicked1,this.clicked2);
    }

    __onPipeAndPipe(){
        // 同じパイプが選ばれたとき値をリセットする
        if(this.clicked1.tile === this.clicked2.tile){
            this.clicked1.tile.top = false;
            this.clicked1.tile.bottom = false;
            this.clicked1.tile.left = false;
            this.clicked1.tile.right = false;
            return ;
        }

        var operations = {};
        // clicked1が上
        operations.onTop = function(){
            this.clicked1.tile.bottom = true;
            this.clicked2.tile.top = true;
        }.bind(this);
        // clicked1が下
        operations.onBottom = function(){
            this.clicked1.tile.top = true;
            this.clicked2.tile.bottom = true;
        }.bind(this);
        // clicked1が左
        operations.onLeft = function(){
            this.clicked1.tile.left = true;
            this.clicked2.tile.right = true;
        }.bind(this);
        // clicked1が右
        operations.onRight = function(){
            this.clicked1.tile.right = true;
            this.clicked2.tile.left = true;
        }.bind(this);
        this.__operate(operations);

        // 中間のタイルもハイライトする
        this.highLightBetween(this.clicked1,this.clicked2);
    }
}