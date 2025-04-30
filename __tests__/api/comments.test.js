import { createMocks } from "node-mocks-http";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as clerkServer from "@clerk/nextjs/server";

// Mock the API routes
import {
  GET as getComments,
  POST as createComment,
} from "@/app/api/reviews/[id]/comments/route";
import {
  PATCH as updateComment,
  DELETE as deleteComment,
} from "@/app/api/comments/[id]/route";

// Mock Clerk authentication
jest.mock("@clerk/nextjs/server", () => ({
  getAuth: jest.fn(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  review: {
    findUnique: jest.fn(),
  },
  comment: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
}));

describe("Comments API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/reviews/[id]/comments", () => {
    it("should return 404 if review is not found", async () => {
      // Mock review not found
      prisma.review.findUnique.mockResolvedValueOnce(null);

      const { req, res } = createMocks({
        method: "GET",
      });

      const response = await getComments(req, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Review not found" });
    });

    it("should return comments for a review", async () => {
      // Mock review and comments
      const mockReview = { id: "review-id", content: "Test Review" };
      const mockComments = [
        {
          id: "comment-1",
          content: "Great review!",
          userId: "user-1",
          user: { id: "user-1", name: "User One" },
        },
        {
          id: "comment-2",
          content: "I agree!",
          userId: "user-2",
          user: { id: "user-2", name: "User Two" },
        },
      ];

      prisma.review.findUnique.mockResolvedValueOnce(mockReview);
      prisma.comment.findMany.mockResolvedValueOnce(mockComments);

      const { req, res } = createMocks({
        method: "GET",
      });

      const response = await getComments(req, { params: { id: "review-id" } });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockComments);
    });
  });

  describe("POST /api/reviews/[id]/comments", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Mock no auth
      clerkServer.getAuth.mockReturnValueOnce({ userId: null });

      const { req, res } = createMocks({
        method: "POST",
        body: {
          content: "Great review!",
        },
      });

      const response = await createComment(req, {
        params: { id: "review-id" },
      });

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: "Unauthorized" });
    });

    it("should return 404 if review is not found", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock review not found
      prisma.review.findUnique.mockResolvedValueOnce(null);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          content: "Great review!",
        },
      });

      const response = await createComment(req, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Review not found" });
    });

    it("should return 400 if content is empty", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock review found
      prisma.review.findUnique.mockResolvedValueOnce({ id: "review-id" });

      const { req, res } = createMocks({
        method: "POST",
        body: {
          content: "", // Empty content
        },
      });

      const response = await createComment(req, {
        params: { id: "review-id" },
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: "Comment content cannot be empty",
      });
    });

    it("should create a new comment successfully", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock review found
      prisma.review.findUnique.mockResolvedValueOnce({ id: "review-id" });

      // Mock comment creation
      const mockCreatedComment = {
        id: "new-comment-id",
        content: "Great review!",
        userId: "user-id",
        reviewId: "review-id",
        createdAt: new Date(),
        user: {
          id: "user-id",
          name: "Test User",
          email: "test@example.com",
        },
      };
      prisma.comment.create.mockResolvedValueOnce(mockCreatedComment);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          content: "Great review!",
        },
      });

      const response = await createComment(req, {
        params: { id: "review-id" },
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockCreatedComment);
    });
  });

  describe("PATCH /api/comments/[id]", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Mock no auth
      clerkServer.getAuth.mockReturnValueOnce({ userId: null });

      const { req, res } = createMocks({
        method: "PATCH",
        body: {
          content: "Updated comment",
        },
      });

      const response = await updateComment(req, {
        params: { id: "comment-id" },
      });

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: "Unauthorized" });
    });

    it("should return 404 if comment is not found", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock comment not found
      prisma.comment.findUnique.mockResolvedValueOnce(null);

      const { req, res } = createMocks({
        method: "PATCH",
        body: {
          content: "Updated comment",
        },
      });

      const response = await updateComment(req, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Comment not found" });
    });

    it("should return 403 if user is not the comment author", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock comment found with different author
      prisma.comment.findUnique.mockResolvedValueOnce({
        id: "comment-id",
        userId: "different-user-id",
      });

      const { req, res } = createMocks({
        method: "PATCH",
        body: {
          content: "Updated comment",
        },
      });

      const response = await updateComment(req, {
        params: { id: "comment-id" },
      });

      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({
        error: "Not authorized to update this comment",
      });
    });

    it("should return 400 if content is empty", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock comment found with same author
      prisma.comment.findUnique.mockResolvedValueOnce({
        id: "comment-id",
        userId: "user-id",
      });

      const { req, res } = createMocks({
        method: "PATCH",
        body: {
          content: "", // Empty content
        },
      });

      const response = await updateComment(req, {
        params: { id: "comment-id" },
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: "Comment content cannot be empty",
      });
    });

    it("should update comment successfully", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock comment found with same author
      prisma.comment.findUnique.mockResolvedValueOnce({
        id: "comment-id",
        userId: "user-id",
      });

      // Mock updated comment
      const mockUpdatedComment = {
        id: "comment-id",
        content: "Updated comment",
        userId: "user-id",
        reviewId: "review-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: "user-id",
          name: "Test User",
          email: "test@example.com",
        },
      };
      prisma.comment.update.mockResolvedValueOnce(mockUpdatedComment);

      const { req, res } = createMocks({
        method: "PATCH",
        body: {
          content: "Updated comment",
        },
      });

      const response = await updateComment(req, {
        params: { id: "comment-id" },
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockUpdatedComment);
    });
  });

  describe("DELETE /api/comments/[id]", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Mock no auth
      clerkServer.getAuth.mockReturnValueOnce({ userId: null });

      const { req, res } = createMocks({
        method: "DELETE",
      });

      const response = await deleteComment(req, {
        params: { id: "comment-id" },
      });

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: "Unauthorized" });
    });

    it("should return 404 if comment is not found", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock comment not found
      prisma.comment.findUnique.mockResolvedValueOnce(null);

      const { req, res } = createMocks({
        method: "DELETE",
      });

      const response = await deleteComment(req, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Comment not found" });
    });

    it("should return 403 if user is not the author or admin", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock comment found with different author
      prisma.comment.findUnique.mockResolvedValueOnce({
        id: "comment-id",
        userId: "different-user-id",
      });

      // Mock user not admin
      prisma.user.findUnique.mockResolvedValueOnce({
        id: "user-id",
        role: "user",
      });

      const { req, res } = createMocks({
        method: "DELETE",
      });

      const response = await deleteComment(req, {
        params: { id: "comment-id" },
      });

      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({
        error: "Not authorized to delete this comment",
      });
    });

    it("should allow admin to delete any comment", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "admin-id" });

      // Mock comment found with different author
      prisma.comment.findUnique.mockResolvedValueOnce({
        id: "comment-id",
        userId: "different-user-id",
      });

      // Mock user is admin
      prisma.user.findUnique.mockResolvedValueOnce({
        id: "admin-id",
        role: "admin",
      });

      const { req, res } = createMocks({
        method: "DELETE",
      });

      const response = await deleteComment(req, {
        params: { id: "comment-id" },
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        message: "Comment deleted successfully",
      });
    });

    it("should allow comment author to delete their comment", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock comment found with same author
      prisma.comment.findUnique.mockResolvedValueOnce({
        id: "comment-id",
        userId: "user-id",
      });

      const { req, res } = createMocks({
        method: "DELETE",
      });

      const response = await deleteComment(req, {
        params: { id: "comment-id" },
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        message: "Comment deleted successfully",
      });
    });
  });
});
