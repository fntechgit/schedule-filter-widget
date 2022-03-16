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
    speakers: [],
    company: [],
    title: '',
    custom_order: '',
    abstract: '',
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

            // mark title filter as freeText so that we show it regardless it has no options

            if (filters.title) {
                filtersWithOptions.title = {...filters.title, freeText: true};
            }
            if (filters.custom_order) {
                filtersWithOptions.custom_order = {...filters.custom_order, freeText: true};
            }
            if (filters.abstract) {
                filtersWithOptions.abstract = {...filters.abstract, freeText: true};
            }

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

            // mark title filter as freeText so that we show it regardless it has no options
            if(filters.title)
                filtersWithOptions.title = {...filters.title, freeText: true};
            if(filters.custom_order)
                filtersWithOptions.custom_order = {...filters.custom_order, freeText: true};
            if(filters.abstract)
                filtersWithOptions.abstract = {...filters.abstract, freeText: true};

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
    // create a deep copy of the original filter param
    const newFilters = cloneDeep(filters);
    const filterKeys = Object.keys(newFilters);


    filterKeys.forEach(k => {
        newFilters[k].options = [];

        // if the filter has values, ie is active, we show all options regardless of the events shown
        if (newFilters[k].values.length > 0) {
            // we populate the options
            newFilters[k].options = allOptions[k];
            // we skip the filter
            delete(newOptions[k]);
        }
    });

    events.forEach(ev => {
        if (newFilters.date && newOptions.date && ev.type?.allows_publishing_dates) {
            const dateObj = epochToMomentTimeZone(ev.start_date, summit.time_zone_id);
            const date = dateObj.format('YYYY-MM-DD');

            if (!newOptions.date.includes(date)) {
                const day = dateObj.format('dddd');
                const month = dateObj.format('MMMM D');

                newOptions.date.push(date);
                newFilters.date.options.push({name: [day, month], value: date, count: 0});
            }
        }

        if (newFilters.level && newOptions.level && ev.level && ev.level !== 'N/A' && !newOptions.level.includes(ev.level)) {
            newOptions.level.push(ev.level);
            newFilters.level.options.push({name: ev.level, value: ev.level.toLowerCase(), count: 0});
        }

        if (newFilters.track && newOptions.track && ev.track && !newOptions.track.includes(ev.track.id)) {
            newOptions.track.push(ev.track.id);
            newFilters.track.options.push({name: ev.track.name, value: ev.track.id, count: 0, color: ev.track.color});
        }

        if (newFilters.event_types && newOptions.event_types && ev.type && !newOptions.event_types.includes(ev.type.id)) {
            newOptions.event_types.push(ev.type.id);
            newFilters.event_types.options.push({name: ev.type.name, value: ev.type.id, count: 0, color: ev.type.color});
        }

        if (newFilters.venues && newOptions.venues && ev.location && !newOptions.venues.includes(ev.location.id)) {
            newOptions.venues.push(ev.location.id);
            newFilters.venues.options.push({name: ev.location.name, value: ev.location.id, count: 0});
        }

        if (newFilters.track_groups && newOptions.track_groups && ev.track) {
            ev.track.track_groups.forEach(tg => {
                if (!newOptions.track_groups.includes(tg)) {
                    newOptions.track_groups.push(tg);
                    const trackg = summit.track_groups.find(t => t.id === tg);
                    newFilters.track_groups.options.push({name: trackg.name, value: trackg.id, count: 0, color: trackg.color});
                }
            });
        }

        if (newFilters.tags && newOptions.tags && ev.tags?.length > 0) {
            ev.tags.forEach(t => {
                if (!newOptions.tags.includes(t.id)) {
                    newOptions.tags.push(t.id);
                    newFilters.tags.options.push({name: t.tag, value: t.id, count: 1});
                } else {
                    newFilters.tags.options.find(tt => tt.value === t.id).count++;
                }
            });
        }

        if (newFilters.speakers && newOptions.speakers) {
            if (ev.speakers?.length > 0) {
                ev.speakers.forEach(s => {
                    if (!newOptions.speakers.includes(s.id)) {
                        newOptions.speakers.push(s.id);
                        const name = `${s.first_name} ${s.last_name}`;
                        newFilters.speakers.options.push({
                            name: name,
                            value: name.toLowerCase(),
                            id: s.id,
                            pic: s.pic,
                            count: 0
                        });
                    }
                })
            }

            if (ev.moderator && !newOptions.speakers.includes(ev.moderator.id)) {
                newOptions.speakers.push(ev.moderator.id);
                const name = `${ev.moderator.first_name} ${ev.moderator.last_name}`;
                newFilters.speakers.options.push({
                    name: name,
                    value: name.toLowerCase(),
                    id: ev.moderator.id,
                    pic: ev.moderator.pic,
                    count: 0
                });
            }
        }

        if (newFilters.company && newOptions.company) {
            if (ev.sponsors?.length > 0) {
                ev.sponsors.forEach(s => {
                    const lowerCaseName = s.name?.toLowerCase();
                    if (!newOptions.company.includes(lowerCaseName)) {
                        newOptions.company.push(lowerCaseName);
                        newFilters.company.options.push({name: s.name, value: lowerCaseName, id: lowerCaseName, count: 0});
                    }
                })
            }

            if (ev.speakers?.length > 0) {
                ev.speakers.forEach(s => {
                    const lowerCaseCompany = s.company?.toLowerCase();
                    if (s.company && !newOptions.company.includes(lowerCaseCompany)) {
                        newOptions.company.push(lowerCaseCompany);
                        newFilters.company.options.push({
                            name: s.company,
                            value: lowerCaseCompany,
                            id: lowerCaseCompany,
                            count: 0
                        });
                    }
                })
            }

            const lowerCaseModCompany = ev.moderator?.company?.toLowerCase();
            if (ev.moderator?.company && !newOptions.company.includes(lowerCaseModCompany)) {
                newOptions.company.push(lowerCaseModCompany);
                newFilters.company.options.push({
                    name: ev.moderator.company,
                    value: lowerCaseModCompany,
                    id: lowerCaseModCompany,
                    count: 0
                });
            }
        }

    });

    return newFilters;
};

