// 全局变量
let globals = {
  firstPlay: true,                                  // firstPlay = true 定义黑棋先下
  playList: [],                                     // 棋谱中被占用的位置统计数组
  canvas: document.getElementById('canvas'),        // 画布元素
  context: canvas.getContext('2d'),                 // 获取2d上下文对象
  winList: [],                                      // 赢法数组
  count: 0,                                         // 赢法总数 1020
  blackWinList: [],                                 // 黑棋 赢法统计
  whiteWinList: [],                                 // 白棋 赢法统计
  gameOver: false,                                  // 是否已结束
};

for( let i = 0; i < 19; i++ ){
  globals.playList[i] = [];
  for( let j = 0; j < 19; j++ ){
    globals.playList[i][j] = 0;
  }
}

/***********赢法数组填充开始**************/
const beginTime = new Date();
for( let i = 0; i < 19; i++ ){
  globals.winList[i] = [];
  for( let j = 0; j < 19; j++ ){
    globals.winList[i][j] = [];
  }
}
//横向赢的情况
for( let i = 0; i < 19; i++ ){
  for( let j = 0; j < 15; j++ ){
    for( let k = 0; k < 5; k++ ){
      globals.winList[i][j+k][globals.count] = true;
    }
    globals.count++
  }
}
//纵向赢的情况
for( let i = 0; i < 15; i++ ){
  for( let j = 0; j < 19; j++ ){
    for( let k = 0; k < 5; k++ ){
      globals.winList[i+k][j][globals.count] = true;
    }
    globals.count++
  }
}
//斜向赢的情况
for( let i = 0; i < 15; i++ ){
  for( let j = 0; j < 15; j++ ){
    for( let k = 0; k < 5; k++ ){
      globals.winList[i+k][j+k][globals.count] = true;
    }
    globals.count++
  }
}
//反斜向赢的情况
for( let i = 0; i < 15; i++ ){
  for( let j = 18; j > 3; j-- ){
    for( let k = 0; k < 5; k++ ){
      globals.winList[i+k][j-k][globals.count] = true;
    }
    globals.count++
  }
}
const endTime = new Date();
console.log(endTime-beginTime);

for( let i = 0; i < globals.count; i++ ){
  globals.blackWinList[i] = 0;
  globals.whiteWinList[i] = 0;
}
/***********赢法数组填充完毕**************/

window.addEventListener('load',function(){
  drawWatermark();
  drawLine();
},false);

/**
 * 落子
 */
globals.canvas.addEventListener('click',function(e){
  if( globals.gameOver ){
    return
  }
  let X = e.offsetX;
  let Y = e.offsetY;
  let x = Math.floor(X / 30);
  let y = Math.floor(Y / 30);
  if( globals.playList[x][y] === 0 ){
    play(x,y,globals.firstPlay);
    if( globals.firstPlay ){
      globals.playList[x][y] = 1;
    }else{
      globals.playList[x][y] = 2;
    }
    judgement(x,y,globals.playList[x][y]);  //调用judgement函数
    globals.firstPlay = !globals.firstPlay;
  }
},false);

/**
 * 画水印、填充定义
 */
function drawWatermark(){
  globals.context.translate(0.5,0.5);
  globals.context.fillStyle = 'rgba(255,255,255,.2)';
  globals.context.strokeStyle = '#333';
  globals.context.font = "150px sans-serif";
  globals.context.fillText("五子棋", 60, 340);
}

/**
 * 画棋谱网格线
 */
function drawLine(){
  for( let i = 0; i < 19; i++ ){
    globals.context.moveTo(15 + i*30, 15);
    globals.context.lineTo(15 + i*30, 555);
    globals.context.stroke();
    globals.context.moveTo(15, 15 + i*30);
    globals.context.lineTo(555, 15 + i*30);
    globals.context.stroke();
  }
}

/**
 * person=true 黑棋
 */
function play(x,y,person){
  globals.context.beginPath();
  globals.context.arc(15 + x*30,15 + y*30,12,0,2*Math.PI);
  globals.context.closePath();
  let gradient = globals.context.createRadialGradient(15 + x*30,15 + y*30,10,15 + x*30,15 + y*30,0);
  if( person === true ){
    gradient.addColorStop(0, "#000");
    gradient.addColorStop(1, '#666');
  }else{
    gradient.addColorStop(0, "#BFBFBF");
    gradient.addColorStop(1, '#fff');
  }
  globals.context.fillStyle = gradient;
  globals.context.fill();
}

/**
 * 判断游戏是否结束，color落子颜色
 */
function judgement(x,y,color){
  for(let i = 0; i < globals.count; i++){
    if( globals.winList[x][y][i] ){  //点(x,y)处有赢法
      if(color === 1){
        globals.blackWinList[i]++;
        if(globals.blackWinList[i] === 5){
          console.log("黑子胜利!");
          globals.over = true;
        }
      }
      if(color === 2){
        globals.whiteWinList[i]++;
        if(globals.whiteWinList[i] === 5){
          console.log("白子胜利!");
          globals.over = true;
        }
      }
    }
  }
}