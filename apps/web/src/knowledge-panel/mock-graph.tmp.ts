import type { Graph } from './types';

// Source 1: CSV upload. Flat rows, every value a string, no types.
export const csvGraph: Graph = {
  nodes: [
    {
      id: "row-1",
      props: {
        name: "Ada Lovelace",
        born: "1815-12-10",
        city: "London",
        occupation: "Mathematician",
        photo: "https://placehold.co/200x200",
      },
    },
    {
      id: "row-2",
      props: { name: "Charles Babbage", born: "1791-12-26", city: "London", occupation: "Inventor" },
    },
  ],
  edges: [{ id: "e1", source: "row-1", target: "row-2", label: "collaborated_with" }],
};

// Source 2: text document. One long-text node plus entities it mentions.
export const documentGraph: Graph = {
  nodes: [
    {
      id: "doc-1",
      type: "document",
      label: "Notes on the Analytical Engine",
      props: {
        author: "Ada Lovelace",
        published: "1843",
        text:
          "The Analytical Engine has no pretensions whatever to originate anything. " +
          "It can do whatever we know how to order it to perform. It might act upon " +
          "other things besides number, were objects found whose mutual fundamental " +
          "relations could be expressed by those of the abstract science of operations.",
      },
    },
    { id: "ent-1", type: "machine", label: "Analytical Engine", props: { designer: "Charles Babbage" } },
  ],
  edges: [{ id: "e1", source: "doc-1", target: "ent-1", label: "mentions" }],
};

// Source 3: database. Typed values, nested objects, arrays, child records.
export const databaseGraph: Graph = {
  nodes: [
    {
      id: "cust-42",
      type: "customer",
      label: "Grace Hopper",
      props: {
        email: "grace@example.com",
        active: true,
        balance: 1250.5,
        address: { street: "1 Navy Way", city: "Arlington", zip: "22202" },
        tags: ["vip", "navy", "compilers"],
      },
    },
    { id: "ord-1", type: "order", props: { total: 99.9, placed_at: "2026-03-01", status: "shipped" } },
    { id: "ord-2", type: "order", props: { total: 24.0, placed_at: "2026-04-12", status: "pending" } },
  ],
  edges: [
    { id: "e1", source: "cust-42", target: "ord-1", label: "placed" },
    { id: "e2", source: "cust-42", target: "ord-2", label: "placed" },
  ],
};

export const mockGraphs = { csvGraph, documentGraph, databaseGraph };
