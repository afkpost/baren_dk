class ServerConnection
    constructor: (server, log = () -> ) ->
        
        ajax = (method, url, body) ->
            body = JSON.stringify body
            ($.ajax
                url: url
                type: method
                contentType: "application/json"
                data: body
            ).fail (xhr) ->
                log "#{url}: #{xhr.status} #{xhr.statusText}"
        
        
        if device?
            uid = device.uuid or 1
        else
            log "could not find device.uuid, uuid = 1"
            uid = 1
            
        @getNews = () ->
            url = "#{server}"
            ajax "GET", url

        @getOffers = () ->
            url = "#{server}/app/users/#{uid}/offers"
            ajax "GET", url

        @getDrinks = () ->
            url = "#{server}/drinks"
            ajax "GET", url

        @useOffer = (id) ->
            url = "#{server}/app/users/#{uid}/offers/#{id}"
            ajax "PUT", url

        @getEvents = () ->
            url = "#{server}/semesterplan"
            ajax "GET", url

        @getUpcommingOffers = () ->
            url = "#{server}/app/offers/upcomming"
            ajax "GET", url

        @getUser = () ->
            url = "#{server}/app/users/#{uid}"
            ajax "GET", url
        
        @checkin = (token) ->
            url = "#{server}/app/users/#{uid}/checkin"
            ajax "PUT", url, 
                token: token
            
            
        @updateUser = (user) ->
            url = "#{server}/app/users/#{uid}"
            ajax "PUT", url, user
            
        @sendHeartbeat = () ->
            url = "#{server}/app/users/#{uid}/heartbeat"
            ajax "PUT", url
            
        @getRanks = () ->
            url = "#{server}/app/ranks"
            ajax "GET", url
        
class App
    constructor: (conn, log = () -> ) ->
        
        bus = $ '<App.bus>'
        
        store = (key, value) ->
            event = key
            json = JSON.stringify value
            key = "App.#{key}"
            if value?
                oldValue = localStorage.getItem key
                if oldValue isnt json
                    localStorage.setItem key, json
                    bus.trigger event, [value]
            else
                res = localStorage.getItem key
                if res?
                    JSON.parse res
                else
                    null
                    
        parseDate = (date) ->
            return date if not date?
            date = new Date date
            "#{date.getDate()}/#{date.getMonth()}"
        
        @on = (event, callback) ->
            bus.on event, (e, data) -> callback data
            try
                callback store event
            catch e
                log "could not call callback #{callback.toString()}"
        
        get = (key) ->
            () -> store key
                
        put = (key) ->
            (key, value) -> store key, value
        
        
        #--------------------#
        # News               #
        #--------------------#
        updateNews = () -> 
            conn.getNews().done (news) =>
                news = news.content
                for n in news
                    n.what = n.what.split /\n/
                store "news", news
        updateNews()
        
        
        #--------------------#
        # Events             #
        #--------------------#
        updateEvents = () ->
            conn.getEvents().done (events) ->
                for es in events.events
                    for event in es.events
                        event.url = event.url.replace "http://www.facebook.com/", "fb://"
                store "events", events
        updateEvents()
        
        
        #--------------------#
        # Offers             #
        #--------------------#
        @useOffer = (id) ->
            offers = store "offers"
            (conn.useOffer id).done (data) ->
                date = new Date()
                for offer in offers when offer.id is id
                    offer.remains--
                    offer.used = "#{date.getDate()}/#{date.getMonth()}"
                store "offers", offers
                
        @updateOffers = () ->
            conn.getOffers().done (offers) ->
                for offer in offers
                    offer.available = true
                    if offer.used
                        offer.available = false
                        offer.used = parseDate offer.used
                    else if offer.remains is 0
                        offer.available = false
                        offer.text = "Udsolgt"
                offers.sort (o1, o2) ->
                    if o1.available? or not o2.available?
                        return 1;
                    return -1;
                store "offers", offers
        @updateOffers()
        
        
        #--------------------#
        # Upcomming Offers   #
        #--------------------#
        @updateUpcommingOffers = () ->
            conn.getUpcommingOffers().done (offers) ->
                for offer in offers
                    offer.startDate = parseDate offer.startDate
                store "upcommingOffers", offers
        @updateUpcommingOffers()
        
        #--------------------#
        # Drinks             #
        #--------------------#
        updateDrinks = () ->
            conn.getDrinks().done (drinks) ->
                drinks = drinks.content
                store "drinks", drinks
        updateDrinks()
            
        #--------------------#
        # User               #
        #--------------------#
        conn.getUser().done (user) ->
            store "user", user
            
        @updateUser = (update) ->
            (conn.updateUser update).done () ->
                user = store "user"
                for field, value of update
                    user[field] = value
                store "user", user
            
        #--------------------#
        # Checkin            #
        #--------------------#
        
        @checkin = (token) ->
            res = conn.checkin token
            res.done () ->
                checkins = store "checkins" or 0
                store "checkins", checkins + 1
            res.fail () ->
                console.log "could not checkin"
            
        @updateRanks = () ->
            conn.getRanks().done (ranks) ->
                store "ranks", ranks
        @updateRanks()
        
        #--------------------#
        # Push notifications #
        #--------------------#
        pushNotification = plugins.pushNotification if plugins?
        if pushNotification?
                    
            pushSuccess = (success) -> log success

            pushError = (err) -> log err


            #--------------------#
            # Push setup         #
            #--------------------#
            platform = device.platform or "unknown"
            platform = platform.toLowerCase()
            log "found platform: #{platform}"
            if platform is "android"
                #--------------------#
                # Push android       #
                #--------------------#
                window.androidCallback = (e) =>
                    log "got event"
                    if e.event is "registered"
                        # regid = localStorage.getItem 'gcm_regid'
                        #if regid isnt e.regid
                        regid = e.regid
                        log regid
                        log "updating user"
                        conn.updateUser
                            regid: regid
                    else if e.event is "message"
                        data = e.payload
                        log JSON.stringify data
                        if e.foreground
                            if data.update? #this should update some data. Unnecessary in background since model is syncronized at startup
                                switch data.update
                                    when "offers" then updateOffers()
                                    else log "unknown update: #{data.update}"


                    else
                        log "Unkown event: #{event.type}"
                log "platform supported"
                pushNotification.register pushSuccess, pushError,
                    senderID: "999604987399"
                    ecb: "androidCallback"
                log "register called"
            else
                log "platform not supported"

        else
            log "PushNotification not found"
            conn.updateUser
                regid: null
                token: null
            
            
        #--------------------#
        # Heartbeat          #
        #--------------------#
        log "setting up heartbeat"
            
        setInterval conn.sendHeartbeat, 5 * 60 * 1000
        conn.sendHeartbeat()