/* Constnts for colours   */
const backgroundColor='#000000';
const LINE_COLOUR='#FFFFFF';
const lineWidth=15;

mEvent=false;

var curX=0;
var curY=0;
var prevX=0;
var prevY=0;

var canvas;
var context;

/* we call the canvas from the html file  */
function prepCanvas(){
    console.log('Preparing canvas!');
    /* we are getting the canvas that we created in html file to style it here */
    canvas=document.getElementById('myCanvas');
    context=canvas.getContext("2d");
     
    /* giving colours to canvas */
    context.fillStyle=backgroundColor;
    context.fillRect(0,0, canvas.clientWidth, canvas.clientHeight);
      
    /* drawing on canvas: colot of line, width of line, the way it should join  */
    context.strokeStyle= LINE_COLOUR;
    context.lineWidth=lineWidth;
    context.lineJoin='round';

    /* this two functions listen to the mouse and dependiong on that make movements */
    document.addEventListener('mousedown', function (event){
        curX=event.clientX- canvas.offsetLeft;
        curY=event.clientY-canvas.offsetTop;
        mEvent=true;
    });

    document.addEventListener('mousemove', function (event){
        if(mEvent==true){ 
           prevX=curX;
           curX=event.clientX- canvas.offsetLeft;
           prevY=curY;
           curY=event.clientY-canvas.offsetTop;
           draw();

            
        }
    });

    document.addEventListener('mouseup', function(event){
       mEvent=false; 
        prevX=0;
        prevY=0;
    });     
        
    /* when we leave canvas it should stop drawing t=when we come back (with the mouse being pressed) */
    canvas.addEventListener('mouseleave', function(event){
        mEvent=false;
    });

    canvas.addEventListener('touchstart', function (event){
        curX=event.touches[0].clientX- canvas.offsetLeft;
        curY=event.touches[0].clientY-canvas.offsetTop;
        mEvent=true;
    });

    canvas.addEventListener('touchend', function(){
        mEvent=false;
    });

    canvas.addEventListener('touchcancel', function(){
        mEvent=false;
    });

    canvas.addEventListener('touchmove', function (event){
        if(mEvent==true){ 
           prevX=curX;
           curX=event.touches[0].clientX- canvas.offsetLeft;
           prevY=curY;
           curY=event.touches[0].clientY-canvas.offsetTop;
           
           draw();
        }

            
    });
    
     


}

/*  draw an a canvas*/
function draw() {
    context.beginPath();
    context.moveTo(prevX, prevY);
    context.lineTo(curX, curY);
    context.closePath();
    context.stroke();
}

/* clearing the canvas after the checkAnswer was clicked*/
function clearCanvas(){

    curX=0;
    curY=0;
    prevX=0;
    prevY=0;
    context.fillRect(0,0, canvas.clientWidth, canvas.clientHeight);

}