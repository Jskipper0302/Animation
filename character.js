function Character(game, asset) {
    this.goF = false;
    this.goB = false;
    this.jump = false;
    this.k = false;
    this.lightB = false;
    this.middleB = false;
    this.sup = false;
    this.g = false;
    this.y = 400;
    this.speed = 500;
    this.game = game;
    this.ctx = game.ctx;
    this.animation = new Animation(asset.getAsset("./danzo/wait.png"), 28, 82, 4, 0.10, 4, true, 2.9);
    this.goForward = new Animation(asset.getAsset("./danzo/goForward.png"), 65, 82, 6, 0.25, 6, true, 2.9);
    this.goBack = new Animation(asset.getAsset("./danzo/goBack.png"), 53, 82, 2, 0.25, 2, true, 2.9);
    this.lightBoxing = new Animation(asset.getAsset("./danzo/lightBoxing.png"), 69, 82, 2, 0.15, 2, false, 2.9);
    this.middleBoxing = new Animation(asset.getAsset("./danzo/heavyBoxing.png"), 117, 82, 2, 0.25, 2, false, 2.9);
    this.jumpUp = new Animation(asset.getAsset("./danzo/jumpUp.png"), 43, 75, 1, 0.45, 1, false, 2.9);
    this.guard = new Animation(asset.getAsset("./danzo/guard.png"), 38, 82, 1, 0.12, 1, true, 2.9);
    this.ki = new Animation(asset.getAsset("./danzo/ki.png"), 45, 82, 1, 0.12, 1, true, 2.9);
    this.super = new Animation(asset.getAsset("./danzo/super.png"), 27, 82, 10, 0.2, 10, false, 2.9);
    this.x = 600;
}

Character.prototype.draw = function () {
    var n = 1;
    if (this.middleB){
        this.middleBoxing.drawFrame(this.game.clockTick, this.ctx, this.x - this.middleBoxing.frameWidth * n, this.y);
    }else if (this.sup){
        this.super.drawFrame(this.game.clockTick, this.ctx, this.x - this.super.frameWidth * n, this.y);
    }else if (this.g){
        this.guard.drawFrame(this.game.clockTick, this.ctx, this.x - this.guard.frameWidth * n, this.y);
    }else if (this.lightB){
        this.lightBoxing.drawFrame(this.game.clockTick, this.ctx, this.x - this.lightBoxing.frameWidth * n, this.y);
    }else if (this.k){
        this.ki.drawFrame(this.game.clockTick, this.ctx, this.x - this.ki.frameWidth * n, this.y);
    }else if (this.jump){
        this.jumpUp.drawFrame(this.game.clockTick, this.ctx, this.x - this.jumpUp.frameWidth * n, this.y);
    }else if (this.goF){
        this.goForward.drawFrame(this.game.clockTick, this.ctx, this.x - this.goForward.frameWidth * n, this.y);
    }else if (this.goB){
        this.goBack.drawFrame(this.game.clockTick, this.ctx, this.x - this.goBack.frameWidth * n, this.y);
    }else {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x - this.animation.frameWidth * n, this.y);
    }
}
Character.prototype.canAction = function(){
    return !(this.k || this.sup || this.g || this.jump || this.lightB || this.middleB);
};

Character.prototype.canMove = function(){
    return !(this.k || this.sup || this.g || this.lightB || this.middleB);
};
Character.prototype.update = function () {
    if (this.canAction()) {
        if (this.game.s){
            this.k = true;
        } else if (this.game.w){
            this.jump = true;
        } else if (this.game.j){
            this.lightB = true;
        } else if (this.game.k){
            this.middleB = true;
        } else if (this.game.u){
            this.g = true;
        } else if (this.game.i){
            this.sup = true;
        }
    }
    if (this.canMove()){
        if (this.game.d){
            this.goF = true;
            if (this.animation.elapsedTime < this.animation.totalTime && this.x < 1200) {
                this.x += this.game.clockTick * this.speed;
            }
        } else {
            this.goF = false;
        }
        if (this.game.a){
            this.goB = true;
            if (this.animation.elapsedTime < this.animation.totalTime && this.x > 0) {
                this.x -= this.game.clockTick * this.speed;
            }
        } else {
            this.goB = false;
        }
    }

    if (!this.game.u){
        this.g = false;
    }

    if (!this.game.s){
        this.k = false;
    }

    if (this.jump){
        if (this.jumpUp.isDone()){
            this.y -= 8;
            this.jumpUp.elapsedTime = 0;
            this.jump = false;
        }
        var jumpDistance = this.jumpUp.elapsedTime / this.jumpUp.totalTime;
        var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = 400 - height;
    } else {
        if (this.canAction()) {
            if (this.game.s){
                this.k = true;
            } else if (this.game.w){
                this.jump = true;
            } else if (this.game.j){
                this.lightB = true;
            } else if (this.game.k){
                this.middleB = true;
            } else if (this.game.u){
                this.g = true;
            } else if (this.game.i){
                this.sup = true;
            }
        }

        if (this.lightB) {
            if (this.lightBoxing.isDone()) {
                this.lightBoxing.elapsedTime = 0;
                this.lightB = false;
            }
        }
        if (this.middleB) {
            if (this.middleBoxing.isDone()) {
                this.middleBoxing.elapsedTime = 0;
                this.middleB = false;
            }
        }
        if (this.sup) {
            if (this.super.isDone()) {
                this.super.elapsedTime = 0;
                this.sup = false;
            }
        }
        if (!this.game.u){
            this.g = false;
        }

        if (!this.game.s){
            this.k = false;
        }
    }
}
