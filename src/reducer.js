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

import {cloneDeep} from 'lodash';
import { epochToMomentTimeZone } from "openstack-uicore-foundation/lib/methods";

import { LOGOUT_USER } from 'openstack-uicore-foundation/lib/actions';

import {
    START_WIDGET_LOADING,
    STOP_WIDGET_LOADING,
    LOAD_INITIAL_VARS,
    UPDATE_FILTERS
} from './actions';

const DEFAULT_STATE = {
    settings: {
        title: "Filter by",
        colorSource: '',
        marketingSettings: null,
        triggerAction: null,
    },
    summit: null,
    events: [],
    filters: [],
    widgetLoading: false,
};

const ALL_FILTERS = {
    date: [],
    level: [],
    track: [],
    track_groups: [],
    event_types: [],
    tags: [],
    venues: [],
    speakers: []
};

const WidgetReducer = (state = DEFAULT_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
        case LOGOUT_USER: {
            return DEFAULT_STATE;
        }
        case START_WIDGET_LOADING: {
            let widgetLoading = state.widgetLoading + 1;
            return { ...state, widgetLoading };
        }
        case STOP_WIDGET_LOADING: {
            let widgetLoading = state.widgetLoading < 2 ? 0 : (state.widgetLoading - 1);
            return { ...state, widgetLoading };
        }
        case LOAD_INITIAL_VARS: {
            const {summit, events, allEvents, filters, triggerAction, marketingSettings, colorSource, ...rest} = payload;

            Object.keys(marketingSettings).forEach(setting => {
                if (getComputedStyle(document.documentElement).getPropertyValue(`--${setting}`)) {
                    document.documentElement.style.setProperty(`--${setting}`, marketingSettings[setting]);
                    document.documentElement.style.setProperty(`--${setting}50`, `${marketingSettings[setting]}50`);
                }
            });

            const allOptions = getAllOptions(summit, allEvents);
            const filtersWithOptions = updateFilterOptions(summit, events, filters, allOptions);

            return {
                ...state,
                widgetLoading: false,
                summit,
                events,
                allEvents,
                filters,
                filtersWithOptions,
                allOptions,
                settings: {
                    ...state.settings,
                    ...rest,
                    colorSource,
                    marketingSettings,
                    triggerAction
                }
            };
        }
        case UPDATE_FILTERS: {
            const {events, filters} = payload;

            const filtersWithOptions = updateFilterOptions(state.summit, events, filters, state.allOptions);

            return {
                ...state,
                widgetLoading: false,
                events,
                filters,
                filtersWithOptions,
            };
        }
        default: {
            return state;
        }
    }
};

const updateFilterOptions = (summit, events, filters, allOptions) => {
    const newOptions = cloneDeep(ALL_FILTERS);
    const filterKeys = Object.keys(filters);

    filterKeys.forEach(k => {
        filters[k].options = [];

        // if the filter has values, ie is active, we show all options regardless of the events shown
        if (filters[k].values.length > 0) {
            // we populate the options
            filters[k].options = allOptions[k];
            // we skip the filter
            delete(newOptions[k]);
        }
    });

    events.forEach(ev => {
        if (filters.date && newOptions.date) {
            const dateObj = epochToMomentTimeZone(ev.start_date, summit.time_zone_id);
            const date = dateObj.format('YYYY-MM-DD');

            if (!newOptions.date.includes(date)) {
                const day = dateObj.format('dddd');
                const month = dateObj.format('MMMM D');

                newOptions.date.push(date);
                filters.date.options.push({name: [day, month], value: date, count: 0});
            }
        }

        if (filters.level && newOptions.level && ev.level !== 'N/A' && !newOptions.level.includes(ev.level)) {
            newOptions.level.push(ev.level);
            filters.level.options.push({name: ev.level, value: ev.level, count: 0});
        }

        if (filters.track && newOptions.track && !newOptions.track.includes(ev.track.id)) {
            newOptions.track.push(ev.track.id);
            filters.track.options.push({name: ev.track.name, value: ev.track.id, count: 0});
        }

        if (filters.event_types && newOptions.event_types && !newOptions.event_types.includes(ev.type.id)) {
            newOptions.event_types.push(ev.type.id);
            filters.event_types.options.push({name: ev.type.name, value: ev.type.id, count: 0});
        }

        if (filters.venues && newOptions.venues && ev.location && !newOptions.venues.includes(ev.location.id)) {
            newOptions.venues.push(ev.location.id);
            filters.venues.options.push({name: ev.location.name, value: ev.location.id, count: 0});
        }

        if (filters.track_groups && newOptions.track_groups){
            ev.track.track_groups.forEach(tg => {
                if (!newOptions.track_groups.includes(tg)) {
                    newOptions.track_groups.push(tg);
                    const trackg = summit.track_groups.find(t => t.id === tg);
                    filters.track_groups.options.push({name: trackg.name, value: trackg.id, count: 0});
                }
            });
        }

        if (filters.tags && newOptions.tags && ev.tags.length > 0){
            ev.tags.forEach(t => {
                if (!newOptions.tags.includes(t.id)) {
                    newOptions.tags.push(t.id);
                    filters.tags.options.push({name: t.tag, value: t.id, count: 1});
                } else {
                    filters.tags.options.find(tt => tt.value === t.id).count++;
                }
            });
        }

        if (filters.speakers && newOptions.speakers && ev.speakers.length > 0){
            ev.speakers.forEach(s => {
                if (!newOptions.speakers.includes(s.id)) {
                    newOptions.speakers.push(s.id);
                    filters.speakers.options.push({name: `${s.first_name} ${s.last_name}`, value: s.id, id: s.id, pic: s.pic, count: 0});
                }
            })
        }

    });

    return filters;
};

