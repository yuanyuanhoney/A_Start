let AstarControl = require('aStartController');

const iconConf = {
    canGo:0,
    startPoint:1,
    endPoint:2,
    onCan:3,
}
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        errorLabel:cc.Node,
        iconPrebef:cc.Prefab,
        contentNode:cc.Node
    },

    onLoad: function () {
        this.StartPoint = null;
        this.EntPoint =null;
        this.comArr = [];
        this.astarControl = AstarControl.getInstance(this);
    },

    start(){
        this.astarControl.start();
        this.click = false;
    },
      //获取周边的点
      getRound(currentPoint){
        let currentX = currentPoint.x;
        let currentY = currentPoint.y;
        let rows = [];
        if(currentPoint.y - 1 >= 0){//上
            rows.push({x:currentX, y: currentY - 1});
        }
        if(currentPoint.y + 1 < this.data.length){ //下
            rows.push({x:currentX, y: currentY + 1});
        }

        if(currentPoint.x - 1 >= 0){ //左
            rows.push({x:currentX - 1, y: currentY});
        }

        if(currentPoint.x + 1 < this.data[0].length){ //右
            rows.push({x:currentX + 1, y: currentY});
        }

        return rows;
    },
    
    init(startArray){
        this.startArray = startArray;
        let len = startArray[0].length;
        this.contentNode.width = len * 35;
        for(let i = 0; i < startArray.length; i++){
            let tempArray = startArray[i];
            this.comArr[i]= []
            for(let j = 0; j < tempArray.length; j++){
                let cellData = tempArray[j];
                let cellPrefeb =  cc.instantiate(this.iconPrebef);
                cellPrefeb.parent = this.contentNode;
                let com = cellPrefeb.getComponent("iconView");
                let data = {x:i,y:j,F:0,G:0,data:cellData}
                if(cellData == -1){
                    this.StartPoint = {x:i,y:j,F:0,G:0};
                }
                if(cellData == -2){
                    this.EndPoint = {x:i,y:j,F:0,G:0};
                }
                com && com.init(data);
                this.comArr[i][j]=com;
            }
        }
    },

    clearAll(){
        for(let i = 0; i < this.startArray.length; i++){
            let tempArray = this.startArray[i];
            for(let j = 0; j < tempArray.length; j++){
                let com = this.comArr[i][j];
                com && com.clear()
            }
        }
    },

    _clickPath(isIng){
        if(this.click){
            this.clearAll();
        }
        this.click = true;
        let path = this.astarControl.GetPath(this.StartPoint, this.EndPoint, isIng);
        if(!path || path.length==0){
            this.errorLabel.active = true;
            return;
        } else{
            this.errorLabel.active = false;
        }
         cc.log("path:"+JSON.stringify(path));
        let xL = this.astarControl.getxL();
        let i = 0;
        let num = path.length;
        setInterval(()=>{
            if(path[i]){
                let itemData = path[i];
                let x = itemData.x;
                let y = itemData.y;
                let num = x*xL + y;
              ;  let com = this.comArr[x][y];
                com && com.setColor()
            }
            i++;
        },500);
    },

    onClickPath(btn, data){
        let flag = parseInt(data);
        let isTrue = flag?true:false;
        this._clickPath(flag)
    }
});
