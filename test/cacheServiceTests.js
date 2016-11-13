"use strict";

const assert = require('assert')
const fs = require('fs')

const cacheService = require('../src/model/service/cacheService')

describe('Cache Service', function() {
    describe('#getCachedView()', function () {
        it('Should throw error, view not in cache', function (done) {
            cacheService.getCachedView('not_in_cache', (err, view) => {
                assert(err)
                assert(err.message === "View is not in cache.")
                done()
            })
        })

        it('Should throw error, time expired', function (done) {
            const path = __dirname + '\\..\\cache\\test_view.txt'
            cacheService.addCachedView('test_view', 'texto e mais texto', -1)

            cacheService.getCachedView('test_view', (err, view) => {
                assert(err)
                assert(err.message == "View is not in cache.")
                fs.unlink(path)
                done()
            })
        })

        it('Should get cached view', function (done) {
            const path = __dirname + '\\..\\cache\\test_view.txt'
            cacheService.addCachedView('test_view', 'texto e mais texto', 7200)

            cacheService.getCachedView('test_view', (err, view) => {
                assert(!err)
                assert(view == 'texto e mais texto')
                fs.unlink(path)
                done()
            })
        })
    })

    describe('#addCachedView()', function () {

        it('Should write correctly', function (done) {
            const path = __dirname + '\\..\\cache\\test_view.txt'
            try {
                cacheService.addCachedView('test_view', 'isto e texto', 7200)
                assert(fs.existsSync(path))
            } finally {
                fs.unlink(path)
                done()
            }
        })
    })
})