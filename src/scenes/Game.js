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

    //Load sprite onto canvas, and add physics body onto sprite for interaction with physics engine.
    this.player = this.physics.add.sprite(250, 160, 'hero-run-sheet');

    //assign animation to sprite.
    this.player.anims.play('hero-running');

    //set boundaries for game sprite not to fall off game scene.
    this.player.body.setCollideWorldBounds(true);

    //set collision box dimensions and center align.
    this.player.body.setSize(12, 40);
    this.player.body.setOffset(12, 23);
  }

  update(time, delta) {}
}

export default Game;
