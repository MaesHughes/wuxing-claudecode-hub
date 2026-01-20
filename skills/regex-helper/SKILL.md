---
name: regex-helper
category: utilities
description: Regular expression patterns, testing, and optimization helper
---

# Regex Helper

Expert assistance for writing, testing, and optimizing regular expressions.

## Common Patterns

### Email Validation
```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

### URL Validation
```regex
^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$
```

### Phone Number (US)
```regex
^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$
```

### Date (YYYY-MM-DD)
```regex
^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$
```

### Password (8+ chars, 1 uppercase, 1 lowercase, 1 number)
```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$
```

### IPv4 Address
```regex
^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
```

### Hex Color Code
```regex
^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$
```

### Username (3-16 chars, alphanumeric + underscore)
```regex
^[a-zA-Z0-9_]{3,16}$
```

### HTML Tag Extraction
```regex
<([a-z]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)
```

## By Use Case

### Text Extraction
```regex
# Extract numbers from text
\d+(?:\.\d+)?

# Extract words
\b\w+\b

# Extract quoted strings
["']([^"']*)["']
```

### Code-Specific Patterns
```regex
# JavaScript function
function\s+(\w+)\s*\(([^)]*)\)

# CSS class
\.([\w-]+)

# Python variable
\b[a-zA-Z_][a-zA-Z0-9_]*\s*=
```

### Validation Patterns
```regex
# Credit Card (simplified)
\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}

# Social Security Number (US)
^\d{3}-\d{2}-\d{4}$

# Postal Code (US)
^\d{5}(-\d{4})?$

# License Key (XXXX-XXXX-XXXX-XXXX)
^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$
```

## Modifiers

- `i` - Case insensitive
- `g` - Global (all matches)
- `m` - Multiline
- `s` - Dot matches newline
- `u` - Unicode

## Special Characters

| Character | Meaning |
|-----------|---------|
| `.` | Any single character except newline |
| `\d` | Digit [0-9] |
| `\w` | Word character [a-zA-Z0-9_] |
| `\s` | Whitespace |
| `\b` | Word boundary |
| `^` | Start of string/line |
| `$` | End of string/line |
| `*` | 0 or more |
| `+` | 1 or more |
| `?` | 0 or 1 |
| `{n}` | Exactly n |
| `{n,m}` | Between n and m |
| `[...]` | Character class |
| `(...)` | Capturing group |
| `(?:...)` | Non-capturing group |

## Testing Tips

1. Start simple, then add complexity
2. Use regex101.com or regexr.com for testing
3. Consider edge cases (empty strings, special chars)
4. Use non-capturing groups `(?:...)` when you don't need backreferences
5. Use anchors `^` and `$` for full string matching
6. Escape special characters with `\` when matching literally
