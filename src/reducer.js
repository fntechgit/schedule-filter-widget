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
            const {summit, events, filters, triggerAction, marketingSettings, colorSource, ...rest} = payload;

            Object.keys(marketingSettings).forEach(setting => {
                if (getComputedStyle(document.documentElement).getPropertyValue(`--${setting}`)) {
                    document.documentElement.style.setProperty(`--${setting}`, marketingSettings[setting]);
                    document.documentElement.style.setProperty(`--${setting}50`, `${marketingSettings[setting]}50`);
                }
            });

            const filtersWithOptions = updateFilterOptions(summit, events, filters);

            return {
                ...state,
                widgetLoading: false,
                summit,
                events,
                filters,
                filtersWithOptions,
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

            const filtersWithOptions = updateFilterOptions(state.summit, events, filters);

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

const updateFilterOptions = (summit, events, filters) => {
    const newOptions = {date: [], level: [], track: [], track_groups: [], event_types: [], tags: [], venues: [], speakers: []};
    const filterKeys = Object.keys(filters);

    filterKeys.forEach(k => {
        filters[k].options = [];
    });

    events.forEach(ev => {
        if (filters.date && filters.date.values.length === 0) {
            const dateObj = epochToMomentTimeZone(ev.start_date, summit.time_zone_id);
            const date = dateObj.format('YYYY-MM-DD');

            if (!newOptions.date.includes(date)) {
                const day = dateObj.format('dddd');
                const month = dateObj.format('MMMM D');

                newOptions.date.push(date);
                filters.date.options.push({name: [day, month], value: date, count: 0});
            }
        }

        if (filters.level && filters.level.values.length === 0 && ev.level !== 'N/A' && !newOptions.level.includes(ev.level)) {
            newOptions.level.push(ev.level);
            filters.level.options.push({name: ev.level, value: ev.level, count: 0});
        }

        if (filters.track && filters.track.values.length === 0 && !newOptions.track.includes(ev.track.id)) {
            newOptions.track.push(ev.track.id);
            filters.track.options.push({name: ev.track.name, value: ev.track.id, count: 0});
        }

        if (filters.event_types && filters.event_types.values.length === 0 && !newOptions.event_types.includes(ev.type.id)) {
            newOptions.event_types.push(ev.type.id);
            filters.event_types.options.push({name: ev.type.name, value: ev.type.id, count: 0});
        }

        if (filters.venues && filters.venues.values.length === 0 && ev.location && !newOptions.venues.includes(ev.location.id)) {
            newOptions.venues.push(ev.location.id);
            filters.venues.options.push({name: ev.location.name, value: ev.location.id, count: 0});
        }

        if (filters.track_groups && filters.track_groups.values.length === 0){
            ev.track.track_groups.forEach(tg => {
                if (!newOptions.track_groups.includes(tg)) {
                    newOptions.track_groups.push(tg);
                    const trackg = summit.track_groups.find(t => t.id === tg.id);
                    filters.track_groups.options.push({name: trackg.name, value: trackg.id, count: 0});
                }
            });
        }

        if (filters.tags && filters.tags.values.length === 0 && ev.tags.length > 0){
            ev.tags.forEach(t => {
                if (!newOptions.tags.includes(t.id)) {
                    newOptions.tags.push(t.id);
                    filters.tags.options.push({name: t.tag, value: t.id, count: 0});
                }

                filters.tags.options.find(tt => tt.value === t.id).count++;
            });
        }

        if (filters.speakers && filters.speakers.values.length === 0 && ev.speakers.length > 0){
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

export default WidgetReducer
