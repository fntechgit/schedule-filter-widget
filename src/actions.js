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

import { createAction } from "openstack-uicore-foundation/lib/methods";

export const START_WIDGET_LOADING    = 'START_WIDGET_LOADING';
export const STOP_WIDGET_LOADING     = 'STOP_WIDGET_LOADING';
export const LOAD_INITIAL_VARS       = 'LOAD_INITIAL_VARS';
export const UPDATE_FILTERS          = 'UPDATE_FILTERS';


const startWidgetLoading = () => (dispatch) => {
    dispatch(createAction(START_WIDGET_LOADING)({}));
};

const stopWidgetLoading = () => (dispatch) => {
    dispatch(createAction(STOP_WIDGET_LOADING)({}));
};

export const loadSettings = (settings) => (dispatch) => {
    dispatch(createAction(START_WIDGET_LOADING)({}))
    dispatch(createAction(LOAD_INITIAL_VARS)(settings));
};

export const updateFilters = (events, filters) => (dispatch) => {
    dispatch(createAction(START_WIDGET_LOADING)({}))
    dispatch(createAction(UPDATE_FILTERS)({events, filters}));
};



