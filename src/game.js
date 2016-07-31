
import Phaser from 'phaser'

class Game extends Phaser.Game {
    constructor() {
        super(480, 320, Phaser.AUTO, 'content', {
            create: ()=> {
                //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

                this.state.add('load', Load);
                this.state.add('menu', Menu);
                this.state.add('play', Play);
                this.state.add('victory', Victory);
                this.state.add('gameover', GameOver);

                this.state.start('load');
            }
        });
    }
}

export class Load extends Phaser.State {
    preload() {
        let textStyle = {font: '45px Arial', alight: 'center', stroke: 'blue', fill: 'blue'};
        this.game.add.text(80, 150, 'loading...', textStyle);    
        this.game.load.spritesheet('wizard', './assets/images/wizardsprite.png', 95, 123, 6);  
        this.game.load.image('bird', './assets/images/bird.png');
        this.game.load.image('pipe', './assets/images/pipe.png');
        this.game.load.audio('jump', './assets/jump.wav');
    }

    create() {
        this.game.state.start('menu');
    }
}

export class Menu extends Phaser.State {
    create() {
        let textStyle = {font: '45px Arial', alight: 'center', stroke: 'blue', fill: 'blue'};
        let title = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'ES2015 Wizard', textStyle);
        title.anchor.set(0.5);
        textStyle.font = '36px Arial';
        let instructions = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '"s" key to start', textStyle);
        instructions.anchor.set(0.5);
        let sKey = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
        sKey.onDown.addOnce( () => this.game.state.start('play')); 
    }
}

export class Play extends Phaser.State {
    create() {
        this.jumpSound = this.add.audio('jump');
        this.game.physics.startSystem(Phaser.Physics.ARCADE); 

        this.bird = this.game.add.sprite(100, 45, 'bird');
        this.game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000;
        this.bird.anchor.setTo(-0.2, 0.5);
        
        this.game.stage.backgroundColor = "#71c5cf";        

        this.pipes = this.add.group();

        this.score = 0;
        this.scoreLabel = this.add.text(20, 20, '0', { font: '30px Arial', fill: '#ffffff' });

        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);

        this.timer = this.game.time.events.loop(1000, this.addRowOfPipes, this);
    }

    addOnePipe(x, y) {
        var pipe = this.game.add.sprite(x, y, 'pipe');
        this.pipes.add(pipe);

        game.physics.arcade.enable(pipe);

        pipe.body.velocity.x = -200;

        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    }

    addRowOfPipes() {
        var hole = Math.floor(Math.random() * 3) + 1;
        
        for (var i = 0; i < 5; ++i) {
            if (i != hole && i != hole + 1) {
                this.addOnePipe(400, i * 60 + 10);
            }
        }

        this.score += 1;
        this.scoreLabel.text = this.score;
    }

    jump() {
        if (this.bird.alive == false) {
            return;
        }
        this.bird.body.velocity.y = -350;
        //this.bird.angle -= 20;
        var animation = this.add.tween(this.bird);
        animation.to({angle: -20}, 100);
        animation.start();
        this.jumpSound.play();
    }

    gameover() {
        this.state.start('gameover');
    }

    hitPipes() {
        if (this.bird.alive == false) {
            return;
        }
        this.bird.alive = false;

        this.time.events.remove(this.timer);

        this.pipes.forEach(function(p) {
            p.body.velocity.x = 0;
        });
    }
     
    update() {
        if (this.bird.y < 0 - 30 || this.bird.y > 320 + 30) {
            this.game.state.start('gameover');
        }
        this.physics.arcade.overlap(this.bird, this.pipes, this.hitPipes, null, this);
        if (this.bird.angle < 20) {
            this.bird.angle += 1;
        }
        /*
        if (!this.startTime) {
            this.startTime = Date.now();
        }
 
        //20 seconds to win
        if ((Date.now() - this.startTime) > 20000) {
            this.startTime = 0;               
            this.game.state.start('gameover');
        }
 
        this.wizard.move(this.cursors);
 
        if (this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {   
            this.startTime = 0;               
            this.game.state.start('victory');
        }
       */
    }
}

export class Victory extends Phaser.State {
    create() {
        let textStyle = {font: '45px Arial', alight: 'center', stroke: 'black', fill: 'red'};
         
        let title = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'Victory!', textStyle);
        title.anchor.set(0.5);
         
        textStyle.font = '36px Arial';
         
        let instructions = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '"s" key to play again', textStyle);
        instructions.anchor.set(0.5);
         
        let sKey = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
        sKey.onDown.addOnce( () => this.game.state.start('play'));
    }
}

export class GameOver extends Phaser.State{
    create() {
        let textStyle = {font: '45px Arial', alight: 'center', stroke: 'red', fill: 'red'};
         
        let title = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 100, 'GAME OVER', textStyle);
        title.anchor.set(0.5);
         
        textStyle.font = '36px Arial';
         
        let instructions = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '"s" key to play again', textStyle);
        instructions.anchor.set(0.5);
         
        let sKey = this.game.input.keyboard.addKey(Phaser.KeyCode.S);
        sKey.onDown.addOnce( () => this.game.state.start('play'));
    }
}

export class Wizard extends Phaser.Sprite { 
    constructor(game, x, y) {
        super(game, x, y, 'wizard');
        this.anchor.setTo(0.5, 0.5);    
        this.scale.setTo(0.65, 0.65);
        this.animations.add('right', [0,1,2]);        
        this.animations.add('left', [3,4,5]);
         
        this.game.physics.enable(this, Phaser.Physics.ARCADE);
         
        this.body.drag.set(100);
        this.body.maxVelocity.set(500);  
        this.body.collideWorldBounds = true;        
         
        this.body.width -= 32;
        this.body.height -= 32;             
    }
     
    move(cursors) {     
        if (cursors.up.isDown) {
            this.body.acceleration.y = -300;                   
        } else if (cursors.down.isDown) {            
            this.body.acceleration.y = 300;           
        } else {
            this.body.acceleration.y = 0;
        }
        if (cursors.left.isDown) {       
            this.body.acceleration.x = -300;
            this.animations.play('left', 4, true);
        } else if (cursors.right.isDown) {          
            this.body.acceleration.x = 300;
            this.animations.play('right', 4, true);
        } else {            
            this.body.acceleration.x = 0;
        }        
    }       
}

export default Game;
