import moment from "moment";
import React from "react";



export const getDiffFromDates = (startDate = new Date(), endDate = new Date(), isHourFormat = true) => {
    if (startDate && endDate) {
        const d1 = moment(startDate, "DD-MM-YYYY");
        const d2 = moment(endDate, "DD-MM-YYYY");
        const hour = d2.diff(d1, 'hour');

        const min = d2.diff(d1, 'minute');
        const day = d2.diff(d1, 'days');
        return isHourFormat ? `${hour} hour / 00 min` : day
    }
    return undefined
}

export const getDays = (startDate = new Date(), endDate = new Date()) => {
    if (startDate && endDate) {
        const d1 = moment(startDate, "DD-MM-YYYY");
        const d2 = moment(endDate, "DD-MM-YYYY");

        const day = d2.diff(d1, 'days');
        return day
    }
    return undefined
}

export const remainingDay = (endDate = new Date()) => {
    if (endDate) {
        const d1 = moment(moment(endDate).format("DD-MM-YYYY"), "DD-MM-YYYY");
        const d2 = moment(new Date(), "DD-MM-YYYY");
        const day = d1.diff(d2, 'days');
        return String(day).split('').length == 1 ? `0${day}` : day
    }
    return undefined
}

export const remainingHour = () => {
    const d1 = moment("24:00", "HH-mm");
    const time = moment(new Date(), "HH-mm");
    const res = d1.diff(time, 'hours');
    return String(res).split('').length == 1 ? `0${res}` : res
}

export const remainingMinute = () => {
    const d1 = 60;
    const minute = moment(new Date(), "mm").format("mm");
    const res = d1 - parseInt(minute);
    return String(res).split('').length == 1 ? `0${res}` : res
}


export const getDateFormateFromTimestamp = (date, isReverse) => {
    if (date) {
        if (isReverse) {
            return moment(date).format('YYYY-MM-DD');
        }
        return moment(date).format('DD-MM-YYYY');
    }
}

export const getDateFormat = (date, isReverse = false) => {
    if (date) {
        if (isReverse) {
            return moment(date, "DD-MM-YYYY").format('YYYY-MM-DD');
        }
        return moment(date).format('DD-MM-YYYY');
    }
    return undefined
}

export const bidDateIsValid = (startDate = "19-11-2021", endDate = "21-11-2021") => {
    const d1 = moment(startDate, "DD-MM-YYYY");
    const d2 = moment(endDate, "DD-MM-YYYY");
    const today = moment(new Date());

    console.log(startDate, endDate);
    if (moment(new Date()).format('DD-MM-YYYY') == moment(endDate, "DD-MM-YYYY").format('DD-MM-YYYY')) {
        return true
    }
    else if (today.isBefore(d2)) {
        return true
    }
    else if (d2.isAfter(moment(new Date(), "DD-MM-YYYY"))) {
        return false
    }
    return true
}


export const validateIssuingDate = (date) => {
    if (date) {
        const d = moment(date, "DD-MM-YYYY");
        const today = moment(new Date());
        const isValid = d.isBefore(today);
        return isValid
    }
}

export const validateExpiryDate = (date) => {
    if (date) {
        const d = moment(date, "DD-MM-YYYY");
        const today = moment(new Date());
        const isValid = d.isAfter(today);
        return isValid
    }
}

export const isDateExpired = (date) => {
    if (date) {
        const d = moment(moment(date), "DD-MM-YYYY");
        const today = moment(new Date());
        return d.isBefore(today)
    }
    return undefined
}
