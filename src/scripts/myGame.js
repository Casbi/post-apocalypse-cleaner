import Zombie from './zombie.js';

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

    // add zombie to the scene (both the display list and the physics manager)
    myGlobal.zombie = myScene.add.existing(new Zombie(myScene, 200, 100, 'charactersWeapons', myGlobal.duck));
    myScene.physics.add.existing(myGlobal.zombie);

}

function update() {

}