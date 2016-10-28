"use strict";

const handlebars = require('handlebars')
const fs = require('fs')

const viewsDir = __dirname + '/../view'
const headerTemplate = fs.readFileSync(viewsDir + '/partials/header.hbs').toString()
const footerTemplate = fs.readFileSync(viewsDir + '/partials/footer.hbs').toString()

handlebars.registerPartial("header", headerTemplate)
handlebars.registerPartial("footer", footerTemplate)

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
    if(memory[viewName])
        return memory[viewName](data)

    const page = fs.readFileSync(viewsDir + '/' + viewName +'.hbs').toString()
    memory[viewName] = handlebars.compile(page)

    return memory[viewName](data)
}

module.exports = views
