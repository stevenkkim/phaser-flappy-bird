import Phaser from 'phaser';
import { config } from '../index'

let bird = null;
let pipes = [];
const GRAVITY = 600;
const FLAP_VELOCITY = 300;
const PIPE_VELOCITY = 200;
let score = 0;
let scoreText = null;
let isPaused = false;

if (localStorage.getItem('bestScore') === null) {
  localStorage.setItem('bestScore', 0);
}
let bestScore = Number(localStorage.getItem('bestScore'));
let bestScoreText = null;


class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene')
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
    this.load.image('pause', 'assets/pause.png');
    console.log(this)
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0);


    // add bird
    bird = this.physics.add.sprite(config.width / 12, config.height / 2, 'bird').setOrigin(0, 0);
    bird.body.gravity.y = GRAVITY;
    // bird.setCollideWorldBounds(true);

    // add pipes
    this.addPipe({ id: 1, x: 400, y: 0 });
    this.addPipe({ id: 2, x: 400, y: 650 });
    this.addPipe({ id: 3, x: 800, y: 0 });
    this.addPipe({ id: 4, x: 800, y: 650 });

    scoreText = this.add.text(16, 16, `Score: ${score}`, { fontSize: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' });
    bestScoreText = this.add.text(16, 48, `Best Score: ${bestScore}`, { fontSize: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"' });

    const pauseButton = this.add.image(config.width - 16, config.height - 16, 'pause')
      .setOrigin(1)
      .setScale(2)
      .setInteractive()
      .on('pointerdown', () => { this.pauseGame() });

    // add inputs
    this.input.on('pointerdown', this.flap);
    this.input.keyboard.on('keydown_SPACE', this.flap);
    this.input.keyboard.on('keydown_W', this.flap);
    this.input.keyboard.on('keydown_ESC', this.pauseGame, this);

    // add colliders
    this.physics.add.collider(bird, pipes, this.gameOver, null, this);


  }

  update() {
    if (bird.y > config.height - bird.height || bird.y < 0) {
      this.gameOver();
    }


    pipes.forEach((pipe, index) => {
      if (pipe.body.x < -pipe.body.width) {
        // move pipe to other side of screen
        pipe.body.x += config.width + pipe.body.width;

        // when pipe is off screen, then add score
        if (index % 2 === 0) { // each pair of pipes should be counted only once for score
          score += 1;
          if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
          }
          scoreText.setText(`Score: ${score}`);
          bestScoreText.setText(`Best Score: ${bestScore}`);
        }
      }
    })


  }

  addPipe({ id, x, y }) {
    y = y + 80 * (Math.random() - 0.5);
    pipes[id] = this.physics.add.sprite(x, y, 'pipe').setImmovable(true);
    pipes[id].body.velocity.x = -PIPE_VELOCITY;
  }

  flap() {
    bird.body.velocity.y = -FLAP_VELOCITY;
  }

  pauseGame() {
    if (isPaused) {
      this.physics.resume();
      //this.scene.resume();
      isPaused = false;
    }
    else {
      this.physics.pause();
      // this.scene.pause();
      isPaused = true;
    }
  }

  gameOver() {
    this.physics.pause();
    bird.setTint(0xEE4824);
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.restart();
        score = 0;
      },
      loop: false,
    })
    // bird.x = initialBirdPosition.x;
    // bird.y = initialBirdPosition.y;
    // bird.body.velocity.x = 0;
    // bird.body.velocity.y = 0;
  }

}




export default PlayScene;