const getAllOptions = (summit, events) => {
    const uniqueOptions = cloneDeep(ALL_FILTERS);
    const allOptions = cloneDeep(ALL_FILTERS);

    events.forEach(ev => {
        if(ev.type?.allows_publishing_dates) {
            const dateObj = epochToMomentTimeZone(ev.start_date, summit.time_zone_id);
            const date = dateObj.format('YYYY-MM-DD');

            if (!uniqueOptions.date.includes(date)) {
                const day = dateObj.format('dddd');
                const month = dateObj.format('MMMM D');

                uniqueOptions.date.push(date);
                allOptions.date.push({name: [day, month], value: date, count: 0});
            }
        }

        if (ev.level && ev.level !== 'N/A' && !uniqueOptions.level.includes(ev.level)) {
            // we need lowercase because of url hash filters
            uniqueOptions.level.push(ev.level);
            allOptions.level.push({name: ev.level, value: ev.level.toLowerCase(), count: 0});
        }

        if (ev.track && !uniqueOptions.track.includes(ev.track.id)) {
            uniqueOptions.track.push(ev.track.id);
            allOptions.track.push({name: ev.track.name, value: ev.track.id, count: 0, color: ev.track.color});
        }

        if (ev.type && !uniqueOptions.event_types.includes(ev.type.id)) {
            uniqueOptions.event_types.push(ev.type.id);
            allOptions.event_types.push({name: ev.type.name, value: ev.type.id, count: 0, color: ev.type.color});
        }

        if (ev.location && !uniqueOptions.venues.includes(ev.location.id)) {
            uniqueOptions.venues.push(ev.location.id);
            allOptions.venues.push({name: ev.location.name, value: ev.location.id, count: 0});
        }

        if (ev.track) {
            ev.track.track_groups.forEach(tg => {
                if (!uniqueOptions.track_groups.includes(tg)) {
                    uniqueOptions.track_groups.push(tg);
                    const trackg = summit.track_groups.find(t => t.id === tg);
                    allOptions.track_groups.push({name: trackg.name, value: trackg.id, count: 0, color: trackg.color});
                }
            });
        }

        if (ev.tags?.length > 0) {
            ev.tags.forEach(t => {
                if (!uniqueOptions.tags.includes(t.id)) {
                    uniqueOptions.tags.push(t.id);
                    allOptions.tags.push({name: t.tag, value: t.id, count: 1});
                } else {
                    allOptions.tags.find(tt => tt.value === t.id).count++;
                }
            });
        }

        if (ev.speakers?.length > 0) {
            ev.speakers.forEach(s => {
                if (!uniqueOptions.speakers.includes(s.id)) {
                    uniqueOptions.speakers.push(s.id);
                    const name = `${s.first_name} ${s.last_name}`;
                    allOptions.speakers.push({name: name, value: name.toLowerCase(), id: s.id, pic: s.pic, count: 0});
                }

                const lowerCaseCompany = s.company?.toLowerCase();
                if (s.company && !uniqueOptions.company.includes(lowerCaseCompany)) {
                    uniqueOptions.company.push(lowerCaseCompany);
                    allOptions.company.push({name: s.company, value: lowerCaseCompany, id: lowerCaseCompany, count: 0});
                }
            })
        }

        if (ev.moderator) {
            if (!uniqueOptions.speakers.includes(ev.moderator.id)) {
                uniqueOptions.speakers.push(ev.moderator.id);
                const name = `${ev.moderator.first_name} ${ev.moderator.last_name}`;
                allOptions.speakers.push({name: name, value: name.toLowerCase(), id: ev.moderator.id, pic: ev.moderator.pic, count: 0});
            }

            const lowerCaseModCompany = ev.moderator.company?.toLowerCase();
            if (ev.moderator.company && !uniqueOptions.company.includes(lowerCaseModCompany)) {
                uniqueOptions.company.push(lowerCaseModCompany);
                allOptions.company.push({name: ev.moderator.company, value: lowerCaseModCompany, id: lowerCaseModCompany, count: 0});
            }
        }

        if (ev.sponsors?.length > 0) {
            ev.sponsors.forEach(s => {
                const lowerCaseName = s.name?.toLowerCase();
                if (!uniqueOptions.company.includes(lowerCaseName)) {
                    uniqueOptions.company.push(lowerCaseName);
                    allOptions.company.push({name: s.name, value: lowerCaseName, id: lowerCaseName, count: 0});
                }
            })
        }

    });

    return allOptions;
};

export default WidgetReducer
