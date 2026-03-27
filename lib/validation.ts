/**
 * 🛡️ INPUT VALIDATION & SANITIZATION
 * 
 * Protection contre les injections et validation des données
 */

export interface ValidationResult<T = any> {
  valid: boolean;
  data?: T;
  errors?: string[];
}

/**
 * Validate Email
 */
export function validateEmail(email: string): ValidationResult<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || typeof email !== 'string') {
    return { valid: false, errors: ['Email is required'] };
  }

  const trimmed = email.trim().toLowerCase();
  
  if (!emailRegex.test(trimmed)) {
    return { valid: false, errors: ['Invalid email format'] };
  }

  if (trimmed.length > 254) {
    return { valid: false, errors: ['Email too long'] };
  }

  return { valid: true, data: trimmed };
}

/**
 * Validate Phone Number
 */
export function validatePhone(phone: string): ValidationResult<string> {
  if (!phone) {
    return { valid: true, data: '' }; // Optional field
  }

  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's digits and optional +
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  
  if (!phoneRegex.test(cleaned)) {
    return { valid: false, errors: ['Invalid phone format. Use: +1234567890'] };
  }

  return { valid: true, data: cleaned };
}

/**
 * Validate Name (no special chars)
 */
export function validateName(name: string, field: string = 'Name'): ValidationResult<string> {
  if (!name || typeof name !== 'string') {
    return { valid: false, errors: [`${field} is required`] };
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return { valid: false, errors: [`${field} must be at least 2 characters`] };
  }

  if (trimmed.length > 100) {
    return { valid: false, errors: [`${field} too long (max 100 characters)`] };
  }

  // Allow letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  
  if (!nameRegex.test(trimmed)) {
    return { valid: false, errors: [`${field} contains invalid characters`] };
  }

  return { valid: true, data: trimmed };
}

/**
 * Validate URL
 */
export function validateUrl(url: string, required: boolean = true): ValidationResult<string> {
  if (!url) {
    if (required) {
      return { valid: false, errors: ['URL is required'] };
    }
    return { valid: true, data: '' };
  }

  try {
    const parsed = new URL(url);
    
    // Only allow http/https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, errors: ['URL must use http or https protocol'] };
    }

    return { valid: true, data: url };
  } catch {
    return { valid: false, errors: ['Invalid URL format'] };
  }
}

/**
 * Sanitize HTML/Script injection
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate Client Data
 */
export interface ClientInput {
  name: string;
  email: string;
  phone?: string;
  instagram_username?: string;
}

export function validateClientData(data: any): ValidationResult<ClientInput> {
  const errors: string[] = [];

  // Validate name
  const nameResult = validateName(data.name, 'Name');
  if (!nameResult.valid) {
    errors.push(...(nameResult.errors || []));
  }

  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) {
    errors.push(...(emailResult.errors || []));
  }

  // Validate phone (optional)
  if (data.phone) {
    const phoneResult = validatePhone(data.phone);
    if (!phoneResult.valid) {
      errors.push(...(phoneResult.errors || []));
    }
  }

  // Validate Instagram username (optional)
  if (data.instagram_username) {
    const username = data.instagram_username.trim();
    if (username.length > 30 || !/^[a-zA-Z0-9._]+$/.test(username)) {
      errors.push('Invalid Instagram username format');
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: nameResult.data!,
      email: emailResult.data!,
      phone: data.phone ? validatePhone(data.phone).data : undefined,
      instagram_username: data.instagram_username?.trim()
    }
  };
}

/**
 * Validate Template Data
 */
export interface TemplateInput {
  name: string;
  message: string;
  trigger_keywords?: string[];
  include_calendly?: boolean;
}

export function validateTemplateData(data: any): ValidationResult<TemplateInput> {
  const errors: string[] = [];

  // Validate name
  if (!data.name || data.name.trim().length < 3) {
    errors.push('Template name must be at least 3 characters');
  }

  // Validate message
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }

  if (data.message && data.message.length > 1000) {
    errors.push('Message too long (max 1000 characters)');
  }

  // Validate keywords
  if (data.trigger_keywords) {
    if (!Array.isArray(data.trigger_keywords)) {
      errors.push('Trigger keywords must be an array');
    } else if (data.trigger_keywords.length > 50) {
      errors.push('Too many trigger keywords (max 50)');
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      name: data.name.trim(),
      message: data.message.trim(),
      trigger_keywords: data.trigger_keywords || [],
      include_calendly: !!data.include_calendly
    }
  };
}

/**
 * Validate UUID
 */
export function validateUuid(id: string): ValidationResult<string> {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(id)) {
    return { valid: false, errors: ['Invalid ID format'] };
  }

  return { valid: true, data: id };
}

/**
 * Rate Limiting Helper (simple in-memory)
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  check(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Filter out old requests
    const recent = requests.filter(time => now - time < windowMs);
    
    if (recent.length >= maxRequests) {
      return false; // Rate limit exceeded
    }

    // Add current request
    recent.push(now);
    this.requests.set(key, recent);
    
    return true;
  }

  reset(key: string) {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Check Rate Limit for API routes
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; error?: string } {
  const allowed = rateLimiter.check(identifier, maxRequests, windowMs);
  
  if (!allowed) {
    return {
      allowed: false,
      error: `Rate limit exceeded. Max ${maxRequests} requests per ${windowMs / 1000}s`
    };
  }

  return { allowed: true };
}
