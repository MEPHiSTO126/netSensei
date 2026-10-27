import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { MousePointer2, Play, Users, BarChart3 } from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/courses");
  }

  return (
    <div className="space-y-12">
      <section>
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <MousePointer2 className="h-4 w-4" />
            Free frontend tutoring
          </div>
          <h1 className="text-4xl font-bold text-heading mb-6">
            Learn frontend development<br />
            with AI-powered feedback
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Work through structured lessons, take retakable quizzes, write code
            and get feedback, and ask a tutor when you get stuck.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-md text-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Get started
            </Link>
            <Link
              href="/courses"
              className="px-8 py-3 border border-input rounded-md text-lg font-medium hover:bg-muted transition-colors"
            >
              Browse courses
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-border pt-12">
        <h2 className="text-xl font-bold text-heading text-center mb-10">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <Card>
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Play className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-heading mb-2">Structured lessons</h3>
              <p className="text-muted-foreground text-sm">
                Modules → phases → stages. Bite-sized content you can finish in
                one sitting.
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-heading mb-2">Retakable quizzes</h3>
              <p className="text-muted-foreground text-sm">
                Test yourself after each phase. Retake as many times as you
                need.
              </p>
            </div>
          </Card>
          <Card>
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-heading mb-2">Tutor support</h3>
              <p className="text-muted-foreground text-sm">
                Tag any stage for tutor help. Get live chat when a tutor is
                online.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
