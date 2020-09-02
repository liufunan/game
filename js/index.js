$(function () {
    //1.监听游戏规则的点击
    //点击淡入
    $(".rules").click(function () {
        $(".rule").stop().fadeIn(100);
    });
    //点击关闭，淡出
    $(".close").click(function () {
        $(".rule").stop().fadeOut(100);
    })

    //2.监听开始游戏按钮的点击
    $(".start").click(function () {
        //按钮点击则淡出
        $(this).stop().fadeOut(100);
        //(1).处理进度条
        progressHandler();
        //(2).处理灰太狼动画的方法
        wolfAnimation();

    });

    //定义一个专门处理进度条的方法  (进度条时间减少即为.progress的宽度边小)
    //3.进度条走完就显示重新开始界面
    function progressHandler() {
        //重新设置进度条的宽度   ,在重新开始时，会用到；
        $(".progress").css({
            width: 180
        });

        //开启定时器处理进度条
        var timer =setInterval(function () {
            //拿到进度条当前宽度
            var progressWidth= $(".progress").width();
            //减少当前的宽度
            progressWidth-=1;
            //宽度变为减少后的宽度
            $(".progress").css({
                width:progressWidth
            });

            //监听进度条是否走完
            if(progressWidth<=0){
                //若进度条走完，则关闭定时器
                clearInterval(timer);
                //4.然后显示重新开始界面
                $(".mask").stop().fadeIn(100);

                //停止灰太狼的动画
                stopwolfAnimation()

                //游戏结束后分数变为0
                $(".score").text(0);

            }
        },300)

    }

    var wolfTimer;
    //定义一个专门处理灰太狼动画的方法
    function wolfAnimation(){
        //(1).定义两个数组，保存所有灰太狼和小灰灰的图片
        var wolf_1=['./images/h0.png','./images/h1.png','./images/h2.png','./images/h3.png','./images/h4.png','./images/h5.png','./images/h6.png','./images/h7.png','./images/h8.png','./images/h9.png'];
        var wolf_2=['./images/x0.png','./images/x1.png','./images/x2.png','./images/x3.png','./images/x4.png','./images/x5.png','./images/x6.png','./images/x7.png','./images/x8.png','./images/x9.png'];
        //(2).定义一个数组保存所有可能出现的位置
        var arrPos = [
            {left:"100px",top:"115px"},
            {left:"20px",top:"160px"},
            {left:"190px",top:"142px"},
            {left:"105px",top:"193px"},
            {left:"19px",top:"221px"},
            {left:"202px",top:"212px"},
            {left:"120px",top:"275px"},
            {left:"30px",top:"295px"},
            {left:"209px",top:"297px"}
        ];

        //灰太狼出来的原理是：不断的切换在显示的图片，效果就是出来了
        //切换前5张是出来的，后五张是被打的

        //(3).创建一个图片
        var $wolfImage = $("<img src='' class='wolfImage'>")

        // 随机得到0-8的整数值  (有8个可能出现的位置)
        var posIndex=Math.round(Math.random()*8);

        //(4).设置图片显示的位置
        $wolfImage.css({
            position:"absolute",
            left:arrPos[posIndex].left,     //随机获取arrPos数组中的一个索引值的内容
            top:arrPos[posIndex].top        // .left获内容中的left值； .top获内容中的top值；
        })

        //随机获取数组类型 (两个数组中，一个是灰太狼，一个是小灰灰)
        //Math.round(Math.random())    :则这个结果是0或1

        //判断随机数是否为0，若是0，则wolfType=wolf_1   ， 不是就wolfType=wolf_2
        var wolfType =Math.round(Math.random())==0  ? wolf_1 :wolf_2

        //(5)设置图片的内容   (做这个图片动画)
        window.wolfIndex =0;           //变为全局变量
        window.wolfIndexEnd=5;

        wolfTimer = setInterval(function () {
            if(wolfIndex>wolfIndexEnd){       //前五张是出来的样子，后5张是拍打到的样子
                $wolfImage.remove();          //删掉图片
                clearInterval(wolfTimer);     //删掉定时器
                wolfAnimation();              //继续调用动画
            }
            $wolfImage.attr("src",wolfType[wolfIndex]);
            wolfIndex++;

        },300)

        //(6)将图片添加到整个框界面上
        $(".container").append($wolfImage);

        //即就为：把一个图片显示在主界面的某个位置上

        //7.调用处理游戏规则的方法
        gameRules($wolfImage);

    }

         //游戏规则的方法
    function  gameRules($wolfImage) {
        //监听图片的点击
        $wolfImage.one("click",function () {     //one(),表示点击只有效点击一次，(若没有则点多次就执行多次了；)
        //修改索引,(当点击图片后，把这个全局变量改变，则显示图片的定时器继续执行动画，显示其他图片)
        window.wolfIndex=5;
        window.wolfIndexEnd=9;

         //拿到当前点击图片的地址
         var $src = $(this).attr("src");
         //在图片地址中可以看到：灰太狼的图片名字含有h，小灰灰的图片名字含有x；
         //根据图片地址判断是否是灰太狼
         // indexOf("h") 查找是否有h的值，若没有找到返回-1，找到了是1；
         var flag =$src.indexOf("h")>=0;        //大于0，则找到了 ，是灰太狼
         //flag接收为true或false

          //根据点击的类型，增减分数
             if(flag){
                 // parseInt($(".score").text())+10;  //拿到h1里面的数字+10
                 $(".score").text(parseInt($(".score").text())+10);
             }
             else{
                 $(".score").text(parseInt($(".score").text())-10);
             }

        });
    }

    //定义一个专门停止灰太狼动画的方法
    function stopwolfAnimation(){
          $(".wolfImage").remove();      //删掉图片
          clearInterval(wolfTimer);       //删掉定时器
                                        //则调用该方法后，不再执行灰太狼动画

    }


    //4.监听重新开始按钮的点击
     $(".reStart").click(function () {
           //  让本身界面淡出
         $(".mask").stop().fadeOut(100);
         //处理进度条
         progressHandler();

         //调用处理灰太狼动画的方法
         wolfAnimation();

     });

});




//数组中图片有9张，我们可以生成0-8的9个随机数，然后根据随机数去数组中取一个

//     0  * 8 = 0   == 0
//     0.1* 8 = 0.8 == 1
//     0.2* 8 = 1.6 == 2
//     0.3* 8 = 2.4 == 2
//     0.4* 8 = 3.2 == 3
//     0.5* 8 = 4.0 == 4
//     0.6* 8 = 4.8 == 5
//     0.7* 8 = 5.6 == 6
//     0.8* 8 = 6.4 == 6
//     0.9* 8 = 7.2 == 7
//     1* 8 =  8    == 8

//Math.random()*8    随机得到0-8的值
// Math.round(Math.random()*8);     //随机得到0-8的整数值
