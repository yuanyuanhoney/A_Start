(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/aStartController.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '398c4xWBY5FAq6OIHyYpGr2', 'aStartController', __filename);
// script/aStartController.js

"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var iconConf = {
    canGo: 0,
    startPoint: 1,
    endPoint: 2,
    onCan: 3
};

var kCost1 = 10; //直移一格消耗
var kCost2 = 14; //斜移一格消耗

/*-3 表示不可行
0表示可通过

*/
var aStartArrays = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, -3, 0, 0, 0, 0, 0], [0, 0, -1, 0, 0, -3, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, -3, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, -3, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, -3, 0, 0, -2, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

var startManager = function () {
    _createClass(startManager, null, [{
        key: "getInstance",
        value: function getInstance(view) {
            if (!_instance) _instance = new startManager(view);
            return _instance;
        }
    }]);

    function startManager(view) {
        _classCallCheck(this, startManager);

        this.view = view;
        this.aStartArrays = aStartArrays;
        this.xL = this.aStartArrays.length;
        this.yL = this.aStartArrays[0].length;
        this.opens = []; //开放列表
        this.closes = []; //关闭列表
    }

    _createClass(startManager, [{
        key: "start",
        value: function start() {
            this.view && this.view.init(this.aStartArrays);
        }
    }, {
        key: "getxL",
        value: function getxL() {
            return this.xL;
        }
    }, {
        key: "getyL",
        value: function getyL() {
            return this.yL;
        }

        //是否可以加到斜角中去

    }, {
        key: "isCanreach",
        value: function isCanreach(point, target, isIgnoreCorner) {
            if (target.x < 0 || target.y < 0) return;
            var curData = this.aStartArrays[target.x][target.y];
            if (target.x < 0 || target.x > this.xL - 1 || target.y < 0 || target.y > this.yL - 1 || curData == -3 || this.isInList(this.closes, target)) {
                //超出范围
                return false;
            } else {
                if (Math.abs(point.x - target.x) + Math.abs(point.y - target.y) == 1) {
                    //非斜角可以
                    return true;
                } else {
                    return isIgnoreCorner;
                }
            }
        }

        //获取周边的点

    }, {
        key: "getSurroundPoints",
        value: function getSurroundPoints(currentPoint, isIgnoreCorner) {
            var currentX = currentPoint.x;
            var currentY = currentPoint.y;
            var rows = [];
            for (var x = currentX - 1; x <= currentX + 1; x++) {
                for (var y = currentY - 1; y <= currentY + 1; y++) {

                    if (this.isCanreach(currentPoint, { x: x, y: y }, isIgnoreCorner)) {
                        rows.push({ x: x, y: y, data: this.aStartArrays[x][y] });
                    }
                }
            }
            return rows;
        }
    }, {
        key: "cacG",
        value: function cacG(tempStart, point) {
            var dis = Math.abs(point.x - tempStart.x) + Math.abs(point.y - tempStart.y);
            if (dis == 0) return 0;
            var extrG = dis == 1 ? kCost1 : kCost2;
            var parentG = tempStart.G || 0;
            return parentG + extrG;
        }
    }, {
        key: "cacH",
        value: function cacH(tempEnd, point) {
            return Math.sqrt((point.x - tempEnd.x) * (point.x - tempEnd.x) + (point.y - tempEnd.y) * (point.y - tempEnd.y)) * kCost1;
        }
    }, {
        key: "cacF",
        value: function cacF(point) {
            return point.H + point.G;
        }
    }, {
        key: "getLeastFPoint",
        value: function getLeastFPoint(openList) {
            if (openList.length > 0) {
                var resPoint = openList[0];
                var index = 0;
                for (var i = 0; i < openList.length; i++) {
                    if (openList[i].F < resPoint.F) {
                        resPoint = openList[i];
                        index = i;
                    }
                }
                return { resPoint: resPoint, index: index };
            }
            return null;
        }
    }, {
        key: "isInList",
        value: function isInList(list, target) {
            for (var i = 0; i < list.length; i++) {
                var curData = list[i];
                if (curData.x == target.x && curData.y == target.y) {
                    return curData;
                }
            }
            return null;
        }
    }, {
        key: "GetPath",
        value: function GetPath(startPoint, endPoint, isIgnoreCorner) {
            var result = this._findWay(startPoint, endPoint, isIgnoreCorner);
            var path = [];
            //返回路径，如果没找到路径，返回空链表
            while (result) {
                path.unshift(result);
                result = result.parent;
            }
            return path;
        }
    }, {
        key: "_findWay",
        value: function _findWay(start, end, isIgnoreCorner) {
            this.opens.splice(0, this.opens.length);
            this.closes.splice(0, this.closes.length);
            this.opens.push(start);
            while (this.opens.length > 0) {
                var curPoint = this.getLeastFPoint(this.opens); //找到F值最小的点
                if (!curPoint) break;
                var curP = curPoint.resPoint;
                this.opens.splice(curPoint.index, 1);
                curPoint && this.closes.push(curPoint.resPoint); //放到关闭列表
                //1,找到当前周围格中可以通过的格子
                var surroundPoints = this.getSurroundPoints(curPoint.resPoint, isIgnoreCorner);
                for (var i = 0; i < surroundPoints.length; i++) {
                    var target = surroundPoints[i];
                    //2,对某一个格子，如果它不在开启列表中，加入到开启列表，设置当前格为其父节点，计算F G H
                    if (!this.isInList(this.opens, target)) {
                        target.parent = curP;
                        target.G = this.cacG(curP, target);
                        target.H = this.cacH(end, target);
                        target.F = this.cacF(target);
                        this.opens.push(target);
                    } else {
                        //3，对某一个格子，它在开启列表中，计算G值, 如果比原来的大, 就什么都不做, 否则设置它的父节点为当前点,并更新G和F
                        var tempG = this.cacG(curP, target);
                        if (tempG < target.G) {
                            target.parent = curP;
                            target.G = this.cacG(curP, target);
                            target.F = this.cacF(target);
                        }
                    }
                    var resPoint = this.isInList(this.closes, end);
                    if (resPoint) {
                        return resPoint;
                    }
                }
            }
            return null;
        }
    }]);

    return startManager;
}();

;
var _instance = null;
module.exports = startManager;

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
        //# sourceMappingURL=aStartController.js.map
        