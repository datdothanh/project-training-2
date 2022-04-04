import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DateRange from '../DateRange';
import { useDispatch } from 'react-redux';
import 'react-dates/initialize';
import { BrowserRouter } from 'react-router-dom';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('DateRange', () => {
  const mockDispatch = jest.fn();
  beforeEach(() => {
    useDispatch.mockImplementation(() => mockDispatch);
  });
  afterEach(() => {
    useDispatch.mockClear();
  });
  it('renders correctly', () => {
    const { container } = render(
      <BrowserRouter>
        <DateRange />
      </BrowserRouter>
    );
    expect(container).toMatchSnapshot();
    expect(container).toBeTruthy();
    expect(container.getElementsByClassName('dateRange'));
  });
  it('change date range and dispatch', () => {
    const { container, getByRole } = render(
      <BrowserRouter>
        <DateRange />
      </BrowserRouter>
    );
    getByRole('textbox', { name: /Start Date/i }).focus();
    expect(getByRole('textbox', { name: /Start Date/i }).value).toEqual('04/01/2022');
    expect(container).toMatchSnapshot();
    fireEvent.click(getByRole('button', { name: /OKE/i }));
    expect(mockDispatch).toHaveBeenCalled();
  });
});