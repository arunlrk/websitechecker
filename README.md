# Website Audit API

A comprehensive website auditing API built with Node.js, Express, and Playwright that performs automated checks for broken links, accessibility, SEO, forms, performance, and responsiveness.

## Features

- **Broken Links Checker**: Identifies broken internal and external links (limited to 20 links for performance)
- **Accessibility Checker**: Validates WCAG compliance including alt text, form labels, heading structure, and ARIA landmarks (limited to 50 elements)
- **SEO Checker**: Analyzes meta tags, structured data, content optimization, and technical SEO elements
- **Forms Checker**: Detects traditional forms, interactive elements, and contact methods
- **Performance Checker**: Measures page load times and identifies slow-loading pages (limited to 20 pages)
- **Responsiveness Checker**: Tests responsive design across 6 different device viewports

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

## Usage

### Starting the Server

```bash
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

### API Endpoints

#### Health Check
```http
GET /health
```

Returns server status:
```json
{
  "status": "OK",
  "message": "Website Audit API is running"
}
```

#### Website Audit
```http
POST /audit
Content-Type: application/json

{
  "url": "https://example.com"
}
```

Returns comprehensive audit results:
```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "completed",
  "results": {
    "brokenLinks": { /* broken links analysis */ },
    "accessibility": { /* accessibility analysis */ },
    "seo": { /* SEO analysis */ },
    "forms": { /* forms analysis */ },
    "performance": { /* performance analysis */ },
    "responsiveness": { /* responsiveness analysis */ }
  },
  "summary": {
    "totalIssues": 4,
    "totalWarnings": 12,
    "totalPassed": 15,
    "recommendations": [
      "Fix 2 broken links to improve user experience",
      "Address accessibility issues to ensure compliance with WCAG guidelines"
    ]
  }
}
```

### Testing the API

Run the included test script:
```bash
node test-api.js
```

This will test both the health endpoint and perform a sample audit on example.com.

## Configuration

### Link Limits
- **Broken Links**: Limited to 20 links for performance
- **Accessibility**: Limited to 50 elements for performance
- **Performance**: Limited to 20 pages for performance
- **SEO**: No limits (comprehensive analysis)
- **Forms**: No limits (comprehensive analysis)
- **Responsiveness**: Tests 6 predefined viewports

### Viewport Configurations
The responsiveness checker tests these device sizes:
- Desktop: 1920x1080
- Laptop: 1366x768
- Tablet: 768x1024
- Mobile Large: 425x768
- Mobile Medium: 375x667
- Mobile Small: 320x568

## Response Structure

### Broken Links Results
```json
{
  "totalLinks": 25,
  "checkedLinks": 20,
  "brokenLinks": [
    {
      "href": "/broken-page",
      "text": "Broken Link",
      "status": 404,
      "type": "internal"
    }
  ],
  "workingLinks": [...],
  "externalLinks": [...],
  "summary": {
    "status": "completed",
    "brokenCount": 1,
    "workingCount": 18,
    "externalCount": 1
  }
}
```

### Accessibility Results
```json
{
  "issues": [
    {
      "type": "Missing Alt Text",
      "element": "img",
      "src": "/image.jpg",
      "description": "Image missing alt text for screen readers"
    }
  ],
  "warnings": [...],
  "passed": [...],
  "summary": {
    "status": "completed",
    "issuesCount": 2,
    "warningsCount": 5,
    "passedCount": 43
  }
}
```

### SEO Results
```json
{
  "metaTags": { "passed": [...], "warnings": [...], "issues": [...] },
  "structuredData": { "passed": [...], "warnings": [...], "issues": [...] },
  "content": { "passed": [...], "warnings": [...], "issues": [...] },
  "technical": { "passed": [...], "warnings": [...], "issues": [...] },
  "performance": { "passed": [...], "warnings": [...], "issues": [...] },
  "summary": {
    "status": "completed",
    "totalPassed": 15,
    "totalWarnings": 8,
    "totalIssues": 3
  }
}
```

### Forms Results
```json
{
  "traditionalForms": [
    {
      "index": 1,
      "id": "contact-form",
      "action": "/submit",
      "method": "POST",
      "inputs": [...],
      "buttons": [...]
    }
  ],
  "interactiveElements": [...],
  "contactMethods": [...],
  "formLikeElements": [...],
  "summary": {
    "status": "completed",
    "traditionalFormsCount": 1,
    "interactiveElementsCount": 5,
    "contactMethodsCount": 3,
    "formLikeElementsCount": 2
  }
}
```

### Performance Results
```json
{
  "mainPage": {
    "url": "https://example.com",
    "loadTime": 1200,
    "domContentLoaded": 800,
    "loadComplete": 1200,
    "firstPaint": 600,
    "firstContentfulPaint": 800,
    "status": "fast"
  },
  "linkedPages": [
    {
      "url": "https://example.com/about",
      "text": "About Us",
      "loadTime": 2500,
      "status": "slow"
    }
  ],
  "summary": {
    "status": "completed",
    "slowPages": 2,
    "fastPages": 15,
    "errorPages": 1
  }
}
```

### Responsiveness Results
```json
{
  "viewports": [
    {
      "name": "Desktop",
      "width": 1920,
      "height": 1080,
      "status": "responsive",
      "issues": [],
      "passed": [...]
    }
  ],
  "issues": [...],
  "summary": {
    "status": "completed",
    "totalIssues": 3,
    "responsiveViewports": 4,
    "problematicViewports": 2
  }
}
```

## Error Handling

The API includes comprehensive error handling:
- Invalid URL format validation
- Network timeout handling (30 seconds per page)
- Graceful degradation if individual checks fail
- Detailed error messages in responses

## Performance Considerations

- All checks run in parallel for faster results
- Configurable limits prevent excessive resource usage
- Headless browser mode for efficient automation
- Timeout limits prevent hanging requests

## Dependencies

- **Express**: Web framework
- **Playwright**: Browser automation
- **CORS**: Cross-origin resource sharing
- **Axios**: HTTP client (for testing)

## License

This project is open source and available under the MIT License.
