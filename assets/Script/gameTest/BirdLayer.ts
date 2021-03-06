import BirdNode from "./BirdNode";
import BirdBase from "./BirdBase";
import { BirdPool } from "./BirdPool";
import { PathPoint } from "./PathPoint";
import { ActionBase } from "./ActionBase";

const { ccclass, property } = cc._decorator;

/**
 * 路线点事件枚举
 */
export enum PointEventEnum {
    FLIP_X = 1,		//横向翻转
    FLIP_Y = 2		//纵向翻转
}


@ccclass
export default class BirdLayer extends cc.Component {

    private _objectLayer: cc.Node; // 显示鱼的对象层
    // private _layer1: cc.Node;
    // private _layer2: cc.Node;
    // private _layer3: cc.Node;

    private _fishList: Array<BirdBase> = new Array<BirdNode>();

    private _isFlip = false;
    onLoad() {
        this._objectLayer = this.node;
        // this._layer1 = this._objectLayer.getChildByName("_layer_1");
        // this._layer2 = this._objectLayer.getChildByName("_layer_2");
        // this._layer3 = this._objectLayer.getChildByName("_layer_3");
        //检测清鱼的函数，5秒钟执行一次
        this.schedule(this.checkClearFish, 5);
    }

    //跟进路径id获取路径数据
    public getFishPathById(id: number): Array<PathPoint> {
        let pathArr = [{ path: { points: [{ x: 0, y: 0, r: 0, d: 1000, e: 0 }, { x: 67, y: 55, r: 39, d: 122, e: 0 }, { x: 190, y: 182, r: 4, d: 2183, e: 0 }, { x: 551, y: 360, r: -10, d: 5483, e: 0 }, { x: 16, y: 4, r: -19, d: 133, e: 0 }, { x: 14, y: 3, r: -2, d: 108, e: 0 }, { x: 9, y: 2, r: 0, d: 75, e: 0 }, { x: 25, y: 2, r: -8, d: 208, e: 0 }, { x: 742, y: 37, r: -2, d: 6183, e: 0 }] } },
        { path: { points: [{ x: 0, y: 0, r: 0, d: 1000, e: 0 }, { x: 80, y: 0, r: 0, d: 800, e: 0 }, { x: 1904, y: -4, r: 0, d: 19040, e: 0 }] }, },
        { path: { points: [{ x: 0, y: 0, r: 0, d: 1000, e: 0 }, { x: -32, y: 0, r: 180, d: 320, e: 0 }, { x: -2003, y: 25, r: 0, d: 20030, e: 0 }] }, },
        { path: { points: [{ x: 0, y: 0, r: 0, d: 1000, e: 0 }, { x: 57, y: -34, r: -31, d: 660, e: 0 }, { x: 1955, y: -1154, r: 1, d: 22700, e: 0 }] }, },
        { path: { points: [{ x: 0, y: 0, r: 0, d: 1000, e: 0 }, { x: 57, y: -34, r: -31, d: 660, e: 0 }, { x: 1955, y: -1154, r: 1, d: 28375, e: 0 }] }, },
        { path: { points: [{ x: 0, y: 0, r: 0, d: 1000, e: 2 }, { x: -41, y: 20, r: 153, d: 460, e: 0 }, { x: -1987, y: 1110, r: -2, d: 22760, e: 0 }] }, },
        { path: { points: [{ x: 0, y: 0, r: 0, d: 1000, e: 0 }, { x: -41, y: 20, r: 153, d: 460, e: 0 }, { x: -1987, y: 1110, r: -2, d: 28450, e: 0 }] }, },
        { path: { points: [{ x: 0, y: 0, r: 0, d: 1000, e: 0 }, { x: 2, y: -100, r: -88, d: 1010, e: 0 }, { x: 13, y: -1399, r: -1, d: 17500, e: 0 }] }, },
        { path: { points: [{ x: 0, y: 0, r: 0, d: 1000, e: 0 }, { x: 4, y: -103, r: -87, d: 1030, e: 0 }, { x: 25, y: -1328, r: -1, d: 13290, e: 0 }] }, },]
        let dataMove = pathArr[id].path.points;
        let arr: Array<PathPoint> = new Array();
        let len = dataMove.length;
        for (let i = 0; i < len; i++) {
            let moveDataVo = dataMove[i];
            arr.push(
                new PathPoint(
                    Number(moveDataVo.x),
                    Number(moveDataVo.y),
                    Number(moveDataVo.r),
                    Number(moveDataVo.d),
                    Number(moveDataVo.e)
                )
            );
        }
        return arr;
    }

