import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SubmissionInfo() {
    return (
        <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
            <div className="container px-4 md:px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
                    Are you an Advocate?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl mb-8">
                    Contribute to the legal community by publishing your articles and case analysis on Sahej Vidhi.
                </p>
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-2 bg-primary-foreground/10 px-6 py-3 rounded-lg backdrop-blur-sm">
                        <Mail className="h-5 w-5" />
                        <span className="font-medium">
                            {process.env.NEXT_PUBLIC_SUBMISSION_EMAIL || "submissions@sahejvidhi.com"}
                        </span>
                    </div>
                    <p className="text-sm text-primary-foreground/80">
                        Email your submissions for review and publication.
                    </p>
                </div>
            </div>
        </section>
    )
}
