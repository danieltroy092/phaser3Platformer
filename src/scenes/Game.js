/// <reference path="../../typings/phaser.d.ts" />
import Phaser from 'phaser';
import Hero from '../entities/Hero';

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
    // capturing keyboard input
    this.cursorKeys = this.input.keyboard.createCursorKeys();

    // initialises animation for sprite
    this.anims.create({
      key: 'hero-running',
      frames: this.anims.generateFrameNumbers('hero-run-sheet'),
      frameRate: 10, //10th of a second
      repeat: -1, //-1 to run inifinitely
    });

    // creates a new hero on screen
    // positioned in centre with hardcoded values
    this.hero = new Hero(this, 250, 160);

    // platform created to test falling state transition.
    const platform = this.add.rectangle(220, 240, 260, 10, 0x4bcb7c);
    this.physics.add.existing(platform, true);
    this.physics.add.collider(this.hero, platform);
  }
  update(time, delta) {}
}

export default Game;
