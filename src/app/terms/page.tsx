import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, ShieldCheck, UserCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service | netSensei",
  description: "Terms of service and code of conduct for netSensei users.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-4">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <h1 className="text-3xl font-bold text-heading">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: November 2026
        </p>
      </div>

      <Card className="p-6 md:p-8 space-y-6">
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              1. Free Educational Mission
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            netSensei provides free, interactive frontend development education
            combining structured modules, AI-evaluated knowledge quizzes, and
            support from verified human tutors. All course materials and exercises
            are provided free of charge for personal educational enrichment.
          </p>
        </section>

        <section className="space-y-3 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              2. Student & Tutor Code of Conduct
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We are dedicated to maintaining a welcoming, supportive, and safe learning environment.
            When using our tutor chat and interactive features, all participants agree to:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1.5 text-muted-foreground">
            <li>Communicate respectfully and constructively with tutors and fellow learners.</li>
            <li>Use the tutor request system exclusively for authentic questions related to the curriculum.</li>
            <li>Refrain from sharing abusive, inappropriate, or malicious content.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              3. Account & Learning Data
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Your quiz attempts, progress records, and tutor conversations are saved to enable
            continuous learning and feedback. We do not sell your personal information or
            share your learning records with third parties.
          </p>
        </section>
      </Card>
    </div>
  );
}

