# Premium Golf Simulator Website - React Version

A modern, clean React website for a golf simulator business featuring booking, shop, and customer feedback functionality.

## Features

- **Home Page**: Hero section with call-to-action, features overview, and technology highlights
- **Play/Booking Page**: Hourly reservations with interactive schedule view:
  - Full Simulator Experience ($25/hour - Opening Month Special)
  - Net & Mat Practice ($10/hour - Limited Time Offer)
  - Free Putting & Chipping (first-come, first-served)
  - Real-time schedule showing booked and available slots
- **Shop Page**: Product catalog with filtering by category (Clubs, Accessories, Apparel)
- **About Page**: Detailed information about Uneekor and GSPro technologies
- **Ideas Page**: Customer feedback forms for:
  - Golf attraction suggestions
  - Website/space improvement suggestions
  - Pricing questionnaire for indoor putting/chipping green

## Technology Stack

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server
- **CSS3** - Custom styling with CSS variables

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
golf-simulator-website/
├── src/
│   ├── components/        # Reusable React components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── BookingModal.jsx
│   │   └── Schedule.jsx
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── Play.jsx
│   │   ├── Shop.jsx
│   │   ├── About.jsx
│   │   └── Ideas.jsx
│   ├── utils/             # Utility functions
│   │   ├── bookingStorage.js
│   │   └── timeUtils.js
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # React entry point
│   └── styles.css         # Global styles
├── index.html             # HTML template
├── package.json
├── vite.config.js
└── README.md
```

## Key Features

### Booking System
- Real-time availability checking
- Conflict prevention
- Schedule visualization
- LocalStorage persistence (for demo - use a database in production)

### Schedule View
- Visual calendar showing booked/available slots
- Filter by session type
- Date picker for viewing different days
- Color-coded availability status

### Shop
- Product filtering by category
- Add to cart functionality (ready for integration)

### Forms
- All forms use React state management
- Form validation
- User feedback on submission

## Customization

### Colors
Modify CSS variables in `src/styles.css`:
- `--primary-color`: Main brand color (dark green)
- `--secondary-color`: Secondary color
- `--accent-color`: Accent/highlight color
- `--light-green`: Light green for highlights

### Pricing
Update pricing in:
- `src/pages/Play.jsx`: Booking card prices
- `src/components/BookingModal.jsx`: `hourlyRate` variable

## Notes

- Bookings are stored in localStorage for demonstration. In production, connect to a backend API.
- Form submissions are logged to console. In production, send to a server.
- The website is fully responsive and works on mobile, tablet, and desktop devices.

## Browser Support

Works on all modern browsers (Chrome, Firefox, Safari, Edge).

## Development

The project uses Vite for fast development:
- Hot Module Replacement (HMR) for instant updates
- Fast builds
- Optimized production builds

## License

All rights reserved.
