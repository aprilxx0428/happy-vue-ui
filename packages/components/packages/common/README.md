select  获取字典项在info页面，可以配置从字典项中获取，或者配置json文件中直接有数据源"dataSource":{"dataList":"[]"}
cascader 获取字典项在cascader，因为要懒加载，并且只支持从字典项中获取,prop是对应数据库的字段名称，model为该控件绑定的v-model值，model不能与prop一样，model必须唯一。控件会把v-model绑定的数组值，根据配置的separator合并为一个以separator分隔的字符串，传入prop字段