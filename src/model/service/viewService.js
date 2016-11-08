"use strict";

const handlebars = require('handlebars')
const fs = require('fs')

const viewsDir = __dirname + '/../../view'
const headerTemplate = fs.readFileSync(viewsDir + '/partials/header.hbs').toString()
const footerTemplate = fs.readFileSync(viewsDir + '/partials/footer.hbs').toString()
const searchbarTemplate = fs.readFileSync(viewsDir + '/partials/searchbar.hbs').toString()


/**
 * Cache n1
 * @type
 */
let memory = {}

const views = {}

/**
 * Get the view cached or not cached
 * @param viewName
 * @param data
 * @return {string}
 */
views.render = (viewName, data) => {
    if (memory[viewName])
        return memory[viewName](data)

    const page = fs.readFileSync(viewsDir + '/' + viewName + '.hbs').toString()
    memory[viewName] = handlebars.compile(page)

    return memory[viewName](data)
}

module.exports = views

/*
|--------------------------------------------------------------------------
| Handlebars configuration
|--------------------------------------------------------------------------
*/
handlebars.registerPartial("header", headerTemplate)
handlebars.registerPartial("footer", footerTemplate)
handlebars.registerPartial("searchbar", searchbarTemplate)

handlebars.registerHelper('limit', function (str, limit) {
    if(str.length > limit) {
        let nstr = str.substring(0, limit)
        return new handlebars.SafeString(nstr + '...');
    }

    return new handlebars.SafeString(str);
});

let disabledLink = 'javascript:void(0)'

handlebars.registerHelper('firstpage', function (path, query, collection) {
    let link = disabledLink
    if(!collection.isFirst())
        link = createPageLink(path, query, 1, collection.limit)
    return new handlebars.SafeString(link);
});

handlebars.registerHelper('lastpage', function (path, query, collection) {
    let link = disabledLink
    if(!collection.isLast())
        link = createPageLink(path, query, collection.getTotalPages(), collection.limit)
    return new handlebars.SafeString(link);
});

handlebars.registerHelper('nextpage', function (path, query, collection) {
    let link = disabledLink
    if(collection.hasNext())
        link = createPageLink(path, query, collection.getNextPageNumber(), collection.limit)

    return new handlebars.SafeString(link);
});

handlebars.registerHelper('previouspage', function (path, query, collection) {
    let link = disabledLink
    if(collection.hasPrevious())
        link = createPageLink(path, query, collection.getPreviousPageNumber(), collection.limit)

    return new handlebars.SafeString(link);
});

function createPageLink(path, query, page, limit) {
    query = encodeURIComponent(query)
    return path + query + "?page=" + page + '&limit=' + limit
}
