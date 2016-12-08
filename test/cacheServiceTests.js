"use strict";

const assert = require('chai').assert;
const fs = require('fs')
const path = require('path')
const CacheService = require('../model/service/cacheService')

describe('Cache Service', function() {
    let cache = null
    const cacheDir = path.join(__dirname,  '../cache')

    beforeEach(function() { // runs before each test
       cache = new CacheService(cacheDir)
    });

    describe('#get()', function () {
        it('is not in cache', function (done) {
            cache.get('not_in_cache', (err, value) => {
                assert(err)
                assert(err.message === "Value is not in cache.")
                done()
            })
        })


        it('value expired', function (done) {
            this.timeout(3000);
            const val = 'texto e mais texto'
            const key = 'test_view'
            
            cache.put(key, val, 1000, (err) => {
                if(err) {
                    assert.fail(err, null)
                }

                assert.isNull(err) // write on disk -> success

                setTimeout(function () { // try get the value when its not expired yet
                    cache.get(key, (err, value) => {
                        assert.isNull(err)
                        assert.equal(value, val) // we should have a value yet
                    })
                }, 500)

                setTimeout(function () { // try get the value when is expired
                    cache.get(key, (err, value) => {
                        assert.isNotNull(err) // we should not have any value
                        assert.equal(err.message, "Value is not in cache.")
                        assert.isFalse(fs.existsSync(path.join(cacheDir, key + cache._cacheExt)))
                        done()
                    })
                }, 1200)
            })

        })

        it('value from disk when not in memory', function (done) {
            const key = 'key'
            const val = 'content'

            cache.put(key, val, cache.INFINITE, (err) => {
                assert.isNull(err, 'file must be written with success')

                delete cache._memory[key] //remove from memory

                cache.get(key, (err, value) => {
                    assert.isNull(err)

                    assert.equal(value, val) // read from disk
                    done()
                })
            })
        })

        it('value from disk when not in memory and is expired', function (done) {
            const key = 'key'
            const val = 'content'

            cache.put(key, val, 1000, (err) => {
                assert.isNull(err, 'file must be written with success')

                delete cache._memory[key] //remove from memory

                setTimeout(() => {
                    cache.get(key, (err, value) => { // will go read the disk
                        assert.isNotNull(err) // we should have an error because it is expired

                        assert.isFalse(fs.existsSync(path.join(cacheDir, key + cache._cacheExt)))
                        done()
                    })
                }, 1100)
            })
        })
    })

    describe('#put()', function () {
        it('should be added to memory and disk', function (done) {
            const key = 'key'
            const val = 'content'

            cache.put(key, val, cache.INFINITE, (err) => {
                assert.isNull(err, 'file must be written with success')

                assert.isOk(cache._memory[key]) // we have in memory

                assert.isTrue(fs.existsSync(path.join(cacheDir, key + cache._cacheExt))) // we have in disk
                cache.delete(key)
                done()
            })
        })

        it('many items at the same time with the same expire time', function (done) {
            this.timeout(10000)
            for(let i = 0; i < 100; ++i) {
                cache.put('key' + i, 'value' + i, 1000)
            }

            console.log(Object.keys(cache._memory).length);

            setTimeout(() => {
                console.log(Object.keys(cache._memory).length);
                done()
            }, 1500)
        })

    })

    describe('#delete()', function () {
        it('should be deleted after expired', function (done) {
            const key = 'key'
            const val = 'content'

            cache.put(key, val, 500, (err) => {
                assert.isNull(err, 'file must be written with success')

                assert.isOk(cache._memory[key]) // we have in memory

                assert.isTrue(fs.existsSync(path.join(cacheDir, key + cache._cacheExt))) // we have in disk

                setTimeout(() => {
                    cache.delete(key) // is async, will give console.log because the file should not exist

                    assert.isNotOk(cache._memory[key]) // deleted from memory

                    setTimeout(() => {
                        assert.isFalse(fs.existsSync(path.join(cacheDir, key + cache._cacheExt))) // deleted
                        done()
                    }, 500) // may fail, not enought time

                }, 700)

            })
        })

    })
})