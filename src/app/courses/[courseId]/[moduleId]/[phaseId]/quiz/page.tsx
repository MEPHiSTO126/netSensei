export const dynamic = "force-dynamic";

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
  return <QuizClient phaseId={phaseId} />;
}
