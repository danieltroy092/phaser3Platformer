/// <reference path="../../typings/phaser.d.ts" />
import Phaser from 'phaser';
import StateMachine from 'javascript-state-machine';

class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero-run-sheet', 0);

    // loading sprite onto canvas and applying game physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // assign animation to sprite.
    this.anims.play('hero-running');

    // set boundaries for game sprite not to fall off game scene.
    this.body.setCollideWorldBounds(true);

    this.body.setSize(12, 40); // set collision box dimensions
    this.body.setOffset(12, 23); // centre align sprite
    this.body.setMaxVelocity(250, 400); // set max velocity for X/Y axis.
    this.body.setDragX(750); // set deacceleration rate.

    // apply keyboard input functionality to hero
    this.keys = scene.cursorKeys;
    this.input = {};

    this.setupMovement();
  }

  // state management
  setupMovement() {
    this.moveState = new StateMachine({
      init: 'standing',
      transitions: [
        { name: 'jump', from: 'standing', to: 'jumping' },
        { name: 'flip', from: 'jumping', to: 'flipping' },
        { name: 'fall', from: 'standing', to: 'falling' },
        {
          name: 'touchdown',
          from: ['jumping', 'flipping', 'falling'],
          to: 'standing',
        },
      ],
      methods: {
        onEnterState: (lifecycle) => {
          console.log(lifecycle);
        },
        onJump: () => {
          this.body.setVelocityY(-400);
        },
        onFlip: () => {
          this.body.setVelocityY(-300);
        },
      },
    });

    // state transitions
    this.movePredicates = {
      jump: () => {
        return this.input.didPressJump;
      },
      flip: () => {
        return this.input.didPressJump;
      },
      fall: () => {
        return !this.body.onFloor();
      },
      touchdown: () => {
        return this.body.onFloor();
      },
    };
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.input.didPressJump = Phaser.Input.Keyboard.JustDown(this.keys.up);

    // horizontal movement
    if (this.keys.left.isDown) {
      this.body.setAccelerationX(-1000);
      this.setFlipX(true); // invert sprite when pressed.
      this.body.offset.x = 8; // re-align collision box to centre when inverted
    } else if (this.keys.right.isDown) {
      this.body.setAccelerationX(1000);
      this.setFlipX(false); // reset inverted sprite.
      this.body.offset.x = 12; // reset collision box to centre.
    } else {
      this.body.setAccelerationX(0);
    }

    // vertical movement
    if (this.moveState.is('jumping') || this.moveState.is('flipping')) {
      // when Up key is not pressed & sprite velocity is above 150 while jumping
      if (!this.keys.up.isDown && this.body.velocity.y < -150) {
        this.body.setVelocityY(-150); // reset back to 150
      }
    }

    // checks which transitions are valid for current state.
    for (const t of this.moveState.transitions()) {
      if (t in this.movePredicates && this.movePredicates[t]()) {
        this.moveState[t]();
        break;
      }
    }
  }
}

export default Hero;
