class AudioController{
    constructor(){
        this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
        this.gameOverMusic = new Audio('Assets/Audio/gameOver.wav');
        this.flipMusic = new Audio('Assets/Audio/flip.wav');
        this.matchMusic = new Audio('Assets/Audio/match.wav');
        this.victoryMusic = new Audio('Assets/Audio/victory.wav');
        this.bgMusic.loop = true;
        this.bgMusic.volumn = 0.5;
    }
    startMusic(){
        this.bgMusic.play();
    }
    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip(){
        this.flipMusic.play();
    }
    match(){
        this.matchMusic.play();
    }
    gameOver(){
        this.stopMusic();
        this.gameOverMusic.play();
    }
    victory(){
        this.stopMusic();
        this.victoryMusic.play();
    }
}

class MixOrMatch {
    constructor(time, cardArray){
        this.totalTime = time;
        this.cardArray = cardArray;
        this.timer = document.querySelector('#time-remaining');
        this.clicker = document.querySelector('#flips');
        this.audioController = new AudioController();
    }

    startGame(){
        this.totalFlips = 0;
        this.timeRemaining = this.totalTime;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.busy = false;
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards(this.cardArray);
            this.countDown = this.startCountDown();
        }, 500);
        this.hideCards();
        this.timer.innerHTML = this.timeRemaining;
        this.clicker.innerHTML = this.totalFlips;
        this.checkingCards = [];
    }

    startCountDown(){
        return setInterval(()=>{
            this.timeRemaining--;
            this.timer.innerHTML = this.timeRemaining;
            if(this.timeRemaining === 0){
                this.gameOver();
            }
        }, 1000);
    }

    gameOver(){
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.querySelector('.lose').classList.add('visible');
    }

    victory(){
        clearInterval(this.countDown);
        document.querySelector('.win').classList.add('visible');
        this.audioController.victory();
    }

    hideCards(){
        this.cardArray.forEach(card => {
            card.classList.remove('flip');
            card.classList.remove('matched');
        });
    }

    flipCard(card){
        if(this.canFlipCard(card)){
            this.audioController.flip();
            this.totalFlips ++;
            this.clicker.innerHTML = this.totalFlips;
            card.classList.add('flip');
            this.checkingCards.push(card);
            if(this.cardToCheck){
                this.checkForMatchedCard(card);
            }
            else{
                this.cardToCheck = card;
            }
            console.log(this.checkingCards.length);
        }
    }

    checkForMatchedCard(card){
        if(this.getCardType(this.cardToCheck) === this.getCardType(card)){
            this.cardMatched(this.cardToCheck, card);
            console.log(this.getCardType(this.cardToCheck), this.getCardType(card))
        }
        else{
            this.cardMismatched(this.cardToCheck, card);
        }
        this.cardToCheck = null;
        this.checkingCards.shift();
        this.checkingCards.shift();
    }

    cardMatched(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardArray.length){
            this.victory();
        }
    }

    cardMismatched(card1, card2){
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            this.busy = false;
        }, 750);
    }

    shuffleCards(cards){
        for(let i=cards.length - 1; i>0; i--){
            let randIndex = Math.floor(Math.random() * (i+1));
            cards[randIndex].style.order = i;
            cards[i].style.order = randIndex;
        }
    }

    getCardType(card){
        return card.querySelector('.card-icon').src;
    }

    canFlipCard(card){
        return this.busy == false && !this.matchedCards.includes(card) && card !== this.cardToCheck;
    }
}

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}


function ready(){
    let overlays = Array.from(document.querySelectorAll('.overlay-text'));
    let cards = Array.from(document.querySelectorAll('.card'));
    let game = new MixOrMatch(60, cards);
    
    overlays.forEach(overlay => {
        overlay.addEventListener('click', function(){
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', function(){
            game.flipCard(card);
        });
    });
}