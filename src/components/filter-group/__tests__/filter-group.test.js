import React from 'react';
import { cleanup, fireEvent, waitFor, render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import * as actions from '../../../actions';
import { Provider } from 'react-redux';

import FilterGroup from "..";

import MockData from '../../../settings.json';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({})

const mockFilter = MockData.find(data => data.filterType === 'date');

const mockCallBack = jest.fn();

// Note: running cleanup fterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

const expectedActions = (filterType, filter, value) => [
    { type: actions.CHANGE_FILTER },
    { type: value ? actions.ADD_FILTER : actions.REMOVE_FILTER, payload: { filterType, option: filter } },
]

it('FilterGroup display and hide the options ', async () => {
    const { getByTestId } = render(<Provider store={store}><FilterGroup filter={mockFilter} changeFilter={mockCallBack} /></Provider>);

    const title = getByTestId('filter-group-title');
    await waitFor(() => expect(screen.queryByTestId('filter-group-options')).toBeVisible());
    fireEvent.click(title);
    await waitFor(() => expect(screen.queryByTestId('filter-group-options')).toHaveStyle({ height: "0px" }));
});

// it('FilterGroup display and hide the options ', async () => {
//     const { getByTestId } = render(<Provider store={store}><FilterGroup filter={mockFilter} changeFilter={(filter, value) => expectedActions(mockFilter.filterType, filter, value)} /></Provider>);

//     const options = getByTestId('filter-group-options');
//     const firstOption = options.firstChild;
//     // fireEvent.click(firstOption.firstChild);

//     // return store.dispatch(actions.changeFilter(filter, value)).then(() => {
//     //     // return of async actions
//     //     expect(store.getActions()).toEqual(expectedActions)
//     // })

// });