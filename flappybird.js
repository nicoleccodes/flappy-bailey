//board
let board;
let boardWidth=360;
let boardHeight = 640;
let context;

//bailey
let baileyWidth = 50; //width/height ratio = 408/228 = 17/12
let baileyHeight = 40;
let baileyX = boardWidth/8;
let baileyY = boardHeight/2;
let baileyImg;

let bailey = {
x: baileyX,
y: baileyY,
width: baileyWidth,
height: baileyHeight
}

//pipes
let pipeArray =[];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bailey jump speed
let gravity = 0.3;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board")
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw flappy bailey
    //context.fillStyle = "green";
    //context.fillRect(bailey.x, bailey.y, bailey.width, bailey.height);

    //load images
    baileyImg = new Image();
    baileyImg.src = "./flappybailey.png";
    baileyImg.onload = function(){
        context.drawImage(baileyImg, bailey.x, bailey.y, bailey.width, bailey.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";


    requestAnimationFrame(update);
    setInterval(placePipes, 1900); //every 1.5 seconds
    document.addEventListener("keydown", movebailey);
    document.getElementById("board").addEventListener("touchstart", movebailey);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0, board.width, board.height);

    //bailey
    velocityY += gravity;
    //bailey.y +=velocityY;
    bailey.y = Math.max(bailey.y + velocityY, 0); //apply gravity to current bailey.y, limit bailey.y to top of the canvas
    context.drawImage(baileyImg, bailey.x, bailey.y, bailey.width, bailey.height);

    if (bailey.y > board.height){
        gameOver = true;
    }

    //pipes
    for(let i =0; i< pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        if (!pipe.passed & bailey.x > pipe.x + pipe.width){
            score+= 0.5; //2 pipes so 0.5, 0.5*2 =1, 1 for each set of pipes
            pipe.passed =true;
        }

        if (detectCollision(bailey, pipe)) {
            gameOver=true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x< -pipeWidth){
        pipeArray.shift(); //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    //gameOver
    if (gameOver){
        context.fillText("GAMEOVER", 5, 90);
    }

}

function placePipes(){
    if (gameOver){
        return;
    }
    //(0-1) * pipeHeight/2
    //0 -> -128px (pipeHeight/4)
    //1 -> -128 -256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); 
    let openingSpace = board.height/4

    let topPipe ={
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottomPipe ={
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight+ openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(bottomPipe);
}

function movebailey(e) {
    if(e.code == "Space" ||  e.code == "ArrowUp" ||e.code == "KeyX" || e.type == "touchstart"){
        velocityY=-5; //jump
    }
 
    //reset game
    if(gameOver){
        bailey.y=baileyY;
        pipeArray =[];
        score =0;
        gameOver = false;
    }

}

function detectCollision(a,b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}