import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

type ball = {
  x: number;
  y: number;
};

type dir = {
  dx: number;
  dy: number;
};

type score = {
  player1: number;
  player2: number;
};

type name = {
  name1: string;
  name2: string;
};

type paddles = {
  paddle1: number;
  paddle2: number;
};

type wall = {
  width: number;
  height: number;
};

export enum Stat {
  READY,
  PLAY,
  CANCEL,
  END,
}

@Injectable()
export class GameService {
  Status: Stat;
  Players = [];
  name: name;
  Watchers: Array<any>;
  roomName: string;
  ownerId: string;
  speed: number;
  ballSize: number;
  ball: ball;
  score: score;
  dir: dir;
  width: number;
  height: number;
  paddles: paddles;
  wall: wall;
  user1: any;
  user2: any;

  constructor(
    user1,
    user2,
    Player1,
    Player2,
    Status: Stat,
    roomName: string,
    ownerId: string,
    speed: string,
    ballSize: string,
  ) {
    this.user1 = user1;
    this.user2 = user2;
    this.Status = Status;
    this.Players.push(Player1);
    this.Players.push(Player2);
    this.Watchers = [];
    this.roomName = roomName;
    this.ownerId = ownerId;
    this.speed = Number(speed);
    this.width = 1500;
    this.height = 750;
    this.ballSize = Number(ballSize);
    this.name = { name1: '', name2: '' };
    this.ball = { x: this.width / 2, y: this.height / 2 };
    this.dir = { dx: 1, dy: 1 };
    this.score = {
      player1: 0,
      player2: 0,
    };
    this.wall = { height: 100, width: 10 };
    this.paddles = { paddle1: 350, paddle2: 350 };
  }

  default() {
    this.ball.x = Math.random() * (this.width / 5) + (2 * this.width) / 5;
    this.ball.y = Math.random() * (this.height / 2) + this.height / 4;
    this.dir.dx = Math.random() > 0.5 ? -1 : 1;
    this.dir.dy = Math.random() > 0.5 ? -1 : 1;
  }

  gameover() {
    this.Status = Stat.END;
  }

  // inGameOver() {
  //     this.roomService.gameOver(this.Players)
  // }

  gameCancel() {
    this.Status = Stat.CANCEL;
  }

  update() {
    //player out  over case
    if (this.Players.length != 2) {
      this.gameCancel();
    }

    var nextX = this.ball.x + this.dir.dx;
    var nextY = this.ball.y + this.dir.dy;

    //top bottom dir change
    if (nextY <= 750 || nextY >= 0) {
      if (nextY <= 750) {
        this.dir.dy *= -1;
        nextY += 1;
      }
      if (nextY >= 0) {
        this.dir.dy *= -1;
        nextY -= 1;
      }
    }

    // new x y
    // paddles

    if (
      nextY <= this.paddles.paddle2 + 100 &&
      nextY >= this.paddles.paddle2 - 20
    ) {
      if (nextX + this.ballSize / 2 + 10 >= 1500) {
        console.log(
          `${this.ball.x}, ${this.ball.y} paddle 2 ${this.paddles.paddle2}`,
        );
        this.dir.dx *= -1;
        nextX -= 10;
      }
    } else if (
      nextY <= this.paddles.paddle1 + 100 &&
      nextY >= this.paddles.paddle1 - 20
    ) {
      if (nextX - this.ballSize / 2 <= 0) {
        this.dir.dx *= -1;
        nextX += 10;
      }
    }
    // score
    // if (nextX - this.ballSize >= 1465 || nextX + this.ballSize <= 10) {
    if (nextX >= 1500 || nextX <= 0) {
      nextX >= 1500 ? (this.score.player1 += 1) : (this.score.player2 += 1);
      // nextX >= 1475 ? (this.score.player1 += 1) : (this.score.player2 += 1);
      if (this.score.player1 == 5) {
        this.gameover();
      } else if (this.score.player2 == 5) {
        this.gameover();
      }
      this.default();
      nextX = this.ball.x;
      nextY = this.ball.y;
    }

    this.ball.x = nextX += (this.dir.dx * 0.2 * this.speed) / 2;
    this.ball.y = nextY += (this.dir.dy * 0.3 * this.speed) / 2;

    //return
    return {
      x: this.ball.x,
      y: this.ball.y,
      name1: this.name.name1,
      name2: this.name.name2,
      score1: this.score.player1,
      score2: this.score.player2,
      paddle1: this.paddles.paddle1,
      paddle2: this.paddles.paddle2,
      ballsize: this.ballSize,
    };
  }

  isPlayer(user: any) {
    if (this.Players.indexOf(user) != -1) return true;
    else return false;
  }

  isOwner(user: any) {
    if (user.id === this.Players[0].id) return true;
    else return false;
  }

  isPlayer2(user: any) {
    if (user.id === this.Players[1].id) return true;
    else return false;
  }

  isWatcher(user: any) {
    if (this.Watchers.indexOf(user) != -1) return true;
    else return false;
  }

  deletePlayer(user: any) {
    if (this.Players.splice(this.Players.indexOf(user), 1)) return true;
    else return false;
  }

  deleteWatcher(user: any) {
    if (this.Watchers.splice(this.Watchers.indexOf(user), 1)) return true;
    else return false;
  }

  changeStatus(status: Stat) {
    this.Status = status;
  }

  addName1(name) {
    this.name.name1 = name;
  }

  addName2(name) {
    this.name.name2 = name;
  }

  keyPaddle1(input: number) {
    if (input === 1) {
      if (this.paddles.paddle1 - 50 < 0) return;
      this.paddles.paddle1 -= 25;
    } else if (input === 2) {
      if (this.paddles.paddle1 + 25 >= 700) return;
      this.paddles.paddle1 += 25;
    }
  }

  keyPaddle2(input: number) {
    if (input === 1) {
      if (this.paddles.paddle2 - 50 < 0) return;
      this.paddles.paddle2 -= 25;
    } else if (input === 2) {
      if (this.paddles.paddle2 + 25 >= 700) return;
      this.paddles.paddle2 += 25;
    }
  }

  pushWatcher(watcher: Socket) {
    this.Watchers.push(watcher);
    for (const player of this.Players) console.log('playerid', player.id);
    for (const i of this.Watchers) console.log('watchers', i.id);
  }
}
