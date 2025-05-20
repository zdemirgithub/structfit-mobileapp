/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import { isoDate } from '../src/utils';

// Integration component using isoDate and other app parts
function DateDisplay({ date, local = true }) {
  return (
    <div>
      <div data-testid="formatted-date">{isoDate(date, local)}</div>
      <div data-testid="current-timezone">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
    </div>
  );
}

describe('Date Integration Tests', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-02-24T21:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('DateDisplay integrates isoDate and timezone correctly', () => {
    render(<DateDisplay date={new Date('2025-02-24T23:00:00')} />);
    expect(screen.getByTestId('formatted-date')).toHaveTextContent('2025-02-24');
    expect(screen.getByTestId('current-timezone')).toHaveTextContent(expect.any(String));
  });

  test('DateDisplay updates formatted date on prop change', () => {
    const { rerender } = render(<DateDisplay date={new Date('2025-02-24T23:59:59')} />);
    expect(screen.getByTestId('formatted-date')).toHaveTextContent('2025-02-24');

    rerender(<DateDisplay date={new Date('2025-02-25T00:00:01')} />);
    expect(screen.getByTestId('formatted-date')).toHaveTextContent('2025-02-25');
  });

  test('DateDisplay respects UTC mode', () => {
    render(<DateDisplay date={new Date('2025-02-25T00:00:00Z')} local={false} />);
    expect(screen.getByTestId('formatted-date')).toHaveTextContent('2025-02-25');
  });

  test('App integrates date input, formatting, and calendar display', async () => {
    render(<App />);

    const dateInput = screen.getByLabelText(/select date/i);
    await userEvent.clear(dateInput);
    await userEvent.type(dateInput, '2025-02-24');

    expect(screen.getByTestId('selected-date-display')).toHaveTextContent('2025-02-24');
    expect(screen.getByTestId('calendar-header')).toHaveTextContent('February 2025');
  });
});
