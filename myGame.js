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

var playerDestination = new Phaser.Math.Vector2();

var game = new Phaser.Game(config);

function preload() {
    this.load.spritesheet('charactersWeapons', 'assets/charactersWeapons.png', {
        frameWidth: 16,
        frameHeight: 16
    });

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

    duck = this.physics.add.sprite(400, 300, 'charactersWeapons').play('duckIdle');

    this.input.on('pointerdown', function (pointer) {
        playerDestination.x = pointer.x;
        playerDestination.y = pointer.y;

        this.physics.moveToObject(duck, pointer, 100);
    }, this);

    // radius(60) - half of sprite width(8) = 52
    // to align centre of the circle to center of the sprite
    duck.setCircle(60, -52, -52);

    zombie = this.physics.add.sprite(200, 100, 'charactersWeapons').play('zombieRun');
    
    zombie.setCircle(30, -22, -22);
}

function update() {
    let distance = Phaser.Math.Distance.Between(duck.x, duck.y, playerDestination.x, playerDestination.y);

    if (distance < 1) {
        duck.body.stop();
        //duck.body.reset(playerDestination.x, playerDestination.y);
    }

}