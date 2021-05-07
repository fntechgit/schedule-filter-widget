import { waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom'

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from '../actions'
import * as types from '../actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

import MockData from '../settings.json';
import MockMarketingData from '../marketing-data.json';

const dateMockOption = MockData.find(f => f.filterType === 'date').options[0];

describe('filter actions', () => {
    it('should add a filter', () => {
        const filterType = 'date'

        const expectedActions = [
            {
                type: types.CHANGE_FILTER
            },
            {
                type: types.ADD_FILTER,
                payload: {
                    filterType,
                    option: dateMockOption
                }
            }
        ]

        const store = mockStore({ settings: { filterCallback: (action, ev) => console.log('change filter', action, ev) } });
        store.dispatch(actions.changeFilter(filterType, dateMockOption, true))
        expect(store.getActions()).toEqual(expectedActions)
    });

    it('should remove a filter', () => {
        const filterType = 'date'

        const expectedActions = [
            {
                type: types.CHANGE_FILTER
            },
            {
                type: types.REMOVE_FILTER,
                payload: {
                    filterType,
                    option: dateMockOption
                }
            }
        ]

        const store = mockStore({ settings: { filterCallback: (action, ev) => console.log('change filter', action, ev) } });
        store.dispatch(actions.changeFilter(filterType, dateMockOption, false))
        expect(store.getActions()).toEqual(expectedActions)
    });

    it('should reset filters', () => {

        const expectedAction = [
            {
                type: types.RESET_FILTERS,
                payload: {}
            }
        ]

        const store = mockStore({});
        store.dispatch(actions.clearFilters())
        expect(store.getActions()).toEqual(expectedAction)
    });

    it('should apply the colors as variables to the widget', async () => {
        const expectedActions = [
            { type: types.START_WIDGET_LOADING, payload: {} },
            { type: types.RECEIVE_MARKETING_SETTINGS, payload: {} },
            { type: types.STOP_WIDGET_LOADING, payload: {} }
        ]

        const store = mockStore({ settings: { marketingData: MockMarketingData } });
        store.dispatch(actions.setMarketingSettings());
        expect(store.getActions()).toEqual(expectedActions);


        const getHTMLStyles = () => {
            const HTML = document.getElementsByTagName("html");
            console.log(HTML[0].getAttribute("style"));
            for (let i = 0; i < HTML.length; i += 1) {
                if (HTML[i].getAttribute("style")) {
                    console.log('yay');
                    return HTML[i].getAttribute("style");
                }
            }
            return "";
        }

        await waitFor(() => console.log('test head styles', getHTMLStyles()));

        // TODO: Check the styles on the html for the colors
        // await waitFor(() => expect(screen.toHaveStyle(`--color_primary:${MockMarketingData.colors.color_primary}`)));

    });
})