# DB General Construction - JavaScript Modules

This directory contains the JavaScript modules and utilities for the website enhancements.

## Directory Structure

```
js/
├── config.js                 # Configuration and constants
├── scripts.js                # Existing main scripts
├── modules/                  # Feature modules
│   ├── cost-calculator.js
│   ├── project-tracker.js
│   ├── live-chat.js
│   ├── newsletter.js
│   ├── gallery-enhanced.js
│   ├── virtual-tour.js
│   ├── admin-dashboard.js
│   ├── service-comparison.js
│   ├── project-map.js
│   └── resource-center.js
└── utils/                    # Utility functions
    ├── storage.js            # LocalStorage operations
    ├── validation.js         # Form validation
    ├── auth.js               # Authentication
    └── api.js                # API calls (mock)
```

## Usage

### Configuration

All configuration is centralized in `config.js`. Import it in your modules:

```javascript
// Access configuration
const apiUrl = CONFIG.API.BASE_URL;
const storageKey = CONFIG.STORAGE_KEYS.AUTH_TOKEN;
```

### Storage Utility

```javascript
// Save data
StorageUtil.set('myKey', { data: 'value' });

// Get data
const data = StorageUtil.get('myKey', defaultValue);

// Remove data
StorageUtil.remove('myKey');

// Save with timestamp
StorageUtil.setWithTimestamp('myKey', data);

// Get with expiration check
const data = StorageUtil.getWithTimestamp('myKey', maxAge);
```

### Validation Utility

```javascript
// Validate email
const isValid = ValidationUtil.validateEmail('user@example.com');

// Validate phone
const isValid = ValidationUtil.validatePhone('+251911590012');

// Validate form
const result = ValidationUtil.validateForm(formData, {
  email: [
    { type: 'required', message: 'Email is required' },
    { type: 'email', message: 'Invalid email format' }
  ],
  name: [
    { type: 'required' },
    { type: 'minLength', params: { min: 3 } }
  ]
});

if (!result.isValid) {
  console.log(result.errors);
}
```

### Authentication Utility

```javascript
// Login
const result = AuthUtil.login(username, password);
if (result.success) {
  console.log('Logged in:', result.user);
}

// Check authentication
if (AuthUtil.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = AuthUtil.getCurrentUser();

// Logout
AuthUtil.logout();

// Require authentication (redirect if not authenticated)
AuthUtil.requireAuth('/login.html');

// Require admin role
AuthUtil.requireAdmin('/index.html');
```

### API Utility

```javascript
// GET request
const response = await ApiUtil.get('/api/projects');
if (response.success) {
  console.log(response.data);
}

// POST request
const response = await ApiUtil.post('/api/quotes', quoteData);

// Send email
await ApiUtil.sendEmail({
  to: 'user@example.com',
  subject: 'Welcome',
  body: 'Thank you for signing up!'
});

// Upload file
const result = await ApiUtil.uploadFile(file, 'projects');
```

## Default Admin Credentials

For development and testing:
- **Username:** Dale melaku
- **Password:** password@12345

**Important:** Change these credentials in production!

## Module Development Guidelines

1. Each module should be self-contained
2. Use the utility functions for common operations
3. Follow the existing code style
4. Add error handling for all operations
5. Use async/await for asynchronous operations
6. Document functions with JSDoc comments
7. Export modules for testing

## Testing

Property-based tests are located in the test directory and use the fast-check library.

```bash
# Run tests
npm test

# Run specific test
npm test -- cost-calculator
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- Bootstrap 5 (already included)
- Font Awesome (already included)
- WOW.js (already included)
- Chart.js (for analytics - to be added)
- Leaflet or Google Maps (for project map - to be added)
- Photo Sphere Viewer or Pannellum (for virtual tours - to be added)

## Notes

- All API calls are currently mocked using LocalStorage
- Session timeout is set to 30 minutes of inactivity
- File uploads are stored as base64 in LocalStorage (for development only)
- In production, replace mock implementations with real API calls
