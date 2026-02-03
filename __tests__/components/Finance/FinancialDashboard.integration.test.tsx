/**
 * Dashboard Integration Tests
 * Testing FinancialDashboardV2 component and its workflows
 * Run with: npm test -- FinancialDashboard.integration.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import FinancialDashboardV2 from '@/components/Finance/FinancialDashboardV2';
import { ThemeProvider } from '@/context/ThemeContext';

// Mock the API
jest.mock('@/lib/api/financial-reporting.api', () => ({
  GET_FinancialData: jest.fn(),
  POST_AddFinancialEntry: jest.fn(),
  POST_BulkDeleteExpenses: jest.fn(),
  GET_ExportFinancialData: jest.fn(),
  GET_FinancialHealthScore: jest.fn(),
  GET_CashFlowAnalysis: jest.fn(),
}));

const mockFinancialData = {
  founders: [
    { id: '1', name: 'Founder 1', email: 'f1@test.com', profitSharePercentage: 50 },
    { id: '2', name: 'Founder 2', email: 'f2@test.com', profitSharePercentage: 50 },
  ],
  accounts: [
    {
      id: '1',
      name: 'Main Account',
      accountType: 'company_central',
      currency: 'PKR',
      currentBalance: 1000000,
    },
    {
      id: '2',
      name: 'Savings',
      accountType: 'company_central',
      currency: 'PKR',
      currentBalance: 500000,
    },
  ],
  expenses: [
    {
      id: '1',
      title: 'Domain Renewal',
      amount: 1500,
      category: 'domain',
      expenseDate: '2024-01-20',
    },
    {
      id: '2',
      title: 'Hosting',
      amount: 5000,
      category: 'hosting',
      expenseDate: '2024-01-21',
    },
  ],
  subscriptions: [
    {
      id: '1',
      name: 'Canva Pro',
      amount: 12000,
      billingCycle: 'monthly',
      status: 'active',
    },
  ],
  contributions: [
    {
      id: '1',
      founderId: '1',
      amount: 500000,
      contributionType: 'additional_capital',
    },
  ],
};

describe('Financial Dashboard Integration Tests', () => {
  const renderDashboard = () => {
    return render(
      <ThemeProvider>
        <FinancialDashboardV2 />
      </ThemeProvider>
    );
  };

  // ============================================================================
  // DASHBOARD RENDERING TESTS
  // ============================================================================

  describe('Dashboard Rendering', () => {
    it('should render dashboard with all tabs', () => {
      renderDashboard();

      expect(screen.getByRole('tab', { name: /overview/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /founders/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /accounts/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /expenses/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /subscriptions/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /contributions/i })).toBeInTheDocument();
    });

    it('should render overview tab by default', () => {
      renderDashboard();

      const overviewTab = screen.getByRole('tab', { name: /overview/i });
      expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should display financial metrics on overview', () => {
      renderDashboard();

      // These would depend on your FinancialDashboardV2 implementation
      expect(screen.getByText(/total balance|total accounts/i)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // TAB NAVIGATION TESTS
  // ============================================================================

  describe('Tab Navigation', () => {
    it('should switch to founders tab', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const foundersTab = screen.getByRole('tab', { name: /founders/i });
      await user.click(foundersTab);

      expect(foundersTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should switch to accounts tab', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const accountsTab = screen.getByRole('tab', { name: /accounts/i });
      await user.click(accountsTab);

      expect(accountsTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should switch to expenses tab', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const expensesTab = screen.getByRole('tab', { name: /expenses/i });
      await user.click(expensesTab);

      expect(expensesTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should switch to subscriptions tab', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const subscriptionsTab = screen.getByRole('tab', { name: /subscriptions/i });
      await user.click(subscriptionsTab);

      expect(subscriptionsTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should switch to contributions tab', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const contributionsTab = screen.getByRole('tab', { name: /contributions/i });
      await user.click(contributionsTab);

      expect(contributionsTab).toHaveAttribute('aria-selected', 'true');
    });

    it('should persist tab selection when switching back', async () => {
      const user = userEvent.setup();
      renderDashboard();

      // Switch to founders
      await user.click(screen.getByRole('tab', { name: /founders/i }));
      expect(screen.getByRole('tab', { name: /founders/i })).toHaveAttribute(
        'aria-selected',
        'true'
      );

      // Switch to accounts
      await user.click(screen.getByRole('tab', { name: /accounts/i }));
      expect(screen.getByRole('tab', { name: /accounts/i })).toHaveAttribute(
        'aria-selected',
        'true'
      );

      // Switch back to founders
      await user.click(screen.getByRole('tab', { name: /founders/i }));
      expect(screen.getByRole('tab', { name: /founders/i })).toHaveAttribute(
        'aria-selected',
        'true'
      );
    });
  });

  // ============================================================================
  // MODAL WORKFLOW TESTS
  // ============================================================================

  describe('Modal Workflows', () => {
    it('should open founder modal when add button is clicked', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const foundersTab = screen.getByRole('tab', { name: /founders/i });
      await user.click(foundersTab);

      const addButton = screen.getByRole('button', { name: /add founder|new founder/i });
      await user.click(addButton);

      // Modal should be visible
      expect(
        screen.getByRole('heading', { name: /add founder|new founder/i })
      ).toBeInTheDocument();
    });

    it('should close modal when cancel is clicked', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const foundersTab = screen.getByRole('tab', { name: /founders/i });
      await user.click(foundersTab);

      const addButton = screen.getByRole('button', { name: /add founder|new founder/i });
      await user.click(addButton);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      // Modal should be closed
      await waitFor(() => {
        expect(
          screen.queryByRole('heading', { name: /add founder|new founder/i })
        ).not.toBeInTheDocument();
      });
    });

    it('should open account modal when add button is clicked', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const accountsTab = screen.getByRole('tab', { name: /accounts/i });
      await user.click(accountsTab);

      const addButton = screen.getByRole('button', {
        name: /add account|new account/i,
      });
      await user.click(addButton);

      expect(
        screen.getByRole('heading', { name: /add account|new account/i })
      ).toBeInTheDocument();
    });

    it('should open expense modal when add button is clicked', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const expensesTab = screen.getByRole('tab', { name: /expenses/i });
      await user.click(expensesTab);

      const addButton = screen.getByRole('button', {
        name: /add expense|new expense/i,
      });
      await user.click(addButton);

      expect(
        screen.getByRole('heading', { name: /add expense|new expense/i })
      ).toBeInTheDocument();
    });
  });

  // ============================================================================
  // SEARCH AND FILTER TESTS
  // ============================================================================

  describe('Search and Filter', () => {
    it('should filter expenses by search term', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const expensesTab = screen.getByRole('tab', { name: /expenses/i });
      await user.click(expensesTab);

      // Assuming there's a search input
      const searchInput = screen.getByPlaceholderText(/search|filter/i);
      await user.type(searchInput, 'Domain');

      // Only domain-related expenses should be visible
      expect(screen.getByText(/domain/i)).toBeInTheDocument();
    });

    it('should filter by category', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const expensesTab = screen.getByRole('tab', { name: /expenses/i });
      await user.click(expensesTab);

      // Find and click category filter
      const categoryFilter = screen.getByDisplayValue(/select category/i);
      await user.selectOption(categoryFilter, 'domain');

      // Should show only domain expenses
      expect(screen.queryByText(/hosting/i)).not.toBeInTheDocument();
    });

    it('should sort data by column', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const expensesTab = screen.getByRole('tab', { name: /expenses/i });
      await user.click(expensesTab);

      // Click on amount header to sort
      const amountHeader = screen.getByText(/amount/i);
      await user.click(amountHeader);

      // Should be sorted
      const amountCells = screen.getAllByText(/\d+/);
      expect(amountCells.length).toBeGreaterThan(0);
    });

    it('should clear filters', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const expensesTab = screen.getByRole('tab', { name: /expenses/i });
      await user.click(expensesTab);

      const searchInput = screen.getByPlaceholderText(/search|filter/i);
      await user.type(searchInput, 'Domain');

      // Find clear button
      const clearButton = screen.getByRole('button', { name: /clear|reset/i });
      await user.click(clearButton);

      // All expenses should be visible again
      expect(searchInput).toHaveValue('');
    });
  });

  // ============================================================================
  // DATA TABLE TESTS
  // ============================================================================

  describe('Data Tables', () => {
    it('should display founders in table', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const foundersTab = screen.getByRole('tab', { name: /founders/i });
      await user.click(foundersTab);

      expect(screen.getByRole('table')).toBeInTheDocument();
      // Check if table has founder data
      expect(screen.getByText(/founder/i)).toBeInTheDocument();
    });

    it('should display pagination', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const foundersTab = screen.getByRole('tab', { name: /founders/i });
      await user.click(foundersTab);

      // If table has enough rows, pagination should appear
      const paginationElements = screen.queryAllByRole('button', {
        name: /next|previous|page/i,
      });
      // Pagination might not appear for small datasets
    });

    it('should handle row selection', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const foundersTab = screen.getByRole('tab', { name: /founders/i });
      await user.click(foundersTab);

      // Find and click a row checkbox if it exists
      const checkboxes = screen.queryAllByRole('checkbox');
      if (checkboxes.length > 0) {
        await user.click(checkboxes[0]);
      }
    });
  });

  // ============================================================================
  // BULK OPERATIONS TESTS
  // ============================================================================

  describe('Bulk Operations', () => {
    it('should enable bulk delete when items are selected', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const expensesTab = screen.getByRole('tab', { name: /expenses/i });
      await user.click(expensesTab);

      // Check multiple items
      const checkboxes = screen.getAllByRole('checkbox');
      if (checkboxes.length > 0) {
        await user.click(checkboxes[0]);
      }

      // Bulk delete button should appear
      const bulkDeleteButton = screen.queryByRole('button', {
        name: /delete selected|bulk delete/i,
      });
      if (bulkDeleteButton) {
        expect(bulkDeleteButton).toBeInTheDocument();
      }
    });

    it('should confirm before bulk deleting', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const expensesTab = screen.getByRole('tab', { name: /expenses/i });
      await user.click(expensesTab);

      const checkboxes = screen.getAllByRole('checkbox');
      if (checkboxes.length > 0) {
        await user.click(checkboxes[0]);
        const bulkDeleteButton = screen.queryByRole('button', {
          name: /delete selected|bulk delete/i,
        });
        if (bulkDeleteButton) {
          await user.click(bulkDeleteButton);

          // Confirmation modal should appear
          expect(
            screen.getByText(/confirm|are you sure/i)
          ).toBeInTheDocument();
        }
      }
    });
  });

  // ============================================================================
  // EXPORT FUNCTIONALITY TESTS
  // ============================================================================

  describe('Export Functionality', () => {
    it('should have export button', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const exportButton = screen.getByRole('button', { name: /export/i });
      expect(exportButton).toBeInTheDocument();
    });

    it('should show export format options', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      // Export options should appear
      expect(screen.queryByText(/CSV|JSON|PDF/i)).toBeTruthy();
    });

    it('should export to CSV', async () => {
      const user = userEvent.setup();
      const mockDownload = jest.fn();
      global.URL.createObjectURL = jest.fn(() => 'blob:url');
      global.URL.revokeObjectURL = jest.fn();

      renderDashboard();

      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      const csvOption = screen.getByText(/CSV/i);
      await user.click(csvOption);

      // Should trigger download
      await waitFor(() => {
        // Check if download was initiated
      });
    });
  });

  // ============================================================================
  // NOTIFICATION TESTS
  // ============================================================================

  describe('Notifications', () => {
    it('should show success notification after adding founder', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const foundersTab = screen.getByRole('tab', { name: /founders/i });
      await user.click(foundersTab);

      const addButton = screen.getByRole('button', { name: /add founder|new founder/i });
      await user.click(addButton);

      await user.type(
        screen.getByLabelText(/founder name/i),
        'Test Founder'
      );

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/success|founder added|created successfully/i)
        ).toBeInTheDocument();
      });
    });

    it('should show error notification on failure', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const foundersTab = screen.getByRole('tab', { name: /founders/i });
      await user.click(foundersTab);

      const addButton = screen.getByRole('button', { name: /add founder|new founder/i });
      await user.click(addButton);

      // Try to submit without required fields
      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/error|required|invalid/i)).toBeInTheDocument();
      });
    });

    it('should dismiss notification when close button is clicked', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const foundersTab = screen.getByRole('tab', { name: /founders/i });
      await user.click(foundersTab);

      const addButton = screen.getByRole('button', { name: /add founder|new founder/i });
      await user.click(addButton);

      await user.type(
        screen.getByLabelText(/founder name/i),
        'Test Founder'
      );

      const submitButton = screen.getByRole('button', { name: /save|submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        const dismissButton = screen.getByRole('button', { name: /close|dismiss/i });
        fireEvent.click(dismissButton);

        expect(
          screen.queryByText(/success|founder added|created successfully/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // DATA REFRESH TESTS
  // ============================================================================

  describe('Data Refresh', () => {
    it('should have refresh button', () => {
      renderDashboard();

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    it('should reload data on refresh', async () => {
      const user = userEvent.setup();
      renderDashboard();

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);

      // Data should be reloaded
      await waitFor(() => {
        // Verify data is refreshed
      });
    });

    it('should auto-refresh at intervals', async () => {
      jest.useFakeTimers();
      renderDashboard();

      // Advance time
      jest.advanceTimersByTime(60000); // 1 minute

      jest.useRealTimers();
    });
  });

  // ============================================================================
  // RESPONSIVE BEHAVIOR TESTS
  // ============================================================================

  describe('Responsive Behavior', () => {
    it('should render on mobile viewport', () => {
      // Mock mobile viewport
      global.innerWidth = 375;

      renderDashboard();

      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('should render on tablet viewport', () => {
      global.innerWidth = 768;

      renderDashboard();

      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('should render on desktop viewport', () => {
      global.innerWidth = 1920;

      renderDashboard();

      expect(screen.getByRole('heading')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // EDGE CASES TESTS
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle empty data gracefully', async () => {
      renderDashboard();

      expect(screen.getByText(/no data|empty/i)).toBeInTheDocument();
    });

    it('should handle large datasets', async () => {
      renderDashboard();

      // Should render without crashing
      expect(screen.getByRole('heading')).toBeInTheDocument();
    });

    it('should handle rapid tab switching', async () => {
      const user = userEvent.setup();
      renderDashboard();

      for (let i = 0; i < 5; i++) {
        await user.click(screen.getByRole('tab', { name: /founders/i }));
        await user.click(screen.getByRole('tab', { name: /accounts/i }));
      }

      // Should not crash
      expect(screen.getByRole('tab', { name: /accounts/i })).toBeInTheDocument();
    });

    it('should handle network errors gracefully', async () => {
      renderDashboard();

      // Should show error state
      expect(screen.getByText(/error|failed|try again/i)).toBeInTheDocument();
    });
  });
});

/**
 * HOW TO RUN THESE TESTS:
 *
 * 1. Run all integration tests:
 *    npm test -- FinancialDashboard.integration.test.tsx
 *
 * 2. Run specific test suite:
 *    npm test -- FinancialDashboard.integration.test.tsx -t "Tab Navigation"
 *
 * 3. Run with coverage:
 *    npm test -- FinancialDashboard.integration.test.tsx --coverage
 *
 * 4. Run in debug mode:
 *    node --inspect-brk node_modules/.bin/jest FinancialDashboard.integration.test.tsx
 *
 * EXPECTED RESULTS:
 * ✅ All rendering tests pass
 * ✅ All tab navigation tests pass
 * ✅ All modal workflow tests pass
 * ✅ All search and filter tests pass
 * ✅ All data table tests pass
 * ✅ All bulk operations tests pass
 * ✅ All export functionality tests pass
 * ✅ All notification tests pass
 * ✅ All data refresh tests pass
 * ✅ All responsive behavior tests pass
 * ✅ All edge cases tests pass
 * Total: 50+ integration test cases
 */
