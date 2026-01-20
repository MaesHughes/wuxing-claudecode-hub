---
name: sql-helper
category: database
description: SQL queries, optimization tips, and database best practices
---

# SQL Helper

Expert guidance for writing SQL queries, database design, and performance optimization.

## Common Query Patterns

### SELECT Basics
```sql
-- Select specific columns
SELECT id, name, email FROM users;

-- Select with conditions
SELECT * FROM orders WHERE status = 'pending';

-- Select with multiple conditions
SELECT * FROM products
WHERE price >= 100 AND category = 'electronics';

-- Select with OR
SELECT * FROM users
WHERE role = 'admin' OR role = 'moderator';
```

### JOIN Operations
```sql
-- INNER JOIN (only matching rows)
SELECT u.name, o.order_date
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- LEFT JOIN (all from left, matching from right)
SELECT u.name, o.order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Multiple JOINs
SELECT u.name, p.name, o.quantity
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN products p ON o.product_id = p.id;
```

### Aggregation
```sql
-- COUNT
SELECT COUNT(*) as total FROM users;
SELECT COUNT(DISTINCT country) FROM users;

-- SUM, AVG, MIN, MAX
SELECT
  SUM(amount) as total,
  AVG(amount) as average,
  MIN(amount) as minimum,
  MAX(amount) as maximum
FROM orders;

-- GROUP BY
SELECT category, COUNT(*), AVG(price)
FROM products
GROUP BY category;

-- GROUP BY with HAVING
SELECT category, COUNT(*) as count
FROM products
GROUP BY category
HAVING COUNT(*) > 10;
```

### Sorting and Limiting
```sql
-- ORDER BY
SELECT * FROM products
ORDER BY price DESC, name ASC;

-- LIMIT (PostgreSQL, MySQL)
SELECT * FROM users LIMIT 10;

-- LIMIT with OFFSET
SELECT * FROM users LIMIT 10 OFFSET 20;

-- TOP (SQL Server)
SELECT TOP 10 * FROM users;
```

### Subqueries
```sql
-- Subquery in WHERE
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders);

-- Subquery in SELECT
SELECT
  name,
  (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count
FROM users u;

-- EXISTS
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

## Data Manipulation

### INSERT
```sql
-- Insert single row
INSERT INTO users (name, email, role)
VALUES ('John', 'john@example.com', 'user');

-- Insert multiple rows
INSERT INTO products (name, price, category)
VALUES
  ('Product A', 99.99, 'electronics'),
  ('Product B', 49.99, 'books'),
  ('Product C', 29.99, 'home');
```

### UPDATE
```sql
-- Update single column
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- Update multiple columns
UPDATE products
SET price = 149.99, discount = 0.2
WHERE id = 1;

-- Update with JOIN
UPDATE orders o
SET status = 'shipped'
FROM users u
WHERE o.user_id = u.id AND u.country = 'US';
```

### DELETE
```sql
-- Delete with condition
DELETE FROM users WHERE id = 1;

-- Delete with subquery
DELETE FROM orders
WHERE user_id IN (SELECT id FROM users WHERE status = 'inactive');
```

## Useful Functions

### String Functions
```sql
-- CONCAT (PostgreSQL, MySQL)
SELECT CONCAT(first_name, ' ', last_name) as full_name FROM users;

-- UPPER/LOWER
SELECT UPPER(name), LOWER(email) FROM users;

-- TRIM
SELECT TRIM(name) FROM users;

-- SUBSTRING
SELECT SUBSTRING(description, 1, 100) FROM products;

-- REPLACE
SELECT REPLACE(description, 'old', 'new') FROM products;
```

### Date Functions
```sql
-- Current date/time
SELECT CURRENT_DATE;
SELECT CURRENT_TIMESTAMP;

-- Date formatting (PostgreSQL)
SELECT TO_CHAR(created_at, 'YYYY-MM-DD') FROM orders;

-- Date arithmetic (PostgreSQL)
SELECT * FROM orders
WHERE created_at > CURRENT_DATE - INTERVAL '30 days';

-- Extract parts
SELECT EXTRACT(YEAR FROM created_at) FROM orders;
```

### Conditional Logic
```sql
-- CASE
SELECT
  name,
  CASE
    WHEN price > 100 THEN 'expensive'
    WHEN price > 50 THEN 'moderate'
    ELSE 'cheap'
  END as price_category
FROM products;

-- COALESCE (first non-null)
SELECT COALESCE(phone, email, 'N/A') as contact FROM users;
```

## Performance Tips

1. **Use indexes** on frequently filtered/joined columns
2. **SELECT specific columns** instead of `SELECT *`
3. **Use LIMIT** for large result sets
4. **Avoid `SELECT DISTINCT`** when possible (use GROUP BY)
5. **Use EXISTS instead of IN** for subqueries
6. **Avoid functions in WHERE clause** (prevents index usage)
7. **Use appropriate data types** (VARCHAR vs TEXT, INT vs BIGINT)
8. **Normalize data** but avoid over-normalization
9. **Use EXPLAIN** to analyze query performance
10. **Consider database-specific optimizations**

## Common Anti-Patterns

```sql
-- BAD: N+1 query problem (execute query in loop)
-- GOOD: Use JOIN or subqueries

-- BAD: SELECT * (retrieves unnecessary columns)
-- GOOD: SELECT specific columns

-- BAD: Wildcard at start LIKE '%term'
-- GOOD: Use full-text search or LIKE 'term%'

-- BAD: Using OR across columns
-- GOOD: Use UNION or separate queries
```
