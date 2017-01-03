const fs = require('fs')
const path = require('path')

/**
 * Load all partials and helpers to hbs
 * Just a configurator for the hbs package
 *
 * Should be moved out of model folder?
 *
 * @param hbs
 * @constructor
 */
function handlebarsConfigurator(hbs) {
    /*
     |--------------------------------------------------------------------------
     | Partials
     |--------------------------------------------------------------------------
     */
    hbs.registerPartials(path.join(__dirname, '../../views/partials'));

    /*
     |--------------------------------------------------------------------------
     | Helpers
     |--------------------------------------------------------------------------
     */
    /**
     * Limit the string by size, usefull to display large strings in a page
     * Appends ... in the end
     * ex: str = "hello" {{limit str 2}} -> "he..."
     */
    hbs.registerHelper('limit', function (str, limit) {
        if (str.length > limit) {
            let nstr = str.substring(0, limit)
            return new hbs.handlebars.SafeString(nstr + '...');
        }

        return new hbs.handlebars.SafeString(str);
    });

    /**
     * Translate boolean values to Yes / No
     * usage:
     *
     * {{bool variable}} -> Yes or No
     */
    hbs.registerHelper('bool', function (boolean) {
        return boolean ? 'Yes' : 'No';
    });

    /**
     * Helper block to check if the user has write permission to the playlist
     * usage:
     *
     * {{#ifCanWrite playlist authUser=user }}
     *   has write permission
     * {{else}}
     *  dont have permission
     * {{/ifCanWrite}}
     */
    hbs.registerHelper('ifCanWrite', function (playlist, options) {
        const authUser = options.hash.authUser

        if (authUser && playlist.user_id == authUser.id) { // the owner of the playlist
            return options.fn(this);
        }

        // invite? accepted? writable?
        if (playlist.invite && playlist.invite.accepted && playlist.invite.writable) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });

    /**
     * Helper block to check if the user is the owner of the playlist
     * usage:
     *
     * {{#ifOwner playlist authUser=user }}
     *   is Owner
     * {{else}}
     *  get out
     * {{/ifCanWrite}}
     */
    hbs.registerHelper('ifOwner', function (playlist, options) {
        const authUser = options.hash.authUser

        if (authUser && playlist.user_id == authUser.id) { // the owner of the playlist
            return options.fn(this);
        }

        return options.inverse(this);
    });

    /**
     * Prints an check character if the track exists in the playlist
     * usage:
     * {{trackExists playlist track.id }}
     */
    hbs.registerHelper('trackExists', function (playlist, trackId) {
        if(playlist.tracks.indexOf(trackId) !== -1)
            return '✓ '

        return '';
    });

    /**
     * Add active class if the path is the same
     * usage:
     * {{{active '/user/register' currentPath }}}
     */
    hbs.registerHelper('active', function (shouldPath, activePath) {
        console.log(shouldPath, activePath);
        if(shouldPath == activePath)
            return 'class="active"'

        return ''
    })

    /*
     |--------------------------------------------------------------------------
     | Handlerbars Pagination helpers
     |--------------------------------------------------------------------------
     */
    let disabledLink = 'javascript:void(0)' // prevents the action when clicking in the anchor

    hbs.registerHelper('firstpage', function (path, query, collection) {
        let link = disabledLink
        if (!collection.isFirst())
            link = createPageLink(path, query, 1, collection.limit)
        return new hbs.handlebars.SafeString(link);
    });

    hbs.registerHelper('lastpage', function (path, query, collection) {
        let link = disabledLink
        if (!collection.isLast())
            link = createPageLink(path, query, collection.getTotalPages(), collection.limit)
        return new hbs.handlebars.SafeString(link);
    });

    hbs.registerHelper('nextpage', function (path, query, collection) {
        let link = disabledLink
        if (collection.hasNext())
            link = createPageLink(path, query, collection.getNextPageNumber(), collection.limit)

        return new hbs.handlebars.SafeString(link);
    });

    hbs.registerHelper('previouspage', function (path, query, collection) {
        let link = disabledLink
        if (collection.hasPrevious())
            link = createPageLink(path, query, collection.getPreviousPageNumber(), collection.limit)

        return new hbs.handlebars.SafeString(link);
    });

    function createPageLink(path, query, page, limit) {
        query = encodeURIComponent(query)
        return path + query + "?page=" + page + '&limit=' + limit
    }
}


module.exports = handlebarsConfigurator