import Link from "next/link";
import Image from "next/image";
import { Mic, FileText, MessageSquare, ListChecks } from "lucide-react";

const VALUE_POINTS = [
  { icon: Mic, text: "Real-time transcription with speaker identification" },
  { icon: FileText, text: "AI summaries and key decisions after every call" },
  { icon: MessageSquare, text: "Voice agent that answers questions live" },
  {
    icon: ListChecks,
    text: "Action items extracted and tracked automatically",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full">
      {/* Left: value panel — hidden on mobile */}
      <div className="bg-primary text-primary-foreground hidden w-1/2 flex-col justify-between p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/brand/icon/icon-dark.png"
            alt=""
            width={24}
            height={24}
          />
          <Image
            src="/brand/wordmark/wordmark-dark.png"
            alt="Vernix"
            width={80}
            height={24}
          />
        </Link>

        <div>
          <h2 className="mb-2 text-2xl font-bold">
            Your meetings, remembered.
          </h2>
          <p className="mb-8 text-sm opacity-70">
            Vernix joins your calls, captures everything, and gives you
            searchable, actionable meeting intelligence.
          </p>
          <ul className="space-y-4">
            {VALUE_POINTS.map((point) => (
              <li key={point.text} className="flex items-start gap-3">
                <point.icon className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
                <span className="text-sm">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs opacity-40">
          Works with Zoom, Google Meet, Microsoft Teams, and Webex.
        </p>
      </div>

      {/* Right: form */}
      <div className="flex w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        {/* Mobile logo — visible only below lg */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/brand/icon/icon.svg"
              alt=""
              width={24}
              height={24}
              className="dark:hidden"
            />
            <Image
              src="/brand/icon/icon-dark.png"
              alt=""
              width={24}
              height={24}
              className="hidden dark:block"
            />
            <Image
              src="/brand/wordmark/wordmark-nobg.png"
              alt="Vernix"
              width={80}
              height={24}
              className="dark:hidden"
            />
            <Image
              src="/brand/wordmark/wordmark-dark.png"
              alt="Vernix"
              width={80}
              height={24}
              className="hidden dark:block"
            />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
