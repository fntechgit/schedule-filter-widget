import reducer from '../reducer'
import * as types from '../actions'
import { LOGOUT_USER } from 'openstack-uicore-foundation/lib/actions';

import MockData from '../dummy_data/filters.json';
import MockMarketingData from '../dummy_data/marketing-data.json';

const dateMockOption = MockData.find(f => f.filterType === 'date').options[0];

describe('filter reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(
            {
                settings: {
                    title: null,
                    filterCallback: null,
                    marketingData: null,
                },
                filters: [],
                filtered: [],
                widgetLoading: false,
                firstLoad: false,
            }
        )
    });

    it('should clear the reducer', () => {
        expect(reducer({}, {
            type: LOGOUT_USER
        })).toEqual(
            {
                settings: {
                    title: null,
                    filterCallback: null,
                    marketingData: null,
                },
                filters: [],
                filtered: [],
                widgetLoading: false,
                firstLoad: false,
            }
        )
    });

    it('should load the initial vars', () => {
        expect(reducer({}, {
            type: types.LOAD_INITIAL_VARS,
            payload: {
                title: 'Testing',
                marketingData: MockMarketingData,
                filterCallback: () => console.log('filter callback'),
                filtersData: MockData,
            }
        })).toMatchObject(
            {
                filters: MockData,
                settings: {
                    title: 'Testing',
                    marketingData: MockMarketingData,
                    filterCallback: () => console.log('filter callback')
                }
            }
        )
    });


    it('should add a filter to the reducer', () => {
        expect(reducer({}, {
            type: types.ADD_FILTER,
            payload: {
                filterType: 'date',
                option: dateMockOption
            }
        })).toEqual(
            {
                filtered: [
                    { filterType: 'date', options: [dateMockOption] }
                ]
            }
        )
    });

    it('should remove an existing filter from the reducer', () => {
        expect(reducer(
            {
                filtered: [
                    { filterType: 'date', options: [dateMockOption] }
                ]
            }, {
            type: types.REMOVE_FILTER,
            payload: {
                filterType: 'date',
                option: dateMockOption
            }
        })).toEqual(
            {
                filtered: []
            }
        )
    });

    it('should reset the filters applied', () => {
        expect(reducer({}, {
            type: types.RESET_FILTERS
        })).toEqual(
            {
                filtered: [],
            }
        )
    });

    it('should set the widget load to true', () => {
        expect(reducer({
            widgetLoading: false
        }, {
            type: types.START_WIDGET_LOADING
        })).toMatchObject(
            {
                widgetLoading: 1
            }
        )
    });

    it('should set the widget load to false', () => {
        expect(reducer({
            widgetLoading: true
        }, {
            type: types.STOP_WIDGET_LOADING
        })).toMatchObject(
            {
                widgetLoading: 0
            }
        )
    });

})