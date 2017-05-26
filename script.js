var snake;
var apple;
var snakeGame;

function SnakeGame(canvasWidth, canvasHeight, blockSize, delay) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.canvas.style.border = "1px solid";
    document.body.appendChild(canvas)
    this.ctx = this.canvas.getContext('2d');
    this.blockSize = blockSize;
    this.delay = delay;
    this.snake = snake;
    this.apple = apple;
    this.widthInBlocks = canvasWidth / blockSize;
    this.heightInBlocks = canvasHeight / blockSize;
    this.score;
    var instance = this;
    var timeOut;

    this.init = function (snake, apple) {
        this.snake = snake;
        this.apple = apple;
        this.score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }

    var refreshCanvas = function () {
        instance.snake.advance();
        if (instance.checkCollision()) {
            instance.gameOver();
        } else {
            if (instance.snake.isEatingApple(instance.apple)) {
                instance.score++;
                instance.snake.ateApple = true;
                do {
                    instance.apple.setNewPosition(instance.widthInBlocks, instance.heightInBlocks);
                }
                while (instance.apple.isOnSnake(instance.snake))
            }
            instance.ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
            instance.drawScore();
            instance.snake.draw(instance.ctx, instance.blockSize);
            instance.apple.draw(instance.ctx, instance.blockSize);
            timeOut = setTimeout(refreshCanvas, delay);
        }
    }

    window.onload = function () {

        var canvasWidth = 900;
        var canvasHeight = 600;
        var blockSize = 30;
        var ctx;
        var delay = 100;
        var snakee;
        var applee;
        var widthInBlocks = canvasWidth / blockSize;
        var heightInBlocks = canvasHeight / blockSize;
        var score;

        init();



        function gameOver() {
            ctx.save();
            ctx.fillText("Game Over", 5, 15);
            ctx.fillText("Hit space to start a new game", 5, 30);
            ctx.restore();
        }

        function restart() {
            snakee = new Snake([[6, 4], [5, 4], [4, 4], [3, 4], [2, 4]], "right");
            applee = new Apple([10, 10]);
            score = 0;
            refreshCanvas();
        }

        function drawScore() {
            ctx.save();
            ctx.fillText(score.toString(), 5, canvasHeight - 5);
            ctx.restore();
        }

        function Snake(body, direction) {
            this.body = body;
            this.direction = direction;
            this.ateApple = false;
            this.draw = function () {
                ctx.save();
                ctx.fillStyle = "#ff0000";
                for (var i = 0; i < this.body.length; i++) {
                    var x = this.body[i][0] * blockSize;
                    var y = this.body[i][1] * blockSize;
                    ctx.fillRect(x, y, blockSize, blockSize);
                }
                ctx.restore();
            };
            this.advance = function () {
                var nextPosition = this.body[0].slice();
                switch (this.direction) {
                    case "left":
                        nextPosition[0] -= 1
                        break;
                    case "right":
                        nextPosition[0] += 1
                        break;
                    case "up":
                        nextPosition[1] -= 1
                        break;
                    case "down":
                        nextPosition[1] += 1
                        break;
                    default:
                        throw ("Invalid Direction");
                }
                this.body.unshift(nextPosition);
                if (!this.ateApple) {
                    this.body.pop();
                } else {
                    this.ateApple = false;
                }

            };
            this.setDirection = function (newDirection) {
                var allowedDirection;
                switch (this.direction) {
                    case "left":
                    case "right":
                        allowedDirection = ["up", "down"]
                        break;
                    case "up":
                    case "down":
                        allowedDirection = ["left", "right"]
                        break;
                    default:
                        throw ("Invalid Direction");
                }
                if (allowedDirection.indexOf(newDirection) > -1) {
                    this.direction = newDirection;
                }
            };
            this.checkCollisions = function () {
                var wallCollision = false;
                var snakeCollision = false;
                var head = this.body[0];
                var rest = this.body.slice(1);
                var snakeX = head[0];
                var snakeY = head[1];
                var minX = 0;
                var minY = 0;
                var maxX = widthInBlocks - 1;
                var maxY = heightInBlocks - 1;
                var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
                var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

                if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls) {
                    wallCollision = true;
                }

                for (var i = 0; i < rest.lenght; i++) {
                    if (snakeX === rest[i][0] && snakeY === rest[i][1]) {
                        snakeCollision = true;
                    }
                }
                return wallCollision || snakeCollision;
            };
            this.IsEatingApple = function (appleToEat) {
                var head = this.body[0];
                if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                    return true;
                else
                    return false;
            };

        }

        function Apple(position) {
            this.position = position;
            this.draw = function () {
                ctx.save();
                ctx.fillStyle = "#33cc33";
                ctx.beginPath();
                var radius = blockSize / 2;
                var x = this.position[0] * blockSize + radius;
                var y = this.position[1] * blockSize + radius;
                ctx.arc(x, y, radius, 0, Math.PI * 2, true);
                ctx.fill();
                ctx.restore();
            };
            this.setNewPosition = function () {
                var newX = Math.round(Math.random() * (widthInBlocks - 1));
                var newY = Math.round(Math.random() * (heightInBlocks - 1));
                this.position = [newX, newY];
            };

            this.isOnSnake = function (snakeTobBeChecked) {
                var isOnSnake = false;
                for (var i = 0; i < snakeTobBeChecked.body.length; i++) {
                    if (this.position[0] === snakeTobBeChecked.body[i][0] && this.position[1] === snakeTobBeChecked.body[i][1]) {
                        isOnSnake = true;
                    }
                }
                return isOnSnake;
            };
        }

        document.onkeydown = function handleKeyDown(e) {
            var key = e.keyCode;
            var newDirection;
            switch (key) {
                case 37:
                    newDirection = "left";
                    break;
                case 38:
                    newDirection = "up";
                    break;
                case 39:
                    newDirection = "right";
                    break;
                case 40:
                    newDirection = "down";
                    break;
                case 32:
                    restart();
                    return;
                default:
                    return;
            }
            snakee.setDirection(newDirection);
        };
    }
