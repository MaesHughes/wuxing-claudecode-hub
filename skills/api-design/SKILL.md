---
name: api-design
category: development
description: RESTful API design patterns, best practices, and documentation standards
---

# API Design

Best practices for designing RESTful APIs with proper structure, documentation, and standards.

## RESTful Principles

### URL Structure
```
# Good - Resource-based
GET    /api/users          # List users
GET    /api/users/123      # Get specific user
POST   /api/users          # Create user
PUT    /api/users/123      # Update user
DELETE /api/users/123      # Delete user

# Good - Nested resources
GET /api/users/123/posts           # User's posts
GET /api/posts/456/comments        # Post's comments

# Bad - Action-based URLs
GET /api/getUsers
POST /api/createUser
GET /api/deleteUser/123
```

### HTTP Methods

| Method | Purpose | Idempotent | Safe |
|--------|---------|------------|------|
| GET | Retrieve | Yes | Yes |
| POST | Create | No | No |
| PUT | Update (full) | Yes | No |
| PATCH | Update (partial) | No | No |
| DELETE | Delete | Yes | No |

## Status Codes

### Success Codes
- `200 OK` - Request succeeded
- `201 Created` - Resource created
- `204 No Content` - Success, no response body

### Client Error Codes
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Authenticated but not authorized
- `404 Not Found` - Resource doesn't exist
- `409 Conflict` - Conflicting state
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limiting

### Server Error Codes
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Server down

## Request/Response Format

### Standard Response Structure
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100
  },
  "errors": null
}
```

### Error Response
```json
{
  "data": null,
  "meta": null,
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Email is required",
      "field": "email"
    }
  ]
}
```

## Pagination

### Query Parameters
```
GET /api/users?page=1&per_page=20&sort=created_at&order=desc
```

### Response Headers
```
X-Total-Count: 100
X-Page: 1
X-Per-Page: 20
X-Total-Pages: 5
Link: <https://api.com/users?page=2>; rel="next"
```

## Filtering and Search

### Filter Syntax
```
GET /api/users?status=active&role=admin
GET /api/posts?tags=javascript,react&created_after=2024-01-01
```

### Full-Text Search
```
GET /api/posts?q=search+term&fields=title,body
```

## Versioning

### URL Versioning
```
/api/v1/users
/api/v2/users
```

### Header Versioning
```
Accept: application/vnd.myapi.v1+json
```

## Authentication

### Bearer Token (JWT)
```
Authorization: Bearer <token>
```

### API Key
```
Authorization: ApiKey <key>
X-API-Key: <key>
```

## Rate Limiting

### Response Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

### Retry-After
```
Retry-After: 3600
```

## Best Practices

1. **Use nouns, not verbs** in URLs
2. **Pluralize resource names** (`/users` not `/user`)
3. **Use kebab-case** for multi-word paths
4. **Nest resources logically** (max 2-3 levels)
5. **Return proper HTTP status codes**
6. **Provide consistent response formats**
7. **Include request ID** for tracing
8. **Document all endpoints** with OpenAPI/Swagger
9. **Implement rate limiting**
10. **Use HTTPS only**
