const express = require('express')
const app = express()
const port = 3000

var http = require('http-request')

const moment = require('moment');

app.set('view engine', 'ejs');

var g_homewizard_hostname = 'http://192.168.0.121/api/v1/data'
var g_p1_meter_data = {}
var g_text_color_active_power_w = "black"
var g_refresh_page_interval = 2500
var g_power_direction = "" // {"", "consumption", "injection"}
var g_power_direction_text = ""

app.get('/', (req, res) => {
    res.render('index.ejs', {
    })
})

app.get('/data', (req, res) => {

    let data = {
        g_p1_meter_data: g_p1_meter_data,
        g_text_color_active_power_w: g_text_color_active_power_w,
        g_refresh_page_interval : g_refresh_page_interval,
        g_power_direction : g_power_direction,
        g_power_direction_text : g_power_direction_text
    }

    res.send(data)
})


app.listen(port, () => {

    console.log(`MyWattMeter listening on port ${port}`)

    setInterval(() => {

        http.get(g_homewizard_hostname, function (err, response) {

            if (err) {
                console.error(err)
                return
            }

            //console.log(response)

            g_p1_meter_data = JSON.parse(response.buffer.toString())
            g_p1_meter_data.monthly_piek_datetime = moment(g_p1_meter_data.montly_power_peak_timestamp, 'YYMMDDHHmmss').format('MMM DD YYYY, HH:mm:ss')

            g_power_direction_text = "Verbruik"
            g_text_color_active_power_w = "purple"
            g_power_direction = "consumption"
            if (g_p1_meter_data.active_power_w < 0) {
                g_text_color_active_power_w = "green"
                g_power_direction = "injection"
                g_power_direction_text = "Injectie"
            }

        })
    }, g_refresh_page_interval);

})