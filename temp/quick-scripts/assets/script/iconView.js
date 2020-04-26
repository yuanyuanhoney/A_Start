(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/iconView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fefb3bl25tIn4DYJLgsW/lK', 'iconView', __filename);
// script/iconView.js

"use strict";

var iconConf = {
    canGo: 0,
    startPoint: 1,
    endPoint: 2,
    onCan: 3
};
cc.Class({
    extends: cc.Component,

    properties: {
        startNode: cc.Node,
        endNode: cc.Node,
        putongNode: cc.Node,
        notGo: cc.Node,
        //   iconSpr:cc.Node,
        bgColor: [cc.Color]
    },

    init: function init(data) {
        this.data = data;
        var value = this.data.data;
        this.startNode.active = value === -1;
        this.endNode.active = value === -2;
        this.putongNode.active = value === 0;
        this.notGo.active = value === -3;
    },
    setColor: function setColor() {
        var value = this.data.data;
        if (value === 0 && this.bgColor[1]) {
            this.putongNode.color = this.bgColor[1];
        }
    },
    clear: function clear() {
        var value = this.data.data;
        if (value === 0 && this.bgColor[0]) {
            this.putongNode.color = this.bgColor[0];
        }
    }

    // update (dt) {},

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
        //# sourceMappingURL=iconView.js.map
        