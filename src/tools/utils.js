/**
 * Copyright 2020 OpenStack Foundation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import { epochToMoment } from "openstack-uicore-foundation/lib/methods";
import { FragmentParser } from "openstack-uicore-foundation/lib/components";
import moment from "moment-timezone";

const fragmentParser = new FragmentParser();

export const getSummitDates = (summit) => {
    let {dates_with_events} = summit;
    let dates = dates_with_events.map(dateString => {
        const dateObj = moment.tz(dateString, 'YYYY-MM-DD', summit.time_zone_id);

        const startUtc = dateObj.utc().valueOf() / 1000;

        return {
            string: dateString,
            label: dateObj.format('MMMM D, YYYY'),
            date: dateObj,
            startUtc: startUtc,
            endUtc: startUtc + (23 * 60 * 60) + (59 * 60),
            has_events: true,
            selected: false,
            is_weekday: true
        }
    });

    return dates
};

// Helper functions.
export const getUrlParam = param => {
    return fragmentParser.getParam(param);
};

export const setUrlParam = (name, value, clearVars = null) => {
    if (clearVars) {
        fragmentParser.deleteParams(clearVars);
    }
    fragmentParser.setParam(name, value);
    if (typeof window !== 'undefined')
        window.location.hash = fragmentParser.serialize();
};

export const getUrlParams = () => {
    return fragmentParser.getParams();
};

export const setUrlParams = (params, exclude = []) => {
    Object.keys(params).forEach(param => {
        if (exclude.indexOf(param) < 0) {
            fragmentParser.setParam(param, params[param]);
        }
    });

    if (typeof window !== 'undefined')
        window.location.hash = fragmentParser.serialize();
};

export const clearUrlParams = (params = null) => {
    if (!params) {
        fragmentParser.clearParams();
        if (typeof window !== 'undefined')
            window.location.hash = '';
    } else {
        fragmentParser.deleteParams(params);
        if (typeof window !== 'undefined')
            window.location.hash = fragmentParser.serialize();
    }
};

export const getEventSlug = (event) => {
    return event.title.replace(/[^A-Z0-9]+/ig, "_");
};

export const isLive = (event, nowUtc) => {
    const hasEnded = event.end_date < nowUtc;
    const hasStarted = event.start_date < nowUtc;
    return hasStarted && !hasEnded;
};

export const minutesToStart = (event, nowUtc) => {
    const momentNow = epochToMoment(nowUtc);
    const momentStart = epochToMoment(event.start_date);
    const duration = moment.duration(momentStart.diff(momentNow)).asMinutes();
    return duration > 1 ? Math.ceil(duration) : 1;
};

export const getNowFromQS = (timezone) => {
    const nowQS = fragmentParser.getParam('now');
    const momentQS = moment.tz(nowQS, 'YYYY-MM-DD,hh:mm:ss', timezone);
    return momentQS.isValid() ? momentQS.valueOf() / 1000 : null;
};