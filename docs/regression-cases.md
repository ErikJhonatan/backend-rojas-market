# Regression cases

Prepared for this change. **Not executed.** Tests, manual checks, lint and builds require explicit user authorization. Use isolated fixtures; never run destructive cases against production.

| Case | Input or setup | Expected outcome |
| --- | --- | --- |
| Concurrent stock | In an isolated transactional MySQL fixture matching the configured dialect stock=1, submit two orders concurrently each requesting amount=1 | Exactly one succeeds; stock=0; losing transaction leaves no order or line item |
| Atomic rollback | Batch order with first product in stock and second product missing/insufficient | No order, line item or stock change persists |
| Lock ordering | Concurrent batches [product 2, product 1] and [product 1, product 2] | Products are locked in ascending ID order; no negative stock |
| Ownership | User A requests or mutates an order/customer belonging to B | 403; no changes; list excludes B resources |
| Invalid amount | POST add-item with 0, -1, 1.5, and a numeric string 2 | Invalid quantities rejected; valid coerced integer reaches service |
| Authentication | Unknown email, wrong password, token for deleted user or changed database role | Authentication fails once, or uses current database role; no fallthrough |
| Sensitive data | List customers/users/orders with included user | Password is absent |
| Restoration | Remove an order item then delete its order | Each reserved unit is restored exactly once inside its transaction |

## Additional cases (not executed)

| Case | Input or setup | Expected outcome |
| --- | --- | --- |
| Customer concurrency | Create an order while deleting or reassigning its customer | Customer row is locked; no orphan order or authorization against stale ownership |
| Zero filter values | Query offset=0 and price_min=0 with a positive maximum | Pagination and range filtering apply |
