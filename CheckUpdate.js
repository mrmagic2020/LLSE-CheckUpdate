//LiteLoaderScript Dev Helper
/// <reference path="d:\PLGUINS\JS/dts/HelperLib-master/src/index.d.ts"/> 


/**

  /$$$$$$  /$$                           /$$       /$$   /$$                 /$$             /$$              
 /$$__  $$| $$                          | $$      | $$  | $$                | $$            | $$              
| $$  \__/| $$$$$$$   /$$$$$$   /$$$$$$$| $$   /$$| $$  | $$  /$$$$$$   /$$$$$$$  /$$$$$$  /$$$$$$    /$$$$$$ 
| $$      | $$__  $$ /$$__  $$ /$$_____/| $$  /$$/| $$  | $$ /$$__  $$ /$$__  $$ |____  $$|_  $$_/   /$$__  $$
| $$      | $$  \ $$| $$$$$$$$| $$      | $$$$$$/ | $$  | $$| $$  \ $$| $$  | $$  /$$$$$$$  | $$    | $$$$$$$$
| $$    $$| $$  | $$| $$_____/| $$      | $$_  $$ | $$  | $$| $$  | $$| $$  | $$ /$$__  $$  | $$ /$$| $$_____/
|  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$| $$ \  $$|  $$$$$$/| $$$$$$$/|  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
 \______/ |__/  |__/ \_______/ \_______/|__/  \__/ \______/ | $$____/  \_______/ \_______/   \___/   \_______/
                                                            | $$                                              
                                                            | $$                                              
                                                            |__/                                              
 * 作者：魔法先生
 * GitHub仓库地址：https://github.com/mrmagic2020/LLSE-CheckUpdate
 * Liscence: AGPLv3
 * 未经允许禁止整合，如有需要请标明资源下载链接
 * 该资源永久免费
 */





ll.registerPlugin(
    /* name */ "CheckUpdate",
    /* introduction */ "检查插件版本更新",
    /* version */ [0,1,0],
    /* otherInformation */ {}
); 
ll.export(checkUpdate, `cup`, `checkUpdate`);



const API = `https://api.minebbs.com/api/openapi/v1/resources/`;


class VersionInfo {
    /**
     * 
     * @param {boolean} success 是否查询成功
     * @param {number} code 状态号码
     * @param {string} message 描述
     * @param {number | null} latest 该版本是否是最新版本
     * @param {string | null} latest_version 最新的版本号
     */
    constructor (success, code, message, latest = null, latest_version = null) {
        this.success = success;
        this.code = code;
        this.message = message
        this.latest = latest;
        this.latest_version = latest_version;
    }
}

/**
 * 
 * @param {string} thisName 资源名称
 * @param {number} targetID 资源ID
 * @param {number[] | string} thisVERS 当前运行版本
 * @param {string[]} messageList 自定义输出信息 [版本最新，版本过时]
 * @returns {VersionInfo}
 */
function checkUpdate (thisName, targetID, thisVERS, messageList = [`插件[${thisName}]已是最新版本！`, `插件[${thisName}]版本过时！当前版本：${thisVERS.join(`.`)} 最新版本：%latest_version% 前往%url%下载最新版本。`]) {
    network.httpGet(API + targetID, (stat, res) => {
        let dt;
        let obj = JSON.parse(res);
        let apiCode = obj.status;
        messageList = formatMessage(messageList, {"%latest_version%": obj.data.version, "%url%": obj.data.view_url});
        if (stat == 200) {
            if (apiCode == 2000) {
                let isLatest;
                let msg;
                if (typeof thisVERS == `object`) {
                    if (thisVERS.join(`.`) == obj.data.version) {
                        isLatest = true;
                        msg = messageList[0];
                    } else {
                        isLatest = false;
                        msg = messageList[1];
                    }
                    dt = new VersionInfo(true, 2000, msg, isLatest, obj.data.version);
                } else if (typeof thisVERS == `string`) {
                    if (thisVERS == obj.data.version) {
                        isLatest = true;
                        msg = messageList[0];
                    } else {
                        isLatest = false;
                        msg = messageList[1];
                    }
                    dt = new VersionInfo(true, 2000, msg, isLatest, obj.data.version);
                } else {
                    dt = new VersionInfo(false, -1, `插件[${thisName}]版本检查失败！参数类型错误：版本应为数组或字符串`);
                }
            } else if (apiCode == 4000) {
                dt = new VersionInfo(false, apiCode, `插件[${thisName}]版本检查失败！` + obj.message);
            } else if (apiCode == 4040) {
                dt = new VersionInfo(false, apiCode, `插件[${thisName}]版本检查失败！` + obj.message);
            } else if (apiCode == 5000) {
                dt = new VersionInfo(false, apiCode, `插件[${thisName}]版本检查失败！` + obj.message);
            } else {
                dt = new VersionInfo(false, -1, `插件[${thisName}]版本检查失败！(未知错误)`);
            }
        } else {
            dt = new VersionInfo(false, -1, `插件[${thisName}]版本检查失败！(API错误)`);
        }
        logger.warn(dt.message);
        return dt;
    });
}

