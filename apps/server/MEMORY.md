## Purpose and context:
Build a domain-blind ingestion and querying engine that turns arbitrary sources (CSV, JSON, SQL, text) into normalized records via metadata-driven evolution. The engine's primary goal is blind ingestion with deterministic normalization — not through domain assumptions, but through deliberate constraint: every dataset, entity, and field is described by a single universal MetadataModel. Primary storage is regular Postgres (relational as source of truth), graph is an overlay via PGQ/AGE (`CREATE PROPERTY GRAPH` over relational tables). Embeddings are a generic enrichment stage driven by `semanticRole`, vector provider is agnostic (`text -> vector`, preferred Transformers.js), hybrid search is metadata-driven (lexical + vector + graph traversal), and every query returns an Envelope with data + presentation for dynamic knowledge panels. Designed to be reusable, drop-in for future projects.

## Current state:
- Only conceptual work done: drafted and reviewed what the project might look like — metadata-driven, domain-blind ingestion, deterministic normalization, generic querying, hybrid search, dynamic knowledge panels
- Design decision clarified: primary storage is regular Postgres (`e_<name>` + `_extra JSONB` + `_edges`), graph is overlay via PGQ/AGE (`CREATE PROPERTY GRAPH` over relational tables), not primary
- Dynamic knowledge panels discussed: not single component, but panel shell rendering declarative layout spec (Envelope with `meta.presentation` drives carousel vs listicle vs link box)
- Table explosion risk identified — every blind upload could create a table; discussed mitigation via generic `e_entities` bucket + promotion threshold
- Started Express app as thin glue between ingestion and query layers (`express-server.ts` draft linking client requests to ingestion and query)
- No tightened `schema-compiler/types.ts` yet — no single source of truth implemented, no compiler, no discovery/evolution/ingestion tightened
- Known issue: table explosion not yet solved, no generic bucket implemented

---

## On the horizon:
- **Schema compiler as core** — `types.ts` owns MetadataModel, `compiler.ts` owns `modelToDDL` and evolution DDL, everything else will read it
- Generic `e_entities` bucket with promotion threshold to avoid table explosion
- Data-discovery (fingerprintSource, discover) using MetadataModel
- Schema-evolution (evolve) with guarded ALTERs
- Deterministic-ingestion (rawToDraft, draftToNormalized, applyMutations)
- Generic-querying with Envelope + `GRAPH_TABLE MATCH` support
- Embeddings as generic enrichment + hybrid search as metadata-driven retrieval
- Tighten Express glue once compiler exists
- Dynamic knowledge panel block registry

### Schema Compiler (next major milestone)

**Core principle:**
Metadata is source of truth. `types.ts` defines Dataset, EntityType, Field, Relationship, and Presentation. Compiler never knows domain — it only reads `searchable`, `semanticRole`, `presentation.primaryView`. DDL is derived, not hand-written.

**Registry / Types (`schema-compiler/types.ts`):**
```ts
export type Field = {
  name: string;
  type: { kind: 'text' | 'int' | 'float' | 'bool' | 'vector' | 'jsonb'; dimensions?: number };
  semanticRole?: 'identifier' | 'display' | 'embeddable' | 'fact';
  searchable?: { lexical?: boolean; semantic?: boolean };
};
export type EntityType = {
  name: string;
  fields: Field[];
  presentation?: { primaryView: 'knowledge_panel' | 'carousel' | 'listicle' | 'link_box'; layoutHints?: string[] };
};
export type Dataset = {
  id: string; version: number; entityTypes: EntityType[]; relationships: Relationship[];
};
export function getEntity(dataset: Dataset, name: string) {...}
```

**`compiler.ts` changes:**
- `modelToDDL(dataset, target)` -> vanilla SQL `CREATE TABLE e_<name>`, `_extra JSONB`, vector columns, HNSW index, `_edges` table
- `modelToEvolutionDDL(prev, next)` -> guarded `ALTER TABLE ADD COLUMN IF NOT EXISTS`, never destructive
- PGQ declaration: `CREATE PROPERTY GRAPH ...` over relational tables, graph as view

**Adding a new entity (e.g., from blind upload):**
1. Discovery produces Draft with inferred fields
2. Draft -> Model via `draftToModel` (assigns `semanticRole`, `searchable`)
3. Compiler emits DDL + registers in `_datasets` model registry

**Migration path:**
Start with generic `e_entities` bucket + `_edges`. Promote to dedicated `e_<name>` when evolution threshold met (row count / source frequency). Existing data migrates via `INSERT INTO e_<name> SELECT`.

**Files added:**
| File | Purpose |
|------|---------|
| `schema-compiler/types.ts` | Universal MetadataModel, single source of truth — first implementation |
| `schema-compiler/compiler.ts` | modelToDDL, modelToEvolutionDDL, PGQ graph declaration |

**Files changed:**
| File | Change |
|------|--------|
| `express-server.ts` | Draft exists, will be tightened to use types.ts once compiler lands — no tightening yet |

---

## Key learnings and principles:
- Relational as source of truth, graph as query view → ACID, GIN, pgvector, easy migrations, still `GRAPH_TABLE MATCH` — discussed, not implemented
- Open model via `_extra JSONB` + `_edges` → blind uploads stay domain-blind, no predefining labels — design decision
- Metadata-first — all behavior should flow from MetadataModel; raw values are escapes
- Zero domain logic in ingestion/querying → positioning is metadata-only; no hardcoded entity handling
- Query parity via target (`postgres` | `pgq` | `age`) — same AST, different compiler — planned
- Envelope with data + presentation drives dynamic knowledge panels (carousel vs listicle vs link box) — discussed
- Table explosion controlled by generic bucket + promotion threshold — idea only, not built
- Process: atomic steps, concision → every change is one file/function at a time; every response is 1 paragraph / ≤10 lines when possible. No one-shotting, no fluff.

## Approach and patterns:
- **Strictly procedural**: One step at a time — clarify types/API shape first, then compiler implementation, then discovery/evolution
- **Concision**: No over-explaining; code snippets preferred over prose-heavy walkthroughs
- **Corrections are immediate**: Deviations from vanilla SQL / domain-blind / metadata-driven are corrected in real time
- **Handoff prompts**: A guided memory log carries context across new chat sessions

### Enforced conventions:
- Vanilla SQL via `node-postgres`, no ORM, no graph DB as primary
- Domain-blind — no entity names hardcoded in compiler, discovery, or ingestion
- `e_<name>` tables, `_extra`, `_edges`, `_provenance`, `_lineage` columns
- `data-entity` and `data-testid` on every knowledge panel block root
- Property ordering: `id` → typed columns → `_extra` → `_provenance` → vector columns
- Envelope always: `{ data, meta: { presentation, searchableFields } }`
- Token naming: `searchable.lexical`, `semanticRole`, `presentation.primaryView`

## Tools and resources:
- Postgres 15+ with PGQ (`CREATE PROPERTY GRAPH`) and `vector` extension (HNSW)
- Node + Express (thin glue for ingestion and query)
- TypeScript
- `node-postgres` (pg Pool)
- `@xenova/transformers` (preferred EmbeddingProvider `text -> vector`)
- GraphRAG concept: hybrid retrieval (lexical + vector + graph traversal) as context for LLM
