// ==UserScript==
// @name        Sagaris GoHome
// @match       https://sagaris.3bpo.com/
// @author      p.zwolin@gmail.com
// @description This is Violentmonkey user-script that displays hour at which one can go home according to personal daily goal.
// ==/UserScript==

function sagarisTimeToGoHome() {
    Date.prototype.timeNow = function () {
        const refinedMinutes = (this.getMinutes() < 10) ? '0' + this.getMinutes() : this.getMinutes()
        const refinedHours = (this.getHours() < 10) ? '0' + this.getHours() : this.getHours()
        return "Fajrant o " + refinedHours + ":" + refinedMinutes
    }

    const timer = $('#timer-today .timer-target')
    timerText = timer.text()
    position = timerText.indexOf('(')
    goHome = timerText[position+1] === '-' ? false : true
    hours = 0
    minutes = 0
    seconds = 0
    hoursOrSeconds = 0

    var unixTimeToGoHome = new Date().valueOf()

    position++

    if (timerText[position] === '-') {
        position++
    }

    if (/^\d+$/.test(timerText[position + 1])) {
        hoursOrSeconds = 10 * Number.parseInt(timerText[position]) + Number.parseInt(timerText[position + 1])
        position += 2
    } else {
        hoursOrSeconds = Number.parseInt(timerText[position])
        position++
    }

    if (timerText[position] === ':') {
        hours = hoursOrSeconds
        position++
        minutes = 10 * Number.parseInt(timerText[position]) + Number.parseInt(timerText[position + 1])
    } else {
        seconds = hoursOrSeconds
    }

    if (goHome) {
        unixTimeToGoHome = unixTimeToGoHome - 1000 * seconds - 1000 * 60 * minutes - 1000 * 60 * 60 * hours
    } else {
        unixTimeToGoHome = unixTimeToGoHome + 1000 * seconds + 1000 * 60 * minutes + 1000 * 60 * 60 * hours
    }

    const goHomeText = new Date(unixTimeToGoHome).timeNow()
    const sagarisPlugin = $('#sagarisPlugin')

    if (sagarisPlugin.length) {
        sagarisPlugin.text(goHomeText)
    } else {
        timer.parent().append("<span id=\"sagarisPlugin\" class=\"kaka\">" + goHomeText + "</span>")
    }
}

setInterval(function(){sagarisTimeToGoHome()}, 5000)
