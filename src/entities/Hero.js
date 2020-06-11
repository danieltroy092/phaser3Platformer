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

    this.setupAnimations();
    this.setupMovement();
  }

  // animation state machine
  setupAnimations() {
    this.animState = new StateMachine({
      init: 'idle', // starting state
      transitions: [
        { name: 'idle', from: ['falling', 'running', 'pivoting'], to: 'idle' },
        { name: 'run', from: ['falling', 'idle', 'pivoting'], to: 'running' },
        { name: 'pivot', from: ['falling', 'running'], to: 'pivoting' },
        { name: 'jump', from: ['idle', 'running', 'pivoting'], to: 'jumping' },
        { name: 'flip', from: ['jumping', 'falling'], to: 'flipping' },
        { name: 'fall', from: '*', to: 'falling' }, // '*' wildcard for all states
      ],
      methods: {
        onEnterState: (lifecycle) => {
          this.anims.play('hero-' + lifecycle.to);
          console.log(lifecycle);
        },
      },
    });

    // animation transitions
    this.animPredicates = {
      idle: () => {
        // sprite on the ground, not moving
        return this.body.onFloor() && this.body.velocity.x === 0;
      },
      run: () => {
        return (
          // sprite on the ground
          this.body.onFloor() && // moving horizontally & facing the direction we're moving to
          Math.sign(this.body.velocity.x) === (this.flipX ? -1 : 1)
        );
      },
      pivot: () => {
        return (
          // sprite on the ground
          this.body.onFloor() && // moving horizontally & invert sprite direction
          Math.sign(this.body.velocity.x) === (this.flipX ? 1 : -1)
        );
      },
      jump: () => {
        // sprite is moving upwards
        return this.body.velocity.y < 0;
      },
      flip: () => {
        // sprite is moving upwards, then check if sprite is in 'flipping' state
        return this.body.velocity.y < 0 && this.moveState.is('flipping');
      },
      fall: () => {
        // sprite is moving downwards
        return this.body.velocity.y > 0;
      },
    };
  }

  // state management
  setupMovement() {
    this.moveState = new StateMachine({
      init: 'standing', // starting state
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

    // checks which animations are valid for current state
    for (const t of this.animState.transitions()) {
      if (t in this.animPredicates && this.animPredicates[t]()) {
        this.animState[t]();
        break;
      }
    }
  }
}

export default Hero;
