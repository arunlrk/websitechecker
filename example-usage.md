# Website Audit API - Usage Examples

## Using curl

### Health Check
```bash
curl http://localhost:3000/health
```

### Basic Audit
```bash
curl -X POST http://localhost:3000/audit \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### Audit with Pretty Output
```bash
curl -X POST http://localhost:3000/audit \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}' | jq
```

## Using JavaScript/Node.js

### Basic Usage
```javascript
const axios = require('axios');

async function auditWebsite(url) {
  try {
    const response = await axios.post('http://localhost:3000/audit', {
      url: url
    });
    
    console.log('Audit Results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Audit failed:', error.message);
  }
}

// Usage
auditWebsite('https://example.com');
```

### Advanced Usage with Error Handling
```javascript
const axios = require('axios');

async function comprehensiveAudit(url) {
  try {
    console.log(`Starting audit for: ${url}`);
    
    const response = await axios.post('http://localhost:3000/audit', {
      url: url
    }, {
      timeout: 120000 // 2 minutes timeout
    });
    
    const results = response.data;
    
    console.log('\n=== AUDIT SUMMARY ===');
    console.log(`URL: ${results.url}`);
    console.log(`Status: ${results.status}`);
    console.log(`Timestamp: ${results.timestamp}`);
    
    console.log('\n=== ISSUES SUMMARY ===');
    console.log(`Total Issues: ${results.summary.totalIssues}`);
    console.log(`Total Warnings: ${results.summary.totalWarnings}`);
    console.log(`Total Passed: ${results.summary.totalPassed}`);
    
    console.log('\n=== RECOMMENDATIONS ===');
    results.summary.recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    
    // Detailed results
    if (results.results.brokenLinks.summary) {
      console.log(`\nBroken Links: ${results.results.brokenLinks.summary.brokenCount}`);
    }
    
    if (results.results.accessibility.summary) {
      console.log(`Accessibility Issues: ${results.results.accessibility.summary.issuesCount}`);
    }
    
    if (results.results.performance.summary) {
      console.log(`Slow Pages: ${results.results.performance.summary.slowPages}`);
    }
    
    return results;
    
  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

// Usage
comprehensiveAudit('https://example.com');
```

## Using Python

### Basic Usage
```python
import requests
import json

def audit_website(url):
    try:
        response = requests.post(
            'http://localhost:3000/audit',
            json={'url': url},
            timeout=120
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None

# Usage
results = audit_website('https://example.com')
if results:
    print(json.dumps(results, indent=2))
```

### Advanced Usage
```python
import requests
import json
from datetime import datetime

def detailed_audit(url):
    try:
        print(f"Starting audit for: {url}")
        start_time = datetime.now()
        
        response = requests.post(
            'http://localhost:3000/audit',
            json={'url': url},
            timeout=120
        )
        response.raise_for_status()
        
        results = response.json()
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        print(f"\nAudit completed in {duration:.2f} seconds")
        print(f"Status: {results['status']}")
        print(f"Total Issues: {results['summary']['totalIssues']}")
        print(f"Total Warnings: {results['summary']['totalWarnings']}")
        
        # Print recommendations
        print("\nRecommendations:")
        for i, rec in enumerate(results['summary']['recommendations'], 1):
            print(f"{i}. {rec}")
        
        return results
        
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

# Usage
detailed_audit('https://example.com')
```

## Using PowerShell

### Basic Usage
```powershell
$body = @{
    url = "https://example.com"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/audit" -Method Post -Body $body -ContentType "application/json"
$response | ConvertTo-Json -Depth 10
```

### Advanced Usage
```powershell
function Start-WebsiteAudit {
    param(
        [string]$Url
    )
    
    try {
        Write-Host "Starting audit for: $Url" -ForegroundColor Green
        
        $body = @{
            url = $Url
        } | ConvertTo-Json
        
        $startTime = Get-Date
        $response = Invoke-RestMethod -Uri "http://localhost:3000/audit" -Method Post -Body $body -ContentType "application/json"
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalSeconds
        
        Write-Host "`nAudit completed in $([math]::Round($duration, 2)) seconds" -ForegroundColor Green
        Write-Host "Status: $($response.status)" -ForegroundColor Yellow
        Write-Host "Total Issues: $($response.summary.totalIssues)" -ForegroundColor Red
        Write-Host "Total Warnings: $($response.summary.totalWarnings)" -ForegroundColor Yellow
        Write-Host "Total Passed: $($response.summary.totalPassed)" -ForegroundColor Green
        
        Write-Host "`nRecommendations:" -ForegroundColor Cyan
        for ($i = 0; $i -lt $response.summary.recommendations.Count; $i++) {
            Write-Host "$($i + 1). $($response.summary.recommendations[$i])" -ForegroundColor White
        }
        
        return $response
        
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Usage
Start-WebsiteAudit -Url "https://example.com"
```

## Response Examples

### Successful Audit Response
```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "status": "completed",
  "results": {
    "brokenLinks": {
      "totalLinks": 25,
      "checkedLinks": 20,
      "brokenLinks": [],
      "workingLinks": [...],
      "externalLinks": [...],
      "summary": {
        "status": "completed",
        "brokenCount": 0,
        "workingCount": 18,
        "externalCount": 2
      }
    },
    "accessibility": {
      "issues": [],
      "warnings": [...],
      "passed": [...],
      "summary": {
        "status": "completed",
        "issuesCount": 0,
        "warningsCount": 3,
        "passedCount": 47
      }
    },
    "seo": {
      "metaTags": { "passed": [...], "warnings": [...], "issues": [] },
      "structuredData": { "passed": [...], "warnings": [...], "issues": [] },
      "content": { "passed": [...], "warnings": [...], "issues": [] },
      "technical": { "passed": [...], "warnings": [...], "issues": [] },
      "performance": { "passed": [...], "warnings": [...], "issues": [] },
      "summary": {
        "status": "completed",
        "totalPassed": 12,
        "totalWarnings": 5,
        "totalIssues": 0
      }
    },
    "forms": {
      "traditionalForms": [...],
      "interactiveElements": [...],
      "contactMethods": [...],
      "formLikeElements": [...],
      "summary": {
        "status": "completed",
        "traditionalFormsCount": 1,
        "interactiveElementsCount": 3,
        "contactMethodsCount": 2,
        "formLikeElementsCount": 1
      }
    },
    "performance": {
      "mainPage": {
        "url": "https://example.com",
        "loadTime": 1200,
        "domContentLoaded": 800,
        "loadComplete": 1200,
        "firstPaint": 600,
        "firstContentfulPaint": 800,
        "status": "fast"
      },
      "linkedPages": [...],
      "summary": {
        "status": "completed",
        "slowPages": 0,
        "fastPages": 18,
        "errorPages": 0
      }
    },
    "responsiveness": {
      "viewports": [...],
      "issues": [],
      "summary": {
        "status": "completed",
        "totalIssues": 0,
        "responsiveViewports": 6,
        "problematicViewports": 0
      }
    }
  },
  "summary": {
    "totalIssues": 0,
    "totalWarnings": 8,
    "totalPassed": 80,
    "recommendations": [
      "Review accessibility warnings to improve user experience for all users",
      "Optimize SEO elements to enhance search engine performance"
    ]
  }
}
```

### Error Response
```json
{
  "error": "Invalid URL format",
  "message": "Please provide a valid URL (e.g., https://example.com)"
}
``` 