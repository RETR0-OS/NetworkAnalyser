// App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Anomaly Dashboard header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Anomaly Dashboard/i);
  expect(headerElement).toBeInTheDocument();
});
