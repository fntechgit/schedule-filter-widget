import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from '../actions'
import * as types from '../actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

import MockData from '../settings.json';

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
})