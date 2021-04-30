import React from 'react';
import { cleanup, fireEvent, waitFor, render } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom';

import FilterSpeaker from "..";

import MockData from '../../../settings.json';

const mockSpeakers = MockData.find(data => data.filterType === 'speakers').options;


const mockCallBack = jest.fn();

// Note: running cleanup fterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

it('FilterSpeaker display and hides the dropdown when the input is on focus/blur', async () => {
    const { getByTestId } = render(<FilterSpeaker options={mockSpeakers} onFilterChange={mockCallBack} />);

    const input = getByTestId('speakers-input');
    fireEvent.focus(input);
    const dropdown = screen.queryByTestId('speakers-dropdown');
    expect(dropdown).toBeVisible();
    fireEvent.blur(input);
    await waitFor(() => expect(dropdown).not.toBeVisible());
});


it('FilterSpeaker display the propper amount of speakers', () => {
    const { getByTestId } = render(<FilterSpeaker options={mockSpeakers} onFilterChange={mockCallBack} />);

    const input = getByTestId('speakers-input');
    fireEvent.focus(input);
    const dropdown = screen.queryByTestId('speakers-dropdown');
    expect(dropdown.querySelectorAll('div .speaker')).toHaveLength(mockSpeakers.length);
});

it('FilterSpeaker select a speakers from dropdown', async () => {
    const { getByTestId } = render(<FilterSpeaker options={mockSpeakers} onFilterChange={mockCallBack} />);

    const wrapper = getByTestId('speakers-wrapper');
    const input = getByTestId('speakers-input');
    fireEvent.focus(input);
    const dropdown = screen.queryByTestId('speakers-dropdown');
    fireEvent.click(dropdown.childNodes[0]);
    expect(mockCallBack.mock.calls.length).toEqual(1);
    const selected = getByTestId('speakers-selected');
    expect(selected.querySelectorAll('div')).toHaveLength(1);
    fireEvent.focus(input);
    await waitFor(() => expect(screen.queryByTestId('speakers-dropdown').querySelectorAll('div')).toHaveLength(mockSpeakers.length - 1));
});

it('FilterSpeaker removes a selected speaker', async () => {
    const { getByTestId } = render(<FilterSpeaker options={mockSpeakers} onFilterChange={mockCallBack} />);

    const input = getByTestId('speakers-input');
    fireEvent.focus(input);
    const dropdown = screen.queryByTestId('speakers-dropdown');
    fireEvent.click(dropdown.childNodes[0]);
    expect(mockCallBack.mock.calls.length).toEqual(1);
    const selected = getByTestId('speakers-selected');
    expect(selected.querySelectorAll('div')).toHaveLength(1);
    fireEvent.click(getByTestId('speakers-selected').firstChild);
    expect(mockCallBack.mock.calls.length).toEqual(2);
    expect(selected).not.toBeVisible();
    fireEvent.focus(input);
    screen.queryByTestId('speakers-dropdown');
    await waitFor(() => expect(screen.queryByTestId('speakers-dropdown').querySelectorAll('div')).toHaveLength(mockSpeakers.length));
});

it('FilterSpeaker search a speaker', async () => {
    const { getByTestId } = render(<FilterSpeaker options={mockSpeakers} onFilterChange={mockCallBack} />);

    const input = getByTestId('speakers-input');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Jeremy' } });    
    expect(input.value).toBe('Jeremy');
    const dropdown = screen.queryByTestId('speakers-dropdown');
    await waitFor(() => expect(dropdown.childNodes.length).toEqual(1));
    fireEvent.change(input, { target: { value: '' } });    
    await waitFor(() => expect(screen.queryByTestId('speakers-dropdown').childNodes.length).toEqual(mockSpeakers.length));    
});


// it("FilterSpeaker apply a custom class when it's clicked", () => {
//     const { getByTestId } = render(<FilterSpeaker option={mockTag} onFilterChange={mockCallBack} applyColors={true} />);

//     const button = getByTestId('tag-button');
//     fireEvent.click(button);
//     expect(button).toHaveClass('tagButtonActive');
//     fireEvent.click(button);
//     expect(button).not.toHaveClass('tagButtonActive');
// });
