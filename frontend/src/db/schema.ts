import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import type { AdapterAccount } from '@auth/core/adapters';

// ============================================
// ENUMS (as constants in TypeScript)
// ============================================

export const CareerPath = {
    ANALYST: 'ANALYST',
    SCIENTIST: 'SCIENTIST',
} as const;

export const ContentType = {
    VIDEO: 'VIDEO',
    TEXT: 'TEXT',
} as const;

export const ChallengeType = {
    PYTHON: 'PYTHON',
    SQL: 'SQL',
} as const;

export const SubmissionStatus = {
    PENDING: 'PENDING',
    GRADED: 'GRADED',
    FAILED: 'FAILED',
} as const;

export const ProgressStatus = {
    LOCKED: 'LOCKED',
    UNLOCKED: 'UNLOCKED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
} as const;

// ============================================
// TABLES
// ============================================

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    name: text('name'),
    email: text('email').notNull().unique(),
    emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
    image: text('image'),
    currentPath: text('current_path'), // 'ANALYST' or 'SCIENTIST'
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const accounts = sqliteTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccount["type"]>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    })
);

export const sessions = sqliteTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    })
);

export const tracks = sqliteTable('tracks', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    careerPath: text('career_path').notNull(), // 'ANALYST' or 'SCIENTIST'
    description: text('description'),
    aiPersonaName: text('ai_persona_name').notNull(), // 'RENDY' or 'ABDUL'
    iconUrl: text('icon_url'),
    colorTheme: text('color_theme'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const levels = sqliteTable('levels', {
    id: text('id').primaryKey(),
    trackId: text('track_id').notNull().references(() => tracks.id),
    name: text('name').notNull(),
    description: text('description'),
    sequenceOrder: integer('sequence_order').notNull(),
    minPassingScore: integer('min_passing_score').notNull().default(70),
    isLockedByDefault: integer('is_locked_by_default', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const modules = sqliteTable('modules', {
    id: text('id').primaryKey(),
    levelId: text('level_id').notNull().references(() => levels.id),
    title: text('title').notNull(),
    contentType: text('content_type').notNull(), // 'VIDEO' or 'TEXT'
    contentUrl: text('content_url'),
    contentMarkdown: text('content_markdown'),
    durationMinutes: integer('duration_minutes'),
    sequenceOrder: integer('sequence_order').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const challenges = sqliteTable('challenges', {
    id: text('id').primaryKey(),
    levelId: text('level_id').notNull().references(() => levels.id),
    title: text('title').notNull(),
    description: text('description').notNull(),
    challengeType: text('challenge_type').notNull(), // 'PYTHON' or 'SQL'
    starterCode: text('starter_code'),
    solutionCode: text('solution_code'),
    testCases: text('test_cases'), // JSON string
    hints: text('hints'), // JSON string
    gradingCriteria: text('grading_criteria'), // JSON string
    difficulty: integer('difficulty').notNull().default(1),
    minPassingScore: integer('min_passing_score').notNull().default(70),
    sequenceOrder: integer('sequence_order').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userProgress = sqliteTable('user_progress', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    levelId: text('level_id').notNull().references(() => levels.id),
    status: text('status').notNull().default('LOCKED'), // LOCKED, UNLOCKED, IN_PROGRESS, COMPLETED
    currentScore: integer('current_score').default(0),
    bestScore: integer('best_score').default(0),
    attemptsCount: integer('attempts_count').notNull().default(0),
    unlockedAt: integer('unlocked_at', { mode: 'timestamp' }),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    lastActivityAt: integer('last_activity_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const submissions = sqliteTable('submissions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    challengeId: text('challenge_id').notNull().references(() => challenges.id),
    code: text('code').notNull(),
    language: text('language').notNull(), // 'PYTHON' or 'SQL'
    status: text('status').notNull().default('PENDING'), // PENDING, GRADED, FAILED
    score: integer('score'),
    aiFeedback: text('ai_feedback'), // JSON string with detailed feedback
    executionTime: integer('execution_time'), // milliseconds
    executionOutput: text('execution_output'),
    passed: integer('passed', { mode: 'boolean' }).default(false),
    submittedAt: integer('submitted_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    gradedAt: integer('graded_at', { mode: 'timestamp' }),
});

export const achievements = sqliteTable('achievements', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    badgeIconUrl: text('badge_icon_url'),
    criteriaJson: text('criteria_json'), // JSON string
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userAchievements = sqliteTable('user_achievements', {
    userId: text('user_id').notNull().references(() => users.id),
    achievementId: text('achievement_id').notNull().references(() => achievements.id),
    unlockedAt: integer('unlocked_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    pk: primaryKey({ columns: [table.userId, table.achievementId] }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Track = typeof tracks.$inferSelect;
export type Level = typeof levels.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
