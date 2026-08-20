"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { db } from "../../db";
import { favorites, solutions } from "../../db/schema";
import { getSessionUser } from "../../lib/auth";
import { solutionSchema, type SolutionInput } from "../../lib/validation";

type ActionState<T = void> = {
  error?: string;
  data?: T;
};

function zodError(e: z.ZodError): string {
  return e.issues[0]?.message ?? "Invalid input";
}

export async function createSolutionAction(
  input: SolutionInput,
): Promise<ActionState<{ id: string }>> {
  const userId = await getSessionUser();
  if (!userId) {
    return { error: "Unauthorized. Please log in." };
  }

  const parsed = solutionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: zodError(parsed.error) };
  }

  try {
    const [created] = await db
      .insert(solutions)
      .values({
        userId,
        title: parsed.data.title,
        description: parsed.data.description,
        problemDescription: parsed.data.problemDescription,
        solutionSteps: parsed.data.solutionSteps,
        status: parsed.data.status,
        difficulty: parsed.data.difficulty,
        tags: parsed.data.tags,
        codeSnippets: parsed.data.codeSnippets,
      })
      .returning({ id: solutions.id });

    revalidatePath("/solution");
    revalidatePath("/dashboard");
    revalidatePath("/tags");

    return { data: { id: created.id } };
  } catch (error) {
    console.error("Failed to create solution:", error);
    return { error: "Database error while creating solution." };
  }
}

export async function updateSolutionAction(
  solutionId: string,
  input: SolutionInput,
): Promise<ActionState> {
  const userId = await getSessionUser();
  if (!userId) {
    return { error: "Unauthorized. Please log in." };
  }

  const parsed = solutionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: zodError(parsed.error) };
  }

  try {
    const existing = await db
      .select({ id: solutions.id })
      .from(solutions)
      .where(and(eq(solutions.id, solutionId), eq(solutions.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      return { error: "Solution not found or access denied." };
    }

    await db
      .update(solutions)
      .set({
        title: parsed.data.title,
        description: parsed.data.description,
        problemDescription: parsed.data.problemDescription,
        solutionSteps: parsed.data.solutionSteps,
        status: parsed.data.status,
        difficulty: parsed.data.difficulty,
        tags: parsed.data.tags,
        codeSnippets: parsed.data.codeSnippets,
        updatedAt: new Date(),
      })
      .where(and(eq(solutions.id, solutionId), eq(solutions.userId, userId)));

    revalidatePath("/solution");
    revalidatePath(`/solution/${solutionId}`);
    revalidatePath("/dashboard");
    revalidatePath("/tags");

    return {};
  } catch (error) {
    console.error("Failed to update solution:", error);
    return { error: "Database error while updating solution." };
  }
}

export async function deleteSolutionAction(
  solutionId: string,
): Promise<ActionState> {
  const userId = await getSessionUser();
  if (!userId) {
    return { error: "Unauthorized. Please log in." };
  }

  try {
    const existing = await db
      .select({ id: solutions.id })
      .from(solutions)
      .where(and(eq(solutions.id, solutionId), eq(solutions.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      return { error: "Solution not found or access denied." };
    }

    await db
      .delete(solutions)
      .where(and(eq(solutions.id, solutionId), eq(solutions.userId, userId)));

    revalidatePath("/solution");
    revalidatePath("/dashboard");
    revalidatePath("/favorites");
    revalidatePath("/tags");

    return {};
  } catch (error) {
    console.error("Failed to delete solution:", error);
    return { error: "Database error while deleting solution." };
  }
}

export async function toggleFavoriteAction(
  solutionId: string,
): Promise<ActionState<{ isFavorited: boolean }>> {
  const userId = await getSessionUser();
  if (!userId) {
    return { error: "Unauthorized. Please log in." };
  }

  try {
    const existing = await db
      .select({ userId: favorites.userId })
      .from(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.solutionId, solutionId)),
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, userId),
            eq(favorites.solutionId, solutionId),
          ),
        );

      revalidatePath("/solution");
      revalidatePath(`/solution/${solutionId}`);
      revalidatePath("/favorites");
      revalidatePath("/dashboard");

      return { data: { isFavorited: false } };
    } else {
      await db.insert(favorites).values({ userId, solutionId });

      revalidatePath("/solution");
      revalidatePath(`/solution/${solutionId}`);
      revalidatePath("/favorites");
      revalidatePath("/dashboard");

      return { data: { isFavorited: true } };
    }
  } catch (error) {
    console.error("Failed to toggle favorite:", error);
    return { error: "Database error while toggling favorite status." };
  }
}
