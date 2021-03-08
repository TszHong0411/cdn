var requests_url = 'https://hexo-fcircle-api.vercel.app/api'; //api地址
var moments_container = document.getElementById('moments_container') ; //div容器的id
var orign_data = []; //api請求所得到的源數據
var maxnumber = 20; //頁面展示文章數量
var addnumber = 10; //每次加載增加的篇數
var opentype = '_blank';  //'_blank'打開新標簽,'_self'本窗口打開

//將html放入指定id的div容器
var append_div = (parent, text) => {
    if (typeof text === 'string') {
        var temp = document.createElement('div');
        temp.innerHTML = text;
        // 防止元素太多 進行提速
        var frag = document.createDocumentFragment();
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        parent.appendChild(frag);
    } else {
        parent.appendChild(text);
    }
};

//去重
var unique = (arr) => {
    return Array.from(new Set(arr))
};

//時區優化
var formatDate = (strDate) => {
    try {
        var date = new Date(Date.parse(strDate.replace(/-/g, "/")));
        var gettimeoffset;
        if (new Date().getTimezoneOffset()) {
            gettimeoffset = new Date().getTimezoneOffset();
        } else {
            gettimeoffset = 8;
        }
        var timeoffset = gettimeoffset * 60 * 1000;
        var len = date.getTime();
        var date2 = new Date(len - timeoffset);
        var sec = date2.getSeconds().toString();
        var min = date2.getMinutes().toString();
        if (sec.length === 1) {
            sec = "0" + sec;
        }
        if (min.length === 1) {
            min = "0" + min;
        }
        return date2.getFullYear().toString() + "/" + (date2.getMonth() + 1).toString() + "/" + date2.getDate().toString() + " " + date2.getHours().toString() + ":" + min + ":" + sec
    } catch (e) {
        return ""
    }
};

var timezoon = (datalist_slice) => {
    var time = datalist_slice[0][1][0][5];
    return formatDate(time)
};

//今日時間
var todaypost = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if (month.length === 1) {
        month = "0" + month;
    }
    if (day.length === 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day
};

//加載更多文章
var load_more_post = () => {
    maxnumber = maxnumber + addnumber;
    moments_container.innerHTML = "";
    data_handle(orign_data, maxnumber)
};

//月份切片
var slice_month = (data) => {
    var monthlist = [];
    var datalist = [];
    var data_slice = data;
    for (var item in data_slice) {
        data_slice[item].push(item);
        if (data_slice[item][1].lenth !== 10) {
            var list = data_slice[item][1].split('-');
            if (list[1].length < 2) {
                list[1] = "0" + list[1]
            }
            if (list[2].length < 2) {
                list[2] = "0" + list[2]
            }
            data_slice[item][1] = list.join('-')
        }
        var month = data_slice[item][1].slice(0, 7);
        if (monthlist.indexOf(month) !== -1) {
            datalist[monthlist.length - 1][1].push(data_slice[item])
        } else {
            monthlist.push(month);
            datalist.push([month, [data_slice[item]]])
        }
    }
    for (var mounthgroup of datalist) {
        mounthgroup.push(mounthgroup[1][0][6]);
    }
    return datalist
};

