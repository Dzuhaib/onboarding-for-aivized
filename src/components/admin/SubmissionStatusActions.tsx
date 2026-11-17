"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { updateSubmissionStatus } from "@/actions/admin";

const STATUS_OPTIONS = ["SUBMITTED", "IN_REVIEW", "ACCEPTED", "DECLINED"] as const;

export function SubmissionStatusActions({ submissionId, status }: { submissionId: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function changeStatus(nextStatus: string) {
    startTransition(async () => {
      const result = await updateSubmissionStatus(submissionId, nextStatus);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_OPTIONS.map((option) => (
        <Button
          key={option}
          size="sm"
          variant={option === status ? "default" : "outline"}
          disabled={pending || option === status}
          onClick={() => changeStatus(option)}
        >
          Mark {option.replace("_", " ")}
        </Button>
      ))}
    </div>
  );
}
