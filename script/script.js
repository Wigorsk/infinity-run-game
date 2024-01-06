let mainCharacter = {
    character: document.querySelector('#character'),
    death: document.querySelector('#death') 
}

let moves = {
    slide: document.querySelector('#slide')
}

let enemys = {
    bird:document.querySelector('#bird'),
    stone: document.querySelector('#stone')
}

let scene = {

    // INTERATIVO
    clouds: document.querySelector('#clouds'),
    meteor:  document.querySelector('#meteor'),
    flower: [
        document.querySelector('#flowerOne'),
        document.querySelector('#flowerTwo')
    ],

    // NÃO INTERATIVO
    blackBG: document.querySelector('#background'),
    whiteBG: document.querySelector('#white'),
    footer: document.querySelector('footer')

}; let {flower, blackBG, whiteBG, footer} = scene;

let button = {
    pressToStart: document.querySelector('#pressToStart'),
    refreshPage: document.querySelector('#refreshPage')
}

let gameOver = {
    loserMenu: document.querySelector('.loserMenu'), // TELA DE GAME OVER
    score: document.querySelector('#score span'), // PONTUAÇÃO SUPERIOR ESQUERDA
    finalScore: document.querySelector('#finalScore span'), // PONTUAÇÃO FINAL
}

let {loserMenu, score, finalScore} = gameOver; loserMenu.style.display = 'none';

let points; // INTERVAL --> incrementScore()
let interval; // INTERVAL --> updateGame()

// AUDIOS
let loserMP3 = new Audio('../assets/audio/loser.mp3');
let jumpMP3 = new Audio('../assets/audio/jump.mp3');
let slideMP3 = new Audio('../assets/audio/slide.mp3');
let zumbidoMP3 = new Audio('../assets/audio/zumbido.mp3');

control = (e) => { //CONTROLES 

    if (e.key == 'ArrowUp') {
        character.classList.add('jump');
        character.src = 'assets/images/character/jump.webp';
        jumpMP3.play();

        setTimeout(() => {
            character.classList.remove('jump');
            character.src = 'assets/images/character/runing.gif'
        }, 550)
    }
    if (e.key == 'ArrowDown') {
        character.classList.add('slide');
        character.src = 'assets/images/character/slide.gif';
        slideMP3.play();

        setTimeout(() => {
            character.classList.remove('slide');
            character.src = 'assets/images/character/runing.gif';
        }, 350);
    }
    
}

initialAnimations = () => { //INICIAR ANIMAÇÕES 
 
    //INIMIGOS
    stone.style.animation = 'enemyAnimation 3s infinite linear';

    bird.style.animation = 'enemyAnimation 3s infinite linear';
    bird.style.animationDelay = '1500ms';

    //CENÁRIO
    clouds.style.animation = 'cloudsAnimation 20s infinite linear';
    flower[0].style.animation = 'flowerOne 20s infinite linear';
    flower[1].style.animation = 'flowerTwo 20s infinite linear';
}

incrementScore = () => { //PONTUAÇÃO 
    
    setTimeout(() => {

        points = setInterval(() => {
            score.innerText = +score.innerText + 10;
        }, 1500 );

    }, 1500); 

}

collisionElementsConfig = () => { // CONFIGURAÇÃO DOS ELEMENTOS PÓS COLISÃO 
            
        //CHARACTER
        character.style.display = 'none'; // REMOVE O PERSONAGEM VIVO
        character.style.animation = 'none';
        
        death.style.display = 'block'; // ADICIONA O PERSONAGEM MORTO
        death.style.bottom = `${position.character}px`;
        document.removeEventListener('keydown', control); //REMOVE OS CONTROLES DO PERSONAGEM

        // PEDRA
        stone.style.animation = 'none';
        stone.style.left = `${position.stone}px`;

        // PÁSSARO
        bird.style.animation = 'none';
        bird.style.left = `${position.bird}px`;
        bird.src = 'assets/images/passaro/aliveStatic.gif'; // ALTERA GIF DO PÁSSARO PARA ELE FICAR PARADO

        // NUVEM
        clouds.style.animation = 'nome';
        clouds.style.left = `${position.clouds}px`;

        // FLORES 
        flower[0].style.animation = 'none';
        flower[0].style.left = `${position.flower[0]}px`;

        flower[1].style.animation = 'none';
        flower[1].style.left = `${position.flower[1]}px`;
}

collisionSceneConfig = () => { // CONFIGURAÇÃO DO CENÁRIO PÓS COLISÃO 

    blackBG.style.background = 'rgba(0, 0, 0, .5)'; // DEIXA O FUNDO ESCURO
    finalScore.innerText = score.textContent; // ATUALIZA A PONTUAÇÃO FINAL
    loserMenu.style.display = 'flex'; // MOSTRA TELA DE GAME OVER
    refreshPage.style.visibility = 'visible'; // TEXTO --> ATUALIZE A PÁGINA PARA JOGAR NOVAMENTE <--
    score.style.display = 'none'; // ESCONDE A PONTUAÇÃO SUPERIOR ESQUERDA
}

updateGame = () => { // ATUALIZA A TELA (10MS) 

    interval = setInterval(() => { // LOOP DE 10MS

        position = { // POSIÇÃO "LEFT" DOS ELEMENTOS 

            character: +window.getComputedStyle(character).bottom.replace('px', ''),
            stone: stone.offsetLeft,
            bird: bird.offsetLeft,
            clouds: clouds.offsetLeft,
            flower: [flower[0].offsetLeft, flower[1].offsetLeft]
        }

        collision = { // CONDIÇÃO DA COLISÃO 
            stone: position.stone <= 70 && position.stone > 0 && position.character <= 110,
            bird: position.bird <= 95 && position.bird > 0 && character.classList != 'slide'
        }

        // COLISÃO
        if ( collision.stone || collision.bird) { 

            collisionElementsConfig();
            collisionSceneConfig();
           
            //LIMPAR INTERVALOS
            clearInterval(interval);
            clearInterval(points);

            //AUDIO
            loserMP3.play();

            footer.style.display = 'flex'; // MOSTRA O RODAPÉ DA PÁGINA
        }

        // METEORO
        if (score.textContent == 50 /* <-- PONTUAÇÃO */) {  

            meteor.style.display = 'block'; // ADICIONA O METEORO

            setTimeout(() => {
            
                meteor.style.display = 'none'; // REMOVE O METEORO
                whiteBG.style.display = 'block'; // ADICIONA FUNDO BRANCO (EXPLOSÃO)
                whiteBG.style.animation = 'explosion 8s';
                zumbidoMP3.play();
                
                setTimeout(() => {
                    whiteBG.style.display = 'none'; // REMOVE FUNDO BRANCO (EXPLOSÃO)
                    whiteBG.style.animation = 'none';
                }, 8000);;
            
            }, 7800);

        }

    }, 10)
}

start = () => { // INICIAR JOGO 

    pressToStart.style.display = 'none'; // PRESSIONE QUALQUER TECLA PARA COMEÇAR
    character.src = 'assets/images/character/runing.gif'; // PERSONAGEM COMEÇA A CORRER

    initialAnimations();
    incrementScore();
    updateGame();

    document.removeEventListener('keydown', pressKey); 
    document.addEventListener('keydown', control);

    footer.style.display = 'none'; // ESCONDE O RODAPÉ DA PÁGINA
}

const pressKey = (e) => {
    if (e.key) {
        start()
    }
}

document.addEventListener('keydown', pressKey);
