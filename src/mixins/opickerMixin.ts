import ConfigManager from '../common/config-manager'
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class OpickerMixin extends Vue {
    initOPicker() {
        this.registerOrgAndUserService()
        this.registerOrgService()
        this.registerUnitService()
        this.registerFolderService()
        this.registerSubjectService()
        this.registerMySubjectService()
    }
    registerOrgAndUserService() {
        B.OPicker.registerService({
            code: 'orguser',
            title: '按部门',
            config: {
                isShowRoot: false,
                rootOrgCode: null,
                cascade: true
            },
            url: `${ConfigManager.get('api.baseURI')}/bua/opicker/orgAndUser`,
            dataFilter: function(item, config, serviceObject, options) {
                if (config.isShowRoot === true) {
                    item.open = true
                }

                if (config.cascade === false || options.selectMode === 1) {
                    if (item.isParent || (item.nodes != null && item.nodes.length > 0)) {
                        item.nocheck = true
                    }
                } else {
                    if (item.isParent) {
                        item.invalidSelectItem = true
                    }
                }

                if (item.id === 'org_region') {
                    item.nocheck = true
                }

                return item
            },
            getUrl: function(config, url) {
                // eslint-disable-next-line
          var url = new B.Url(url || this.url)

                if (config.rootOrgCode) {
                    url.appendKey('rootCode', config.rootOrgCode)
                }
                if (config.isShowRoot === true) {
                    url.appendKey('isIncludeRoot', config.isShowRoot)
                }

                return url.toString()
            }
        })
    }
    registerOrgService() {
        B.OPicker.registerService({
            code: 'org',
            title: '部门',
            config: {
                isShowRoot: false,
                rootOrgCode: null
            },
            url: `${ConfigManager.get('api.baseURI')}/bua/opicker/org`,
            showIcon: function() {
                return false
            },
            dataFilter: function(item, config) {
                if (config.isShowRoot === true) {
                    item.open = true
                }

                return item
            },
            getUrl: function(config, url) {
                // eslint-disable-next-line
          var url = new B.Url(url || this.url)

                if (config.rootOrgCode) {
                    url.appendKey('rootCode', config.rootOrgCode)
                }
                if (config.isShowRoot === true) {
                    url.appendKey('isIncludeRoot', config.isShowRoot)
                }

                return url.toString()
            }
        })
    }
    registerUnitService() {
        B.OPicker.registerService({
            code: 'unit',
            title: '单位',
            config: {
                isShowRoot: false,
                rootOrgCode: null
            },
            url: `${ConfigManager.get('api.baseURI')}/bua/opicker/unit`,
            showIcon: function() {
                return false
            },
            dataFilter: function(item, config) {
                if (config.isShowRoot === true) {
                    item.open = true
                }

                return item
            },
            getUrl: function(config, url) {
                // eslint-disable-next-line
          var url = new B.Url(url || this.url)

                if (config.rootOrgCode) {
                    url.appendKey('rootCode', config.rootOrgCode)
                }
                if (config.isShowRoot === true) {
                    url.appendKey('isIncludeRoot', config.isShowRoot)
                }

                return url.toString()
            }
        })
    }
    registerFolderService() {
        B.OPicker.registerService({
            code: 'knowledge-folder',
            title: '目录',
            config: {
                isShowRoot: true,
                rootId: null
            },
            url: `${ConfigManager.get('api.baseURI')}/knowledge/folder/folders`,
            showIcon: function() {
                return false
            },
            dataFilter: function(item, config) {
                if (config.isShowRoot === true) {
                    item.open = true
                }

                return item
            },
            getUrl: function(config, url) {
                // eslint-disable-next-line
          var url = new B.Url(url || this.url)
                if (config.rootId) {
                    url.appendKey('rootId', config.rootId)
                }
                if (config.isShowRoot === true) {
                    url.appendKey('isIncludeRoot', config.isShowRoot)
                }

                return url.toString()
            }
        })
    }
    registerSubjectService() {
        B.OPicker.registerService({
            code: 'cms-subject',
            title: '栏目',
            config: {
                isShowRoot: true,
                rootId: null
            },
            url: `${ConfigManager.get('api.baseURI')}/cms/subject/subjects`,
            showIcon: function() {
                return false
            },
            dataFilter: function(item, config) {
                if (config.isShowRoot === true) {
                    item.open = true
                }

                return item
            },
            getUrl: function(config, url) {
                // eslint-disable-next-line
          var url = new B.Url(url || this.url)
                if (config.rootId) {
                    url.appendKey('rootId', config.rootId)
                }
                if (config.isShowRoot === true) {
                    url.appendKey('isIncludeRoot', config.isShowRoot)
                }

                return url.toString()
            }
        })
    }
    registerMySubjectService() {
        B.OPicker.registerService({
            code: 'cms-mySubject',
            title: '栏目',
            config: {
                id: null,
                isShowRoot: true,
                rootId: null,
                userUid: null
            },
            url: `${ConfigManager.get('api.baseURI')}/cms/subject/mySubjects`,
            showIcon: function() {
                return false
            },
            dataFilter: function(item, config) {
                if (config.isShowRoot === true) {
                    item.open = true
                }

                return item
            },
            getUrl: function(config, url) {
                // eslint-disable-next-line
          var url = new B.Url(url || this.url)
                if (config.rootId) {
                    url.appendKey('rootId', config.rootId)
                }
                if (config.isShowRoot === true) {
                    url.appendKey('isIncludeRoot', config.isShowRoot)
                }
                if (config.userUid) {
                    url.appendKey('userUid', config.userUid)
                }
                if (config.id) {
                    url.appendKey('id', config.id)
                }

                return url.toString()
            }
        })
    }
}
