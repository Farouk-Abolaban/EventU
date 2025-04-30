import { createMocks } from "node-mocks-http";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import * as clerkServer from "@clerk/nextjs/server";

// Mock the API routes
import {
  GET as getEventReviews,
  POST as createEventReview,
} from "@/app/api/events/[id]/reviews/route";
import {
  GET as getReview,
  PATCH as updateReview,
  DELETE as deleteReview,
} from "@/app/api/reviews/[id]/route";
import { POST as toggleLike } from "@/app/api/reviews/[id]/like/route";
import {
  GET as getReviewComments,
  POST as createReviewComment,
} from "@/app/api/reviews/[id]/comments/route";

// Mock Clerk authentication
jest.mock("@clerk/nextjs/server", () => ({
  getAuth: jest.fn(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  review: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  event: {
    findUnique: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  reviewLike: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  comment: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Reviews API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/events/[id]/reviews", () => {
    it("should return 404 if event is not found", async () => {
      // Mock event not found
      prisma.event.findUnique.mockResolvedValueOnce(null);

      const { req, res } = createMocks({
        method: "GET",
      });

      const response = await getEventReviews(req, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Event not found" });
    });

    it("should return reviews for an event", async () => {
      // Mock event and reviews
      const mockEvent = { id: "event-id", title: "Test Event" };
      const mockReviews = [
        {
          id: "review-1",
          rating: 5,
          content: "Great event!",
          userId: "user-1",
        },
        { id: "review-2", rating: 4, content: "Good event!", userId: "user-2" },
      ];

      prisma.event.findUnique.mockResolvedValueOnce(mockEvent);
      prisma.review.findMany.mockResolvedValueOnce(mockReviews);

      // Mock no auth
      clerkServer.getAuth.mockReturnValueOnce({ userId: null });

      const { req, res } = createMocks({
        method: "GET",
      });

      const response = await getEventReviews(req, {
        params: { id: "event-id" },
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockReviews);
    });

    it("should add userHasLiked flag when user is authenticated", async () => {
      // Mock event and reviews
      const mockEvent = { id: "event-id", title: "Test Event" };
      const mockReviews = [
        {
          id: "review-1",
          rating: 5,
          content: "Great event!",
          userId: "user-1",
        },
        { id: "review-2", rating: 4, content: "Good event!", userId: "user-2" },
      ];
      const mockUserLikes = [{ reviewId: "review-1" }];

      prisma.event.findUnique.mockResolvedValueOnce(mockEvent);
      prisma.review.findMany.mockResolvedValueOnce(mockReviews);
      prisma.reviewLike.findMany.mockResolvedValueOnce(mockUserLikes);

      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "current-user" });

      const { req, res } = createMocks({
        method: "GET",
      });

      const response = await getEventReviews(req, {
        params: { id: "event-id" },
      });
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result).toHaveLength(2);
      expect(result[0].userHasLiked).toBe(true);
      expect(result[1].userHasLiked).toBe(false);
    });
  });

  describe("POST /api/events/[id]/reviews", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Mock no auth
      clerkServer.getAuth.mockReturnValueOnce({ userId: null });

      const { req, res } = createMocks({
        method: "POST",
        body: {
          rating: 5,
          content: "Great event!",
        },
      });

      const response = await createEventReview(req, {
        params: { id: "event-id" },
      });

      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ error: "Unauthorized" });
    });

    it("should return 400 if rating or content is missing", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      const { req, res } = createMocks({
        method: "POST",
        body: {
          // Missing rating
          content: "Great event!",
        },
      });

      const response = await createEventReview(req, {
        params: { id: "event-id" },
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: "Rating and content are required",
      });
    });

    it("should return 400 if rating is invalid", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      const { req, res } = createMocks({
        method: "POST",
        body: {
          rating: 6, // Invalid rating (> 5)
          content: "Great event!",
        },
      });

      const response = await createEventReview(req, {
        params: { id: "event-id" },
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: "Rating must be between 1 and 5",
      });
    });

    it("should return 404 if event is not found", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock event not found
      prisma.event.findUnique.mockResolvedValueOnce(null);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          rating: 5,
          content: "Great event!",
        },
      });

      const response = await createEventReview(req, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Event not found" });
    });

    it("should return 400 if user has already reviewed the event", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock event found
      prisma.event.findUnique.mockResolvedValueOnce({ id: "event-id" });

      // Mock existing review
      prisma.review.findFirst.mockResolvedValueOnce({ id: "review-id" });

      const { req, res } = createMocks({
        method: "POST",
        body: {
          rating: 5,
          content: "Great event!",
        },
      });

      const response = await createEventReview(req, {
        params: { id: "event-id" },
      });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        error: "You have already reviewed this event",
      });
    });

    it("should create a new review successfully", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock event found
      prisma.event.findUnique.mockResolvedValueOnce({ id: "event-id" });

      // Mock no existing review
      prisma.review.findFirst.mockResolvedValueOnce(null);

      // Mock review creation
      const mockCreatedReview = {
        id: "new-review-id",
        rating: 5,
        content: "Great event!",
        userId: "user-id",
        eventId: "event-id",
        createdAt: new Date(),
        user: {
          id: "user-id",
          name: "Test User",
        },
        _count: {
          likes: 0,
          comments: 0,
        },
      };
      prisma.review.create.mockResolvedValueOnce(mockCreatedReview);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          rating: 5,
          content: "Great event!",
        },
      });

      const response = await createEventReview(req, {
        params: { id: "event-id" },
      });
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result).toEqual({
        ...mockCreatedReview,
        userHasLiked: false,
      });
    });
  });

  // Tests for individual review API endpoints
  describe("GET /api/reviews/[id]", () => {
    it("should return 404 if review is not found", async () => {
      // Mock review not found
      prisma.review.findUnique.mockResolvedValueOnce(null);

      const { req, res } = createMocks({
        method: "GET",
      });

      const response = await getReview(req, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Review not found" });
    });

    it("should return review details", async () => {
      // Mock review
      const mockReview = {
        id: "review-id",
        rating: 5,
        content: "Great event!",
        userId: "user-id",
        user: {
          id: "user-id",
          name: "Test User",
        },
        _count: {
          likes: 2,
          comments: 1,
        },
      };

      prisma.review.findUnique.mockResolvedValueOnce(mockReview);

      // Mock no auth
      clerkServer.getAuth.mockReturnValueOnce({ userId: null });

      const { req, res } = createMocks({
        method: "GET",
      });

      const response = await getReview(req, { params: { id: "review-id" } });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockReview);
    });
  });

  // Test for review like toggle
  describe("POST /api/reviews/[id]/like", () => {
    it("should return 401 if user is not authenticated", async () => {
      // Mock no auth
      clerkServer.getAuth.mockReturnValueOnce({ userId: null });

      const { req, res } = createMocks({
        method: "POST",
      });

      const response = await toggleLike(req, { params: { id: "review-id" } });

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
      });

      const response = await toggleLike(req, {
        params: { id: "non-existent-id" },
      });

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: "Review not found" });
    });

    it("should unlike if user already liked the review", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock review found
      prisma.review.findUnique.mockResolvedValueOnce({ id: "review-id" });

      // Mock existing like
      prisma.reviewLike.findUnique.mockResolvedValueOnce({ id: "like-id" });

      // Mock updated likes count
      prisma.reviewLike.count.mockResolvedValueOnce(1);

      const { req, res } = createMocks({
        method: "POST",
      });

      const response = await toggleLike(req, { params: { id: "review-id" } });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        action: "unliked",
        message: "Like removed successfully",
        likesCount: 1,
      });
    });

    it("should like if user has not liked the review", async () => {
      // Mock authenticated user
      clerkServer.getAuth.mockReturnValueOnce({ userId: "user-id" });

      // Mock review found
      prisma.review.findUnique.mockResolvedValueOnce({ id: "review-id" });

      // Mock no existing like
      prisma.reviewLike.findUnique.mockResolvedValueOnce(null);

      // Mock updated likes count
      prisma.reviewLike.count.mockResolvedValueOnce(2);

      const { req, res } = createMocks({
        method: "POST",
      });

      const response = await toggleLike(req, { params: { id: "review-id" } });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        action: "liked",
        message: "Review liked successfully",
        likesCount: 2,
      });
    });
  });

  // Add more tests for other API endpoints as needed
});
