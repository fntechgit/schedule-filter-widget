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

import {    
    createAction    
} from "openstack-uicore-foundation/lib/methods";

export const START_WIDGET_LOADING           = 'START_WIDGET_LOADING';
export const STOP_WIDGET_LOADING            = 'STOP_WIDGET_LOADING';
export const LOAD_INITIAL_VARS              = 'LOAD_INITIAL_VARS';
export const REQUEST_SUMMIT                 = 'REQUEST_SUMMIT';
export const RECEIVE_SUMMIT                 = 'RECEIVE_SUMMIT';
export const REQUEST_EVENTS                 = 'REQUEST_EVENTS';
export const RECEIVE_EVENTS                 = 'RECEIVE_EVENTS';
export const TOGGLE_FILTERS                 = 'TOGGLE_FILTERS';
export const RESET_FILTERS                  = 'RESET_FILTERS';
export const SET_FILTERS                    = 'SET_FILTERS';
export const RECEIVE_MARKETING_SETTINGS     = 'RECEIVE_MARKETING_SETTINGS';


const startWidgetLoading = () => (dispatch) => {
    dispatch(createAction(START_WIDGET_LOADING)({}));
};

const stopWidgetLoading = () => (dispatch) => {
    dispatch(createAction(STOP_WIDGET_LOADING)({}));
};

export const loadSession = (settings) => (dispatch) => {
    dispatch(createAction(LOAD_INITIAL_VARS)(settings));
    return Promise.resolve();
};

export const getSummitById = () => (dispatch, getState) => {
    dispatch(startWidgetLoading());

    let { settings } = getState();
    const { summitData } = settings;

    dispatch(createAction(REQUEST_SUMMIT));
    dispatch(createAction(RECEIVE_SUMMIT)(summitData));
    dispatch(getEvents(summitData));
    dispatch(stopWidgetLoading());
};

export const setMarketingSettings = () => (dispatch, getState) => {

    dispatch(startWidgetLoading());

    let { settings } = getState();
    let { marketingData } = settings;

    dispatch(createAction(RECEIVE_MARKETING_SETTINGS));


    Object.keys(marketingData).forEach(setting => {
        if (getComputedStyle(document.documentElement).getPropertyValue(`--${setting}`)) {
            document.documentElement.style.setProperty(`--${setting}`, marketingData[setting]);
            document.documentElement.style.setProperty(`--${setting}50`, `${marketingData[setting]}50`);
        }
    });

    dispatch(stopWidgetLoading());
};


/*********************************************************************************/
/*                               FILTERS                                         */
/*********************************************************************************/

export const setFilters = (filters) => (dispatch) => {
    dispatch(createAction(SET_FILTERS)({ filters }));
};

export const clearFilters = () => (dispatch, getState) => {
    dispatch(createAction(RESET_FILTERS)({}));
};

export const toggleFilters = () => {
    return { type: TOGGLE_FILTERS }
};


/*********************************************************************************/
/*                               EVENTS                                          */
/*********************************************************************************/

const getEventsFilter = (summit, settings, view, fullView, searchTerm) => {
    const { eventsData, sponsorId, roomId, trackId, speakerId, nowUtc, showAllEvents } = settings;
    let filteredEvents = [];

    if (searchTerm) {
        let regex = new RegExp(searchTerm, 'gi');
        filteredEvents = eventsData.filter(ev => ev.title.contains(regex) || ev.abstract.contains(regex) || ev.tags.contains(regex) || ev.speaker.contains(regex));
    } else if (fullView) {        
        if (sponsorId) {
            filteredEvents = eventsData.filter(ev => ev.sponsors.some(s => s.id == sponsorId));
        } else if (roomId) {
            filteredEvents = eventsData.filter(ev => ev.location_id == roomId);
        } else if (trackId) {
            filteredEvents = eventsData.filter(ev => ev.track && ev.track.id == trackId);
        } else if (speakerId) {
            filteredEvents = eventsData.filter(ev => ev.speakers.some(s => s.id == speakerId));
        }

        if (!showAllEvents) {
            filteredEvents = eventsData.filter(ev => ev.start_date >= nowUtc);
        }

    } else {
        switch (view.type) {
            case 'day':
                let date = summit.dates.find(d => d.string === view.value);
                filteredEvents = eventsData.filter(ev => ev.start_date >= date.startUtc && ev.end_date <= date.endUtc);
                break;
            case 'track':
                const track = summit.tracks.find(t => t.code && t.code.toLowerCase() === view.value.toLowerCase());
                if (track) filteredEvents = eventsData.filter(ev => ev.track && ev.track.id === track.id);
                break;
            case 'level':
                filteredEvents = eventsData.filter(ev => ev.level === view.value);
                break;
        }
    }

    return filteredEvents;
};

export const getEvents = (summitData = null, showLoading = true) => (dispatch, getState) => {
    let { summit, settings, view, searchTerm, fullView } = getState();

    if (showLoading) {
        dispatch(startWidgetLoading());
    }

    summit = summit ? summit : summitData;

    if (!summit) return;

    dispatch(createAction(REQUEST_EVENTS));
    
    const filteredEvents = getEventsFilter(summit, settings, view, fullView, searchTerm)
    
    dispatch(createAction(RECEIVE_EVENTS)(filteredEvents));

    dispatch(stopWidgetLoading());
};


/*********************************************************************************/
/*                               USER ACTIONS                                    */
/*********************************************************************************/


export const addEventToSchedule = (event) => (dispatch, getState) => {

    return new Promise((resolve, reject) => {
        dispatch(startWidgetLoading());

        let { settings: { eventCallback } } = getState();
    
        eventCallback(ADDED_TO_SCHEDULE, event)
            .then((event) => {
                dispatch(createAction(ADDED_TO_SCHEDULE)({event}));
                dispatch(stopWidgetLoading());
                resolve(event);
            }, (err) => {            
                dispatch(stopWidgetLoading());
                defaultErrorHandler(err);
                reject(err); 
            });    
    })    
};

export const removeEventFromSchedule = (event) => (dispatch, getState) => {

    return new Promise((resolve, reject) => {

    dispatch(startWidgetLoading());

    let { settings: { eventCallback } } = getState();

    eventCallback(REMOVED_FROM_SCHEDULE, event)
        .then((event) => {            
            dispatch(createAction(REMOVED_FROM_SCHEDULE)({event}));
            dispatch(stopWidgetLoading());
            resolve(event);
        }, (err) => {            
            dispatch(stopWidgetLoading());
            defaultErrorHandler(err);
            reject(err); 
        });    
    });
};