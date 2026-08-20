import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "./index";
import { favorites, solutions, users } from "./schema";

export type CodeSnippetData = {
  title: string;
  language: string;
  code: string;
};

export type SolutionWithFavorite = {
  id: string;
  userId: string;
  title: string;
  description: string;
  problemDescription: string;
  solutionSteps: string;
  status: "open" | "resolved";
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  codeSnippets: CodeSnippetData[];
  createdAt: Date;
  updatedAt: Date;
  isFavorited: boolean;
};

export async function getSolutionById(
  solutionId: string,
  userId: string,
): Promise<SolutionWithFavorite | null> {
  const rows = await db
    .select({
      solution: solutions,
      favUserId: favorites.userId,
    })
    .from(solutions)
    .leftJoin(
      favorites,
      and(
        eq(favorites.solutionId, solutions.id),
        eq(favorites.userId, userId),
      ),
    )
    .where(and(eq(solutions.id, solutionId), eq(solutions.userId, userId)))
    .limit(1);

  if (rows.length === 0) return null;

  const row = rows[0];
  const s = row.solution;
  return {
    id: s.id,
    userId: s.userId,
    title: s.title,
    description: s.description,
    problemDescription: s.problemDescription,
    solutionSteps: s.solutionSteps,
    status: s.status as "open" | "resolved",
    difficulty: s.difficulty as "easy" | "medium" | "hard",
    tags: s.tags ?? [],
    codeSnippets: (s.codeSnippets as CodeSnippetData[]) ?? [],
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    isFavorited: row.favUserId !== null,
  };
}

export async function getUserSolutions(
  userId: string,
): Promise<SolutionWithFavorite[]> {
  const rows = await db
    .select({
      solution: solutions,
      favUserId: favorites.userId,
    })
    .from(solutions)
    .leftJoin(
      favorites,
      and(
        eq(favorites.solutionId, solutions.id),
        eq(favorites.userId, userId),
      ),
    )
    .where(eq(solutions.userId, userId))
    .orderBy(desc(solutions.createdAt));

  return rows.map((row) => {
    const s = row.solution;
    return {
      id: s.id,
      userId: s.userId,
      title: s.title,
      description: s.description,
      problemDescription: s.problemDescription,
      solutionSteps: s.solutionSteps,
      status: s.status as "open" | "resolved",
      difficulty: s.difficulty as "easy" | "medium" | "hard",
      tags: s.tags ?? [],
      codeSnippets: (s.codeSnippets as CodeSnippetData[]) ?? [],
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      isFavorited: row.favUserId !== null,
    };
  });
}

export async function getUserFavoriteSolutions(
  userId: string,
): Promise<SolutionWithFavorite[]> {
  const rows = await db
    .select({
      solution: solutions,
    })
    .from(favorites)
    .innerJoin(solutions, eq(favorites.solutionId, solutions.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));

  return rows.map((row) => {
    const s = row.solution;
    return {
      id: s.id,
      userId: s.userId,
      title: s.title,
      description: s.description,
      problemDescription: s.problemDescription,
      solutionSteps: s.solutionSteps,
      status: s.status as "open" | "resolved",
      difficulty: s.difficulty as "easy" | "medium" | "hard",
      tags: s.tags ?? [],
      codeSnippets: (s.codeSnippets as CodeSnippetData[]) ?? [],
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      isFavorited: true,
    };
  });
}

export async function getUserProfile(userId: string) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}
