var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

/*
    MoleculesであるRectangle,Pipeのために
    色操作の機能を提供する
 */
String.prototype.format = function(){
    var i=0,args = arguments;
    return this.replace(/{}/g,function(){
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

var bmin = rmin = gmin = 50;
var rmax = gmax = 240;
var bmax = 240;
class Color {
    constructor(r=null,g=null,b=null){
        this.r = (r === null ? Color.__getRandom(rmin,rmax) : r);
        this.g = (g === null ? Color.__getRandom(gmin,gmax) : g);
        this.b = (b === null ? Color.__getRandom(bmin,bmax) : b);
    }

    static __getRandom(min,max){
        return Math.floor(Math.random() *(max-min)+min);
    }

    static highLight = new Color(240,240,20);
    static highLightOff = new Color(30,30,30);
    static blackLine = new Color(80,80,80);
}
Color.prototype.toString = function(){
    return "rgb({},{},{})".format(this.r,this.g,this.b);
}

var maps = [
    {
        map:
        [
            [2,0,0,0,0,0,0],
            [3,0,0,0,0,0,0],
            [0,0,0,0,6,0,0],
            [0,7,0,0,0,0,0],
            [0,0,0,4,0,3,0],
            [0,0,0,0,0,0,0],
            [6,0,0,0,0,0,1],
            [7,0,5,0,0,0,0],
            [4,0,0,0,5,2,0],
            [1,0,0,0,0,0,0]
        ],
        answer:
            "■dddddj,■ddddjm,kddd■mm,m■kdjmm,mmm■m■m,mmmmmkf,■mmmmm■,■f■mmmm,■ddf■■m,■dddddf"
    }
]