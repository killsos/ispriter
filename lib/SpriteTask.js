var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,

    Logger = require('./Logger');


function SpriteTask(ispriter, cssUri) {

    EventEmitter.call(this);

    this.ispriter = ispriter;

    this.cssUri = cssUri; // css 文件的路径

    this.styleSheet = null; // css 文件的内容
    
    this.styleObjList = null; // 搜集到的需要合并图片的样式和相关图片信息(大小宽高等)

    this.spriteArray = null; // 精灵图的所有小图片数组

    this.init();
}

util.inherits(SpriteTask, EventEmitter);

SpriteTask.createTasks = function(ispriter, callback) {
    
    var config = ispriter.config,
        taskArr = [];

    zTool.forEach(config.input.cssSource, function(cssUri, index, next){ // onEach

        var task = new SpriteTask(ispriter, cssUri);

        task.on('inited', function(){

                    // 没有需要合并的图片的任务就丢弃
                    if(task.styleObjList.length){

                        taskArr.push(task);
                    }
                })
                .on('inited', next);
    }, function(){ //onDone

        callback && callback(taskArr);
    });
}

SpriteTask.prototype.init = function() {

    var context = this,
        config = this.ispriter.config,
        styleObjList;

    this.styleSheet = BaseStyleSheet.createStyleSheet(config, this.cssUri);

    // 收集需要合并的图片信息, 这个是 ispriter 的核心之一
    styleObjList = this.styleObjList = this.styleSheet.collectStyleRules();

    if(!styleObjList.length){

        this.emit('inited');
        return;
    }

    // 读取图片的内容, 宽高和大小
    zTool.forEach(styleObjList, function(styleObj, url, next){

        var fileName;
        function onGetImageInfo(imageInfo){

            if(imageInfo){

                // 从所有style里面, 选取图片宽高最大的作为图片宽高
                setImageWidthHeight(styleObj, imageInfo);

                styleObj.imageInfo = imageInfo;

            }else{ // 没有读取到图片信息, 可能是图片签名或格式不对, 读取出错了
                
                delete styleObjList[url];
                styleObj.cssRules.forEach(function(style){

                    style.mergeBackgound();
                });
            }
            next();
        }

        fileName = path.join(config.workspace, styleObj.imageAbsUrl);
        ImageTool.getImageInfo(fileName, onGetImageInfo);
    }, function(){

        context.emit('inited');
    });
    
}

SpriteTask.prototype.exec = function() {
    
}