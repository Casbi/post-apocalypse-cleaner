export default class Zombie extends Phaser.GameObjects.Sprite {
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