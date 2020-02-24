
/* canvasを構成するRectangle,Pipe */
class Rectangle {
    constructor(x,y,width,height,color=null){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = (color === null ? new Color() : color);
    }

    fill(stroke=null){
        var r = 10;
        if(stroke === null){
            stroke = this.color;
        }
        context.beginPath();
        context.lineWidth = 1;
        context.fillStyle = this.color;
        context.strokeStyle = stroke;
        context.moveTo(this.x,this.y + r);
        context.arc(this.x+r,this.y+this.height-r,r,Math.PI,Math.PI*0.5,true);
        context.arc(this.x+this.width-r,this.y+this.height-r,r,Math.PI*0.5,0,1);
        context.arc(this.x+this.width-r,this.y+r,r,0,Math.PI*1.5,1);
        context.arc(this.x+r,this.y+r,r,Math.PI*1.5,Math.PI,1);
        context.closePath();
        context.stroke();
        context.fill();
        //context.fillRect(this.x,this.y,this.width,this.height);
    }

    highlightFill(callback=null){
        this.fill(Color.highLight);
        if(callback != null){
            callback();
        }
    }

    highlightOff(callback=null){
        this.fill();
        if(callback != null){
            callback();
        }
    }

    static exchange(r1,r2){
        var x = r1.x;
        var y = r1.y;
        var w = r1.width;
        var h = r1.height;
        

        r1.x = r2.x;
        r1.y = r2.y;
        r1.width = r2.width;
        r1.height = r2.height;

        r2.x = x;
        r2.y = y;
        r2.width = w;
        r2.height = h;
    }
}

class Pipe {
    constructor(x,y,width,height,color=null){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = (color === null ? new Color() : color);
        this.left = false;
        this.right = false;
        this.top = false;
        this.bottom = false;
        this.defaultColor = "rgb(100,100,100)";
    }

    __drawLine(sx,sy,ex,ey,color){
        context.beginPath();
        context.lineWidth = 10;
        context.strokeStyle = color;
        context.moveTo(sx,sy);
        context.lineTo(ex,ey);
        context.closePath();
        context.stroke();
    }

    fill(color=null){
        if(color === null){
            color = this.defaultColor;
        }
        
        /* ベースの描画 */
        this.__drawLine(this.x+this.width/2,this.y,this.x+this.width/2,this.y+this.height/2,color);             // top
        this.__drawLine(this.x+this.width/2,this.y+this.height/2,this.x+this.width/2,this.y+this.height,color); // bottom
        this.__drawLine(this.x,this.y+this.height/2,this.x+this.width/2,this.y+this.height/2,color);            // left
        this.__drawLine(this.x+this.width/2,this.y+this.height/2,this.x+this.width,this.y+this.height/2,color); // right

        /* trueになっている箇所をハイライトする */
        if(this.top){
            this.__drawLine(this.x+this.width/2,this.y,this.x+this.width/2,this.y+this.height/2,Color.highLight);
        }
        if(this.bottom){
            this.__drawLine(this.x+this.width/2,this.y+this.height/2,this.x+this.width/2,this.y+this.height,Color.highLight);
        }
        if(this.left){
            this.__drawLine(this.x,this.y+this.height/2,this.x+this.width/2,this.y+this.height/2,Color.highLight);
        }
        if(this.right){
            this.__drawLine(this.x+this.width/2,this.y+this.height/2,this.x+this.width,this.y+this.height/2,Color.highLight);
        }

    }

    highlightFill(callback=null){
        var selectColor = "rgb(120,120,120)"
        this.fill(selectColor);
        if(callback != null){
            callback();
        }
    }

    highlightOff(callback=null){
        this.fill();
        if(callback != null){
            callback();
        }
    }
}

class Tile {
    static onRight(tile1,tile2){
        // 行が同じ
        if(tile1.y === tile2.y){
            if(tile1.x < tile2.x){
                return true;
            }
        }
        return false;
    }

    static onLeft(tile1,tile2){
        // 行が同じ
        if(tile1.y === tile2.y){
            if(tile1.x >= tile2.x){
                return true;
            }
        }
    }

    static onTop(tile1,tile2){
        // 列が同じ
        if(tile1.x === tile2.x){
            if(tile1.y < tile2.y){
                return true;
            }
        }
        return false;
    }

    static onBottom(tile1,tile2){
        // 列が同じ
        if(tile1.x === tile2.x){
            if(tile1.y >= tile2.y){
                return true;
            }
        }
        return false;
    }
}