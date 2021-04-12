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

import moment from "moment";
import Filter from './tools/filter';
import FixedFilter from './tools/fixed-filter';
import {getNowFromQS, getSummitDates} from './tools/utils';
import {epochToMomentTimeZone} from "openstack-uicore-foundation/lib/methods";
import { LOGOUT_USER } from 'openstack-uicore-foundation/lib/actions';


import {
    START_WIDGET_LOADING,
    STOP_WIDGET_LOADING,
    LOAD_INITIAL_VARS,
    UPDATE_CLOCK,
    RECEIVE_SUMMIT,
    RECEIVE_USER_PROFILE,    
    RECEIVE_EVENTS,
    APPEND_EVENTS,
    SET_FILTERS,
    RESET_FILTERS,
    ADDED_TO_SCHEDULE,
    REMOVED_FROM_SCHEDULE,
    TOGGLE_FILTERS,
    UPDATE_EVENTS
} from './actions';

const DEFAULT_FILTERS = {
    tracks: [],
    trackgroups: [],
    eventtypes: [],
};

const DEFAULT_FIXED_FILTERS = {
    roomId: null,
    sponsorId: null,
    trackId: null,
    speakerId: null,
    yours: false
};

const DEFAULT_STATE = {
    settings: {
        onAuthError: null,
        eventCount: 3,
        title: null,
        display: 'portrait',
        yourSchedule: null,
        sponsorId: null,
        trackId: null,
        roomId: null,
        speakerId: null,
        showFilters: false,
        showNav: true,
        showAllEvents: false,
        showDetails: false,
        hideAdd: false,
        showUTC: false,
        defaultImage: '',
        nowUtc: null,
        updateCallback: null,
        onEventClick: null,
        onTrackClick: null,
        onSpeakerClick: null,
        onRoomClick: null
    },
    summit: null,
    loggedUser: {},
    view: { type: null, value: null },
    fullView: true,
    schedule_view_defaults: {day: null, track: null, level: null},
    filters: DEFAULT_FILTERS,
    fixedFilters: DEFAULT_FIXED_FILTERS,
    events: [],
    filtered: [],
    allEvents: [],
    searchTerm: '',
    widgetLoading: false,
    firstLoad: false,
};

const WidgetReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case LOGOUT_USER: {
            return DEFAULT_STATE;
        }
        break;
        case START_WIDGET_LOADING: {
            let widgetLoading = state.widgetLoading + 1;
            return {...state, widgetLoading};
        }
        break;
        case STOP_WIDGET_LOADING: {
            let widgetLoading = state.widgetLoading < 2 ? 0 : (state.widgetLoading - 1);
            return {...state, widgetLoading};
        }
        break;
        case UPDATE_CLOCK: {
            const {timestamp} = payload;
            return {...state, settings: {...state.settings, nowUtc: timestamp}};
        }
        break;
        case LOAD_INITIAL_VARS:
            const { yourSchedule, sponsorId, roomId, speakerId, trackId, userProfile, ...otherSettings} = payload;
            const now = moment().unix();
            let { fixedFilters, loggedUser } = state;

            fixedFilters.yours = yourSchedule ? yourSchedule : false;
            fixedFilters.sponsorId = sponsorId ? sponsorId : null;
            fixedFilters.roomId = roomId ? roomId : null;
            fixedFilters.speakerId = speakerId ? speakerId : null;
            fixedFilters.trackId = trackId ? trackId : null;
            if(userProfile) {
                let schedule_summit_events = userProfile.schedule_summit_events.map(ev => ev.id);
                loggedUser.schedule_summit_events = schedule_summit_events;
            }

            return {
                ...state,
                fixedFilters: {...state.fixedFilters, ...fixedFilters},
                loggedUser: userProfile ? {...userProfile, ...loggedUser} : null,
                settings: {
                    ...state.settings,
                    ...otherSettings,
                    yourSchedule,
                    sponsorId,
                    roomId,
                    trackId,
                    speakerId,
                    nowUtc: now
                }
            };
        break;
        case RECEIVE_USER_PROFILE: {
            let loggedUser = {...payload.response};
            return {...state, loggedUser};
        }
        break;
        case RECEIVE_SUMMIT: {
            let summit = {...payload};

            // check for QS now, because here we have the timezone for first time
            const nowQS = getNowFromQS(summit.time_zone_id);

            summit.dates = getSummitDates(summit);
            summit.presentation_levels = [
                {value: 'beginner', label: 'Beginner'},
                {value: 'intermediate', label: 'Intermediate'},
                {value: 'advanced', label: 'Advanced'},
            ];
            summit.month = epochToMomentTimeZone(summit.start_date, summit.time_zone_id).format('MMMM');

            const schedule_view_defaults = {};
            schedule_view_defaults.day = summit.dates.length > 0 ? summit.dates[0].string : null;
            schedule_view_defaults.track = summit.tracks.length > 0 ? summit.tracks[0].code : '';
            schedule_view_defaults.level = 'beginner';
            return {...state, summit, schedule_view_defaults, settings: {...state.settings, nowUtc: nowQS || state.settings.nowUtc}};
        }                
        break;
        case TOGGLE_FILTERS: {
            return {...state, showFilters: !state.showFilters}
        }
        break;
        case RESET_FILTERS: {
            return {...state, filters: DEFAULT_STATE.filters, filtered: [], showFilters: false};
        }
        break;
        case SET_FILTERS: {
            let {filters} = payload;
            let stateFilters = {...state.filters};
            let showFilters = false;

            Object.keys(filters).forEach(f => {
                if (stateFilters.hasOwnProperty(f)) {
                    stateFilters[f] = filters[f];
                    showFilters = true;
                }
            });

            if (filters.track_groups && filters.track_groups.length > 0) {
                let tracks = [];
                filters.track_groups.forEach(tg => {
                    let tracksTmp = state.summit.track_groups.find(tgg => tgg.name === tg.name).tracks;
                    tracks = tracks.concat(tracksTmp);
                });

                stateFilters.tracks = tracks;
            }

            // Get the new list of filtered events.
            // var filtered = Filter.events(stateFilters, state.events, state.loggedUser);

            return {...state, filters: stateFilters, showFilters};
        }
        break;
        case RECEIVE_EVENTS: {
            const allEvents = [...payload];
            let events = [...payload];
            let {view, settings: {nowUtc, showAllEvents, yourSchedule, showNav}, summit} = state;
            let nowDateTZ = epochToMomentTimeZone(nowUtc, summit.time_zone_id).format('YYYY-M-D');
            let shouldClearFinished = !showAllEvents && ((view.type === 'day' && view.value === nowDateTZ) || !showNav);

            // filter out finished events
            if (shouldClearFinished) {
                events = events.filter(ev => ev.end_date > nowUtc);
            }

            // filter with fixed filters
            events = FixedFilter.events(state.fixedFilters, events, state.loggedUser);

            // Get the new list of filtered events.
            // const filtered = Filter.events(state.filters, events, state.loggedUser);

            // if there are no events and is upcomming schedule then we want to hide everything -> firstload=false will do
            const firstLoad = yourSchedule || showAllEvents || events.length > 0;

            return {...state, allEvents, events, firstLoad};
        }
        break;
        case UPDATE_EVENTS: {
            let events = [...state.events];
            let {view, settings: {nowUtc, showAllEvents, yourSchedule, showNav}, summit} = state;
            let nowDateTZ = epochToMomentTimeZone(nowUtc, summit.time_zone_id).format('YYYY-M-D');
            let shouldClearFinished = !showAllEvents && ((view.type === 'day' && view.value === nowDateTZ) || !showNav);

            // filter out finished events
            if (shouldClearFinished) {
                events = events.filter(ev => ev.end_date > state.settings.nowUtc);
            }

            // Get the new list of filtered events.
            // const filtered = Filter.events(state.filters, events, state.loggedUser);

            // if there are no events and is upcomming schedule then we want to hide everything -> firstload=false will do
            const firstLoad = yourSchedule || showAllEvents || events.length > 0;

            return {...state, events, firstLoad};
        }
        break;
        case APPEND_EVENTS: {
            const allEvents = [...payload.response.data];
            let events = [...payload.response.data];
            let {view, settings: {nowUtc, showAllEvents, yourSchedule, showNav}, summit} = state;
            let nowDateTZ = epochToMomentTimeZone(nowUtc, summit.time_zone_id).format('YYYY-M-D');
            let shouldClearFinished = !showAllEvents && ((view.type === 'day' && view.value === nowDateTZ) || !showNav);

            // filter out finished events
            if (shouldClearFinished) {
                events = events.filter(ev => ev.end_date > nowUtc);
            }

            // filter with fixed filters
            events = FixedFilter.events(state.fixedFilters, events, state.loggedUser);

            // Get the new list of filtered events.
            // const filtered = Filter.events(state.filters, events, state.loggedUser);

            return {
                ...state,
                allEvents: [...state.allEvents, ...allEvents],
                events: [...state.events, ...events],
            };
        }
            break;
        case ADDED_TO_SCHEDULE: {
            const {event} = payload;
            let events = [...state.allEvents];
            let loggedUser = {...state.loggedUser};

            if (loggedUser.schedule_summit_events && !loggedUser.schedule_summit_events.includes(event.id)) {
                loggedUser.schedule_summit_events.push(event.id);
            }

            // filter with fixed filters
            events = FixedFilter.events(state.fixedFilters, events, loggedUser);

            // Get the new list of filtered events.
            // const filtered = Filter.events(state.filters, events, loggedUser);

            return {...state, loggedUser, events};
        }
        break;
        case REMOVED_FROM_SCHEDULE: {
            const {event} = payload;
            let events = [...state.allEvents];
            let loggedUser = {...state.loggedUser};

            loggedUser.schedule_summit_events = loggedUser.schedule_summit_events.filter( evID => evID !== event.id);

            // filter with fixed filters
            events = FixedFilter.events(state.fixedFilters, events, loggedUser);

            // Get the new list of filtered events.
            // const filtered = Filter.events(state.filters, events, loggedUser);

            return {...state, loggedUser, events};
        }
        break;
        default: {
            return state;
        }
    }

    return state
}

export default WidgetReducer
