const iconConf = {
    canGo:0,
    startPoint:1,
    endPoint:2,
    onCan:3,
}
cc.Class({
    extends: cc.Component,

    properties: {
      startNode:cc.Node,
      endNode:cc.Node,
      putongNode:cc.Node,
      notGo:cc.Node,
    //   iconSpr:cc.Node,
      bgColor:[cc.Color],
    },

    init (data) {
        this.data = data;
        let value = this.data.data;
        this.startNode.active = (value===-1);
        this.endNode.active = (value===-2);
        this.putongNode.active = (value===0);
        this.notGo.active = (value === -3);
    },

    setColor(){
        let value = this.data.data;
        if(value === 0 && this.bgColor[1]){
            this.putongNode.color = this.bgColor[1];
        }
    },

    clear(){
        let value = this.data.data;
        if(value === 0 && this.bgColor[0]){
            this.putongNode.color = this.bgColor[0];
        }
    }

    // update (dt) {},
});
