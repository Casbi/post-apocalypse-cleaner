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

function preload() {
    this.load.spritesheet('charactersWeapons', 'assets/charactersWeapons.png', {
        frameWidth: 16,
        frameHeight: 16
    });

    myGlobal.playerDestination = new Phaser.Math.Vector2();

    // TODO
    // this.load.image('background', 'assets/underwater1.png');
}

function create() {

    this.anims.create({
        key: 'duckIdle',
        frames: this.anims.generateFrameNumbers('charactersWeapons', {
            start: 0,
            end: 3
        }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'zombieRun',
        frames: this.anims.generateFrameNumbers('charactersWeapons', {
            start: 5,
            end: 9
        }),
        frameRate: 5,
        repeat: -1
    });

    myGlobal.duck = this.physics.add.sprite(400, 300, 'charactersWeapons').play('duckIdle');

    this.input.on('pointerdown', function (pointer) {
        myGlobal.playerDestination.x = pointer.x;
        myGlobal.playerDestination.y = pointer.y;

        this.physics.moveToObject(myGlobal.duck, pointer, 100);
    }, this);

    myGlobal.zombie = this.physics.add.sprite(200, 100, 'charactersWeapons').play('zombieRun');
    // create an empty rectangle game object, probably doesn't have to be circle, i just can't find a empty game object
    // it will later get its body set to a circle anyway to be used as zombie's vision
    myGlobal.zombieVision = this.add.rectangle(myGlobal.zombie.x, myGlobal.zombie.y, 0, 0);
    this.physics.add.existing(myGlobal.zombieVision);
    myGlobal.zombieVision.body.setCircle(60, -60, -60);

    this.physics.add.overlap(myGlobal.duck, myGlobal.zombieVision);
}

function update() {
    let distance = Phaser.Math.Distance.Between(myGlobal.duck.x, myGlobal.duck.y, myGlobal.playerDestination.x, myGlobal.playerDestination.y);

    if (distance < 1) {
        myGlobal.duck.body.stop();
    }

    myGlobal.zombieVision.body.debugBodyColor = myGlobal.zombieVision.body.touching.none ? 0x0099ff : 0xff9900;
}