//處理數據
var data_handle = (data, maxnumber) => {
    var today = todaypost();
    var Datetody = new Date(today);
    for (var item = 0; item < data[1].length; item++) {
        var Datedate = new Date(data[1][item][1]);
        if (Datedate > Datetody) {
            data[1].splice(item--, 1);
        }
    }
    var today_post = 0;
    var error = 0;
    var unique_live_link;
    var datalist = data[1].slice(0, maxnumber);
    var listlenth = data[1].length;
    var user_lenth = data[0].length;
    var datalist_slice = slice_month(datalist);
    var last_update_time = timezoon(datalist_slice);
    var link_list = [];
    for (var item of data[1]) {
        if (item[1] === today) {
            today_post += 1;
        }
        link_list.push(item[3]);
    }
    var arr = unique(link_list);
    unique_live_link = arr.length;
    for (var item of data[0]) {
        if (item[3] === 'true') {
            error += 1;
        }
    }
    var html_item = '<h2>統計信息</h2>';
    html_item += '<div id="info_user_pool" class="moments-item info_user_pool" style="">';
    html_item += '<div class="moments_chart"><span class="moments_post_info_title">當前友鏈數:</span><span class="moments_post_info_number">' + user_lenth + '個</span><br><span class="moments_post_info_title">失敗數:</span><span class="moments_post_info_number">' + error + '個</span><br></div>';
    html_item += '<div class="moments_chart"><span class="moments_post_info_title">活躍友鏈數:</span><span class="moments_post_info_number">' + unique_live_link + '個</span><br><span class="moments_post_info_title">當前庫存:</span><span class="moments_post_info_number">' + listlenth + '篇</span><br></div>';
    html_item += '<div class="moments_chart"><span class="moments_post_info_title">今日更新:</span><span class="moments_post_info_number">' + today_post + '篇</span><br><span class="moments_post_info_title">最近更新:</span><span class="moments_post_info_number">' + last_update_time + '</span><br></div>';
    html_item += '</div>';
    for (var month_item of datalist_slice) {
        html_item += '<h2>' + month_item[0] + '</h2>';
        for (var post_item of month_item[1]) {
            html_item += ' <div class="moments-item">';
            html_item += ' <a target="' + opentype + '" class="moments-item-img" href="' + post_item[2] + '" title="' + post_item[0] + '">';
            html_item += '<img onerror="this.onerror=null,this.src=&quot;https://cdn.jsdelivr.net/gh/tszhong0411/image/404.png&quot;"';
            html_item += ' src="' + post_item[4] + '"></a>';
            html_item += '<div class="moments-item-info"><div class="moments-item-time"><i class="far fa-user"></i>';
            html_item += '<span>' + post_item[3] + '</span>';
            html_item += ' <div class="moments_post_time"><i class="far fa-calendar-alt"></i>' +
                '<time datetime="' + post_item[1] + '" title="' + post_item[1] + '">' + post_item[1] + '</time></div>';
            html_item += `</div><a target="${opentype}" class="moments-item-title" href="${post_item[2]}" title="${post_item[0]}">${post_item[0]}</a></div>`;
            html_item += '</div>';

        }
    }
    if (data[1].length - maxnumber > 0) {
        html_item += '<div style="text-align: center"><button type="button" class="moments_load_button" ' +
            'onclick="load_more_post()">加載更多...</button>' +
            '</div>'
    }
    html_item += '<style>.moments-item-info span{padding-left:.3rem;padding-right:.3rem}.moments_post_time time{padding-left:.3rem;cursor:default}.moments_post_info_title{font-weight:700}.moments_post_info_number{float:right}.moments_chart{align-items:flex-start;flex:1;width:100px;height:60px;margin:20px}@media screen and (max-width:500px){.info_user_pool{padding:10px;flex-direction:column;max-height:200px}.moments_chart{flex:0;width:100%;height:160px;margin:0}}.moments-item:before{border:0}@media screen and (min-width:500px){.moments_post_time{float:right}}.moments_load_button{-webkit-transition-duration:.4s;transition-duration:.4s;text-align:center;border:1px solid #ededed;border-radius:.3em;display:inline-block;background:transparent;color:#555;padding:.5em 1.25em}.moments_load_button:hover{color:#3090e4;border-color:#3090e4}.moments-item{position:relative;display:-webkit-box;display:-moz-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-moz-box-align:center;-o-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;margin:0 0 1rem .5rem;-webkit-transition:all .2s ease-in-out;-moz-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;-ms-transition:all .2s ease-in-out;transition:all .2s ease-in-out;box-shadow:rgba(0,0,0,0.07) 0 2px 2px 0,rgba(0,0,0,0.1) 0 1px 5px 0;border-radius:2px}.moments-item-img{overflow:hidden;width:80px;height:80px}.moments-item-img img{max-width:100%;width:100%;height:100%;object-fit:cover}.moments-item-info{-webkit-box-flex:1;-moz-box-flex:1;-o-box-flex:1;box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;padding:0 .8rem}.moments-item-title{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;font-size:1.1em;-webkit-transition:all .3s;-moz-transition:all .3s;-o-transition:all .3s;-ms-transition:all .3s;transition:all .3s;-webkit-line-clamp:1}</style>'
    append_div(moments_container, html_item)
};

//網絡請求
fetch(requests_url).then(
    data => data.json()
).then(
    data => {
        orign_data = data;
        data_handle(orign_data, maxnumber)
    }
)

setTimeout(function(){while (true) {
    if (document.getElementById("info_user_pool")) {
        document.getElementById("loaderOfFcircle").style.display = "none";
        break;
    }
}},1500)