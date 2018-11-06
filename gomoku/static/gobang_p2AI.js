//实现人机对战
$(document).ready(function () {
    var gobang = {
        //全局变量定义处
        NO_CHESS: 0,
        BLACK_CHESS: -1,
        WHITE_CHESS: 1,
        chessArr: [],   //记录棋子
        playerTurn: true,  //玩家回合
        gameStart: false,
        gameOver: false,
        lastChess: [],

        //函数定义处
        init: function () {
            var chess = this;

            //添加鼠标移动事件
            $("div.chessboard div").hover(function () {
                $(this).addClass("hover");
            }, function () {
                $(this).removeClass("hover");
            })

            //初始化棋子状态
            var i, j;
            for (i = 0; i < 15; i++) {
                chess.chessArr[i] = [];
                for (j = 0; j < 15; j++) {
                    chess.chessArr[i][j] = chess.NO_CHESS;
                }
            }

            //添加下子事件
            $("div.chessboard div").click(function () {
                var index = $(this).index(),
                    i = parseInt(index / 15),       //等价于i = index/15 | 0
                    j = index % 15;
                if (chess.gameOver) {
                    return;
                }
                if (chess.playerTurn) {
                    if (chess.chessArr[i][j] == chess.NO_CHESS) {
                        chess.player(i, j);
                        if (chess.gameOver) {
                            return;
                        }
                        chess.AI();
                    }
                }
            });
        },

        //AI下棋
        AI: function () {
            var chess = this;
            var i, j;
            var weightArr = [];
            //初始化weightArr
            for (i = 0; i < 15; i++) {
                weightArr[i] = [];
                for (j = 0; j < 15; j++) {
                    weightArr[i][j] = 0;
                }
            }

            //计算权重
            for (i = 0; i < 15; i++)
                for (j = 0; j < 15; j++) {
                    if (chess.chessArr[i][j] == chess.NO_CHESS) {
                        weightArr[i][j] += chess.weight(i, j);
                    }
                }
            //获取weightArr中的最大值，并赋值
            var m, n;
            var max = 0;
            for (i = 0; i < 15; i++)
                for (j = 0; j < 15; j++) {
                    if (weightArr[i][j] > max) {
                        max = weightArr[i][j];
                        m = i;
                        n = j;
                    }
                }
            chess.chessArr[m][n] = chess.WHITE_CHESS;
            $(".black_last").addClass("black").removeClass("black_last");
            $("div.chessboard div:eq(" + (m * 15 + n) + ")").addClass("white_last");
            chess.win(m, n);
            chess.playerTurn = true;
        },

        //权值计算
        weight: function (i, j) {
            //return parseInt(100 * Math.random());   //随机棋子测试
            var chess = this;
            var blackweight = 0;
            var whiteweight = 0;

            //白子权值判断
            var live = 1;
            var death = 0;
            //竖向
            for (var k = i + 1; k < 15; k++) {
                if (chess.chessArr[k][j] == chess.WHITE_CHESS) {
                    live++;
                }
                else if (chess.chessArr[k][j] == chess.BLACK_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            for (var k = i - 1; k >= 0; k--) {
                if (chess.chessArr[k][j] == chess.WHITE_CHESS) {
                    live++;
                }
                else if (chess.chessArr[k][j] == chess.BLACK_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            whiteweight += chess.computerweight(live, death, 1);

            //横向
            live = 1;
            death = 0;
            for (var k = j + 1; k < 15; k++) {
                if (chess.chessArr[i][k] == chess.WHITE_CHESS) {
                    live++;
                }
                else if (chess.chessArr[i][k] == chess.BLACK_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            for (var k = j - 1; k >= 0; k--) {
                if (chess.chessArr[i][k] == chess.WHITE_CHESS) {
                    live++;
                }
                else if (chess.chessArr[i][k] == chess.BLACK_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            whiteweight += chess.computerweight(live, death, 1);

            //斜向 \
            live = 1;
            death = 0;
            for (var m = i + 1, n = j + 1; m < 15 && n < 15; m++ , n++) {
                if (chess.chessArr[m][n] == chess.WHITE_CHESS) {
                    live++;
                }
                else if (chess.chessArr[m][n] == chess.BLACK_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            for (var m = i - 1, n = j - 1; m >= 0 && n >= 0; m-- , n--) {
                if (chess.chessArr[m][n] == chess.WHITE_CHESS) {
                    live++;
                }
                else if (chess.chessArr[m][n] == chess.BLACK_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            whiteweight += chess.computerweight(live, death, 1);

            //斜向 \
            live = 1;
            death = 0;
            for (var m = i - 1, n = j + 1; m >= 0 && n < 15; m-- , n++) {
                if (chess.chessArr[m][n] == chess.WHITE_CHESS) {
                    live++;
                }
                else if (chess.chessArr[m][n] == chess.BLACK_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            for (var m = i + 1, n = j - 1; m < 15 && n >= 0; m++ , n--) {
                if (chess.chessArr[m][n] == chess.WHITE_CHESS) {
                    live++;
                }
                else if (chess.chessArr[m][n] == chess.BLACK_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            whiteweight += chess.computerweight(live, death, 1);

            //黑子权值判断
            live = 1;
            death = 0;
            //竖向
            for (var k = i + 1; k < 15; k++) {
                if (chess.chessArr[k][j] == chess.BLACK_CHESS) {
                    live++;
                }
                else if (chess.chessArr[k][j] == chess.WHITE_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            for (var k = i - 1; k >= 0; k--) {
                if (chess.chessArr[k][j] == chess.BLACK_CHESS) {
                    live++;
                }
                else if (chess.chessArr[k][j] == chess.WHITE_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            whiteweight += chess.computerweight(live, death, 2);

            //横向
            live = 1;
            death = 0;
            for (var k = j + 1; k < 15; k++) {
                if (chess.chessArr[i][k] == chess.BLACK_CHESS) {
                    live++;
                }
                else if (chess.chessArr[i][k] == chess.WHITE_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            for (var k = j - 1; k >= 0; k--) {
                if (chess.chessArr[i][k] == chess.BLACK_CHESS) {
                    live++;
                }
                else if (chess.chessArr[i][k] == chess.WHITE_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            whiteweight += chess.computerweight(live, death, 2);

            //斜向 \
            live = 1;
            death = 0;
            for (var m = i + 1, n = j + 1; m < 15 && n < 15; m++ , n++) {
                if (chess.chessArr[m][n] == chess.BLACK_CHESS) {
                    live++;
                }
                else if (chess.chessArr[m][n] == chess.WHITE_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            for (var m = i - 1, n = j - 1; m >= 0 && n >= 0; m-- , n--) {
                if (chess.chessArr[m][n] == chess.BLACK_CHESS) {
                    live++;
                }
                else if (chess.chessArr[m][n] == chess.WHITE_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            whiteweight += chess.computerweight(live, death, 2);

            //斜向 \
            live = 1;
            death = 0;
            for (var m = i - 1, n = j + 1; m >= 0 && n < 15; m-- , n++) {
                if (chess.chessArr[m][n] == chess.BLACK_CHESS) {
                    live++;
                }
                else if (chess.chessArr[m][n] == chess.WHITE_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            for (var m = i + 1, n = j - 1; m < 15 && n >= 0; m++ , n--) {
                if (chess.chessArr[m][n] == chess.BLACK_CHESS) {
                    live++;
                }
                else if (chess.chessArr[m][n] == chess.WHITE_CHESS) {
                    death++;
                    break;
                }
                else {
                    break;
                }
            }
            whiteweight += chess.computerweight(live, death, 2);

            return whiteweight + blackweight;
        },
        computerweight: function (live, death, computer) {
            //机器和人采取不同的加权方法
            if (computer == 1) {
                if (live == 5) {
                    return 100000;
                }
                else if (live == 4) {
                    if (death == 0) {
                        return 5000;
                    }
                    else if (death == 1) {
                        return 400;
                    }
                    else {
                        return 0;
                    }
                }
                else if (live == 3) {
                    if (death == 0) {
                        return 500;
                    }
                    else if (death == 1) {
                        return 30;
                    }
                    else {
                        return 0;
                    }
                }
                else if (live == 2) {
                    if (death == 0) {
                        return 100;
                    }
                    else if (death == 1) {
                        return 10;
                    }
                    else {
                        return 0;
                    }
                }
                else {
                    if (death == 0) {
                        return 15;
                    }
                    else if (death == 1) {
                        return 15;
                    }
                    else {
                        return 0;
                    }
                }
            }
            else {
                if (live == 5) {
                    return 10000;
                }
                else if (live == 4) {
                    if (death == 0) {
                        return 2000;
                    }
                    else if (death == 1) {
                        return 100;
                    }
                    else {
                        return 0;
                    }
                }
                else if (live == 3) {
                    if (death == 0) {
                        return 200;
                    }
                    else if (death == 1) {
                        return 20;
                    }
                    else {
                        return 0;
                    }
                }
                else if (live == 2) {
                    if (death == 0) {
                        return 50;
                    }
                    else if (death == 1) {
                        return 5;
                    }
                    else {
                        return 0;
                    }
                }
                else {
                    if (death == 0) {
                        return 10;
                    }
                    else if (death == 1) {
                        return 10;
                    }
                    else {
                        return 0;
                    }
                }
            }
        },
        //玩家下棋
        player: function (i, j) {
            var chess = this;
            $(".white_last").addClass("white").removeClass("white_last");
            $("div.chessboard div:eq(" + (i * 15 + j) + ")").addClass("black_last");
            chess.chessArr[i][j] = chess.BLACK_CHESS;
            chess.lastChess = [i, j];
            chess.win(i, j);
            chess.playerTurn = false;
        },

        //判断是否赢
        win: function (i, j) {
            var chess = this;
            var num = 1;  //记录连续棋子个数
            var color;
            var colornum;
            if (chess.playerTurn) {
                color = "black";
                colornum = -1;
            }
            else {
                color = "white";
                colornum = 1;
            }

            //纵向
            for (var k = i - 1; k >= 0; k--) {
                if (chess.chessArr[k][j] === colornum) {
                    num++;
                }
                else {
                    break;
                }
            }
            for (var k = i + 1; k < 15; k++) {
                if (chess.chessArr[k][j] === colornum) {
                    num++;
                }
                else {
                    break;
                }
            }
            if (num >= 5) {
                //标记赢棋
                for (var k = i - 1; k >= 0; k--) {
                    if (chess.chessArr[k][j] === colornum) {
                        $("div.chessboard div:eq(" + (k * 15 + j) + ")").removeClass(color).addClass(color + "_last");
                    }
                    else {
                        break;
                    }
                }
                for (var k = i + 1; k < 15; k++) {
                    if (chess.chessArr[k][j] === colornum) {
                        $("div.chessboard div:eq(" + (k * 15 + j) + ")").removeClass(color).addClass(color + "_last");
                    }
                    else {
                        break;
                    }
                }
                chess.gameOver = true;
                chess.showResult(color);
                return;
            }
            else {
                num = 1;
            }

            //横向
            for (var k = j - 1; k >= 0; k--) {
                if (chess.chessArr[i][k] === colornum) {
                    num++;
                }
                else {
                    break;
                }
            }
            for (var k = j + 1; k < 15; k++) {
                if (chess.chessArr[i][k] === colornum) {
                    num++;
                }
                else {
                    break;
                }
            }
            if (num >= 5) {
                //标记赢棋
                for (var k = j - 1; k >= 0; k--) {
                    if (chess.chessArr[i][k] === colornum) {
                        $("div.chessboard div:eq(" + (i * 15 + k) + ")").removeClass(color).addClass(color + "_last");
                    }
                    else {
                        break;
                    }
                }
                for (var k = j + 1; k < 15; k++) {
                    if (chess.chessArr[i][k] === colornum) {
                        $("div.chessboard div:eq(" + (i * 15 + k) + ")").removeClass(color).addClass(color + "_last");
                    }
                    else {
                        break;
                    }
                }
                chess.gameOver = true;
                chess.showResult(color);
                return;
            }
            else {
                num = 1;
            }

            //斜向 \
            for (var m = i - 1, n = j - 1; m >= 0 && n >= 0; m-- , n--) {
                if (chess.chessArr[m][n] === colornum) {
                    num++;
                }
                else {
                    break;
                }
            }
            for (var m = i + 1, n = j + 1; m < 15 && n < 15; m++ , n++) {
                if (chess.chessArr[m][n] === colornum) {
                    num++;
                }
                else {
                    break;
                }
            }
            if (num >= 5) {
                //标记赢棋
                for (var m = i - 1, n = j - 1; m >= 0 && n >= 0; m-- , n--) {
                    if (chess.chessArr[m][n] === colornum) {
                        $("div.chessboard div:eq(" + (m * 15 + n) + ")").removeClass(color).addClass(color + "_last");
                    }
                    else {
                        break;
                    }
                }
                for (var m = i + 1, n = j + 1; m < 15 && n < 15; m++ , n++) {
                    if (chess.chessArr[m][n] === colornum) {
                        $("div.chessboard div:eq(" + (m * 15 + n) + ")").removeClass(color).addClass(color + "_last");
                    }
                    else {
                        break;
                    }
                }
                chess.gameOver = true;
                chess.showResult(color);
                return;
            }
            else {
                num = 1;
            }

            //斜向 /
            for (var m = i - 1, n = j + 1; m >= 0 && n < 15; m-- , n++) {
                if (chess.chessArr[m][n] === colornum) {
                    num++;
                }
                else {
                    break;
                }
            }
            for (var m = i + 1, n = j - 1; m < 15 && n >= 0; m++ , n--) {
                if (chess.chessArr[m][n] === colornum) {
                    num++;
                }
                else {
                    break;
                }
            }
            if (num >= 5) {
                //标记赢棋
                for (var m = i - 1, n = j + 1; m >= 0 && n < 15; m-- , n++) {
                    if (chess.chessArr[m][n] === colornum) {
                        $("div.chessboard div:eq(" + (m * 15 + n) + ")").removeClass(color).addClass(color + "_last");
                    }
                    else {
                        break;
                    }
                }
                for (var m = i + 1, n = j - 1; m < 15 && n >= 0; m++ , n--) {
                    if (chess.chessArr[m][n] === colornum) {
                        $("div.chessboard div:eq(" + (m * 15 + n) + ")").removeClass(color).addClass(color + "_last");
                    }
                    else {
                        break;
                    }
                }
                chess.gameOver = true;
                chess.showResult(color);
                return;
            }
            else {
                num = 1;
            }
        },
        showResult: function (color) {
            $("#message").html(color + " win!")
        },
    }

    gobang.init();
});

