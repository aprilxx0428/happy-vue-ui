/*!
 * Beyondbit Mobile Front-end Framework v1.0.0
 changeset 180329 *
 * http://bsdn.beyondbit.com
 *
 * Copyright (c)  xakoy
 * Released under the  license
 */
// 兼容iOS WKWebView

/* eslint-disable */
try {
    if (window.webkit.messageHandlers && window.webkit.messageHandlers._belvolyNative) {
        window._belvolyNative = {
            exec: function (service, action, callbackId, args) {
                window.webkit.messageHandlers._belvolyNative.postMessage({ functionName: "exec", service: service, action: action, callbackId: callbackId, arguments: args })
            }
        }
    }
} catch (e) {
    console.log("not in WKWebView")
}

// 兼容CefSharp
try {
    if (window.cef) {
        window._belvolyNative = {
            exec: function (service, action, callbackId, args) {
                window.cef.execute(service, action, callbackId, args)
            }
        }
    }
} catch (e) {
    console.log("not in WPF ChromiumWebBrowser")
}

/**
 * This is module BM
 * @module BM
 * @main BM
 * @class BM
 * @static
 * @example
 *
 *     // BM 命名空间<br />
 *     var b = BM;
 *
 */
var belvolyMobile = (function () {
    var that = {}
    // Hello,ll

    /**
      * 注册命名空间到Beyondbit命令空间下，可注册多层
      * @method registerNameSpace
      * @static
      * @param  {string} nameSpace 命名空间字符串，多层使用.隔开
      * @return {object} 返回创建的命令空间对象
      * @example
      *
      *     var web = Beyondbit.registerNameSpace("Web");
      *     var window = Beyondbit.registerNameSpace("Web.Window");
      *
      */
    that.registerNameSpace = function (nameSpace) {
        var result = that
        var path = nameSpace.split(".")
        var length = path.length
        for (var i = 0; i < length; i++) {
            var name = path[i]
            if (result[name] === undefined) {
                result[name] = {}
            }
            result = result[name]
        }
        return result
    }

    /**
    * 注册一个命名空间对象至Beyondbit中
    * @method register
    * @static
    * @param {String} nameSpace 命名空间字符串，多层使用.隔开
    * @param {function} maker 一个方法委托，执行后，返回一个Json对象 () => {};
    * @example
    *
    *     // 注册
    *     Beyondbit.register("Web",function(){
    *        return {
    *           alert:function(){
    *               alert(1);
    *           }
    *        }
    *     });
    *
    *     // 调用
    *     Beyondbit.Web.alert();
    */
    that.register = function (nameSpace, maker) {
        var path = nameSpace.split(".")
        var curr = that
        for (var i = 0, len = path.length; i < len; i += 1) {
            if (i == len - 1) {
                if (curr[path[i]] !== undefined) {
                    curr[path[i]] = $.extend({}, curr[path[i]], maker(that))
                    return true
                }
                curr[path[i]] = maker(that)
                return true
            }
            if (curr[path[i]] === undefined) {
                curr[path[i]] = {}
            }
            curr = curr[path[i]]
        }
    }

    that.regShort = function (ns, maker) {
        if (that[ns] !== undefined) throw "[" + ns + "] : short : 已经注册"
        that[ns] = maker
    }

    /**
    * 检测对象是否存在
    * @method isObjectExists
    * @static
    * @param {String} objectString 对象的string字符串
    * @example
    *
    *     Beyondbit.isObjectExists("Beyondbit.Portal.toLocationMenu")
    */
    that.isObjectExists = function (objectString) {
        try {
            eval("var tempObjetExists = " + objectString)
            return true
        } catch (e) { }

        return false
    }

    /* 代号 */
    that.DESIGNATION = "belvolyMobile"

    var _identity = 1

    /**
      * 获取自增长标识字段
      * @method getIdentity
      * @returns {Number}
      *
      */
    that.getIdentity = function () {
        return _identity++
    }

    that.log = function (obj) {
        // alert(obj);
        console.log(obj)
        // $("#log").append("<p>" + obj + "</p>");
    }

    that.ready = function (existsMobile, notExistsMobile) {
        if (that.isMobileEnvironment()) {
            existsMobile && existsMobile()
        } else {
            notExistsMobile && notExistsMobile()
        }
    }

    /**
      * 是否是移动的环境
      * @method isMobileEnvironment
      */
    that.isMobileEnvironment = function () {
        return window._belvolyNative != null
    }

    return that
})()

var BM = window.BM = window.belvolyMobile = belvolyMobile;

(function () {
    BM.Config = {
        webRootUrl: "/",
        sharedServiceRootUrl: "",
        position: {
            url: "/Position/Select"
        },
        iam: {
            clientId: "",
            clientSecret: "",
            token: "",
            refreshToken: "",
            refreshTokenUrl: "",
            enabled: true
        }
    }

    BM.getAbsoluteUrl = function (url) {
        var a = document.createElement("a")
        a.href = url

        return a.href
    }

    BM.getEntireUrl = function (url) {
        if (BM.Config.webRootUrl && BM.Config.webRootUrl.length <= 1) {
            return url
        }

        return BM.Config.webRootUrl + url
    }

    BM.config = function (config) {
        if (!config) {
            return BM.Config
        }

        BM.Config = $.extend(true, {}, BM.Config, config)
    }

    if (window.BM_config) {
        BM.config(window.BM_config)
    }
})();

(function () {
    BM.getBottomWindow = function () {
        var currentWindow = window
        while (currentWindow.parent !== currentWindow.self) {
            currentWindow = currentWindow.parent
        }
        return currentWindow
    }
})();

(function () {
    /**
    * 调用APP 外壳交互API 相关
    * @module BM.appointment
    * @submodule appointment
    *
    */

    var appointment = {
        getCommonCallback: function (callback) {
            return function (data) {
                if (callback) {
                    callback(data)
                }
            }
        }
    }

    BM.appointment = appointment
})();

