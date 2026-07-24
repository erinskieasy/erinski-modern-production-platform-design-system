# Table

The table component provides the canonical Aligned presentation for compact structured data.

Use `.ds-table` as the scrolling surface and `.ds-table__element` on a native HTML table. Header and body cells use `.ds-table__cell`; add `.ds-table__cell--primary` for the row's primary value and `.ds-table__cell--actions` for a compact action column.

## Contract

- Native table semantics remain intact.
- Cells use `16px` horizontal and `12px` vertical padding.
- Header and primary values use the shared `500` control weight.
- Body values use the standard `14px`/`400` hierarchy.
- Rows use `1px` separators and the shared clickable hover surface.
- The table surface uses the panel radius, subtle border, raised background, and static shadow.
- Status values consume `.ds-pill` rather than introducing local badges.
