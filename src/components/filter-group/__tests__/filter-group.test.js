import React from 'react';
import { cleanup, fireEvent, waitFor, render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import * as actions from '../../../actions';
import { Provider } from 'react-redux';

import FilterGroup from "..";
import FilterSpeaker from '../../filter-speakers';
import FilterTag from '../../filter-tags';

import MockData from '../../../dummy_data/filters.json';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({})

const mockFilterCheckbox = MockData.find(data => data.filterType === 'date');
const mockFilterSpeakers = MockData.find(data => data.filterType === 'speakers');
const mockFilterTag = MockData.find(data => data.filterType === 'tags');
const unknowFilterType = { ...mockFilterTag, filterType: 'not a case' }

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
    const { getByTestId } = render(<Provider store={store}><FilterGroup filter={mockFilterCheckbox} changeFilter={mockCallBack} /></Provider>);

    const title = getByTestId('filter-group-title');
    await waitFor(() => expect(screen.queryByTestId('filter-group-options')).toBeVisible());
    fireEvent.click(title);
    await waitFor(() => expect(screen.queryByTestId('filter-group-options')).toHaveStyle({ height: "0px" }));
});


it('FilterGroup render a checkbox filter group ', async () => {
    const { getAllByTestId } = render(<Provider store={store}><FilterGroup filter={mockFilterCheckbox} changeFilter={mockCallBack} /></Provider>);

    const checkboxGroup = getAllByTestId('checkbox-wrapper');
    await waitFor(() => expect(checkboxGroup.length).toBeGreaterThan(0));
});

it('FilterGroup render a speaker filter group ', async () => {
    const { getAllByTestId } = render(<Provider store={store}><FilterGroup filter={mockFilterSpeakers} changeFilter={mockCallBack} /></Provider>);

    const speakerGroup = getAllByTestId('speakers-wrapper');
    await waitFor(() => expect(speakerGroup.length).toBeGreaterThan(0));
});

it('FilterGroup render a tag filter group ', async () => {
    const { getAllByTestId } = render(<Provider store={store}><FilterGroup filter={mockFilterTag} changeFilter={mockCallBack} /></Provider>);

    const tagGroup = getAllByTestId('tag-button');
    await waitFor(() => expect(tagGroup.length).toBeGreaterThan(0));
});

it('FilterGroup should not render anything if the filter type is unknow ', async () => {
    
    const { getByTestId } = render(<Provider store={store}><FilterGroup filter={unknowFilterType} changeFilter={mockCallBack} /></Provider>);

    const group = getByTestId('filter-group-options');
    await waitFor(() => expect(group.firstChild.childNodes.length).toBeFalsy());
});