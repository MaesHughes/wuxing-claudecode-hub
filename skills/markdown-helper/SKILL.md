---
name: markdown-helper
category: utilities
description: Markdown syntax guide, table formatting, and documentation writing tips
---

# Markdown Helper

Complete guide to Markdown syntax, formatting, and documentation best practices.

## Basic Syntax

### Headings
```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

### Emphasis
```markdown
*italic* or _italic_
**bold** or __bold__
***bold italic***
~~strikethrough~~
```

### Lists
```markdown
# Unordered
- Item 1
- Item 2
  - Nested item
* Item 3

# Ordered
1. First
2. Second
3. Third

# Task List
- [x] Completed task
- [ ] Incomplete task
```

### Links and Images
```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Hover text")

![Alt text](image.png)
![Alt text](image.png "Image title")

[Reference link][ref]
[ref]: https://example.com
```

### Code
```markdown
`inline code`

```
code block
```

```javascript
// Code with syntax highlighting
function hello() {
  console.log("Hello, World!");
}
```
```

### Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

# Alignment
| Left | Center | Right |
|:-----|:------:|------:|
| L    | C      | R     |
```

### Blockquotes
```markdown
> Blockquote
>
> > Nested quote
>
> --- with paragraph
```

### Horizontal Rule
```markdown
---
***
___
```

### HTML
```markdown
<div>Raw HTML</div>
<details>
<summary>Click to expand</summary>
Hidden content
</details>
```

## Advanced Features

### Footnotes
```markdown
Text with footnote[^1]

[^1]: Footnote text
```

### Definition Lists
```markdown
Term 1
: Definition 1

Term 2
: Definition 2
```

### Task Lists
```markdown
- [x] Completed task
- [ ] Pending task
- [ ] Subtask
  - [x] Subtask completed
```

### Admonitions (GitHub)
```markdown
> **Note**
> This is a note

> **Warning**
> This is a warning

> **Tip**
> This is a tip
```

## Documentation Best Practices

### Structure
```markdown
# Title

Brief description or abstract.

## Table of Contents
- [Section 1](#section-1)
- [Section 2](#section-2)

## Prerequisites
What you need before starting.

## Installation
Step-by-step setup instructions.

## Usage
How to use the project.

## API Reference
Detailed API documentation.

## Contributing
Contribution guidelines.

## License
License information.
```

### Code Examples
- Use syntax highlighting
- Include comments for clarity
- Show expected output
- Provide complete, runnable examples

### Linking
- Use relative links for internal navigation
- Include anchor links for sections
- Update links when content moves

## Quick Reference

| Element | Syntax |
|---------|--------|
| Heading | `# H1` / `## H2` |
| Bold | `**text**` |
| Italic | `*text*` |
| Code | `` `code` `` |
| Link | `[text](url)` |
| Image | `![alt](url)` |
| List | `- item` / `1. item` |
| Code block | ` ``` ` |
| Table | `\| col \|` |
| Blockquote | `> quote` |
| Strikethrough | `~~text~~` |
| Task | `- [ ] task` |
