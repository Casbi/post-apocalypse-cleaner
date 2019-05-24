// import Zombie from './zombie';

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

class Zombie extends Phaser.GameObjects.Sprite {
    constructor(pScene, x, y, pTextureKey, pPlayer) {
      super(pScene, x, y, pTextureKey);

      this.play('zombieRun');

    /*  create an empty rectangle game object, probably doesn't have to be circle
        i just can't find a empty game object
        immediantly set its *body* to a circle to be used as zombie's vision (check overlap with player) */
    this.vision = pScene.add.rectangle(this.x, this.y, 0, 0);
    pScene.physics.add.existing(this.vision);
    this.vision.body.setCircle(60, -60, -60);
    this.vision.playerLastPosition = new Phaser.Math.Vector2();

    // check if zombie can see duck and move towards duck if it can
    pScene.time.addEvent({
        delay: 100,
        loop: true,
        callback: () => {
            if (pScene.physics.overlap(pPlayer, this.vision)){
                this.vision.body.debugBodyColor = 0xff9900;
                pScene.physics.moveTo(this, pPlayer.x, pPlayer.y);
            } else {
                this.vision.body.debugBodyColor = 0x0099ff;
            }
        }
    });

    // stop if zombie hasn't seen duck for a while
    pScene.time.addEvent({
        delay: 2500,
        loop: true,
        callback: () => {
            if (!pScene.physics.overlap(pPlayer, this.vision)){
                this.vision.body.debugBodyColor = 0x0099ff;
                this.body.stop();
            } else {
                this.vision.body.debugBodyColor = 0xff9900;
            }
        }
    });

    // stop if zombie reached duck
    pScene.time.addEvent({
        delay: 17,
        loop: true,
        callback: () => {
            if (pScene.physics.overlap(pPlayer, this)) {
                this.body.stop();
            }
        }
    });

    // keep zombie vision on the zombie if the zombie moves
    pScene.time.addEvent({
        loop: true,
        callback: () => {
            if (this.body.moves) {
                this.vision.x = this.x;
                this.vision.y = this.y;
            }
        }
    });

    }
}

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