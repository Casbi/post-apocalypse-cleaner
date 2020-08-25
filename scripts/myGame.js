import Zombie from './zombie.js';
import Bullet from './bullet.js';

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var myGlobal = {};

var game = new Phaser.Game(config);
var myScene;

function preload() {
    myScene = this;

    myScene.load.spritesheet('charactersWeapons', 'assets/charactersWeapons.png', {
        frameWidth: 16,
        frameHeight: 16
    });

    myScene.load.image('bullet', 'assets/bullet2.png');

    myGlobal.playerDestination = new Phaser.Math.Vector2();
}

function create() {
    myScene.anims.create({
        key: 'duckIdle',
        frames: myScene.anims.generateFrameNumbers('charactersWeapons', {
            start: 0,
            end: 3
        }),
        frameRate: 5,
        repeat: -1
    });

    myScene.anims.create({
        key: 'zombieRun',
        frames: myScene.anims.generateFrameNumbers('charactersWeapons', {
            start: 5,
            end: 9
        }),
        frameRate: 5,
        repeat: -1
    });

    myGlobal.duck = myScene.physics.add.sprite(400, 300, 'charactersWeapons').play('duckIdle');

    myScene.input.on('pointerdown', function (pointer) {
        myGlobal.playerDestination.x = pointer.x;
        myGlobal.playerDestination.y = pointer.y;

        myScene.physics.moveToObject(myGlobal.duck, pointer, 100);
    }, myScene);

    myScene.time.addEvent({
        loop: true,
        callback: function() {
            if (Phaser.Math.Distance.Between(   myGlobal.duck.x, 
                                                myGlobal.duck.y,
                                                myGlobal.playerDestination.x,
                                                myGlobal.playerDestination.y) < 1) {
                myGlobal.duck.body.stop();
            }
        }
    });

    addZombiesAroundPosition(100, 100, 500, 150, 20);

    myScene.time.addEvent({
        delay: 300,
        repeat: 50,
        callback: function() {
            myGlobal.bullet = myScene.add.existing(new Bullet(
                myScene,
                myGlobal.duck,
                'bullet'
            ));

            myGlobal.zombies.sort(
                function(a,b) {
                    let aX = a.x - myGlobal.duck.x;
                    let aY = a.y - myGlobal.duck.y;

                    let bX = b.x - myGlobal.duck.x;
                    let bY = b.y - myGlobal.duck.y;
                    
                    return (Math.abs(Math.sqrt(aX*aX + aY*aY)) - Math.abs(Math.sqrt(bX*bX + bY*bY))) ;
                }); 
            
            myScene.physics.moveToObject(myGlobal.bullet, myGlobal.zombies[0], 500);
        }
    });

}

function update() {

}

function addZombiesAroundPosition(minX, minY, maxX, maxY, pNumber) {
    myGlobal.zombies = [];

    for (let i = 0; i<=pNumber; i++) {
        myGlobal.zombies[i] = myScene.add.existing(new Zombie(
            myScene,
            Math.floor(Math.random() * (maxX - minX)) + minX,
            Math.floor(Math.random() * (maxY - minY)) + minY,
            'charactersWeapons',
            myGlobal.duck));
        myScene.physics.add.existing(myGlobal.zombies[i]);
    }
}