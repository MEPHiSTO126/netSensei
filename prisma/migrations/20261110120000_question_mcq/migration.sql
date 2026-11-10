-- Add multiple-choice support and answer explanations to questions.
ALTER TABLE "Question" ADD COLUMN "options" JSONB;
ALTER TABLE "Question" ADD COLUMN "correctIndex" INTEGER;
ALTER TABLE "Question" ADD COLUMN "explanation" TEXT;
