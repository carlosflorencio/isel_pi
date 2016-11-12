"use strict";

const handlebars = require('handlebars')
const fs = require('fs')

const viewsDir = __dirname + '/../../view'
const headerTemplate = fs.readFileSync(viewsDir + '/partials/header.hbs').toString()
const footerTemplate = fs.readFileSync(viewsDir + '/partials/footer.hbs').toString()
const searchbarTemplate = fs.readFileSync(viewsDir + '/partials/searchbar.hbs').toString()
const paginationTemplate = fs.readFileSync(viewsDir + '/partials/paginate.hbs').toString()


const cachedViews = {}

const views = {}

/**
 * Get the view
 * The first time is loaded from disk
 * After that will be saved in memory
 *
 * @param viewName
 * @param data
 * @param cb
 * @return {string}
 */
views.render = (viewName, data, cb) => {
    if (cachedViews[viewName])
        return cb(null, cachedViews[viewName](data))

    fs.readFile(viewsDir + '/' + viewName + '.hbs', (err, page) => {
        if(err){
            return cb(err)
        }

        cachedViews[viewName] = handlebars.compile(page.toString())
        cb(null, cachedViews[viewName](data))
    })
}

module.exports = views

/*
|--------------------------------------------------------------------------
| Handlebars Configuration
|--------------------------------------------------------------------------
*/
handlebars.registerPartial("header", headerTemplate)
handlebars.registerPartial("footer", footerTemplate)
handlebars.registerPartial("searchbar", searchbarTemplate)
handlebars.registerPartial("paginate", paginationTemplate)

/**
 * Limit the string by size, usefull to display large strings in a page
 * Appends ... in the end
 * ex: str = "hello" {{limit str 2}} -> "he..."
 */
handlebars.registerHelper('limit', function (str, limit) {
    if(str.length > limit) {
        let nstr = str.substring(0, limit)
        return new handlebars.SafeString(nstr + '...');
    }

    return new handlebars.SafeString(str);
});

/*
|--------------------------------------------------------------------------
| Handlerbars Pagination helpers
|--------------------------------------------------------------------------
*/
let disabledLink = 'javascript:void(0)' // prevents the action when clicking in the anchor

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
