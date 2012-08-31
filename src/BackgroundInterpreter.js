/**
 * @author azrael
 * @date 2012-6-16
 * @description 解析 css background 属性
 */

//url(../images/app_icon.png) white no-repeat 10px 50% border-box content-box fixed
(function(){

    var MATCH_ACTION = [
    {
        //background-image
        regexp: /(url\([^\)]+\))/i,
        exec: function(style, match){
            style['background-image'] = match[1];
        }
    },/*{//TODO background-repeat 没必要拆开, 简写的时候, 只能是两个值同时设置
        //background-repeat
        regexp: /(repeat)|(no-repeat)|(repreat-x)|(repeat-y)/i,
        exec: function(style, match){
            var text;
            if(text = (match[1] || match[2])){
                style['background-repeat-x'] = style['background-repeat-y'] = text;
            }else if(text = match[3]){
                style['background-repeat-x'] = 'repeat';
                style['background-repeat-y'] = 'no-repeat';
            }else if(text = match[4]){
                style['background-repeat-x'] = 'no-repeat';
                style['background-repeat-y'] = 'repeat';
            }
        }
    },*/{
        //background-repeat
        regexp: /((repeat)|(no-repeat)|(repreat-x)|(repeat-y))/i,
        exec: function(style, match){
            style['background-repeat'] = match[1];
        }
    },{
        //background-attachment
        regexp: /(fixed|scroll)/i,
        exec: function(style, match){
            style['background-attachment'] = match[1];
        }
    },{
        //background-origin, background-clip
        //使用简写的时候 origin 是比 clip 优先的
        regexp: /((border|padding|content)-box)/i,
        exec: function(style, match){
            style['background-origin'] = match[1];
        }
    },{
        //background-clip
        regexp: /((border|padding|content)-box)/i,
        exec: function(style, match){
            style['background-clip'] = match[1];
        }
    },{
        //background-position
        //w3c 中 position 的两个值必须写在一起(如果有两个的话)
        regexp: /(-?\d+(%|in|cm|mm|em|ex|pt|pc|px)?)|(center|top|right|bottom|left)\b/i,
        exec: function(style, match){
            style['background-position-x'] = style['background-position-y'] = match[1] || match[3];
        }
    },{
        //background-position-y
        regexp: /(-?\d+(%|in|cm|mm|em|ex|pt|pc|px)?)|(center|top|right|bottom|left)\b/i,
        exec: function(style, match){
            style['background-position-y'] = match[1] || match[3];
        }
    },{
        //background-color: #fff
        regexp: /(#([0-9a-f]{3}|[0-9a-f]{6})\b)/i,
        exec: function(style, match){
            style['background-color'] = match[1];
        }
    },{
        //background-color: rgb()
        regexp: /(rgb\(\s*(1[0-9]{2}|2[0-4][0-9]|25[0-5]|[1-9][0-9]|[0-9])\s*(,\s*(1[0-9]{2}|2[0-4][0-9]|25[0-5]|[1-9][0-9]|[0-9])\s*){2}\))/i,
        exec: function(style, match){
            style['background-color'] = match[1];
        }
    },{
        //background-color: rgba()
        regexp: /(rgba\((\s*(1[0-9]{2}|2[0-4][0-9]|25[0-5]|[1-9][0-9]|[0-9])\s*,){3}\s*(0?\.[0-9]+|[01])\s*\))/i,
        exec: function(style, match){
            style['background-color'] = match[1];
        }
    },{
        //background-color: color-name
        //W3C 的 HTML 4.0 标准仅支持 16 种颜色名, 加上 orange + transparent 一共 18 种 
        regexp: /(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|orange|transparent)/i,
        exec: function(style, match){
            style['background-color'] = match[1];
        }
    }
    ];

    var analyse = function(value){
        var style = {},
            match,
            origin = value = value.trim();
        for(var i = 0, action; (action = MATCH_ACTION[i]) && value; i++) {
            match = value.match(action.regexp);
            if(match){
                action.exec(style, match);
                value = value.replace(match[0], '').trim();
            }
        };
        return style;
    }

    exports.analyse = analyse;

})();