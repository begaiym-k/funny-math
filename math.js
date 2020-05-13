var answer;
var score=0;
var backgroundImages=[];
function nextQuestion(){
    const n1=Math.floor(Math.random() *5);
    document.getElementById('num1').innerHTML=n1;
    const n2=Math.ceil(Math.random()*5);
    document.getElementById('num2').innerHTML=n2;
    setTimeout(()=> { answer=n1+n2; }, 2000);
}

async function checkAnswer(){
    const prediction=await predictImage();
    console.log(`answer: ${answer}, prediction ${prediction}`);
   
    if (await prediction== await answer){
        score++;
        console.log(`Correct, score ${score} `);
        if(score<=6){
        backgroundImages.push(`url('images/background${score}.svg')`);
        document.body.style.backgroundImage=backgroundImages;
        } else{
            alert('Well Done!');
            score=0;
            backgroundImages=[];
            document.body.style.backgroundImage=backgroundImages;
        }
        

    }
    else{
        
        if (score>=0){
            score--;
            alert('The answer is incorrect! Try one more time!');
            console.log(`Wrong, score ${score}`);
            setTimeout(function(){
                backgroundImages.pop();
                document.body.style.backgroundImage=backgroundImages;}, 1000);
        }
       


    }

}