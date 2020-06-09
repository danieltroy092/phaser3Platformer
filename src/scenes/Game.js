/// <reference path="../../typings/phaser.d.ts" />
import Phaser from 'phaser';

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.spritesheet('hero-run-sheet', 'assets/hero/run.png', {
      frameWidth: 32,
      frameHeight: 64,
    });
  }

  create(data) {
    this.anims.create({
      key: 'hero-running',
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 10, //10th of a second
      repeat: -1,
    });

    //Load sprite onto canvas
    this.player = this.add.sprite(400, 300, 'hero-run-sheet');

    //assign animation to sprite
    this.player.anims.play('hero-running');
  }

  update(time, delta) {}
}

export default Game;