(function () {
    var appointment = BM.appointment
    var serviceName = "driver"

    /**
      * 设备信息类操作集合
      * @class driver
      *
      */

    function Driver () {
        /**
         * 获取设备信息
         * @method get
         * @param {Function} callback 完成后的回调事件
         * @param {JSON} callback.data callback事件的第一个数据
         * @param {string} callback.data.name 设备名称
         * @param {string} callback.data.platform 平台以下几个值[android、ios、web、wechat]
         * @param {string} callback.data.version 系统版本
         * @param {string} callback.data.version 框架版本
         *
         * @example
         *
         *      BM.appointment.driver.get(function(data){
         *          alert("当前的设备是:" + data.name)
         *      })
         *
         */
        this.get = function (callback) {
            BM.webBridge.native.execute(serviceName, "get", {}, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        var _lasterInfo = null

        /**
         * Overwritten method see {{#crossLink "appointment.driver/get"}}{{/crossLink}}
         *
         *
         * 获取最近一次设备信息，此方法是对 [get] 方法做了缓存包装. 参数参考[get]
         *
         * @method getLaster
         */
        this.getLaster = function (callback) {
            if (_lasterInfo != null) {
                appointment.getCommonCallback(callback)(_lasterInfo)
            } else {
                this.get(function (data) {
                    _lasterInfo = data
                    appointment.getCommonCallback(callback)(_lasterInfo)
                })
            }
        }

        /**
         * 获取系统指纹相关信息
         * @method getFingerprintInfo
         * @param {Function} callback 完成后的回调事件
         * @param {JSON} callback.data callback事件的第一个数据
         * @param {Boolean} callback.data.isSupport 系统是否支持指纹
         * @param {Boolean} callback.data.isSet 系统是否设置过指纹
         */
        this.getFingerprintInfo = function (callback) {
            BM.webBridge.native.execute(serviceName, "getFingerprintInfo", {}, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }
    }

    appointment.driver = new Driver()
})();

(function () {
    var appointment = BM.appointment

    var serviceName = "location"

    function Location () {
        /**
         * 获取定位
         * @method get
         * @param {Function} callback 获取到后通知的事件
         * @param {JSON} callback.data 获取到的数据
         * @param {JSON} callback.data.point 定位的坐标
         * @param {Number} callback.data.point.longitude 经度
         * @param {Number} callback.data.point.latitude 纬度
         *
         * @return {
         *    point: {
         *          longitude: 100.00,
         *          latitude: 100.00
         *       }
         *   }
         *
         * @example
         *
         *     BM.appointment.location.get(function(data){
         *          alert("经度：{0}, 纬度：{1}".bformat(data.point.longitude, data.point.latitude))
         *     });
         *
         */
        this.get = function (callback) {
            BM.webBridge.native.execute(serviceName, "get", {}, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }
    };

    /**
     * 地理位置
     * @class location
     * @module BM.appointment
     */

    appointment.location = new Location()
})();

(function () {
    var appointment = BM.appointment

    /**
      * 图像查看器
      * @class imageView
      * @module BM.appointment
      */
    var serviceName = "imageView"
    appointment.imageView = new function () {
        /**
         * 显示
         * @method show
         * @param {Array} images 要显示的图片列表
         * @param {String} images.url 图片的下载URL
         * @param {String} images.title 图片的标题
         * @param {int} currentIndex 当前的图片索引
         */
        this.show = function (imageList, currentIndex, callback) {
            BM.webBridge.native.execute(serviceName, "show",
                { imageList: imageList, currentIndex: currentIndex },
                function (data) {
                    if (callback) {
                        callback(data)
                    }
                })
        }
    }()
})();

(function () {
    var appointment = BM.appointment

    /**
      * 照相机
      * @class camera
      * @module BM.appointment
      */
    var serviceName = "camera"

    appointment.camera = new function () {
        /**
         * 获取一张图片
         * @method getPictrue
         * @param {JSON} [options] 参数配置
         * @param {Number} [options.compressionRatio=1] 压缩比例，默认为1 。 如0.75 = 75%
         * @param {Function} callback 获取成功后的回调函数
         * @param {JSON} callback.data 获取的数据
         * @param {string} callback.data.imgURI 图片的磁盘物理地址
         * @param {string} callback.data.fileSize 图片的文件字节大小
         */
        // this.getPicture = function (callback) {
        this.getPicture = function () {
            var config = {
                compressionRatio: 1
            }

            var options, callback
            if (arguments.length == 1) {
                options = config
                callback = arguments[0]
            } else {
                options = $.extend(true, {}, config, arguments[0])
                callback = arguments[1]
            }

            BM.webBridge.native.execute(serviceName, "getPicture", options, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        /**
          * 上传一张图片
          * @method uploadPicture
          * @param {JSON} options 参数配置
          * @param {String} options.imgURI 图片的磁盘物理地址
          * @param {String} options.uploadURL 上传服务器地址
          * @param {Number} [options.compressionRatio=1] 压缩比例，默认为1 。 如0.75 = 75%
          * @param {Function} callback 获取成功后的回调函数
          * @param {JSON} callback.data 获取的数据
          * @param {Number} callback.data.state 上传的状态 0 准备, 1 上传中, 2 成功, 3 失败， 4 超时  , 6 文件在本地缓存已存在
          * @param {double} callback.data.progressPercentage 上传进度 1为100%
          * @param {string} callback.data.code 上传的code
          * @param {string} callback.data.message 上传的完成后返回的文本
          * @param {string} callback.data.result 上传的完成后服务端返回的数据
          */
        // this.uploadPicture = function (imgURI, uploadURL, callback) {

        this.uploadPicture = function () {
            var config = {
                imgURI: "",
                uploadURL: "",
                compressionRatio: 1
            }

            var options, callback
            if (arguments.length == 3) {
                options = $.extend(true, {}, config, {
                    imgURI: arguments[0],
                    uploadURL: arguments[1]
                })
                callback = arguments[2]
            } else {
                options = $.extend(true, {}, config, arguments[0])
                callback = arguments[1]
            }

            BM.webBridge.native.execute(serviceName, "uploadPicture", options,
                function (data) {
                    if (callback) {
                        callback(data)
                    }
                })
        }
        /**
         * 扫码
         * @method scanQR
         * @param {Function} callback 扫码成功后通知的事件
         * @param {String} callback.data 获取到的文本结果
         */
        this.scanQR = function (callback) {
            BM.webBridge.native.execute(serviceName, "scanQR", {}, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }
    }()
})();

(function () {
    var appointment = BM.appointment

    /**
      * 社交服务
      * @class sns
      * @module BM.appointment
      */
    var serviceName = "sns"

    appointment.sns = new function () {
        /**
         * 分享
         * @method share
         * @param {JSON} options 参数配置
         * @param {string} options.title 标题 为null是获取当期网页的标题
         * @param {string} options.description 简介
         * @param {string} [options.imgUrl] 图片URL
         * @param {Boolean} [options.isScreenshot=false] 是否屏幕截图
         * @param {string} [url=当前URL] 分享的Url如果是为空，则默认为当前的url地址
         */
        this.share = function (options) {
            var config = $.extend(true, {},
                {
                    title: "",
                    subtitle: "",
                    description: "",
                    imgUrl: "",
                    isScreenShot: false,
                    url: ""
                }, options)

            BM.webBridge.native.execute(serviceName, "share", config,
                function (data) {
                    if (callback) {
                        callback(data)
                    }
                }
            )
        }
    }()
})();

(function () {
    var appointment = BM.appointment

    /**
     * 数据服务
     * @class data
     * @module BM.appointment
     */
    var serviceName = "data"

    function Data () {
        /**
          * 设置数据
          * @method set
          * @param {string} key 存储的数据名
          * @param {string} value 存储的值
          * @param {Function} callback 回调函数
          */
        this.set = function (key, value, callback) {
            BM.webBridge.native.execute(serviceName, "set",
                {
                    domain: getCurrentDomain(),
                    key: key,
                    value: value
                },
                BM.appointment.getCommonCallback(callback)
            )
        }

        /**
          * 获取数据
          * @method get
          * @param {string} key 存储的数据名
          * @param {Function} callback 回调函数
          * @param {string} callback.value 获取的值，如果 key 不存在。返回空
          */
        this.get = function (key, callback) {
            this.containKey(key, function (result) {
                if (!result) {
                    if (callback) {
                        callback(null)
                    }
                    return
                }

                BM.webBridge.native.execute(serviceName, "get",
                    {
                        domain: getCurrentDomain(),
                        key: key
                    },
                    BM.appointment.getCommonCallback(callback)
                )
            })
        }
        /**
          * 移除数据
          * @method remove
          * @param {string} key 存储的数据名
          * @param {Function} callback 回调函数
          */
        this.remove = function (key, callback) {
            BM.webBridge.native.execute(serviceName, "remove",
                {
                    domain: getCurrentDomain(),
                    key: key
                },
                BM.appointment.getCommonCallback(callback)
            )
        }
        /**
          * 清空所有数据
          * @method clear
          * @param {Function} callback 回调函数
          */
        this.clear = function (callback) {
            BM.webBridge.native.execute(serviceName, "clear",
                {
                    domain: getCurrentDomain()
                },
                BM.appointment.getCommonCallback(callback)
            )
        }

        this.containKey = function (key, callback) {
            BM.webBridge.native.execute(serviceName, "containKey",
                {
                    domain: getCurrentDomain(),
                    key: key
                },
                BM.appointment.getCommonCallback(callback)
            )
        }
    }

    appointment.data = new Data()

    function getCurrentDomain () {
        return window.location.host
    };
})();

(function () {
    var appointment = BM.appointment

    var serviceName = "plugin"

    /**
     * 插件服务
     * @class plugin
     * @module BM.appointment
     */
    function Plugin () {
        this.show = function (code, functionCode, params, callback) {
            BM.webBridge.native.execute(serviceName, "show",
                {
                    code: code,
                    functionCode: functionCode,
                    params: JSON.stringify(params || {})
                }, BM.appointment.getCommonCallback(callback))
        }

        /**
         * 调用执行插件
         * @method exec
         * @param {String} code 插件服务的标识
         * @param {String} functionCode 插件的功能标识
         * @param {String} params 插件功能需要提供的参数
         * @param {Function} callback 插件执行完成后，返回调用的回调函数
         * @param {Object} callback.data 执行完成后，返回的数据
         */
        this.exec = function (code, functionCode, params, callback) {
            this.show(code, functionCode, params, callback)
        }
    }

    appointment.plugin = new Plugin()
})();

(function () {
    // Init
    $(function () {
        BM.ready(function () {
            if (window.BM_setAutoConvertLinkToPageEnabled && window.BM_setAutoConvertLinkToPageEnabled == true) {
                $("a").click(function () {
                    var mode = $(this).attr("data-mode")
                    if (mode !== "none") {
                        var href = $(this).attr("href")

                        if (!href || href == "#") {
                            return false
                        }

                        BM.appointment.webview.open(href)

                        return false
                    }
                })
            }
        })
    })
})();

(function () {
    var appointment = BM.appointment

    var serviceName = "contacts"

    /**
     * 联系人服务
     * @class contacts
     * @module BM.appointment
     */
    function Contacts () {
        /**
         * 添加联系人
         * @method add
         * @param {contact} contact 通讯录对象
         * @param {String} [type=phone] 通讯录类型 phone=手机通讯录，sim=sim卡通讯录
         * @param {Function} [callback] 添加成功后的事件
         * @param {JSON} [callback.data] 成功后的数据
         * @param {String} [callback.data.id] 手机联系人ID
         */
        this.add = function (contact, type, callback) {
            BM.webBridge.native.execute(serviceName, "add", { type: type, contact: JSON.stringify(contact) }, appointment.getCommonCallback(callback))
        }
    };

    appointment.contacts = new Contacts()
})();

(function () {
    var appointment = BM.appointment

    /**
      * 当前DOM类操作集合
      * @class document
      * @module BM.appointment
      */

    function Document () {
        var events = {}
        /**
         * 订阅事件
         * @method on
         * @param {string} eventName 事件的名称.
         * @param {Function} fn 该事件被触发时执行的函数
         */
        this.on = function (eventName, fn) {
            var ev = getEvent(eventName)

            if (!$.isFunction(fn)) {
                return
            }

            var index = $.inArray(fn, ev)
            if (index > -1) {
                return
            }

            if (ev.length == 0) {
                BM.appointment.event.add(eventName, function (data) {
                    var name = data.eventName
                    var evs = getEvent(name)

                    var sysEvent = sysEvents[name]

                    if (sysEvent) {
                        sysEvent(data)
                    } else {
                        $.each(evs, function (_, ev) {
                            ev(data)
                        })
                    }
                })
            }

            ev.push(fn)
        }

        /**
         * 移除订阅事件
         * @method off
         * @param {string} eventName 事件的名称.
         * @param {Function} fn 事件之前的触发的函数
         */
        this.off = function (eventName, fn) {
            var ev = getEvent(eventName)

            if (!$.isFunction(fn)) {
                return
            }

            var index = $.inArray(fn, ev)
            if (index == -1) {
                return
            }

            ev.splice(index, 1)

            if (ev.length == 0) {
                BM.appointment.event.remove(eventName)
            }
        }

        /**
         * 触发自定义事件
         * @method fire
         * @param {string} eventName 要触发事件的名称.
         * @param {JSON} [data] 触发事件的参数 JSONString.
         * @param {string} [context=openview] 触发事件的范围, 可选值. current = 当前view, openview = 打开的view
         */
        this.fire = function (eventName, data, context) {
            BM.appointment.event.fire(eventName, data, context)
        }

        function getEvent (name) {
            var event = events[name]

            if (event) {
                return event
            }

            events[name] = []

            return getEvent(name)
        }

        var sysEvents = {
            viewBeforeBack: function () {
                var name = "viewBeforeBack"
                var evs = getEvent(name)
                var isCanBack = true

                $.each(evs, function (_, ev) {
                    var result = ev()
                    if (result === false) {
                        isCanBack = false
                    }
                })

                if (isCanBack) {
                    BM.appointment.webview.back(true)
                }
            }
        }
    }

    var document = new Document()

    appointment.document = document
})();

(function () {
    var appointment = BM.appointment

    var serviceName = "event"

    function Event () {
        this.add = function (eventName, callback) {
            BM.webBridge.native.execute(serviceName, "add", { eventName: eventName }, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        this.remove = function (eventName, callback) {
            BM.webBridge.native.execute(serviceName, "remove", { eventName: eventName }, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        /**
         * 触发自定义事件
         * @method fire
         * @param {string} eventName 要触发事件的名称.
         * @param {JSON} [data] 触发事件的参数 JSONString.
         * @param {string} [context=openview] 触发事件的范围, 可选值. current = 当前view, openview = 打开的view
         */
        this.fire = function (eventName, data, context) {
            var dataString = data ? JSON.stringify(data) : ""
            context = context || "openview"

            BM.webBridge.native.execute(serviceName, "fire", { eventName: eventName, data: dataString, context: context }, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }
    }

    appointment.event = new Event()
})();

(function () {
    var appointment = BM.appointment

    /**
      * 文件
      * @class file
      * @module BM.appointment
      */
    var serviceName = "file"

    function File () {
        var that = this

        /**
         * 获取文件
         * @method getFiles
         * @param {Number} [maxTotal=0] 选择的最大数量（0为不限制）
         * @param {Function} callback 获取成功后的回调函数
         * @param {Array} callback.data 获取的数据
         * @param {string} callback.data.fileURI 文件的磁盘物理地址
         * @param {string} callback.data.fileSize 文件的文件字节大小
         */
        this.getFiles = function (maxTotal, callback) {
            BM.webBridge.native.execute(serviceName, "getFiles", { maxTotal: maxTotal }, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        /**
          * 上传一个文件
          * @method uploadFile
          * @param {String} fileURI 文件的磁盘物理地址
          * @param {String} uploadURL 上传服务器地址
          * @param {Function} callback 获取成功后的回调函数
          * @param {JSON} callback.data 获取的数据
          * @param {Number} callback.data.state 上传的状态 0 准备, 1 上传中, 2 成功, 3 失败， 4 超时
          * @param {double} callback.data.progressPercentage 上传进度 1为100%
          * @param {string} callback.data.code 上传的code
          * @param {string} callback.data.message 上传的完成后返回的文本
          * @param {string} callback.data.result 上传的完成后服务端返回的数据
          */
        this.uploadFile = function (fileURI, uploadURL, callback) {
            BM.webBridge.native.execute(serviceName, "uploadFile", { fileURI: fileURI, uploadURL: uploadURL },
                function (data) {
                    if (callback) {
                        callback(data)
                    }
                })
        }

        /**
          * 下载文件
          * 将文件下载到当前用户的指定目录中，并打开文件
          * @method download
          * @param {JSON} options 文件下载参数
          * @param {String} options.downloadURL 文件下载地址
          * @param {String} options.fileName 文件名（包含扩展名）
          * @param {String} [options.categoryCode] 文件的分类Code
          * @param {Object} [options.extendData] 文件关联的扩展数据（特殊需求使用）
          * @param {String} [options.id] 文件的唯一ID
          * @param {Boolean} [options.isFinishedOpen=true] 下载完成后是否打开文件
          * @param {Function} callback 下载的回调函数
          * @param {JSON} callback.data 下载的回调的数据
          * @param {Number} callback.data.state 下载的状态 0 准备, 1 上传中, 2 成功, 3 失败， 4 超时
          * @param {double} callback.data.progressPercentage 下载进度 1为100%
          * @param {string} callback.data.code 下载的code
          * @param {string} callback.data.message 下载的完成后返回的文本
          * @param {string} callback.data.result 下载的完成后服务端返回的数据
          */

        /**
          * 下载文件
          * 将文件下载到当前用户的指定目录中，并打开文件
          * @method download
          * @param {String} downloadURL 文件下载地址
          * @param {String} fileName 文件名（包含扩展名）
          * @param {String} [categoryCode] 文件的分类Code
          * @param {Object} [extendData] 文件关联的扩展数据（特殊需求使用）
          * @param {Function} callback 下载的回调函数
          * @param {JSON} callback.data 下载的回调的数据
          * @param {Number} callback.data.state 下载的状态 0 准备, 1 上传中, 2 成功, 3 失败， 4 超时
          * @param {double} callback.data.progressPercentage 下载进度 1为100%
          * @param {string} callback.data.code 下载的code
          * @param {string} callback.data.message 下载的完成后返回的文本
          * @param {string} callback.data.result 下载的完成后服务端返回的数据
          */
        this.download = function (downloadURL, fileName, categoryCode, extendData, callback) {
            if (!downloadURL) {
                return
            }

            var config = {
                id: null,
                downloadURL: null,
                fileName: null,
                categoryCode: null,
                extendData: null,
                isFinishedOpen: true
            }

            var cb

            if ($.type(arguments[0]) !== "string") {
                config = $.extend(true, {}, config, arguments[0])
                if (arguments.length > 1) {
                    cb = arguments[1]
                }
            } else {
                config.downloadURL = downloadURL
                config.fileName = fileName
                config.categoryCode = categoryCode
                config.extendData = extendData
                cb = callback
            }

            if (config.id) {
                that.exists(config.id, function (isExists) {
                    if (isExists) {
                        if (config.isFinishedOpen) {
                            that.open(config.id)
                        } else {
                            cb({ state: 6 })
                        }
                    } else {
                        downloadFile(config, cb)
                    }
                })
            } else {
                downloadFile(config, cb)
            }
        }

        function downloadFile (config, callback) {
            BM.webBridge.native.execute(serviceName, "download", config,
                function (data) {
                    if (callback) {
                        callback(data)
                    }
                })
        }

        /**
         * 查询文件是否存在
         * @method exists
         * @param {String} id 文件的ID
         * @param {Function} callback 查询后的回调函数
         * @param {Boolean} callback.result 查询的结果
         */
        this.exists = function (id, callback) {
            BM.webBridge.native.execute(serviceName, "exists", { id: id }, appointment.getCommonCallback(callback))
        }
        /**
         * 根据文件ID打开文件
         * @method open
         * @param {String} id 文件的ID
         */
        this.open = function (id) {
            BM.webBridge.native.execute(serviceName, "open", { id: id })
        }

        /**
         * 获取本地图片文件内容
         * @method getLocalImgData
         * @param {string} imgURI 本地图片URI
         * @param {Function} callback 查询后的回调函数
         * @param {Boolean} callback.uri 本地图片URI
         * @param {Boolean} callback.size 图片的大小
         * @param {Boolean} callback.uri 图片的名称
         * @param {Boolean} callback.uri 图片的base64格式，可直接放到img src属性中
         * @exception 如果imgURI不是一个图片文件，则返回异常代码501
         */
        this.getLocalImgData = function (imgURI, callback) {
            BM.webBridge.native.execute(serviceName, "getLocalImgData", { imgURI: imgURI }, appointment.getCommonCallback(callback))
        }

        this.query = function (categoryCode, callback) {
            BM.webBridge.native.execute(serviceName, "query", { categoryCode: categoryCode },
                function (data) {
                    if (callback) {
                        callback(data)
                    }
                })
        }

        /**
         * 根据文件本地路径打开文件
         * @method show
         * @param {String} localPath 文件的路径
         */
        this.show = function (localPath, callback) {
            BM.webBridge.native.execute(serviceName, "show", { localPath: localPath },
                function (data) {
                    if (callback) {
                        callback(data)
                    }
                })
        }

        /**
          * 删除本地文件
          * @method remove
          * @param {String} id 文件id
          * @param {Function} callback 删除后的回调函数
          */
        this.remove = function (id, callback) {
            BM.webBridge.native.execute(serviceName, "remove", { id: id },
                function (data) {
                    if (callback) {
                        callback(data)
                    }
                })
        }
    }

    appointment.file = new File()
})();

(function () {
    var appointment = BM.appointment

    var serviceName = "screen"

    /**
      * 屏幕类操作集合
      * @class screen
      * @module BM.appointment
      */

    function Screen () {
        /**
		 * 设置屏幕方向
		 * @method setOrientation
		 * @param {string} orientation 屏幕方向, 值可选。
		 *							    default=恢复全局配置的值；
		 *							    unspecified=由系统来判断显示方向.判定的策略是和设备相关的，所以不同的设备会有不同的显示方向；
		 *							    portrait=竖屏正方向或反方向，根据设备重力感应器自动调整；
		 *								portrait-primary = 竖屏正方向；
		 *								portrait-secondary = 竖屏反方向，屏幕正方向按顺时针旋转180°；
		 *								landscape = 横屏正方向或反方向，根据设备重力感应器自动调整；
		 *								landscape-primary =  横屏正方向，屏幕正方向按顺时针旋转90°；
		 *								landscape-secondary = 横屏反方向，屏幕正方向按顺时针旋转270°；
		 * @param {boolean} [isEffectApp=false] 是否影响整个APP，false只影响当前页面
		 */
        this.setOrientation = function (orientation, isEffectApp) {
            BM.webBridge.native.execute(serviceName, "setOrientation", { orientation: orientation, isEffectApp: isEffectApp })
        }
    };

    appointment.screen = new Screen()
})();

(function () {
    var appointment = BM.appointment

    var serviceName = "selectView"

    /**
     * 选择视图
     * @class selectedView
     * @module BM.appointment
     */
    function SelectView () {
        /**
         * 显示选择视图
         * @method show
         * @param {JSON} options 选项
         * @param {Number} options.totalCount 总共能选择的数量
         * @param {String} [options.direction=left]  方向,可选的值有left,right. 默认为left
         */
        this.show = function (options) {
            var options = $.extend(true, {}, {
                direction: "left",
                totalCount: 0
            }, options)

            BM.webBridge.native.execute(serviceName, "show",
                {
                    totalCount: options.totalCount,
                    direction: options.direction
                },
                function (data) {

                })
        }

        /**
         * 注册执行事件处理器，一直执行，知道遇到unRegisterEventHandler才注销事件
         * @method registerEventHandler
         * @param {Function} callback 事件的回调函数
         */
        this.registerEventHandler = function (callback) {
            BM.webBridge.native.execute(serviceName, "registerEventHandler", {}, appointment.getCommonCallback(callback))
        }
        /**
         * 注销执行事件的处理器
         * @method unRegisterEventHandler
         */
        this.unRegisterEventHandler = function () {
            BM.webBridge.native.execute(serviceName, "unRegisterEventHandler", {})
        }
        /*
         * 设置已选择的数量. 当selectedCount == totalCount 的值，"全选"按钮会变成"取消全选"按钮，当selectedCount < totalCount "取消全选"按钮会变成"全选"按钮
         * @method setSelectedCount
         * @param {Number} count 数量
         */
        this.setSelectedCount = function (count) {
            BM.webBridge.native.execute(serviceName, "setSelectedCount", { count: count })
        }
        /**
         * 设置总共能选择的数量，当变更数量时，当selectedCount == totalCount 的值，"全选"按钮会变成"取消全选"按钮，当selectedCount < totalCount "取消全选"按钮会变成"全选"按钮
         * @method setTotalCount
         * @param {Number} count 总数量
         */
        this.setTotalCount = function (count) {
            BM.webBridge.native.execute(serviceName, "setTotalCount", { count: count })
        }

        /**
         * 关闭选择视图
         * @method close
         * @param {String} code 关闭的动作，两个值ok=确认关闭,cancel=取消关闭
         * @param {JSON} data 关闭的数据
         */
        this.close = function (code, data) {
            var dataStr = JSON.stringify(data)
            BM.webBridge.native.execute(serviceName, "close", { code: code, data: dataStr })
        }
    };

    appointment.selectView = new SelectView()
})();

(function () {
    var appointment = BM.appointment

    var serviceName = "system"

    /**
      * 系统类操作集合
      * @class system
      * @module BM.appointment
      */

    function System () {
        /**
          * 登录
          * @method signOn
          * @param {String} account 用户名
          * @param {JSON} data 登录存储的附加数据
		  * @param {Function} callback 回调函数
          */
        this.signOn = function (account, data, callback) {
            var dataString = data ? JSON.stringify(data) : ""
            BM.webBridge.native.execute(serviceName, "signOn",
                {
                    account: account,
                    data: dataString
                },
                BM.appointment.getCommonCallback(callback)
            )
        }

        /*
         * 注销
         * @method signOut
         * @param {Boolean} [isClearData=false] 是否清除用户数据
         */
        this.signOut = function (isClearData) {
            BM.webBridge.native.execute(serviceName, "signOut", { isClearData: isClearData || false }, function (data) {

            })
        }

        /**
          * 登录
          * @method login
          * @param {String} account 用户名
          * @param {JSON} data 登录存储的附加数据
          * @param {JSON} keepStateData 保持登录状态的数据
          * @param {Function} callback 回调函数
          */
        this.login = function (account, data, keepStateData, callback) {
            var dataString = data ? JSON.stringify(data) : ""
            var keepStateDataString = keepStateData ? JSON.stringify(keepStateData) : ""

            BM.webBridge.native.execute(serviceName, "login",
                {
                    account: account,
                    data: dataString,
                    keepStateData: keepStateDataString
                },
                BM.appointment.getCommonCallback(callback)
            )
        }

        /**
         * 注销
         * @method logout
         * @param {Boolean} [isClearData=false] 是否清除用户数据
         * @param {Function} callback 回调函数
         */
        this.logout = function (isClearData, callback) {
            BM.webBridge.native.execute(serviceName, "logout", { isClearData: isClearData || false }, BM.appointment.getCommonCallback(callback))
        }

        /**
          * 获取当前用户
          * @method getUser
          * @param {Function} callback 完成后的回调事件
          * @param {JSON} callback.data callback事件的第一个数据
          * @param {string} callback.data.account 当前用户名
          * @param {JSON} callback.data.data 登录存储的附加数据
          */
        this.getUser = function (callback) {
            BM.webBridge.native.execute(serviceName, "getUser",
                {
                },
                function (data) {
                    if (!callback) {
                        return
                    }
                    var userData = (data.data ? JSON.parse(data.data) : null)
                    var result = {
                        account: data.account,
                        data: userData
                    }

                    callback(result)
                }
            )
        }

        /**
         * 获取启动锁
         * @method getStartuplock
         * @param {Function} callback 完成后的回调事件
         * @param {JSON} callback.data callback事件的第一个数据
         * @param {boolean} callback.data.enabled 是否启用
         * @param {int} callback.data.timeout 超时时间（单位为秒
         * @example
         *
         *      BM.appointment.system.getStartuplock(function(data){
         *          if(data.enabled){
         *              alert("当前已开启手势锁")
         *          }else{
         *              alert("当前没有开启手势锁")
         *          }
         *      });
         */
        this.getStartuplock = function (callback) {
            BM.webBridge.native.execute(serviceName, "getStartuplock", {}, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        /**
         * 是否启用启动锁
         * @method enabledStartupLock
         * @param {boolean} enabled 是否启用
         * @param {int} timeout 超时时间（单位为秒）
         * @param {Function} callback 完成后的回调事件
         * @param {JSON} callback.data callback事件的第一个数据
         * @param {string} callback.data.isSuccess 操作是否成功
         * @example
         *
         *      BM.appointment.system.enabledStartupLock(true, 3000, function(data){
         *          if(data.isSuccess){
         *              alert("设置成功");
         *          }else{
         *              alert("设置失败");
         *          }
         *      });
         */
        this.enabledStartupLock = function (enabled, timeout, callback) {
            BM.webBridge.native.execute(serviceName, "enabledStartupLock", { enabled: enabled, timeout: timeout }, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        /**
		 * 使用浏览器打开外部链接
		 * @method openUrl
		 * @param {string} url 外部链接地址
		 */
        this.openUrl = function (url) {
            BM.webBridge.native.execute(serviceName, "openUrl", {
                url: url
            })
        }

        /**
         * 退出应用
         * @method quit
         */
        this.quit = function () {
            BM.webBridge.native.execute(serviceName, "quit", {})
        }

        /**
         * 系统提示
         * @method toast
         * @param {string} text 提示才文本
         * @param {int} displayTime 显示的时间（单位毫秒）
         */
        this.toast = function (text, displayTime) {
            BM.webBridge.native.execute(serviceName, "toast", { text: text, displayTime: displayTime })
        }

        /**
         * 打电话
         * @method makePhoneCall
         * @param {string} phoneNumber 电话号码
         */
        this.makePhoneCall = function (phoneNumber) {
            BM.webBridge.native.execute(serviceName, "makePhoneCall", { phoneNumber: phoneNumber })
        }

        /**
         * 启动其它应用
         * @method startApp
         * @param {string} appName 应用名称
         */
        this.startApp = function (appName) {
            BM.webBridge.native.execute(serviceName, "startApp", { appName: appName })
        }
    }

    appointment.system = new System()
})();

(function () {
    var appointment = BM.appointment

    /**
      * 系统类操作集合
      * @class webview
      * @module BM.appointment
      *
      */
    var serviceName = "webview"

    var toAbsURL = function (url) {
        var a = document.createElement("a")
        a.href = url
        return a.href
    }

    function WebView () {
        if (!BM._popupWindowStack) {
            BM._popupWindowStack = []
        }

        /**
         * 打开一个新的view，此方法和navigate方法效果一样
         * @method open
         * @param {String} url view中的URL地址为
         * @param {String} [direction] 打开Url的窗口的动画. 此参数暂时设置无效果
         * @param {Boolean} [true] isNeedProgressBar 是否需要显示进度条
         * @param {Boolean} [true] isNeedTitle 是否需要标题
         */
        this.open = function (url, direction, isNeedProgressBar, isNeedTitle) {
            this.navigate(url, direction, isNeedProgressBar, isNeedTitle)
        }

        /**
         * 打开一个新的view
         * @method navigate
         * @param {String} url view中的URL地址为
         * @param {String} [direction] 打开Url的窗口的动画. 此参数暂时设置无效果
         * @param {Boolean} [true] isNeedProgressBar 是否需要显示进度条
         * @param {Boolean} [true] isNeedTitle 是否需要标题
         */
        this.navigate = function (url, direction, isNeedProgressBar, isNeedTitle) {
            url = toAbsURL(url)
            if (!url) {
                alert("url 为null")
            }
            BM.webBridge.native.execute(serviceName, "open", { url: url, direction: direction, isNeedProgressBar: isNeedProgressBar, isNeedTitle: isNeedTitle })
        }

        var popups = {}

        this.findPopup = function (id) {
            var popup = popups[id]
            if (popup) {
                return popup
            }
        }

        /**
         * 弹出一个页，并能够在关闭的时候接受回调函数
         * @method popup
         * @param {JSON} options 选项
         * @param {JSON} options.url 打开的url
         * @param {String} [options.id] 窗口ID
         * @param {Boolean} [options.isNeedProgressBar] 是否需要显示进度条url
		 * @param {Boolean} [options.isNeedTitle] 是否需要显示标题栏
         * @param {JSON} [options.data] 传递给打开页面的数据，此数据可以用getRequestData方法获取到
         * @param {Function} [options.onClose] 关闭的回调事件
		 * @param {JSON} [titleBar] 标题栏
		 * @param {Boolean} [titleBar.show] 标题栏是否显示
		 * @param {String} [titleBar.color] 标题栏字体颜色
		 * @param {String} [titleBar.backgroundColor] 标题栏背景色
		 * @param {Boolean} [titleBar.shadowEnabled] 标题栏阴影
		 * @param {JSON} [immersiveStatusBar] 状态栏
		 * @param {Boolean} [immersiveStatusBar.enabled] 状态栏是否启用 false:启用，true:不启用
		 * @param {String} [immersiveStatusBar.style] 状态栏字体颜色默认白色，style:'dark'设置黑色
		 * @param {String} [immersiveStatusBar.backgroundColor] 状态栏背景颜色
		 * @param {Boolean} [immersiveStatusBar.allowTransparency] 状态栏是否允许透明
         */
        this.popup = function (options) {
            var config = $.extend(true, {
                id: "",
                url: "",
                title: "",
                isNeedProgressBar: true,
                isNeedTitle: true,
                titleBar: {
                    show: false,
                    color: "#FFFFFF",
                    backgroundColor: "#3492E9",
                    shadowEnabled: false
                },
                immersiveStatusBar: {
                    enabled: false,
                    style: "default",
                    backgroundColor: "#3492E9",
                    allowTransparency: false
                },
                onClose: function () {

                },
                data: {}
            }, options, {})

            config.url = toAbsURL(options.url)

            BM.webBridge.native.execute(serviceName, "popup", {
                url: config.url,
                title: config.title,
                data: JSON.stringify(config.data),
                isNeedProgressBar: config.isNeedProgressBar,
                isNeedTitle: config.isNeedTitle,
                titleBar: {
                    show: config.titleBar.show,
                    color: config.titleBar.color,
                    backgroundColor: config.titleBar.backgroundColor,
                    shadowEnabled: config.titleBar.shadowEnabled
                },
                immersiveStatusBar: {
                    enabled: config.immersiveStatusBar.enabled,
                    style: config.immersiveStatusBar.style,
                    backgroundColor: config.immersiveStatusBar.backgroundColor,
                    allowTransparency: config.immersiveStatusBar.allowTransparency
                }
            }, function (data) {
                if (config.onClose) {
                    config.onClose(data)
                }
            })
        }

        /**
         * 页面后退
         * @method back
         * @param {boolean} [isImmediate = false] 是否立即后退，如果是，则不触发viewBeforeBack事件
         */
        this.back = function (isImmediate) {
            BM.webBridge.native.execute(serviceName, "back", { isImmediate: isImmediate === true })
        }

        /**
         * 关闭一个页, 对于open方法
         * @method close
         */
        this.close = function () {
            BM.webBridge.native.execute(serviceName, "close")
        }

        /**
         * 关闭 Propup 页，对应popup方法
         * @method closePopup
         * @param {object} data 传递给打开Popup的方法
         */
        this.closePopup = function (data) {
            BM.webBridge.native.execute(serviceName, "closePopup", { data: data })
        }

        /**
         * 设置当前窗口的按钮
         * @method setViewButton
         * @param {string} buttonCode 按钮代号    [默认三种: back => 后退 点击为后退.  home => 点击为跳到首页 . none => 去掉图标. 并且点击返回键也不能有任何响应]
         */
        this.setViewButton = function (buttonCode) {
            BM.webBridge.native.execute(serviceName, "setViewButton", { buttonCode: buttonCode })
        }

        /**
         * 跳转到登录主界面
         * @method goHome
         */
        this.goHome = function () {
            BM.webBridge.native.execute(serviceName, "goHome")
        }

        /**
         * 跳转到登录界面
         * @method goLoginView
         */
        this.goLoginView = function () {
            BM.webBridge.native.execute(serviceName, "goLoginView")
        }

        /**
         * 设置当前页面的标题
         * @method setTitle
         * @param {String} title 标题
         */
        this.setTitle = function (title) {
            BM.webBridge.native.execute(serviceName, "setTitle", { title: title })
        }

        /**
         * 禁用刷新选项
         * @method disabledRefresh
         * @param {Boolean} disabled 是否禁用
         */
        this.disabledRefresh = function (disabled) {
            BM.webBridge.native.execute(serviceName, "disabledRefresh", { disabled: disabled })
        }

        /**
         * 添加字体Toolbar
         * @method addFontToolbar
         * @param {String} id 按钮的ID，唯一
         * @param {String} fontFamily 哪种字体
         * @param {String} fontName 字的名称
         * @param {Function} callback 按钮被点击后响应的事件
         */
        this.addFontToolbar = function (id, fontFamily, fontName, callback) {
            BM.webBridge.native.execute(serviceName, "addFontToolbar",
                { id: id, fontFamily: fontFamily, fontName: fontName }, function (data) {
                    if (callback) {
                        callback(data)
                    }
                })
        }

        /**
         * 删除Toolbar
         * @method deleteToolbar
         * @param {String} id 按钮的ID，唯一
         */
        this.deleteToolbar = function (id) {
            BM.webBridge.native.execute(serviceName, "deleteToolbar", { id: id })
        }

        /**
         * 禁用Toolbar
         * @method disabledToolbar
         * @param {String} id 按钮的ID，唯一
         * @param {Boolean} disabled 是否禁用
         */
        this.disabledToolbar = function (id, disabled) {
            BM.webBridge.native.execute(serviceName, "disabledToolbar", { id: id, disabled: disabled })
        }

        /**
         * 添加文本Toolbar
         * @method addTextToolbar
         * @param {String} id 按钮的ID，唯一
         * @param {String} text 按钮的文字
         * @param {Function} callback 按钮被点击后响应的事件
         */
        this.addTextToolbar = function (id, text, callback) {
            BM.webBridge.native.execute(serviceName, "addTextToolbar", { id: id, text: text }, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        /**
         * 更改文本Toolbar的文字
         * @method changeTextToolbar
         * @param {String} id 按钮的ID，唯一
         * @param {String} text 按钮的文字
         */
        this.changeTextToolbar = function (id, text) {
            BM.webBridge.native.execute(serviceName, "changeTextToolbar", { id: id, text: text })
        }

        /**
         * 获取请求的数据
         * @method getRequestData
         * @param {Function} callback 获取到后通知的事件
         * @param {JSON} callback.data 获取到的数据
         */
        this.getRequestData = function (callback) {
            BM.webBridge.native.execute(serviceName, "getRequestData", {}, function (data) {
                if (callback) {
                    callback(JSON.parse(data.data))
                }
            })
        }

        /**
         * 设置是否启用WebView的历史功能，可以后退WebView里面的页面
         * @method setHistroyEnabled
         * @param {Boolean} [false] enabled 是否开启
         */
        this.setHistroyEnabled = function (enabled, callback) {
            BM.webBridge.native.execute(serviceName, "setHistroyEnabled", { enabled: enabled }, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        /**
         * 设置是否禁用WebView的后退功能
         * @method setHistroyBackDisabled
         * @param {Boolean} [false] disabled 是否禁用
         */
        this.setHistroyBackDisabled = function (disabled, callback) {
            BM.webBridge.native.execute(serviceName, "setHistroyBackDisabled", { disabled: disabled }, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        this.addTextViewButton = function (id, text, callback) {
            BM.webBridge.native.execute(serviceName, "addTextViewButton", { id: id, text: text }, function (data) {
                if (callback) {
                    callback(data)
                }
            })
        }

        this.deleteViewButton = function (id) {
            BM.webBridge.native.execute(serviceName, "deleteViewButton", { id: id })
        }

        /**
         * 设置当前标题栏是否可见
         * @method setTitleBarVisible
         * @param {Boolean} isVisible 是否可见
         */
        this.setTitleBarVisible = function (isVisible) {
            BM.webBridge.native.execute(serviceName, "setTitleBarVisible", { isVisible: isVisible })
        }

        /**
         * 设置当前是否启用沉浸式状态栏
         * @method enabledImmersiveStatusBar
         * @param {Boolean} enabled 是否启用
         */
        this.enabledImmersiveStatusBar = function (enabled) {
            BM.webBridge.native.execute(serviceName, "enabledImmersiveStatusBar", { enabled: enabled })
        }

        /**
         * 设置当前页面是否启用油滑关闭功能
         * @method enabledSwipeBack
         * @param {boolean} enabled 是否启用
         */
        this.enabledSwipeBack = function (enabled) {
            BM.webBridge.native.execute(serviceName, "enabledSwipeBack", { enabled: enabled })
        }

        /**
         * 设置当前窗体最小化，仅PC可用
         * @method minimize
         */
        this.minimize = function () {
            BM.webBridge.native.execute(serviceName, "minimize")
        }
    }

    function PopupView (options) {
        var that = this
        this.remoteID = ""
        this.url = options.url
        this.title = options.title
        this.options = options
        this.onDestroy = null

        this.show = function () {
            BM.webBridge.native.execute(serviceName, "popup", { url: this.url, title: this.title }, function (data) {
                that.remoteID = data.id
            })
        }

        this.ok = function (data) {
            if (that.options.onOk) {
                that.options.onOk(data)
            }

            this.close()
        }

        this.close = function () {
            BM.webBridge.native.execute(serviceName, "close", { id: this.remoteID }, function (data) {
                if (that.options.onClose) {
                    that.options.onClose()
                }

                that.destroy()
            })
        }

        this.destroy = function () {
            if (this.onDestroy) {
                this.onDestroy()
            }
        }
    }

    appointment.webview = new WebView()
})();

(function () {
    var ERRORS = {
        1: "系统异常",
        100: "定位异常",
        101: "获取定位失败",
        102: "没有开启定位功能",
        501: "传入文件地址的不是一个图片文件",
        9990: "不支持该功能",
        9999: "系统异常"
    }

    function errorHandle (args) {
        var error_message = ERRORS[args.code] || args.message
        if (error_message) {
            alert(error_message)
        }
    }

    function beforeHandle (args) {
        var flag = (args.Flag || args.flag)
        if (!flag || flag == 0) {
            errorHandle(args)
            return false
        }

        return true
    }

    var webBridge = new function () {
        var identity = 1

        var handles = {}

        /**
         * IOS和android 回调方法
         * @method callback
         * @param {String} id 回调方法的id
         * @param {String} args参数，为json字符串
         * @param {Boolean} destroyCallback为是否释放该callback，不传时默认为true
         */
        this.callback = function (id, args, destroyCallback) {
            try {
                BM.log("callbackID:" + id + ", args:" + args)
                var arg = args

                if (typeof (args) === "string") {
                    arg = JSON.parse(args)
                }

                if (beforeHandle(arg)) {
                    if (!id) {
                        return
                    }
                    BM.log("CallBackID:" + id)

                    var handle = handles[id]

                    if (!handle) {
                        BM.log("回调函数不存在:" + id)
                        return
                    }

                    handle(arg.data)
                }
                destroyCallback = (typeof destroyCallback === "undefined") ? true : destroyCallback
                if (destroyCallback) {
                    this.destroyCallback(id)
                }
            } catch (e) {
                alert(e)
            }
        }

        /*
         * 注册回调事件
         * @method registerCallback
         * @returns {String} ID
         */
        this.registerCallback = function (handle) {
            if (!handle) {
                return
            }
            var id = "webBridgeCallback" + (identity++)
            BM.log("注册回调函数:" + id)
            handles[id] = handle

            return id
        }

        /*
         * 释放回调事件
         */
        this.destroyCallback = function (callbackId) {
            delete handles[callbackId]
        }

        /*
         * 将普通数据转换为协议数据
         * @data {Object} 返回数据
         * @flag {Boolean} 是否成功
         * @code {int} 响应编号
         * @message {String} 消息
         */
        this.interfaceData = function (data, flag, code, message) {
            flag = (flag === undefined) ? true : flag
            var response = {
                flag: flag ? 1 : 0,
                message: message || "",
                code: code || 0,
                data: data || {}
            }
            return JSON.stringify(response)
        }

        this.exception = {
            systemExcetpion: this.interfaceData({}, 0, 9999),
            positionExcetpion: this.interfaceData({}, 0, 100),
            positionFailed: this.interfaceData({}, 0, 101),
            positionTurnOff: this.interfaceData({}, 0, 102),
            unsupportException: this.interfaceData({}, 0, 9990)
        }
    }()

    BM.webBridge = webBridge
})();

(function () {
    var webBridge = BM.webBridge

    var native = function () {
        this.execute = function (service, action, args, handle) {
            var callbackID = webBridge.registerCallback(handle)

            var arg = JSON.stringify(args)

            BM.log("service:" + service + ", action:" + action + ", args:" + arg + ", callbackID: " + callbackID)
            window._belvolyNative.exec(service, action, callbackID, arg)
        }
    }

    webBridge.native = new native()
})()

var IS_APPENVIRONMENT = false; var IS_APPENVIRONMENT_INIT = false

function isAppEnvironment () {
    if (IS_APPENVIRONMENT_INIT == false) {
        IS_APPENVIRONMENT = window._belvolyNative != null
        IS_APPENVIRONMENT_INIT = true
    }
    return IS_APPENVIRONMENT
}

function isEnvironments (evns) {
    if (!evns || evns.length == 0) {
        return false
    }

    var result = false

    for (var i in evns) {
        if (!evns.hasOwnProperty(i)) {
            continue
        }
        var v = evns[i]
        result = result || isEnvironment(v)
    }

    return result
}

function isEnvironment (envi) {
    switch (envi) {
    case "web":
        return !isAppEnvironment() && !isWeChatEnvironment()
    case "wechat":
        return isWeChatEnvironment()
    case "app":
        return isAppEnvironment()
    default:
        return false
    }
}

function isWeChatEnvironment () {
    return window.BM_WeChat && window.BM_WeChat.ready === true
}

(function () {
    if (isAppEnvironment()) {
        return
    }

    var native = {}

    native.exec = function (service, action, callbackId, args) {
        handle(service, action, args, callbackId)
    }

    var WebBN = window.WebBN = window._belvolyNative = native

    WebBN.Services = {}

    var g_Services = {}
    WebBN.Services.registerService = function (code, type, createServiceFactory) {
        setService(code, type, createServiceFactory || defaultCreateServiceFactory)
    }

    function defaultCreateServiceFactory (type) {
        return new type()
    };

    function getService (code) {
        var service = g_Services[code]
        if (service != null) {
            return service
        }
    }

    function setService (code, type, createServiceFactory) {
        g_Services[code] = {
            type: type,
            createServiceFactory: createServiceFactory
        }
    }

    function handle (serviceCode, action, args, callbackId) {
        var serviceReg = getService(serviceCode)

        if (serviceReg == null) {
            return {
                flag: 0,
                code: 9999
            }
        }

        var service = serviceReg.createServiceFactory(serviceReg.type)

        var method = service[action]
        if (!method) {
            return {
                flag: 0,
                code: 9999
            }
        }
        args = args || "{}"
        var as = JSON.parse(args)

        try {
            if (!(service instanceof ServiceBase)) {
                return method.call(service, callbackId, as)
            } else {
                var context = new ServiceContext()
                context.callbackId = callbackId

                service.context = context

                method.call(service, as)
            }
        } catch (ex) {
            BM.log(ex)
            alert(ex)
        }
    }

    function ServiceResult () {
        this.data = ""
        this.isDestroyCallback = true

        this.toResult = function () {
            return this.data
        }
    }

    function ServiceContext () {
        this.callbackId = null

        this.onContent = function (data, isDestroyCallback) {
            var result = new ServiceResult()
            result.data = data

            if (isDestroyCallback === false) {
                result.isDestroyCallback = isDestroyCallback
            }

            this.onResult(result)
        }

        this.onResult = function (result) {
            var response = {
                flag: 1,
                message: 1,
                code: 0,
                data: result.toResult()
            }

            BM.webBridge.callback(this.callbackId, response, result.isDestroyCallback)
        }
    }

    function ServiceBase () {
    }

    ServiceBase.prototype.init = function () {

    }

    ServiceBase.prototype.empty = function (isDestroyCallback) {
        var result = new ServiceResult()
        if (isDestroyCallback === false) {
            result.isDestroyCallback = isDestroyCallback
        }

        this.context.onResult(result)
    }

    ServiceBase.prototype.content = function (data, isDestroyCallback) {
        this.context.onContent(data, isDestroyCallback)
    }

    WebBN.Services.ServiceBase = ServiceBase
    WebBN.Services.ServiceResult = ServiceResult
})();

(function () {
    if (!isWeChatEnvironment()) {
        return
    }

    WeChatBN = window.WeChatBN = new Object()

    WeChatBN.getConfig = function () {
        return $.extend(true, {}, {
            ready: false,
            fileTransitUrl: null
        }, window.BM_WeChat)
    }

    WeChatBN.getWeChatProxy = function () {
        return top.wx
    }
})()
