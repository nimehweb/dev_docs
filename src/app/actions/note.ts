"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "../../db";
import { noteFavorites, notes } from "../../db/schema";
import { getSessionUser } from "../../lib/auth";
import { withDbRetry } from "../../lib/retry";
import { noteSchema, type NoteInput } from "../../lib/validation";

type ActionState<T = void> = {
  error?: string;
  data?: T;
};

function zodError(e: z.ZodError): string {
  return e.issues[0]?.message ?? "Invalid input";
}

export async function createNoteAction(
  input: NoteInput,
): Promise<ActionState<{ id: string }>> {
  const userId = await getSessionUser();
  if (!userId) {
    return { error: "Unauthorized. Please log in." };
  }

  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: zodError(parsed.error) };
  }

  try {
    const [created] = await withDbRetry(() =>
      db
        .insert(notes)
        .values({
          userId,
          title: parsed.data.title,
          summary: parsed.data.summary,
          status: parsed.data.status,
          tags: parsed.data.tags,
          blocks: parsed.data.blocks,
        })
        .returning({ id: notes.id }),
    );

    revalidatePath("/solution");
    revalidatePath("/dashboard");
    revalidatePath("/tags");

    return { data: { id: created.id } };
  } catch (error) {
    console.error("Failed to create note:", error);
    return { error: "Database error while creating note." };
  }
}

export async function updateNoteAction(
  noteId: string,
  input: NoteInput,
): Promise<ActionState> {
  const userId = await getSessionUser();
  if (!userId) {
    return { error: "Unauthorized. Please log in." };
  }

  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: zodError(parsed.error) };
  }

  try {
    const existing = await withDbRetry(() =>
      db
        .select({ id: notes.id })
        .from(notes)
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
        .limit(1),
    );

    if (existing.length === 0) {
      return { error: "Note not found or access denied." };
    }

    await withDbRetry(() =>
      db
        .update(notes)
        .set({
          title: parsed.data.title,
          summary: parsed.data.summary,
          status: parsed.data.status,
          tags: parsed.data.tags,
          blocks: parsed.data.blocks,
          updatedAt: new Date(),
        })
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId))),
    );

    revalidatePath("/solution");
    revalidatePath(`/solution/${noteId}`);
    revalidatePath("/dashboard");
    revalidatePath("/tags");

    return {};
  } catch (error) {
    console.error("Failed to update note:", error);
    return { error: "Database error while updating note." };
  }
}

export async function deleteNoteAction(noteId: string): Promise<ActionState> {
  const userId = await getSessionUser();
  if (!userId) {
    return { error: "Unauthorized. Please log in." };
  }

  try {
    const existing = await withDbRetry(() =>
      db
        .select({ id: notes.id })
        .from(notes)
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId)))
        .limit(1),
    );

    if (existing.length === 0) {
      return { error: "Note not found or access denied." };
    }

    await withDbRetry(() =>
      db
        .delete(notes)
        .where(and(eq(notes.id, noteId), eq(notes.userId, userId))),
    );

    revalidatePath("/solution");
    revalidatePath("/dashboard");
    revalidatePath("/favorites");
    revalidatePath("/tags");

    return {};
  } catch (error) {
    console.error("Failed to delete note:", error);
    return { error: "Database error while deleting note." };
  }
}

export async function toggleNoteFavoriteAction(
  noteId: string,
): Promise<ActionState<{ isFavorited: boolean }>> {
  const userId = await getSessionUser();
  if (!userId) {
    return { error: "Unauthorized. Please log in." };
  }

  try {
    const existing = await withDbRetry(() =>
      db
        .select({ userId: noteFavorites.userId })
        .from(noteFavorites)
        .where(
          and(
            eq(noteFavorites.userId, userId),
            eq(noteFavorites.noteId, noteId),
          ),
        )
        .limit(1),
    );

    if (existing.length > 0) {
      await withDbRetry(() =>
        db
          .delete(noteFavorites)
          .where(
            and(
              eq(noteFavorites.userId, userId),
              eq(noteFavorites.noteId, noteId),
            ),
          ),
      );

      revalidatePath("/solution");
      revalidatePath(`/solution/${noteId}`);
      revalidatePath("/favorites");
      revalidatePath("/dashboard");

      return { data: { isFavorited: false } };
    } else {
      await withDbRetry(() =>
        db.insert(noteFavorites).values({ userId, noteId }),
      );

      revalidatePath("/solution");
      revalidatePath(`/solution/${noteId}`);
      revalidatePath("/favorites");
      revalidatePath("/dashboard");

      return { data: { isFavorited: true } };
    }
  } catch (error) {
    console.error("Failed to toggle note favorite:", error);
    return { error: "Database error while toggling favorite status." };
  }
}
