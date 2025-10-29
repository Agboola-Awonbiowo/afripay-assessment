# Afripay Transaction Dashboard

A modern, responsive transaction management dashboard built with Next.js, TypeScript, and Tailwind CSS. This application allows users to manage their financial transactions with filtering, export capabilities, and persistent storage.

## Features

### Core Functionality
- ✅ **Transaction Management**: Add money (credit) and send money (debit) from the same modal
- ✅ **Transaction Filtering**: Filter by type (All, Credit, Debit)
- ✅ **Summary Statistics**: Real-time calculation of inflow, outflow, and net balance
- ✅ **Data Persistence**: Transactions saved to localStorage (first load auto-seeds 100 dummy transactions for testing)
- ✅ **Export Functionality**: Export transactions as CSV or Excel (XLSX), respecting current filter and search
- ✅ **Responsive Design**: Optimized for both desktop and mobile devices
- ✅ **Delete Confirmation**: Safety modal before delete
- ✅ **Details Modal**: Tap/click a row to view full transaction details
- ✅ **Search**: Filter by description, ID, or date
- ✅ **Pagination**: Desktop shows 10 per page; Mobile auto-loads next 10 on scroll (infinite scroll)

### Technical Features
- ✅ **TypeScript**: Full type safety throughout the application
- ✅ **Reusable Components**: Modular, well-structured component architecture
- ✅ **Custom Hooks**: Clean state management with React hooks
- ✅ **Comprehensive Testing**: Unit tests with Jest and React Testing Library
- ✅ **Modern UI**: Beautiful interface built with Tailwind CSS
- ✅ **Accessibility**: Keyboard navigation and screen reader support

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Export**: XLSX, File-saver
- **State Management**: React Hooks (useState, useEffect, useCallback)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── transaction/      # Transaction-specific components
│   │   ├── TransactionList.tsx
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionSummary.tsx
│   │   ├── FilterTabs.tsx
│   │   └── ExportButton.tsx
│   └── Dashboard.tsx     # Main dashboard component
│   └── ui/
│       └── Pagination.tsx # Reusable pagination component
├── hooks/                # Custom React hooks
│   └── useTransactions.ts
├── types/                # TypeScript type definitions
│   └── index.ts
├── utils/                # Utility functions
│   ├── storage.ts        # localStorage utilities
│   └── export.ts         # Export functionality
└── __tests__/           # Test files
    ├── components/
    ├── hooks/
    └── utils/
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd afripay-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

If you hit memory issues locally, run:
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm test -- --watchAll=false
```

## Component Architecture

### Reusable UI Components

The application features a comprehensive set of reusable UI components:

- **Button**: Configurable button with variants (primary, secondary, danger, success) and sizes
- **Input**: Form input with label, error handling, and helper text
- **Card**: Container component with customizable padding and shadow
- **Modal**: Accessible modal with backdrop and keyboard navigation

### Transaction Components

- **TransactionList**: Displays filtered transactions with delete functionality
- **TransactionForm**: Form for adding new transactions with validation
- **TransactionSummary**: Shows financial summary with visual indicators
- **FilterTabs**: Tab-based filtering interface
- **ExportButton**: Export functionality with format selection

### Custom Hooks

- **useTransactions**: Manages transaction state, filtering, and persistence

## Key Features Explained

### Data Persistence
Transactions are automatically saved to localStorage and restored on page refresh. The `useTransactions` hook handles this seamlessly.

On first load (when no data exists), the app seeds 100 mixed credit/debit transactions to help you test filtering, pagination and search quickly.

### Export Functionality
Users can export their transaction data in two formats:
- **CSV**: Comma-separated values for spreadsheet applications
- **XLSX**: Excel format with proper formatting

### Responsive Design
The interface adapts to different screen sizes:
- **Mobile**: Quick actions bar (Add, Send, Export, Clear), stacked list rows, infinite scroll
- **Tablet**: Optimized spacing and sizing
- **Desktop**: Multi-column layout with enhanced spacing

### Form Validation
The transaction form includes comprehensive validation:
- Required field validation
- Numeric validation for amounts
- Real-time error display
- Form state management

## Testing

The application includes comprehensive unit tests covering:

- Component rendering and behavior
- User interactions
- State management
- Utility functions
- Custom hooks

Run tests with:
```bash
npm test
```

View coverage report:
```bash
npm run test:coverage
```

## Design Decisions

### State Management
- Used React hooks instead of external state management for simplicity
- Custom `useTransactions` hook encapsulates all transaction logic
- Local state for UI interactions (modals, forms)

### Component Structure
- Separated UI components from business logic
- Created reusable components for consistency
- Used TypeScript interfaces for prop validation

### Styling Approach
- Tailwind CSS for rapid development and consistency
- Responsive design with mobile-first approach
- Consistent color scheme and spacing

### Data Flow
- Unidirectional data flow from parent to child components
- Callback functions for child-to-parent communication
- Centralized state management in custom hooks

## Performance Considerations

- **Lazy Loading**: Components are loaded as needed
- **Memoization**: Used useCallback for expensive operations
- **Efficient Re-renders**: Optimized component structure to minimize re-renders
- **Local Storage**: Efficient data persistence without external dependencies

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## CI

GitHub Actions workflow is included to run tests on push/PR. See `.github/workflows/test.yml`.

## Future Enhancements

- [ ] Data visualization with charts
- [ ] Transaction categories and tags
- [x] Search functionality
- [ ] Date range filtering
- [ ] Bulk operations
- [ ] Data import functionality
- [ ] User authentication
- [ ] Cloud synchronization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

---

Built with ❤️ for the Afripay Frontend Engineer Assessment
