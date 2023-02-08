import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';


export const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 200 },
      debug: true,
    }
  },
  // scene: { preload, create, update }
  scene: [PlayScene]
};


new Phaser.Game(config);