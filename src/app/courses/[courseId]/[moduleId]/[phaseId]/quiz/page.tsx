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
  const { courseId, moduleId, phaseId } = await params;
  const user = await getCurrentUser();

  return (
    <QuizClient
      phaseId={phaseId}
      courseId={courseId}
      moduleId={moduleId}
      readOnly={user?.role === "TUTOR"}
    />
  );
}