    /**
	 * 根据剩余存活时间获取动态路径和初始坐标  
	 * @param points  动作关键点
	 * @param aliveTime  剩余存活时间
	 */
    public getPointsAndPos(points: Array<PathPoint>, aliveTime: number): Array<any> {

        let result: Array<any> = new Array<any>();
        let tempPoints = new Array<PathPoint>();
        let totalTime = 0;
        let len = points.length;
        let addX = 0;
        let addY = 0;
        let addR = 0;
        let addFlipY = 0;
        for (let i = len - 1; i >= 0; i--) {
            totalTime += points[i].t;
            if (totalTime >= aliveTime && i < len - 1) {  // i< len -1
                addX += points[i].x;
                addY += points[i].y;
                addR += points[i].r;
                if (points[i].e == PointEventEnum.FLIP_Y) {
                    addFlipY += 1;
                }
            } else {
                tempPoints.push(points[i]);
            }
        }
        tempPoints = tempPoints.reverse();
        result.push(tempPoints);
        result.push(new cc.Vec2(addX, addY));
        result.push(addR);
        let flipY: boolean = false;
        if (addFlipY % 2 == 0) {
            flipY = false;   //false 
        } else {
            flipY = true;  // true
        }
        result.push(flipY);
        return result;
    }

    //加鱼
    public addUnitFish(type: number, fishId: number, pathId: number, posX: number, posY: number,
        aliveTime: number = 0, pathPot: number = -1): void {
        // return;
        let fishAtLayer = -1; //鱼存在哪一层
        //TODO  鸟路径设置
        //鸟的移动 需要设置
        let arr: Array<PathPoint> = this.getFishPathById(pathId);
        if (!arr) {
            return;
        }

        let fish: BirdBase;
        //处理鱼的出生handler
        let self = this;

        let drawFishHandler = function () {

            //处理已经在鱼塘中存活的鱼，让其不让在起始点出生。
            let rota = 0;
            let flipY = false;
            //存活时间

            fish.setFishPosition(posX, posY);
            fish.rotation = rota;
            //处理已经在鱼塘中存活的鱼反转问题
            // if ((aliveTime > 0) || (pathPot >= 0)) {
            //     if (flipY) {
            //         fish.fishflipY();
            //     }
            // }

            //默认层级1
            self.addFishAt(fish, 1);

            // if (APP.DEBUG) {  //调试模式 显示路径ID
            //     let lable = fish.getChildByName("lable");
            //     if (!lable) {
            //         lable = new cc.Node("lable");
            //         lable.color = cc.Color.BLACK;
            //         lable.addComponent(cc.Label);
            //         fish.addChild(lable);
            //     }
            //     // lable.getComponent(cc.Label).string = pathId.toString();
            //     lable.getComponent(cc.Label).string = "fishId:" + fishId;
            // }
            cc.log(arr);
            // 绑定游动逻辑
            ActionBase.bindMoveAction(arr, fish);
        }
        //创建鱼 
        fish = BirdPool.getFIshPool().getFish(fishId);

        if (self._isFlip) {
            fish.fishflipY();
        }
        fish.setType(type);
        drawFishHandler();
        // fish.setUniqId(uniqIdArr[0]);
        fish.setUniqId(0);
    }

    /** 把鱼添加到指定节点*/
    public addFishAt(fish: BirdBase, at: number): void {
        // switch (at) {
        //     case 1:
        //         this._fishList.push(fish);
        //         this._layer1.addChild(fish, at);
        //         break;
        //     case 2:
        //         this._fishList.push(fish);
        //         this._layer2.addChild(fish, at);
        //         break;
        //     case 3:
        //         this._fishList.push(fish);
        //         this._layer3.addChild(fish, at);
        //         break;
        // }

        this._fishList.push(fish);
        this._objectLayer.addChild(fish, at);
        cc.log(this._fishList);
    }

    // public getRoomUI(): RoomView {
    //     return this.node.parent.getComponent<RoomView>(RoomView);
    // }

    public getFishList(): Array<BirdBase> {
        return this._fishList;
    }

    /**
     * 清鱼的函数
     */
    checkClearFish() {
        let deadFish = new Array<BirdBase>();
        if (!this._fishList) {
            return;
        }
        let len = this._fishList.length;

        for (let i = 0; i < len; i++) {
            if (!this._fishList[i].getActive() /*&& !fishList[i].activeInHierarchy*/) {
                deadFish.push(this._fishList[i]);
            }
        }
        let deadLen = deadFish.length;
        for (let i = 0; i < deadLen; i++) {
            let index = this._fishList.indexOf(deadFish[i]);
            this._fishList.splice(index, 1);
            BirdPool.getFIshPool().pushFish(deadFish[i]);
        }
    }

    onDestroy() {
        this.unscheduleAllCallbacks();
        this.unschedule(this.checkClearFish);
        this._objectLayer = null;
        // this._layer1 = null;
        // this._layer2 = null;
        // this._layer3 = null;
        this._fishList = null;
    }
}
