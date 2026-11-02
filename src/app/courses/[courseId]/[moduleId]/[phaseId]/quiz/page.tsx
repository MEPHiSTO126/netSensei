export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { QuizClient } from "./QuizClient";

export default async function QuizPage({
  params,
}: {
  params: Promise<{
    courseId: string;
    moduleId: string;
    phaseId: string;
  }>;
}) {
  const { phaseId } = await params;
  const user = await getCurrentUser();

  return <QuizClient phaseId={phaseId} readOnly={user?.role === "TUTOR"} />;
}
