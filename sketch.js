var trex, trex_running, trex_collided;
var ground, groundImage, invisibleground;
var cloud, cloudImage, cloudsgroup;

var cactus, cactus1, cactus2, cactus3, cactus4, cactus5, cactus6, cactusgroup;

var puntaje;
var comienzo = 1;
var final = 0;
var gamestate = comienzo;

var gameover, gameoverImg;
var boton, botonImg;
//variables para el sonidero
var die, jump, checkpoint;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameoverImg = loadImage ("gameOver.png");
  botonImg = loadImage ("restart.png");
  
  cactus1 = loadImage("obstacle1.png");
  cactus2 = loadImage("obstacle2.png");
  cactus3 = loadImage("obstacle3.png");
  cactus4 = loadImage("obstacle4.png");
  cactus5 = loadImage("obstacle5.png");
  cactus6 = loadImage("obstacle6.png");
  
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(600, 200);

  //Crea el Sprite del trex
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //añade escala y posición al Trex
  trex.scale = 0.5;
  trex.setCollider("rectangle",0,0,trex.width,trex.heigth);
  trex.debug= true;

  //crea el Sprite del suelo
  ground = createSprite(200,180,400,20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width/2;
  //suelo invisible
  invisibleground = createSprite (200, 190, 400, 10);
  invisibleground.visible = false;
  
  puntaje=0;
  
  //creagrupo de cactus y de nubes
  cloudsgroup = new Group();
  cactusgroup = new Group();
  
  //crea los sprites de las imagenes de gameover y boton
  gameover = createSprite(300,100);
  gameover.addImage(gameoverImg);
  gameover.scale = 0.8;
  gameover.visible = false;
  
  boton = createSprite(300,140);
  boton.addImage(botonImg);
  boton.scale = 0.5;
  boton.visible = false;
}

function draw() {
  //establece el color de fondo
  background("crimson");
  
  //puntuacion
  fill("orange");
  stroke("white");
  strokeWeight(4);
  text("puntuacion     "+puntaje,500,50);
  
  //añade estados del juego
  if (gamestate=== comienzo){
    //mueve el sulo
    ground.velocityX = -(2+3*puntaje/100);
    //comienza el puntaje
    puntaje=puntaje+Math.round(getFrameRate()/60);
    if(puntaje>0&&puntaje%500===0){
      checkpoint.play();
    }
    if(ground.x<0){
       ground.x = ground.width/2;
    }
     //salta cuando preciono la barra espaciadora
    if(keyDown("space") && trex.y>=100  ) {
      trex.velocityY = -10;  
      jump.play();
    }  
    
    trex.velocityY = trex.velocityY + 0.8 
    
    spawncloud();
    spawnobstaculos();
    
    if(trex.isTouching(cactusgroup)){
      gamestate= final;
      die.play();
    }
  }
  else if(gamestate=== final){
    // detiene el suelo 
    ground.velocityX = 0;
    cactusgroup.setVelocityXEach(0);
    cloudsgroup.setVelocityXEach(0);
    //cambia la animacion del trex
    trex.changeAnimation("collided", trex_collided);
    // nunca desaparecer objetos
    cactusgroup.setLifetimeEach(-1);
    cloudsgroup.setLifetimeEach(-1);
    trex.velocityY= 0;
    gameover.visible = true;
    boton.visible = true;
    
  }
  //evita que el trex caiga
  trex.collide(invisibleground);
  
  // condicion para tocar el boton de reinicio 
  if(mousePressedOver(boton)){
    reset();
  }
  
  drawSprites();
  
}

//funcion para que aparescan las nubes
function spawncloud(){
  if(frameCount%60===0){
    cloud = createSprite(600, 100, 40, 10);
    cloud.velocityX = -2;
    cloud.addImage(cloudImage);
    cloud.y=Math.round(random(10,60));
    cloud.scale=0.8;
    //tiempo de vida de las nubes
    cloud.lifetime=320;
    //ajusta la profundidad de las nubes
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    //añade cada nuve al grupo de nubes
    cloudsgroup.add(cloud);
  } 
}

function spawnobstaculos(){
  if(frameCount%60===0){
    cactus = createSprite(600, 165, 10, 40);
    cactus.velocityX = -(6+puntaje/100);
    //genera los actus alazar
    var rand=Math.round(random(1,6));
    switch(rand){
      case 1:cactus.addImage(cactus1);
      break;
      case 2:cactus.addImage(cactus2);
      break;
      case 3:cactus.addImage(cactus3);
      break;
      case 4:cactus.addImage(cactus4);
      break;
      case 5:cactus.addImage(cactus5);
      break;
      case 6:cactus.addImage(cactus6);
      break;
      default:break;
    }
   //asigno escala y tempo de vida alos obstaculos
   cactus.scale = 0.5; 
   cactus.lifetime = 320;
    
   //añade cada cactus al grupo de cactus
   cactusgroup.add(cactus); 
  }
}

function reset(){
  gamestate= comienzo;
  gameover.visible = false;
  boton.visible = false;
  cactusgroup.destroyEach();
  cloudsgroup.destroyEach();
  trex.changeAnimation("running", trex_running);                    
  puntaje = 0;
}