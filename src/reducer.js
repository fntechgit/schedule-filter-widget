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

import { LOGOUT_USER } from 'openstack-uicore-foundation/lib/actions';


import {
    START_WIDGET_LOADING,
    STOP_WIDGET_LOADING,
    LOAD_INITIAL_VARS,
    UPDATE_FILTER_OPTIONS
} from './actions';

const DEFAULT_STATE = {
    settings: {
        title: "Filter by",
        marketingData: null,
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
            const {summit, events, filters, triggerAction, marketingData, ...rest} = payload;

            Object.keys(marketingData).forEach(setting => {
                if (getComputedStyle(document.documentElement).getPropertyValue(`--${setting}`)) {
                    document.documentElement.style.setProperty(`--${setting}`, marketingData[setting]);
                    document.documentElement.style.setProperty(`--${setting}50`, `${marketingData[setting]}50`);
                }
            });

            const filtersWithOptions = updateFilterOptions(summit, events, filters);

            return {
                ...state,
                summit,
                events,
                filters,
                filtersWithOptions,
                settings: {
                    ...state.settings,
                    ...rest,
                    marketingData,
                    triggerAction
                }
            };
        }
        case UPDATE_FILTER_OPTIONS: {

        }
        default: {
            return state;
        }
    }
};

const updateFilterOptions = (summit, events, filters) => {
  const {dates_with_events: dates, levels, tracks, track_groups, event_types} = summit;
  const newOptions = {date: [], level: [], track: [], track_group: [], event_type: [], tag: [], venue: [], speaker: []};
  const filterKeys = Object.keys(filters);

    filterKeys.forEach(k => {
        filters[k].options = [];
    });


  events.forEach(ev => {
      if (filters.date && !newOptions.date.includes(ev.start_date)) {
          newOptions.date.push(ev.start_date);
          filters.date.options.push({name: ev.start_date, value: ev.start_date, count: 0});
      }

      if (filters.level && ev.level !== 'N/A' && !newOptions.level.includes(ev.level)) {
          newOptions.level.push(ev.level);
          filters.level.options.push({name: ev.level, value: ev.level, count: 0});
      }

      if (filters.track && !newOptions.track.includes(ev.track.id)) {
          newOptions.track.push(ev.track.id);
          filters.track.options.push({name: ev.track.name, value: ev.track.id, count: 0});
      }

      if (filters.event_type && !newOptions.event_type.includes(ev.type.id)) {
          newOptions.event_type.push(ev.type.id);
          filters.event_type.options.push({name: ev.type.name, value: ev.type.id, count: 0});
      }

      if (filters.venue && ev.location && !newOptions.venue.includes(ev.location.id)) {
          newOptions.venue.push(ev.location.id);
          filters.venue.options.push({name: ev.location.name, value: ev.location.id, count: 0});
      }

      if (filters.track_group){
          ev.track.track_groups.forEach(tg => {
              if (!newOptions.track_group.includes(tg)) {
                  newOptions.track_group.push(tg);
                  const trackg = summit.track_groups.find(t => t.id === tg.id);
                  filters.track_group.options.push({name: trackg.name, value: trackg.id, count: 0});
              }
          });
      }

      if (filters.tag && ev.tags.length > 0){
          ev.tags.forEach(t => {
              if (!newOptions.tag.includes(t.id)) {
                  newOptions.tag.push(t.id);
                  filters.tag.options.push({name: t.tag, value: t.id, count: 0});
              }
          });
      }


      if (filters.speaker && ev.speakers.length > 0){
          ev.speakers.forEach(s => {
              if (!newOptions.speaker.includes(s.id)) {
                  newOptions.speaker.push(s.id);
                  filters.speaker.options.push({name: `${s.first_name} ${s.last_name}`, value: s.id, count: 0});
              }
          })
      }

  });

  return filters;
};

export default WidgetReducer
