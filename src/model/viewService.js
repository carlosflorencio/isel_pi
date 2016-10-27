"use strict";

const handlebars = require('handlebars')
const fs = require('fs')

const viewsDir = __dirname + '/../view'
const headerTemplate = fs.readFileSync(viewsDir + '/partials/header.hbs').toString()
const footerTemplate = fs.readFileSync(viewsDir + '/partials/footer.hbs').toString()

handlebars.registerPartial("header", headerTemplate)
handlebars.registerPartial("footer", footerTemplate)

const views = {}

/**
 * Get the view
 * @param viewName
 * @param data
 * @return {string}
 */
views.get = (viewName, data) => {
    const page = fs.readFileSync(viewsDir + '/' + viewName +'.hbs').toString()

    return handlebars.compile(page)(data)
}

module.exports = views
