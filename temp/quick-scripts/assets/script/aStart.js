(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/aStart.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '280c3rsZJJKnZ9RqbALVwtK', 'aStart', __filename);
// script/aStart.js

"use strict";

var AstarControl = require('aStartController');

var iconConf = {
    canGo: 0,
    startPoint: 1,
    endPoint: 2,
    onCan: 3
};
cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        errorLabel: cc.Node,
        iconPrebef: cc.Prefab,
        contentNode: cc.Node
    },

    onLoad: function onLoad() {
        this.StartPoint = null;
        this.EntPoint = null;
        this.comArr = [];
        this.astarControl = AstarControl.getInstance(this);
    },

    start: function start() {
        this.astarControl.start();
        this.click = false;
    },

    //获取周边的点
    getRound: function getRound(currentPoint) {
        var currentX = currentPoint.x;
        var currentY = currentPoint.y;
        var rows = [];
        if (currentPoint.y - 1 >= 0) {
            //上
            rows.push({ x: currentX, y: currentY - 1 });
        }
        if (currentPoint.y + 1 < this.data.length) {
            //下
            rows.push({ x: currentX, y: currentY + 1 });
        }

        if (currentPoint.x - 1 >= 0) {
            //左
            rows.push({ x: currentX - 1, y: currentY });
        }

        if (currentPoint.x + 1 < this.data[0].length) {
            //右
            rows.push({ x: currentX + 1, y: currentY });
        }

        return rows;
    },
    init: function init(startArray) {
        this.startArray = startArray;
        var len = startArray[0].length;
        this.contentNode.width = len * 35;
        for (var i = 0; i < startArray.length; i++) {
            var tempArray = startArray[i];
            this.comArr[i] = [];
            for (var j = 0; j < tempArray.length; j++) {
                var cellData = tempArray[j];
                var cellPrefeb = cc.instantiate(this.iconPrebef);
                cellPrefeb.parent = this.contentNode;
                var com = cellPrefeb.getComponent("iconView");
                var data = { x: i, y: j, F: 0, G: 0, data: cellData };
                if (cellData == -1) {
                    this.StartPoint = { x: i, y: j, F: 0, G: 0 };
                }
                if (cellData == -2) {
                    this.EndPoint = { x: i, y: j, F: 0, G: 0 };
                }
                com && com.init(data);
                this.comArr[i][j] = com;
            }
        }
    },
    clearAll: function clearAll() {
        for (var i = 0; i < this.startArray.length; i++) {
            var tempArray = this.startArray[i];
            for (var j = 0; j < tempArray.length; j++) {
                var com = this.comArr[i][j];
                com && com.clear();
            }
        }
    },
    _clickPath: function _clickPath(isIng) {
        var _this = this;

        if (this.click) {
            this.clearAll();
        }
        this.click = true;
        var path = this.astarControl.GetPath(this.StartPoint, this.EndPoint, isIng);
        if (!path || path.length == 0) {
            this.errorLabel.active = true;
            return;
        } else {
            this.errorLabel.active = false;
        }
        cc.log("path:" + JSON.stringify(path));
        var xL = this.astarControl.getxL();
        var i = 0;
        var num = path.length;
        setInterval(function () {
            if (path[i]) {
                var itemData = path[i];
                var x = itemData.x;
                var y = itemData.y;
                var _num = x * xL + y;
                ;var com = _this.comArr[x][y];
                com && com.setColor();
            }
            i++;
        }, 500);
    },
    onClickPath: function onClickPath(btn, data) {
        var flag = parseInt(data);
        var isTrue = flag ? true : false;
        this._clickPath(flag);
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=aStart.js.map
        