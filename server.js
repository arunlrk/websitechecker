const express = require('express');
const cors = require('cors');

// Import all audit modules
const { checkBrokenLinks } = require('./audit-modules/broken-links-checker');
const { checkAccessibility } = require('./audit-modules/accessibility-checker');
const { checkSEO } = require('./audit-modules/seo-checker');
const { checkForms } = require('./audit-modules/forms-checker');
const { checkPerformance } = require('./audit-modules/performance-checker');
const { checkResponsiveness } = require('./audit-modules/responsiveness-checker');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Website Audit API is running' });
});

// Main audit endpoint
app.post('/audit', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ 
      error: 'URL is required',
      message: 'Please provide a URL in the request body'
    });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ 
      error: 'Invalid URL format',
      message: 'Please provide a valid URL (e.g., https://example.com)'
    });
  }

  console.log(`Starting comprehensive audit for: ${url}`);

  const auditResults = {
    url: url,
    timestamp: new Date().toISOString(),
    status: 'running',
    results: {},
    summary: {
      totalIssues: 0,
      totalWarnings: 0,
      totalPassed: 0,
      recommendations: []
    }
  };

  try {
    // Run all audit checks in parallel for better performance
    const [
      brokenLinksResult,
      accessibilityResult,
      seoResult,
      formsResult,
      performanceResult,
      responsivenessResult
    ] = await Promise.allSettled([
      checkBrokenLinks(url, 20),
      checkAccessibility(url, 50),
      checkSEO(url),
      checkForms(url),
      checkPerformance(url, 20),
      checkResponsiveness(url)
    ]);

    // Process results
    auditResults.results = {
      brokenLinks: brokenLinksResult.status === 'fulfilled' ? brokenLinksResult.value : { error: brokenLinksResult.reason?.message || 'Failed to check broken links' },
      accessibility: accessibilityResult.status === 'fulfilled' ? accessibilityResult.value : { error: accessibilityResult.reason?.message || 'Failed to check accessibility' },
      seo: seoResult.status === 'fulfilled' ? seoResult.value : { error: seoResult.reason?.message || 'Failed to check SEO' },
      forms: formsResult.status === 'fulfilled' ? formsResult.value : { error: formsResult.reason?.message || 'Failed to check forms' },
      performance: performanceResult.status === 'fulfilled' ? performanceResult.value : { error: performanceResult.reason?.message || 'Failed to check performance' },
      responsiveness: responsivenessResult.status === 'fulfilled' ? responsivenessResult.value : { error: responsivenessResult.reason?.message || 'Failed to check responsiveness' }
    };

    // Generate summary and recommendations
    let totalIssues = 0;
    let totalWarnings = 0;
    let totalPassed = 0;
    const recommendations = [];

    // Process broken links
    if (auditResults.results.brokenLinks.summary) {
      totalIssues += auditResults.results.brokenLinks.summary.brokenCount || 0;
      if (auditResults.results.brokenLinks.summary.brokenCount > 0) {
        recommendations.push(`Fix ${auditResults.results.brokenLinks.summary.brokenCount} broken links to improve user experience`);
      }
    }

    // Process accessibility
    if (auditResults.results.accessibility.summary) {
      totalIssues += auditResults.results.accessibility.summary.issuesCount || 0;
      totalWarnings += auditResults.results.accessibility.summary.warningsCount || 0;
      totalPassed += auditResults.results.accessibility.summary.passedCount || 0;
      
      if (auditResults.results.accessibility.summary.issuesCount > 0) {
        recommendations.push('Address accessibility issues to ensure compliance with WCAG guidelines');
      }
      if (auditResults.results.accessibility.summary.warningsCount > 0) {
        recommendations.push('Review accessibility warnings to improve user experience for all users');
      }
    }

    // Process SEO
    if (auditResults.results.seo.summary) {
      totalPassed += auditResults.results.seo.summary.totalPassed || 0;
      totalWarnings += auditResults.results.seo.summary.totalWarnings || 0;
      totalIssues += auditResults.results.seo.summary.totalIssues || 0;
      
      if (auditResults.results.seo.summary.totalIssues > 0) {
        recommendations.push('Fix SEO issues to improve search engine visibility');
      }
      if (auditResults.results.seo.summary.totalWarnings > 0) {
        recommendations.push('Optimize SEO elements to enhance search engine performance');
      }
    }

    // Process forms
    if (auditResults.results.forms.summary) {
      if (auditResults.results.forms.summary.traditionalFormsCount === 0 && 
          auditResults.results.forms.summary.formLikeElementsCount === 0) {
        recommendations.push('Consider adding contact forms or interactive elements to improve user engagement');
      }
    }

    // Process performance
    if (auditResults.results.performance.summary) {
      if (auditResults.results.performance.summary.slowPages > 0) {
        recommendations.push(`Optimize ${auditResults.results.performance.summary.slowPages} slow-loading pages to improve user experience`);
      }
      if (auditResults.results.performance.summary.errorPages > 0) {
        recommendations.push(`Fix ${auditResults.results.performance.summary.errorPages} pages with errors`);
      }
    }

    // Process responsiveness
    if (auditResults.results.responsiveness.summary) {
      if (auditResults.results.responsiveness.summary.totalIssues > 0) {
        recommendations.push('Address responsive design issues to ensure proper display across all devices');
      }
      if (auditResults.results.responsiveness.summary.problematicViewports > 0) {
        recommendations.push(`Improve responsive design for ${auditResults.results.responsiveness.summary.problematicViewports} device viewports`);
      }
    }

    // Update summary
    auditResults.summary = {
      totalIssues,
      totalWarnings,
      totalPassed,
      recommendations: recommendations.length > 0 ? recommendations : ['Website audit completed successfully with no major issues found']
    };

    auditResults.status = 'completed';

    console.log(`Audit completed for ${url}: ${totalIssues} issues, ${totalWarnings} warnings, ${totalPassed} passed checks`);

    res.json(auditResults);

  } catch (error) {
    console.error('Error during audit:', error);
    auditResults.status = 'error';
    auditResults.error = error.message;
    res.status(500).json(auditResults);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Website Audit API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Audit endpoint: POST http://localhost:${PORT}/audit`);
});

module.exports = app; 