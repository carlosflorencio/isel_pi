"use strict";

/**
 * Data collection
 * Contains the paginate data and the items
 * @param offset
 * @param limit
 * @param total
 * @param items
 * @constructor
 */
function Collection(offset, limit, total, items) {
    this.offset = offset
    this.limit = limit
    this.total = total
    this.items = items
}

/**
 * Get how many pages we have
 * @return {*}
 */
Collection.prototype.getTotalPages = function () {
    return Math.ceil(this.total / this.limit)
}

/**
 * Get the current page
 * @return {number}
 */
Collection.prototype.getCurrentPage = function () {
    return Math.ceil(this.offset / this.limit) + 1
}

/**
 * See if there is a next page to navigate
 * @return {boolean}
 */
Collection.prototype.hasNext = function () {
    return this.getCurrentPage() < this.getTotalPages()
}

/**
 * See if there is a previous page to navigate
 * @return {boolean}
 */
Collection.prototype.hasPrevious = function () {
    return this.getCurrentPage() > 1
}

/**
 * See if the collection is in the first page
 * @return {boolean}
 */
Collection.prototype.isFirst = function() {
    return this.offset == 0
}

/**
 * See if the collection is in the last page
 * @return {boolean}
 */
Collection.prototype.isLast = function() {
    return this.offset + this.limit >= this.total
}


/**
 * Get the previous page number
 * If the current page is the first page, 1 is returned
 * @return {number}
 */
Collection.prototype.getPreviousPageNumber = function() {
    const curr = this.getCurrentPage()

    return curr > 1 ? curr - 1 : 1
}

/**
 * Get the next page number
 * If there are no more pages, the current page is returner
 * @return {number}
 */
Collection.prototype.getNextPageNumber = function() {
    const curr = this.getCurrentPage()
    const total = this.getTotalPages()
    const next = curr + 1

    return next <= total ? next : curr
}

module.exports = Collection