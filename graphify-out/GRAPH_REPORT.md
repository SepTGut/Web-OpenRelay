# Graph Report - .  (2026-05-10)

## Corpus Check
- Corpus is ~11,593 words - fits in a single context window. You may not need a graph.

## Summary
- 72 nodes · 67 edges · 8 communities (7 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `streamNextSection()` - 3 edges
2. `buildPanel()` - 2 edges
3. `openPanel()` - 2 edges
4. `fetchSection()` - 2 edges
5. `initDynamicContent()` - 2 edges
6. `hamburger` - 1 edges
7. `mobileMenu` - 1 edges
8. `isOpen` - 1 edges
9. `spans` - 1 edges
10. `nav` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (8 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.15
Nodes (12): colors, hamburger, isOpen, mobileMenu, nav, observer, reveals, spans (+4 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (10): buildPanel(), conns, details, nodes, openPanel(), overlay, panel, panelBody (+2 more)

### Community 2 - "Community 2"
Cohesion: 0.18
Nodes (7): badge, container, d, dot, dots, observer, stats

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (8): arrows, body, btn, cards, header, layers, nodes, observer

### Community 4 - "Community 4"
Cohesion: 0.32
Nodes (5): app, fetchSection(), initDynamicContent(), pages, streamNextSection()

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (7): fullText, items, nameEl, observer, palette, ring, skills

### Community 6 - "Community 6"
Cohesion: 0.29
Nodes (6): badge, lines, row, svg, topic, val

## Knowledge Gaps
- **52 isolated node(s):** `hamburger`, `mobileMenu`, `isOpen`, `spans`, `nav` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `hamburger`, `mobileMenu`, `isOpen` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._