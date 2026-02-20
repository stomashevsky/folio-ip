"use client";

import { useState } from "react";
import { Avatar } from "@plexui/ui/components/Avatar";
import { Button } from "@plexui/ui/components/Button";
import { Textarea } from "@plexui/ui/components/Textarea";
import { SectionHeading } from "@/components/shared";
import { formatDateTime } from "@/lib/utils/format";

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

const INITIAL_COMMENTS: Comment[] = [
  {
    id: "cmt_1",
    author: "Sarah Johnson",
    text: "Initial review started. Document inconsistencies found between front and back of government ID.",
    createdAt: "2026-01-15T10:35:00Z",
  },
  {
    id: "cmt_2",
    author: "Mike Chen",
    text: "Cross-referenced with AML database. No immediate sanctions hits, but the PEP match score is borderline. Recommending deeper investigation.",
    createdAt: "2026-01-16T14:20:00Z",
  },
  {
    id: "cmt_3",
    author: "Emma Wilson",
    text: "Requested additional documentation from the customer. Awaiting response.",
    createdAt: "2026-01-18T09:15:00Z",
  },
];

export function CommentsTab() {
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [newComment, setNewComment] = useState("");

  const handleAdd = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `cmt_${Date.now()}`,
        author: "You",
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="space-y-6">
      <SectionHeading badge={comments.length}>Comments</SectionHeading>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar name={comment.author} size={32} color="primary" variant="soft" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {comment.author}
                </span>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  {formatDateTime(comment.createdAt)} UTC
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
          className="w-full"
        />
        <div className="mt-3 flex justify-end">
          <Button
            color="primary"
            size="sm"
            onClick={handleAdd}
            disabled={!newComment.trim()}
          >
            Add comment
          </Button>
        </div>
      </div>
    </div>
  );
}
