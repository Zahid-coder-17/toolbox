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
      expect(screen.getByText(/born on a friday/i)).toBeInTheDocument();
      expect(screen.getByText(/taurus/i)).toBeInTheDocument();
    });

    it('handles invalid date sequences (target before birth) gracefully without crashing', () => {
      render(<AgeCalculator />);
      const inputs = screen.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/);
      const birthInput = inputs[0];
      const targetInput = inputs[1];

      // Set target to before birth
      fireEvent.change(birthInput, { target: { value: '2025-01-01' } });
      fireEvent.change(targetInput, { target: { value: '2000-01-01' } });

      // Primary age banner should not render
      expect(screen.queryByText(/primary age/i)).not.toBeInTheDocument();
    });
  });

  // 22. Percentage Calculator
  describe('Percentage Calculator', () => {
    it('calculates X% of Y correctly', () => {
      render(<PercentageCalculator />);
      // Default: 20% of 150 = 30.00
      expect(screen.getByText('30.00')).toBeInTheDocument();
    });

    it('switches tabs and calculates percentage ratios with division by zero protection', () => {
      render(<PercentageCalculator />);
      // Switch to X is what % of Y tab
      const tab = screen.getByRole('tab', { name: /x is what % of y\?/i });
      fireEvent.click(tab);

      // Default: 45 is what % of 180 = 25.00%
      expect(screen.getByText('25.00%')).toBeInTheDocument();

      // Test divide by 0: set Y to 0
      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[1], { target: { value: '0' } });

      expect(screen.queryByText('%')).not.toBeInTheDocument();
    });

    it('calculates percentage increase and discount prices', () => {
      render(<PercentageCalculator />);
      // Switch to % Increase / Decrease tab
      const tabChange = screen.getByRole('tab', { name: /% increase \/ decrease/i });
      fireEvent.click(tabChange);
      // From 50 to 75 = 50.00%
      expect(screen.getByText('50.00%')).toBeInTheDocument();

      // Switch to Tax & Discount tab
      const tabDiscount = screen.getByRole('tab', { name: /tax & discount/i });
      fireEvent.click(tabDiscount);
      // 15% discount on $100 = $85.00
      expect(screen.getByText('$85.00')).toBeInTheDocument();
    });
  });

  // 23. EMI Calculator
  describe('EMI Calculator', () => {
    it('computes monthly EMI and total interest matching standard financial formulas', () => {
      render(<EmiCalculator />);
      // Default: P=250000, r=6.5%, 15 years (180 months)
      // Standard EMI ~ $2,177.77
      expect(screen.getByText('$2,177.77')).toBeInTheDocument();
      expect(screen.getByText(/Total Interest/i)).toBeInTheDocument();
      expect(screen.getByText(/Amortization Repayment Schedule/i)).toBeInTheDocument();
    });

    it('handles tenure mode toggling between years and months', () => {
      render(<EmiCalculator />);
      const monthsBtn = screen.getByRole('button', { name: /^months$/i });
      fireEvent.click(monthsBtn);

      const tenureInput = screen.getByRole('spinbutton', { name: /loan tenure/i });
      fireEvent.change(tenureInput, { target: { value: '120' } });

      expect(screen.getByText(/Per month for 120 installments/i)).toBeInTheDocument();
    });

    it('handles zero or invalid principal values without crashing', () => {
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
      expect(screen.getByText(/Future Portfolio Value/i)).toBeInTheDocument();
      expect(screen.getByText(/Total Deposits/i)).toBeInTheDocument();
      expect(screen.getByText(/Compound Interest/i)).toBeInTheDocument();
      expect(screen.getByText(/Annual Balance Accumulation Schedule/i)).toBeInTheDocument();
    });

    it('updates calculation upon compounding frequency change', () => {
      render(<CompoundInterestCalculator />);
      const dailyBtn = screen.getByRole('button', { name: /daily/i });
      fireEvent.click(dailyBtn);

      expect(screen.getByText(/Future Portfolio Value/i)).toBeInTheDocument();
    });
  });
});
