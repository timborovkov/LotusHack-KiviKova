import { randomUUID } from "crypto";
import { getQdrantClient } from "./client";
import { createEmbedding } from "@/lib/openai/embeddings";
import { chunkText } from "@/lib/knowledge/chunk";

/**
 * Upsert agenda text into a meeting's Qdrant collection.
 * Deletes any existing agenda points first, then embeds and upserts new ones.
 */
export async function upsertAgenda(
  collectionName: string,
  agendaText: string
): Promise<void> {
  const client = getQdrantClient();

  // Delete existing agenda points
  // eslint-disable-next-line drizzle/enforce-delete-with-where -- Qdrant client, not Drizzle
  await client.delete(collectionName, {
    filter: {
      must: [{ key: "type", match: { value: "agenda" } }],
    },
  });

  const trimmed = agendaText.trim();
  if (!trimmed) return;

  // Chunk if long, otherwise single chunk
  const chunks = chunkText(trimmed);

  for (const chunk of chunks) {
    const vector = await createEmbedding(chunk.text);
    await client.upsert(collectionName, {
      points: [
        {
          id: randomUUID(),
          vector,
          payload: {
            text: chunk.text,
            type: "agenda",
            speaker: "Agenda",
            timestamp_ms: 0,
          },
        },
      ],
    });
  }
}
