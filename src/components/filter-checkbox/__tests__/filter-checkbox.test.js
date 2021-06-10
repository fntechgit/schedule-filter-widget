import React from 'react';
import { cleanup, fireEvent, render as rtlRender, render, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom';

import FilterCheckbox from "..";

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk'
import { Provider } from 'react-redux';
import WidgetReducer from '../../../reducer';
import * as actions from '../../../actions';
import MockMarketingData from '../../../dummy_data/marketing-data.json';
import MockData from '../../../dummy_data/filters.json';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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

const mockOption = MockData.find(data => data.filterType === 'date').options[0];

const mockCallBack = jest.fn();

// Note: running cleanup fterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

it('FilterChecbox triggers onFilterChange function on click', () => {
    const { getByTestId } = render(<FilterCheckbox option={mockOption} onFilterChange={mockCallBack} />);

    const wrapper = getByTestId('checkbox-wrapper');
    fireEvent.click(wrapper);
    expect(mockCallBack.mock.calls.length).toEqual(1);
});

it('FilterChecbox changes checkmark after click', async () => {

    const onFilterChange = (option, value) => {
        actions.changeFilter('date', option, value);
    }

    const { getByTestId } = renderWithState(
        <FilterCheckbox option={mockOption} onFilterChange={onFilterChange} />,
        { initialState: { settings: { title: "Test title", marketingData: MockMarketingData }, filters: MockData, filtered: [{filterType: 'date', options: [mockOption]}] } }
    );

    const wrapper = getByTestId('checkbox-wrapper');
    fireEvent.click(wrapper);
    const checkmark = await waitFor(() => screen.queryByTestId('checkmark'));    
    await waitFor(() => expect(checkmark).toBeVisible());
    fireEvent.click(wrapper);
    await waitFor(() => expect(checkmark).not.toBeVisible());

});

it("FilterChecbox has a custom color when the color setting it's passed", () => {
    const { getByTestId } = render(<FilterCheckbox option={mockOption} filtered={true} onFilterChange={mockCallBack} applyColors={true} />);

    const checkbox = screen.queryByTestId('checkbox');
    expect(checkbox).toHaveStyle(`background-color: ${mockOption.color}`);
});
