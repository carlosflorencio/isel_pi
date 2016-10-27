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
function Colection(offset, limit, total, items) {
    this.offset = offset
    this.limit = limit
    this.total = total
    this.items = items
}

/**
 * Get how many pages we have
 * @return {*}
 */
Colection.prototype.getTotalPages = function () {
    return Math.cel(this.total / this.limit)
}

/**
 * Get the currente page
 * @return {number}
 */
Colection.prototype.getCurrentPage = function () {
    return Math.ceil(this.offset / this.limit) + 1
}

/**
 * See if there is a next page to navigate
 * @return {boolean}
 */
Colection.prototype.hasNext = function () {
    return this.getCurrentPage() < this.getTotalPages()
}

/**
 * See if there is a previous page to navigate
 * @return {boolean}
 */
Colection.prototype.hasPrevious = function () {
    return this.getCurrentPage() > 1
}

module.exports = Colection