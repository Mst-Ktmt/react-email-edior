/**
 * Build URL with tracking parameters
 *
 * Adds UTM parameters and custom parameters to a base URL for click tracking.
 */

import type { ButtonTracking } from '@/types';

/**
 * Validate if a string is a valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Build tracking URL with UTM and custom parameters
 *
 * @param baseUrl - The base URL to add parameters to
 * @param tracking - Tracking parameters (UTM and custom)
 * @returns URL with tracking parameters appended
 *
 * @example
 * ```ts
 * buildTrackingUrl('https://example.com', {
 *   utmSource: 'email',
 *   utmMedium: 'newsletter',
 *   utmCampaign: 'spring_sale',
 *   customParams: { ref: 'promo123' }
 * })
 * // Returns: 'https://example.com?utm_source=email&utm_medium=newsletter&utm_campaign=spring_sale&ref=promo123'
 * ```
 */
export function buildTrackingUrl(baseUrl: string, tracking?: ButtonTracking): string {
  // Return base URL if no tracking or invalid URL
  if (!tracking || !isValidUrl(baseUrl)) {
    return baseUrl;
  }

  try {
    const url = new URL(baseUrl);

    // Add UTM parameters
    if (tracking.utmSource) {
      url.searchParams.set('utm_source', tracking.utmSource);
    }
    if (tracking.utmMedium) {
      url.searchParams.set('utm_medium', tracking.utmMedium);
    }
    if (tracking.utmCampaign) {
      url.searchParams.set('utm_campaign', tracking.utmCampaign);
    }
    if (tracking.utmTerm) {
      url.searchParams.set('utm_term', tracking.utmTerm);
    }
    if (tracking.utmContent) {
      url.searchParams.set('utm_content', tracking.utmContent);
    }

    // Add custom parameters
    if (tracking.customParams) {
      Object.entries(tracking.customParams).forEach(([key, value]) => {
        if (key && value) {
          url.searchParams.set(key, value);
        }
      });
    }

    return url.toString();
  } catch (error) {
    // Return base URL if any error occurs during URL construction
    console.error('Error building tracking URL:', error);
    return baseUrl;
  }
}
