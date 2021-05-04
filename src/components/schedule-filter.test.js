import React from 'react';
import { cleanup, fireEvent, waitFor, render as rtlRender } from '@testing-library/react';
import { getAllByTestId, screen, within } from '@testing-library/dom'
import '@testing-library/jest-dom';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import * as actions from '../actions';
import WidgetReducer from '../reducer';
import { createStore } from 'redux'
import { Provider } from 'react-redux';

import ScheduleFilter from './schedule-filter';
import MockData from '../settings.json';
import MockMarketingData from '../marketing-data.json';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const mockCallBack = jest.fn();

export const renderWithState = (
    ui,
    {
        initialState,
        ...renderOptions
    } = {}
) => {
    const store = mockStore({ WidgetReducer, ...initialState });    
    const Wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
    );

    return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// Note: running cleanup fterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it('ScheduleFilter render the correct title', async () => {
    const { getByTestId } = renderWithState(
        <ScheduleFilter
            updateEvent={mockCallBack}
            onRef={mockCallBack}
            settings={{
                title: "Test title",
                marketingData: MockMarketingData,
                onRef: mockCallBack
            }}
            filters={MockData} />,
        { initialState: { settings: { title: "Test title", onRef: mockCallBack, marketingData: MockMarketingData }, filters: MockData } }
    );

    const title = getByTestId('schedule-filter-title');
    await waitFor(() => expect(title.innerHTML).toEqual("Test title"));
});

it('ScheduleFilter should render the correct number of filters', async () => {

    const { getByTestId } = renderWithState(
        <ScheduleFilter
            updateEvent={mockCallBack}
            onRef={mockCallBack}
            settings={{
                title: "Test title",
                marketingData: MockMarketingData,
                onRef: mockCallBack
            }}
            filters={MockData} />,
        { initialState: { settings: { title: "Test title", onRef: mockCallBack, marketingData: MockMarketingData }, filters: MockData } }
    );
    
    const expectedGroups = MockData.filter(f => f.is_enabled === true).length;    
    const filterList = getByTestId('schedule-filter-list');
    const filterGroups = within(filterList).getAllByTestId('filter-group-wrapper');

    await waitFor(() => expect(filterGroups.length).toEqual(expectedGroups));
});