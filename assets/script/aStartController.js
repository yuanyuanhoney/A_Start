
const iconConf = {
    canGo:0,
    startPoint:1,
    endPoint:2,
    onCan:3,
}

const  kCost1 = 10; //直移一格消耗
const  kCost2 = 14; //斜移一格消耗

/*-3 表示不可行
0表示可通过

*/
let aStartArrays= [
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,-3,0,0,0,0,0],
    [0,0,-1,0,0,-3,0,0,0,0,0],
    [0,0,0,0,0,-3,0,0,0,0,0],
    [0,0,0,0,0,-3,0,0,0,0,0],
    [0,0,0,0,0,-3,0,0,-2,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0]
];
class startManager{
    static getInstance(view){
        if(!_instance) _instance = new startManager(view);
        return _instance;
    }
    constructor(view) {
        this.view = view;
        this.aStartArrays = aStartArrays
        this.xL = this.aStartArrays.length;
        this.yL = this.aStartArrays[0].length;
        this.opens = []; //开放列表
        this.closes = []; //关闭列表
    }
    start(){
        this.view && this.view.init(this.aStartArrays);
    }

    getxL(){
        return this.xL;
    }

    getyL(){
        return this.yL;
    }

    //是否可以加到斜角中去
    isCanreach(point, target, isIgnoreCorner){
        if(target.x < 0 || target.y < 0 || target.x > this.xL - 1 || target.y > this.yL - 1 ) return;
        let curData = this.aStartArrays[target.x][target.y];
        if(curData == -3 || this.isInList(this.closes, target)){//超出范围
            return false;
        }else{
            if (Math.abs(point.x - target.x) + Math.abs(point.y - target.y) == 1){ //非斜角可以
                return true;
            }else{
                return isIgnoreCorner; 
            }
        }
    }

    //获取周边的点
    getSurroundPoints(currentPoint, isIgnoreCorner){
        let currentX = currentPoint.x;
        let currentY = currentPoint.y;
        let rows = [];
        for(let x = currentX - 1; x <= currentX + 1; x++){
            for(let y = currentY-1; y <= currentY + 1; y++){
                
                if(this.isCanreach(currentPoint,{x: x,y: y}, isIgnoreCorner)){
                    rows.push({x: x, y: y, data: this.aStartArrays[x][y]})
                }
            }
        }
        return rows;
    }

    cacG(tempStart, point){
        let dis =  Math.abs(point.x - tempStart.x) + Math.abs(point.y - tempStart.y);
        if(dis == 0) return 0;
        let extrG = (dis == 1?kCost1: kCost2);
        let parentG = tempStart.G || 0;
        return parentG + extrG;
    }

    cacH(tempEnd, point){
        return Math.sqrt((point.x - tempEnd.x)*(point.x - tempEnd.x) + (point.y - tempEnd.y)* (point.y - tempEnd.y))*kCost1;
    }

    cacF(point){
        return point.H + point.G;
    }

    getLeastFPoint(openList){
        if(openList.length > 0){
            let resPoint = openList[0];
            let index = 0;
            for(let i = 0; i < openList.length; i++){
                if(openList[i].F < resPoint.F){
                    resPoint = openList[i];
                    index = i;
                }
            }
            return {resPoint:resPoint,index:index};
        }
        return null;
    }

    isInList(list, target){
        for (let i = 0; i < list.length; i++){
            let curData = list[i];
            if(curData.x == target.x && curData.y == target.y){
                return curData;
            }
        }
        return null;
    }

    GetPath(startPoint, endPoint, isIgnoreCorner)
    {
        let result = this._findWay(startPoint, endPoint, isIgnoreCorner);
        let  path = [];
        //返回路径，如果没找到路径，返回空链表
        while (result)
        {
            path.unshift(result);
            result = result.parent;
        }
        return path;
    }

    _findWay(start, end, isIgnoreCorner){
        this.opens.splice(0, this.opens.length);
        this.closes.splice(0, this.closes.length);
        this.opens.push(start);
        while(this.opens.length>0){
            let curPoint = this.getLeastFPoint(this.opens);//找到F值最小的点
            if(!curPoint) break;
            let curP = curPoint.resPoint;
            this.opens.splice(curPoint.index,1);
            curPoint && this.closes.push(curPoint.resPoint);//放到关闭列表
            //1,找到当前周围格中可以通过的格子
            let surroundPoints = this.getSurroundPoints(curPoint.resPoint, isIgnoreCorner);
            for(let i = 0; i < surroundPoints.length; i++){
                let target = surroundPoints[i];
                //2,对某一个格子，如果它不在开启列表中，加入到开启列表，设置当前格为其父节点，计算F G H
                if(!this.isInList(this.opens, target)){
                    target.parent  = curP;
                    target.G = this.cacG(curP, target);
                    target.H = this.cacH(end, target);
                    target.F = this.cacF(target);
                    this.opens.push(target);
                }else{//3，对某一个格子，它在开启列表中，计算G值, 如果比原来的大, 就什么都不做, 否则设置它的父节点为当前点,并更新G和F
                    let tempG = this.cacG(curP, target);
                    if(tempG < target.G){
                        target.parent = curP;
                        target.G = this.cacG(curP, target);
                        target.F = this.cacF(target);
                    }
                }
                let resPoint = this.isInList(this.closes, end);
                if(resPoint){
                    return resPoint;
                }
            }
        }
        return null;
    }
};
let _instance = null;
module.exports = startManager;
