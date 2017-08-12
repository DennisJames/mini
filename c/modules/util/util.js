'use strict';

module.exports = {
	/**
	 * 扩展对象
	 */
	extend: function(obj) {
        if (this.type(obj) != 'object') return obj;
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                obj[prop] = source[prop];
            }
        }
        return obj;
    },
    /**
     * 返回对象的类型
     */
    type: function (obj) {
        return /\[object (\w+)\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase()
    },
    /**
     *  获取 query 参数
     */
    queryParse: function(search, spliter) {
        if (!search) return {};

        spliter = spliter || '&';

        var query = search.replace(/^\?/, ''),
            queries = {},
            splits = query ? query.split(spliter) : null;

        if (splits && splits.length > 0) {
            splits.forEach(function(item) {
                item = item.split('=');
                var key = item.splice(0, 1),
                    value = item.join('=');
                queries[key] = value;
            });
        }
        return queries;
    },
    /**
     * 将对象转换成url参数
     */
    queryStringify: function (params, spliter) {
        if (!params) return ''
        return Object.keys(params).map(function (k) {
            return k + '=' + encodeURIComponent(params[k])
        }).join(spliter || '&')
    }
}