const getAllOptions = (summit, events) => {
    const uniqueOptions = cloneDeep(ALL_FILTERS);
    const allOptions = cloneDeep(ALL_FILTERS);

    events.forEach(ev => {
        const dateObj = epochToMomentTimeZone(ev.start_date, summit.time_zone_id);
        const date = dateObj.format('YYYY-MM-DD');

        if (!uniqueOptions.date.includes(date)) {
            const day = dateObj.format('dddd');
            const month = dateObj.format('MMMM D');

            uniqueOptions.date.push(date);
            allOptions.date.push({name: [day, month], value: date, count: 0});
        }

        if (ev.level !== 'N/A' && !uniqueOptions.level.includes(ev.level)) {
            uniqueOptions.level.push(ev.level);
            allOptions.level.push({name: ev.level, value: ev.level, count: 0});
        }

        if (!uniqueOptions.track.includes(ev.track.id)) {
            uniqueOptions.track.push(ev.track.id);
            allOptions.track.push({name: ev.track.name, value: ev.track.id, count: 0});
        }

        if (!uniqueOptions.event_types.includes(ev.type.id)) {
            uniqueOptions.event_types.push(ev.type.id);
            allOptions.event_types.push({name: ev.type.name, value: ev.type.id, count: 0});
        }

        if (ev.location && !uniqueOptions.venues.includes(ev.location.id)) {
            uniqueOptions.venues.push(ev.location.id);
            allOptions.venues.push({name: ev.location.name, value: ev.location.id, count: 0});
        }

        ev.track.track_groups.forEach(tg => {
            if (!uniqueOptions.track_groups.includes(tg)) {
                uniqueOptions.track_groups.push(tg);
                const trackg = summit.track_groups.find(t => t.id === tg);
                allOptions.track_groups.push({name: trackg.name, value: trackg.id, count: 0});
            }
        });

        if (ev.tags.length > 0){
            ev.tags.forEach(t => {
                if (!uniqueOptions.tags.includes(t.id)) {
                    uniqueOptions.tags.push(t.id);
                    allOptions.tags.push({name: t.tag, value: t.id, count: 1});
                } else {
                    allOptions.tags.find(tt => tt.value === t.id).count++;
                }
            });
        }

        if (ev.speakers.length > 0){
            ev.speakers.forEach(s => {
                if (!uniqueOptions.speakers.includes(s.id)) {
                    uniqueOptions.speakers.push(s.id);
                    allOptions.speakers.push({name: `${s.first_name} ${s.last_name}`, value: s.id, id: s.id, pic: s.pic, count: 0});
                }
            })
        }

    });

    return allOptions;
};

export default WidgetReducer
