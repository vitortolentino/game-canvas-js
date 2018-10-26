(function () {
  'use strict';
  class Game {
    constructor() {
      this.canvas = document.getElementById('my-canvas');
      this.restartButton = document.getElementById('restart');
      this.scoreElement = document.getElementById('score');
      this.ctx = this.canvas.getContext('2d');
      this.looper;
      this.enemyesStore = [];
      this.score = 0;
      this.frames = 0;
      this.isPlaying;
      this.isGameOver;
      this.hero = new Hero(this.canvas, this.ctx);
      this.character = new Character();
      this.primarySound = new Audio('./sounds/primary-bg-sound.mp3');
      this.secondarySound = new Audio('./sounds/secondary-bg-sound.mp3');
      this.bind();

      //this.primarySound.play();
      window.addEventListener('keydown', this.handleKeys);
      window.addEventListener('click', this.restart);
      this.primarySound.addEventListener('ended', this.playPrimaryMusic, false);
      this.secondarySound.addEventListener('ended', this.playSecondaryMusic, false);
    }

    startLooper() {
      this.isPlaying = true;
      this.looper = setInterval(this.render, 0);
    }

    render() {
      this.resetCanvas();
      this.frames += 1;
      this.hero.draw();
      this.createEnemy();
      this.drawEnemies();
      this.collisionChecker();
      this.renderScore();
    }

    resetCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    createEnemy() {
      if (this.frames % this.character.size === 0) {
        let x = Math.floor(Math.random() * 10) * this.character.size;
        this.enemyesStore.push(new Enemy(x, this.ctx));
        if (this.enemyesStore.length === 12)
          this.enemyesStore.shift();
      }
    }

    drawEnemies() {
      this.enemyesStore.forEach(enemy => enemy.draw());
    }

    collisionChecker() {
      this.enemyesStore.forEach(enemy => {
        if (this.hero.checkCollision(enemy)) {
          this.gameOver();
        }
        if (enemy.y === 500)
          this.score++;
      })
    }

    renderScore() {
      this.ctx.font = '16px Arial';
      this.ctx.fillStyle = '#0095DD';
      this.ctx.fillText('Score: ' + this.score, this.canvas.width - 100, 20);
    }

    gameOver() {
      clearInterval(this.looper);
      this.ctx.font = '20px Verdana';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText('GAME OVER', 185, 220);
      this.isPlaying = false;
      this.isGameOver = true;
      this.restartButton.style.display = 'block';
    };

    restart() {
      this.enemyesStore.splice(0, this.enemyesStore.length);
      this.restartButton.style.display = 'none';
      this.score = 0;
      this.startLooper();
    };

    handleKeys({ keyCode }) {
      if (keyCode === 37 && this.isPlaying) {
        if (this.hero.x <= 0)
          return;
        this.hero.x -= this.hero.size;
      }
      if (keyCode === 39 && this.isPlaying) {
        if (this.hero.x >= this.canvas.width - this.hero.size)
          return;
        this.hero.x += this.hero.size;
      }
      if (keyCode === 32 && !this.isGameOver) {
        if (this.isPlaying) {
          clearInterval(this.looper);
          this.isPlaying = false;
        } else {
          this.startLooper();
          this.isPlaying = true;
        }
      } else if (keyCode === 32 && this.isGameOver)
        this.restart();
    }

    playPrimaryMusic() {
      this.secondarySound.play();
    }
    playSecondaryMusic() {
      this.primarySound.play();
    }

    bind() {
      this.render = this.render.bind(this)
      this.restart = this.restart.bind(this);
      this.handleKeys = this.handleKeys.bind(this);
      this.playPrimaryMusic = this.playPrimaryMusic.bind(this);
      this.playSecondaryMusic = this.playSecondaryMusic.bind(this);
    }
  }
  window.Game = Game;
})();