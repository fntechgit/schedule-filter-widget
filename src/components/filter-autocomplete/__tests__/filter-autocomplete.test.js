import React from 'react';
import { cleanup, fireEvent, waitFor, render } from '@testing-library/react';
import { getByText, screen } from '@testing-library/dom'
import '@testing-library/jest-dom';

import FilterAutocomplete from "..";

import MockData from '../../../dummy_data/filters.json';

const mockSpeakers = MockData.find(data => data.filterType === 'speakers').options;


const mockCallBack = jest.fn();

// Note: running cleanup fterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

it('FilterSpeaker display and hides the dropdown when the input is on focus/blur', async () => {
    const { getByTestId } = render(<FilterAutocomplete options={mockSpeakers} onFilterChange={mockCallBack} />);

    const input = getByTestId('autocomplete-input');
    fireEvent.focus(input);
    const dropdown = screen.queryByTestId('autocomplete-dropdown');
    expect(dropdown).toBeVisible();
    fireEvent.blur(input);
    await waitFor(() => expect(dropdown).not.toBeVisible());
});


it('FilterSpeaker display the propper amount of speakers', () => {
    const { getByTestId } = render(<FilterAutocomplete options={mockSpeakers} onFilterChange={mockCallBack} />);

    const input = getByTestId('autocomplete-input');
    fireEvent.focus(input);
    const dropdown = screen.queryByTestId('autocomplete-dropdown');
    expect(dropdown.querySelectorAll('div .speaker')).toHaveLength(mockSpeakers.length);
});

it('FilterSpeaker select a speakers from dropdown', async () => {
    const { getByTestId } = render(<FilterAutocomplete options={mockSpeakers} onFilterChange={mockCallBack} />);

    const wrapper = getByTestId('autocomplete-wrapper');
    const input = getByTestId('autocomplete-input');
    fireEvent.focus(input);
    const dropdown = screen.queryByTestId('autocomplete-dropdown');
    fireEvent.click(dropdown.childNodes[0]);
    expect(mockCallBack.mock.calls.length).toEqual(1);
    const selected = getByTestId('autocomplete-selected');
    expect(selected.querySelectorAll('div')).toHaveLength(1);
    fireEvent.focus(input);
    await waitFor(() => expect(screen.queryByTestId('autocomplete-dropdown').querySelectorAll('div')).toHaveLength(mockSpeakers.length - 1));
});

it('FilterSpeaker removes a selected speaker', async () => {
    const { getByTestId } = render(<FilterAutocomplete options={mockSpeakers} onFilterChange={mockCallBack} />);

    const input = getByTestId('autocomplete-input');
    fireEvent.focus(input);
    const dropdown = screen.queryByTestId('autocomplete-dropdown');
    fireEvent.click(dropdown.childNodes[0]);
    expect(mockCallBack.mock.calls.length).toEqual(1);
    const selected = getByTestId('autocomplete-selected');
    expect(selected.querySelectorAll('div')).toHaveLength(1);
    fireEvent.click(getByTestId('autocomplete-selected').firstChild);
    expect(mockCallBack.mock.calls.length).toEqual(2);
    expect(selected).not.toBeVisible();
    fireEvent.focus(input);
    screen.queryByTestId('autocomplete-dropdown');
    await waitFor(() => expect(screen.queryByTestId('autocomplete-dropdown').querySelectorAll('div')).toHaveLength(mockSpeakers.length));
});

it('FilterSpeaker search a speaker', async () => {
    const { getByTestId } = render(<FilterSpeFilterAutocompleteaker options={mockSpeakers} onFilterChange={mockCallBack} />);

    const input = getByTestId('autocomplete-input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Jeremy' } });
    expect(input.value).toBe('Jeremy');
    const dropdown = screen.queryByTestId('autocomplete-dropdown');
    await waitFor(() => expect(dropdown.childNodes.length).toEqual(1));
    fireEvent.change(input, { target: { value: '' } });
    await waitFor(() => expect(screen.queryByTestId('autocomplete-dropdown').childNodes.length).toEqual(mockSpeakers.length));
});

it("FilterSpeaker shows a message when no speaker it's found", async () => {
    const { getByTestId, getByText } = render(<FilterAutocomplete options={mockSpeakers} onFilterChange={mockCallBack} />);

    const input = getByTestId('autocomplete-input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'asdasdasd' } });
    expect(input.value).toBe('asdasdasd');
    const dropdown = screen.queryByTestId('autocomplete-dropdown');
    await waitFor(() => expect(dropdown.childNodes.length).toEqual(1));
    const noResultText = getByText('There is no results for the search');
    await waitFor(() => expect(noResultText).toBeTruthy());
});
