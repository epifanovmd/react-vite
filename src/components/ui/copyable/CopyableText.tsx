import { cn } from "@utils/cn";
import { Check, Copy } from "lucide-react";
import * as React from "react";

export interface CopyableTextProps {
  text: string;
  displayText?: string;
  truncate?: boolean;
  className?: string;
}

export const CopyableText: React.FC<CopyableTextProps> = ({
  text,
  displayText,
  truncate = true,
  className,
}) => {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-mono group cursor-pointer min-w-0 max-w-full",
        className,
      )}
      title={text}
    >
      <span className={cn("min-w-0", truncate && "truncate flex-1")}>
        {displayText ?? text}
      </span>
      <span className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
        {copied ? (
          <Check size={12} className="text-success" />
        ) : (
          <Copy size={12} />
        )}
      </span>
    </button>
  );
};
