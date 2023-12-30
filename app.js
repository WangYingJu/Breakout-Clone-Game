// 畫布設定
const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
// 初始設定圓
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let speed_x = 20;
let speed_y = 20;
let ground_x = 100;
let ground_y = 500;
let gronnd_width = 200;
let ground_height = 5;
let brickArray = [];
let brickUnit = 50;
let ctxColum = canvasWidth / brickUnit;
let ctxRow = (canvasHeight - (brickUnit * 3)) / brickUnit;
let count = 0;

// 監聽事件 地板跟隨滑鼠移動
c.addEventListener("mousemove", (e) => {
  ground_x = e.offsetX;
  if(e.offsetX <= 0) {
    ground_x = 0;
  }
  if(e.offsetX >= canvasWidth - gronnd_width) {
    ground_x = canvasWidth - gronnd_width;
  }
});

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = brickUnit;
    this.height = brickUnit;
    brickArray.push(this);
    this.visible = true;
  }
  drawBrick() {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
  checkTouch(ball_x, ball_y) {
    return (ball_x >= this.x - radius && ball_x <= this.x + this.width + radius && ball_y >= this.y - radius && ball_y <= this.y + this.height + radius);
  }
}

// 取 min 到 max 之間隨機一個數字
function anyNumber(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

// -------------------- 尚未修好 bug -------------------- //
// 確認 brickArray 裡是否有一樣的
function checkSame(arr, index) {
  for(let i = 0; i < arr.length; i++) {
    for(let j = (arr.length - 1); j > i; j--) {
      // console.log({i,j});
      if(arr[i].x == arr[j].x && arr[i].y == arr[j].y ) {
        console.log("重複了");
        return true;
      }
    }
  }
}

// 每次遊戲開始，都有隨機的 10 個磚頭
for(let i = 1; i <= 10; i++) {
  // 每製作出一個 brick 之前，要先確認 brickArray 裡是否有一樣的
  checkSame(brickArray);
  new Brick(anyNumber(0, ctxColum) * brickUnit, anyNumber(0, ctxRow) * brickUnit);
  // while(checkSame(brickArray)) {
    //   brickArray.splice(i, 1);
    //   new Brick(anyNumber(0, ctxColum) * brickUnit, anyNumber(0, ctxRow) * brickUnit);
  // }
}
// -------------------- 尚未修好 bug -------------------- //

console.log(brickArray);

// 初始設定
function draw() {
  // 確認圓球是否碰到邊界或地板，並改變行進方向
  checkBoundary();
  function checkBoundary() {
    // 確認球是否碰到方塊
    brickArray.forEach((Brick) => {
      // 如果球和方塊位置重疊
      if(Brick.visible && Brick.checkTouch(circle_x, circle_y)) {
        count++;
        console.log(count);
        Brick.visible = false;
        // 碰到方塊，改變球的方向
        // 從下方撞
        if(circle_y >= Brick.y + Brick.height) {
          speed_y *= -1;
        }
        // 從上方撞
        else if(circle_y <= Brick.y) {
          speed_y *= -1;
        }
        // 從右方撞
        else if(circle_x >= Brick.x + Brick.width) {
          speed_x *= -1;
        }
        //從左方撞
        else if(circle_x <= Brick.x) {
          speed_x *= -1;
        }
        // 從 brickArray 中移除
        // 方法一
        // brickArray.splice(index, 1);
        // if(brickArray.length == 0) {
        //   console.log("遊戲結束");
        //   alert("遊戲結束");
        //   clearInterval(game);
        // }
        // 方法二
        if(count == 10) {
          alert("You Win!");
          clearInterval(game);
        }
      }
    });
    
    // 確認球是否碰到地板
    if(circle_x >= ground_x - radius &&
      circle_x <= ground_x + gronnd_width + radius &&
      circle_y >= ground_y - radius &&
      circle_y <= ground_y + ground_height + radius) {
        if(speed_y > 0){
          circle_y -= 40;
        }else {
          circle_y += 40;
        }
        speed_y *= -1;
    }
    // 確認球是否碰到右方邊界
    if(circle_x >= canvasWidth - radius) {
      speed_x *= -1;
    }
    // 確認球是否碰到上方邊界
    if(circle_y <= radius) {
      speed_y *= -1;
    }
    // 確認球是否碰到左方邊界
    if(circle_x <= radius) {
      speed_x *= -1;
    }
    // 確認球是否碰到下方邊界
    if(circle_y >= canvasHeight - radius) {
      speed_y *= -1;
      // alert("You Lose!");
      // clearInterval(game);
    }
    
    // 初始圓的方向
    circle_x += speed_x;
    circle_y += speed_y;
  }
  
  // 畫出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 畫出所有方塊
  brickArray.forEach((Brick) => {
    if(Brick.visible) {
      Brick.drawBrick();
    }
  });

  // 畫出地板
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(ground_x, ground_y, gronnd_width, ground_height);

  // 畫出圓
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(draw, 25);