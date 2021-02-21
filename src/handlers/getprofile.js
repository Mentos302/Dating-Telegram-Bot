module.exports = {
    async f(ctx) {
        ctx.scene.state.cli_info = {}
        let profile = await ctx.db.Profile.find({ city: ctx.scene.state.host_info[0].city, chat_id: { $ne: ctx.from.id }, is_active: true })

        for (let i = 0; i < profile.length; i++) {
            let fined = 0

            if (profileValidate(ctx, profile[i])) {
                for (let p = 0; p < ctx.scene.state.relations.length; p++) {
                    if (ctx.scene.state.relations == false) break;
                    if (profile[i].chat_id == ctx.scene.state.relations[p].cli_id) {
                        fined++;
                        break;
                    }
                }
            } else {
                fined++
            }
            if (!fined) {
                ctx.scene.state.cli_info = profile[i];
                break;
            }
        }
        sendProfile(ctx, ctx.scene.state.cli_info)
    }
}

function profileValidate(ctx, cli_info) {
    if (ctx.scene.state.host_info[0].interest != cli_info.gender && ctx.scene.state.host_info[0].interest != 2) { return false }
    if (ctx.scene.state.host_info[0].gender != cli_info.interest && cli_info.interest != 2) { return false }

    // Age validation
    if (ctx.scene.state.host_info[0].age < 16 && cli_info.age > 16) {
        return false
    } else if (ctx.scene.state.host_info[0].age >= 16 && ctx.scene.state.host_info[0].age < 25) {
        if (cli_info.age < 16 || cli_info.age > 25) { return false }
    } else if (ctx.scene.state.host_info[0].age >= 25 && ctx.scene.state.host_info[0].age < 35) {
        if (cli_info.age < 25 || cli_info.age > 35) { return false }
    } else if (ctx.scene.state.host_info[0].age >= 35 && ctx.scene.state.host_info[0].age < 60) {
        if (cli_info.age < 35 || cli_info.age > 60) { return false }
    }

    return true
}

async function sendProfile(ctx, cli_info) {
    const Extra = require('telegraf/extra')

    try {
        try {
            await ctx.replyWithPhoto(`${cli_info.avatar}`, Extra.markup((markup) => {
                markup.resize()
            }).caption(`<b>${cli_info.name}, ${cli_info.age}</b>. ${cli_info.city} \n\n${cli_info.decsript}`).HTML().markup((m) =>
                m.inlineKeyboard([
                    [
                        m.callbackButton(ctx.i18n.t('action.like'), 'yes'),
                        m.callbackButton(ctx.i18n.t('action.mail'), 'mail'),
                        m.callbackButton(ctx.i18n.t('action.dislike'), 'no')
                    ],
                    [m.callbackButton(ctx.i18n.t('action.report'), 'report'),
                        m.callbackButton(ctx.i18n.t('action.exit'), 'go_exit')
                    ]
                ])
            ))
        } catch (err) {
            await ctx.replyWithVideo(`${cli_info.avatar}`, Extra.markup((markup) => {
                markup.resize()
            }).caption(`<b>${cli_info.name}, ${cli_info.age}</b>. ${cli_info.city} \n\n${cli_info.decsript}`).HTML().markup((m) =>
                m.inlineKeyboard([
                    [
                        m.callbackButton(ctx.i18n.t('action.like'), 'yes'),
                        m.callbackButton(ctx.i18n.t('action.mail'), 'mail'),
                        m.callbackButton(ctx.i18n.t('action.dislike'), 'no')
                    ],
                    [m.callbackButton(ctx.i18n.t('action.report'), 'report'),
                        m.callbackButton(ctx.i18n.t('action.exit'), 'go_exit')
                    ]
                ])
            ))
        }
    } catch { // All of clients had been shown, getCityCoords
        getCityCoords(ctx)
    }
}

async function getCityCoords(ctx) {
    const cyrillicToTranslit = require('cyrillic-to-translit-js');
    const fetch = require('node-fetch');

    let city = await ctx.db.City.find({ city_name: ctx.scene.state.host_info[0].city })
    if (city.length) {
        getNearlyCity(ctx, city[0].city_lat, city[0].city_lng)
    } else {
        try {
            let adress = cyrillicToTranslit({ preset: "uk" }).transform(ctx.scene.state.host_info[0].city, " ")
            let nameURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + adress + '&key=AIzaSyCOBtb6JVZkiP7T8nk07SxLfYPVKZf3z9c'
            let response = await fetch(nameURL);
            let commits = await response.json();
            let coord = commits.results[0].geometry.location
            await ctx.db.City.create({
                city_name: ctx.scene.state.host_info[0].city,
                city_lat: coord.lat,
                city_lng: coord.lng
            })
            getNearlyCity(ctx, coord.lat, coord.lng)
        } catch { console.log('Такого міста нема') }
    }
}

async function getNearlyCity(ctx, lat, lng) {
    const geolib = require('geolib');
    const scanedCities = ctx.scene.state.scaned_city
    if (ctx.scene.state.nearly_cities == undefined || !ctx.scene.state.nearly_cities.length) {
        let cities = await ctx.db.City.find({ city_name: { $ne: ctx.scene.state.host_info[0].city } })
        cities.forEach((e, i) => {
            if (scanedCities.some((el) => el == e.city_name)) {
                cities.splice(i, 1);
            } else {
                e.distance = geolib.getDistance({ latitude: lat, longitude: lng }, { latitude: e.city_lat, longitude: e.city_lng }, 1) / 1000
            }
        })
        cities.sort((a, b) => a.distance - b.distance)
        ctx.scene.state.nearly_cities = cities
    } else {
        ctx.scene.state.nearly_cities.splice(0, 1);
    }
    updateScaned(ctx, ctx.scene.state.nearly_cities);
}

function updateScaned(ctx, cities) {
    try {
        ctx.scene.state.scaned_city.push(`${cities[0].city_name}`)

        ctx.scene.state.host_info[0].city = cities[0].city_name
        ctx.scene.enter('action_main', ctx.scene.state)
    } catch {
        ctx.reply(`Ви переглянули всі анкети, очікуйте з часом хтось Вам відповість або з'являться нові анкети`)
    }
}