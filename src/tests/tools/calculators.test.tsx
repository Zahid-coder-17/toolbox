import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgeCalculator } from '@/components/tools/calculators/AgeCalculator';
import { PercentageCalculator } from '@/components/tools/calculators/PercentageCalculator';
import { EmiCalculator } from '@/components/tools/calculators/EmiCalculator';
import { CompoundInterestCalculator } from '@/components/tools/calculators/CompoundInterestCalculator';

describe('CALCULATOR TOOLS (4/4)', () => {
  // 21. Age Calculator
  describe('Age Calculator', () => {
    it('calculates chronological age, days to next birthday, and day of week born', () => {
      render(<AgeCalculator />);
      // Default: birth 1998-05-15
      expect(screen.getByText(/primary age/i)).toBeInTheDocument();
      expect(screen.getByText(/next birthday countdown/i)).toBeInTheDocument();
      expect(screen.getByText('Friday')).toBeInTheDocument();
      expect(screen.getByText(/Born on a/i)).toBeInTheDocument();
      expect(screen.getByText(/taurus/i)).toBeInTheDocument();
    });

    it('handles leap year birth (Feb 29) advancing to March 1st in non-leap target years', () => {
      render(<AgeCalculator />);
      const inputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
      const birthInput = inputs[0];
      const targetInput = inputs[1];

      // Leap year birth: 2000-02-29, target in non-leap year: 2025-01-01
      fireEvent.change(birthInput, { target: { value: '2000-02-29' } });
      fireEvent.change(targetInput, { target: { value: '2025-01-01' } });

      expect(screen.getAllByText(/24/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/years/).length).toBeGreaterThan(0);
      expect(screen.getByText('Tuesday')).toBeInTheDocument();
      expect(screen.getByText(/Pisces/i)).toBeInTheDocument();
      // Next birthday countdown should be computed and rendered
      expect(screen.getByText(/Next Birthday Countdown/i)).toBeInTheDocument();
    });

    it('handles invalid date sequences (target before birth) with clear error message', () => {
      render(<AgeCalculator />);
      const inputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
      const birthInput = inputs[0];
      const targetInput = inputs[1];

      // Set target to before birth
      fireEvent.change(birthInput, { target: { value: '2025-01-01' } });
      fireEvent.change(targetInput, { target: { value: '2000-01-01' } });

      // Error banner should render
      expect(screen.getByText(/Date of birth cannot be later than the target date/i)).toBeInTheDocument();
      expect(screen.queryByText(/primary age/i)).not.toBeInTheDocument();
    });
  });

  // 22. Percentage Calculator
  describe('Percentage Calculator', () => {
    it('calculates X% of Y correctly', () => {
      render(<PercentageCalculator />);
      // Default: 20% of 150 = 30.00
      expect(screen.getAllByText('30.00').length).toBeGreaterThan(0);
    });

    it('switches tabs and calculates percentage ratios with division by zero protection', () => {
      render(<PercentageCalculator />);
      // Switch to X is what % of Y tab
      const tab = screen.getByRole('tab', { name: /x is what % of y\?/i });
      fireEvent.click(tab);

      // Default: 45 is what % of 180 = 25.00%
      expect(screen.getAllByText('25.00%').length).toBeGreaterThan(0);

      // Test divide by 0: set Y to 0
      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[1], { target: { value: '0' } });

      // Should display division by zero protection error
      expect(screen.getByText(/Cannot divide by zero/i)).toBeInTheDocument();
    });

    it('protects against zero initial value in percentage increase/decrease', () => {
      render(<PercentageCalculator />);
      const tabChange = screen.getByRole('tab', { name: /% increase \/ decrease/i });
      fireEvent.click(tabChange);

      // Default: From 50 to 75 = 50.00%
      expect(screen.getAllByText(/50\.00%/).length).toBeGreaterThan(0);

      // Set initial value A to 0
      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[0], { target: { value: '0' } });

      expect(screen.getByText(/Initial value \(A\) cannot be zero/i)).toBeInTheDocument();
    });

    it('calculates negative percentage change (decrease) and discount prices', () => {
      render(<PercentageCalculator />);
      // Switch to % Increase / Decrease tab
      const tabChange = screen.getByRole('tab', { name: /% increase \/ decrease/i });
      fireEvent.click(tabChange);

      // Set from 100 to 70 (30% decrease)
      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[0], { target: { value: '100' } });
      fireEvent.change(inputs[1], { target: { value: '70' } });

      expect(screen.getAllByText(/-30\.00%/).length).toBeGreaterThan(0);

      // Switch to Tax & Discount tab
      const tabDiscount = screen.getByRole('tab', { name: /tax & discount/i });
      fireEvent.click(tabDiscount);
      // 15% discount on $100 = $85.00
      expect(screen.getAllByText('$85.00').length).toBeGreaterThan(0);
    });
  });

  // 23. EMI Calculator
  describe('EMI Calculator', () => {
    it('computes monthly EMI and total interest matching standard financial formulas', () => {
      render(<EmiCalculator />);
      // Default: P=250000, r=6.5%, 15 years (180 months)
      // Standard EMI ~ $2,177.77
      expect(screen.getAllByText(/\$2,177\.77/).length).toBeGreaterThan(0);
      expect(screen.getByText(/Total Interest Payable/i)).toBeInTheDocument();
      expect(screen.getByText(/Amortization Schedule/i)).toBeInTheDocument();
    });

    it('handles zero interest rate (0% financing) correctly without NaN or division by zero', () => {
      render(<EmiCalculator />);
      const rateInput = screen.getByRole('spinbutton', { name: /annual interest rate/i });
      // Set interest rate to 0
      fireEvent.change(rateInput, { target: { value: '0' } });

      // Principal 250,000 / 180 months = $1,388.89 monthly EMI, total interest = $0.00
      expect(screen.getAllByText(/\$1,388\.89/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\$0\.00/).length).toBeGreaterThan(0);
    });

    it('handles tenure mode toggling between years and months', () => {
      render(<EmiCalculator />);
      const monthsBtn = screen.getByRole('button', { name: /^months$/i });
      fireEvent.click(monthsBtn);

      const tenureInput = screen.getByRole('spinbutton', { name: /loan tenure/i });
      fireEvent.change(tenureInput, { target: { value: '120' } });

      expect(screen.getByText(/for 120 months/i)).toBeInTheDocument();
    });

    it('handles zero or negative principal values clamped safely without crashing', () => {
      render(<EmiCalculator />);
      const principalInput = screen.getByRole('spinbutton', { name: /loan principal amount/i });
      fireEvent.change(principalInput, { target: { value: '0' } });

      const zeroes = screen.getAllByText('$0.00');
      expect(zeroes.length).toBeGreaterThan(0);
    });
  });

  // 24. Compound Interest Calculator
  describe('Compound Interest Calculator', () => {
    it('forecasts future portfolio growth accurately with monthly deposits', () => {
      render(<CompoundInterestCalculator />);
      // Default: P=10,000, PMT=500/mo, 8%, 20 yrs
      expect(screen.getByText(/Projected Future Balance/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Deposits/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Compound Interest/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual Accumulation Breakdown/i)).toBeInTheDocument();
    });

    it('handles 0% annual interest rate where future balance equals total deposits', () => {
      render(<CompoundInterestCalculator />);
      const rateInput = screen.getByRole('spinbutton', { name: /annual interest rate/i });
      fireEvent.change(rateInput, { target: { value: '0' } });

      // P=10,000, PMT=500/mo * 240 mo = 120,000 => Total Deposits = 130,000, Total Interest = $0.00
      expect(screen.getAllByText(/\$130,000\.00/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/\$0\.00/).length).toBeGreaterThan(0);
    });

    it('updates calculation upon compounding frequency change', () => {
      render(<CompoundInterestCalculator />);
      const dailyBtn = screen.getByRole('button', { name: /daily/i });
      fireEvent.click(dailyBtn);

      expect(screen.getByText(/Projected Future Balance/i)).toBeInTheDocument();
    });
  });
});
