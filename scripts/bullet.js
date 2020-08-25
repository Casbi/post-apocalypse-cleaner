export default class Bullet extends Phaser.GameObjects.Sprite {
  constructor(pScene, pShooter, pTextureKey) {
    super(pScene, pShooter.x, pShooter.y, pTextureKey);
    
  }
}