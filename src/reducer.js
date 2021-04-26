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
import { LOGOUT_USER } from 'openstack-uicore-foundation/lib/actions';


import {
    START_WIDGET_LOADING,
    STOP_WIDGET_LOADING,
    LOAD_INITIAL_VARS,
    ADD_FILTER,
    REMOVE_FILTER,
    RESET_FILTERS
} from './actions';

const DEFAULT_STATE = {
    settings: {
        title: null,
        onRef: null,        
        filterCallback: null,
        marketingData: null,
    },
    summit: null,
    events: [],
    filters: [],
    filtered: [],
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
            return { ...state, widgetLoading };
        }
            break;
        case STOP_WIDGET_LOADING: {
            let widgetLoading = state.widgetLoading < 2 ? 0 : (state.widgetLoading - 1);
            return { ...state, widgetLoading };
        }
            break;
        case LOAD_INITIAL_VARS:

            const { filtersData } = payload;

            const newSettings = {
                title: payload.title,
                onRef: payload.onRef,
                filterCallback: payload.filterCallback,
                marketingData: payload.marketingData
            };

            return {
                ...state,
                filters: filtersData,
                settings: {
                    ...state.settings,
                    ...newSettings
                }
            };
            break;
        case RESET_FILTERS: {
            return { ...state, filters: [], filtered: [] };
        }
        case ADD_FILTER: {
            const { filterType, option } = payload;
            let newFilter = state.filtered.find(f => f.filterType === filterType) || [];
            const options = newFilter.options || [];
            newFilter = { filterType, options: [...options, option] };
            return { ...state, filtered: [...state.filtered.filter(f => f.filterType !== filterType), newFilter] };
        }
        case REMOVE_FILTER: {
            const { filterType, option } = payload;
            let newFilter = state.filtered.find(f => f.filterType === filterType) || [];
            newFilter = { filterType, options: [...newFilter.options.filter(f => f !== option)] };
            return { ...state, filtered: [...state.filtered.filter(f => f.filterType !== filterType), newFilter] };
        }
            break;
        default: {
            return state;
        }
    }

    return state
}

export default WidgetReducer
