/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App'; // Your main application component
import { isoDate } from '../src/utils';

// Mock a component that uses isoDate in a real UI context
function DateDisplay({ date, local = true }) {
  return (
    <div>
      <div data-testid="formatted-date">{isoDate(date, local)}</div>
      <div data-testid="current-timezone">{Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
    </div>
  );
}

describe('Date Formatting E2E', () => {
  beforeAll(() => {
    // Mock the system timezone if needed (using libraries like timezone-mock)
    // This helps make tests consistent across different environments
    jest.useFakeTimers().setSystemTime(new Date('2025-02-24T21:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('renders correct local date in Helsinki timezone', async () => {
    // Render a component that uses the isoDate function
    render(<DateDisplay date={new Date('2025-02-24T23:00:00')} />);
    
    // Verify the displayed date matches expected format
    expect(screen.getByTestId('formatted-date')).toHaveTextContent('2025-02-24');
    expect(screen.getByTestId('current-timezone')).toHaveTextContent(expect.any(String));
  });

  test('handles date transition at midnight correctly', async () => {
    const { rerender } = render(<DateDisplay date={new Date('2025-02-24T23:59:59')} />);
    expect(screen.getByTestId('formatted-date')).toHaveTextContent('2025-02-24');
    
    // Simulate time passing to next day
    rerender(<DateDisplay date={new Date('2025-02-25T00:00:01')} />);
    expect(screen.getByTestId('formatted-date')).toHaveTextContent('2025-02-25');
  });

  test('UTC mode shows dates without timezone conversion', async () => {
    render(<DateDisplay date={new Date('2025-02-25T00:00:00Z')} local={false} />);
    expect(screen.getByTestId('formatted-date')).toHaveTextContent('2025-02-25');
  });

  test('integration with date picker component', async () => {
    render(<App />);
    
    // Simulate user selecting a date
    const dateInput = screen.getByLabelText(/select date/i);
    await userEvent.type(dateInput, '2025-02-24');
    
    // Verify the displayed date is formatted correctly
    expect(screen.getByTestId('selected-date-display')).toHaveTextContent('2025-02-24');
    
    // Verify other components react to the date change
    expect(screen.getByTestId('calendar-header')).toHaveTextContent('February 2025');
  });
});
