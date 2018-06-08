//实现人人对战
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
        direction: [],

        //函数定义处
        init: function () {
            // $("div.chessboard div").click(function () {
            //     $(this).addClass("black");
            // })
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
                    //$(this).removeClass("white").addClass("black");
                    //console.log($(this).index());
                    if (chess.chessArr[i][j] == chess.NO_CHESS) {
                        $(".white_last").addClass("white").removeClass("white_last");
                        $(this).addClass("black_last");
                        chess.chessArr[i][j] = chess.BLACK_CHESS;
                        chess.lastChess = [i, j];
                        chess.win(i,j);
                        chess.playerTurn = chess.playerTurn ? false : true;
                        // setTimeout(function () {
                        //     chess.win(i, j);
                        //     chess.playerTurn = chess.playerTurn ? false : true;
                        // }, 0)
                    }
                }
                else {
                    if (chess.chessArr[i][j] == chess.NO_CHESS) {
                        $(".black_last").addClass("black").removeClass("black_last");
                        $(this).addClass("white_last");
                        chess.chessArr[i][j] = chess.WHITE_CHESS;
                        chess.lastChess = [i, j];
                        chess.win(i,j);
                        chess.playerTurn = chess.playerTurn ? false : true;
                        //设置延时，使属性设置生效
                        // setTimeout(function () {
                        //     chess.win(i, j);
                        //     chess.playerTurn = chess.playerTurn ? false : true;
                        // }, 0)
                    }
                }
            });
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
                //alert(color + " win!");  //alert会提前执行，但是同等的css不会
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
        // markChess: function (pos, color) {
        //     $("div.chessboard div:eq(" + pos + ")").removeClass(color).addClass(color + "_last");
        // },
        showResult: function(color){
            $("#message").html(color+" win!")
        },
    }

    gobang.init();
});