/**
 * 
 * @param {string[]} messageList 
 * @param {object} holderList 
 * @returns
 */
function formatMessage (messageList, holderList) {
    for (let i in messageList) {
        for (let j in holderList) {
            messageList[i] = messageList[i].replaceAll(j, holderList[j]);
        }
    }
    return messageList;
}



const example = {
    "success": true,
    "status": 2000,
    "message": "OK，DaZe",
    "version": "v1",
    "codename": "Accelerator",
    "time": 1643540879,
    "data": {
        "title": "Minecraft 基岩版/国际版 正式版 安卓版 安装包", //资源标题
        "version": "1.18.2.03", //资源最新版本
        "last_update": 1639110321, //最后更新时间
        "update_count": 53, //更新次数
        "view_count": 84338, //查看次数
        "download_count": 4267, //下载次数
        "review_count": 101, //评论数量
        "tag_line": "MCPE是一款沙盒式建造游戏，玩家可以在游戏中的三维空间里创造和破坏零零总总的方块", //资源描述
        "icon_url": "https://www.minebbs.com/data/resource_icons/0/13.jpg?1532605567", //资源图标
        "description_parsed": "<b>Minecraft 基岩版 是指包括Minecraft 手机版（Android、IOS）、Win10版（VR）、主机版（XboxOne、NS）在内的 使用“基岩引擎”（C++语言）开发的Minecraft 统一版本。<br />\n正式版是 Minecraft 基岩版 经过一段时间的测试版测试之后得到的稳定版本，也是众多材质、Addons和官方领域服会逐渐跟进的版本。与此同时Google Play、Win10 Store等官方软件商城也会推送更新。</b><br />\n<br />\n我们会基本保持同步、持续更新<br />\n<br />\n<b><span style=\"color: rgb(65, 168, 95)\"><b><span style=\"font-size: 18px\">本资源仅供用户体验游戏特性和学习使用，请于24H内删除！</span><br />\n<span style=\"font-size: 18px\">条件允许的话请前往官网、Windows Store或者GooglePlay支持正版！</span></b></span><br />\n<br />\n请选择这四项下载！！！<br />\n<span style=\"color: rgb(65, 168, 95)\"><b><span style=\"font-size: 18px\"><img src=\"https://www.minebbs.com/attachments/20283/\" alt=\"1634309489233.png\" /></span></b></span></b><br />\n<span style=\"font-size: 15px\"><b>这个是图片广告，不要被骗，小心下载器：</b></span><br />\n<img src=\"https://www.minebbs.com/attachments/20284/\" alt=\"1634309527688.png\" /><br />\n<br />\n<b><span style=\"color: rgb(209, 72, 65)\"><span style=\"font-size: 18px\">本帖只从1.2.10开始搬运最新的MCPE正式版，历史版本请见：<a href=\"https://www.minebbs.com/resources/minecraftpe.110/\" class=\"link link--internal\">https://www.minebbs.com/resources/minecraftpe.110/</a><br />\n<br />\n测试版请见：<br />\n<a href=\"https://www.minebbs.com/resources/minecraftpe-beta.81/\" class=\"link link--internal\">https://www.minebbs.com/resources/minecraftpe-beta.81/</a> </span></span><br />\n<br />\nAndroid用户：</b><br />\n<ul>\n<li data-xf-list-type=\"ul\">系统版本至少为<u>Android4.2</u>或更高（Android7.0可用/8.0用户反映可用）</li>\n<li data-xf-list-type=\"ul\">机型：能正常使用均可</li>\n</ul><b>IOS用户：</b><br />\n<ul>\n<li data-xf-list-type=\"ul\">需要<u>IOS 8.0</u>或更高版本</li>\n<li data-xf-list-type=\"ul\">机型：iPhone 5/5c/5s、iPhone 6/6s、iPhone 7、iPhone X、iPhone 8、iPhone SE</li>\n</ul><b>其他用户：</b><br />\n<ul>\n<li data-xf-list-type=\"ul\">自行测试</li>\n</ul>转载本贴时须要注明<b>原作者</b>以及<b>本帖地址</b>。", //资源信息(H5)
        "price": "0.00", //资源价格
        "rating_avg": 0, //资源平均评分
        "rating_count": 92, //资源评分数量
        "resource_date": 1519391277, //资源上传日期
        "resource_state": "visible", //资源状态
        "resource_type": "download", //资源类型
        "view_url": "https://www.minebbs.com/minecraft/" //查看链接
    }
}