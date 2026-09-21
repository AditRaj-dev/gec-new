import Link from "next/link";

type ArrowLinkProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
};

export function ArrowLink({ children, href, className = "" }: ArrowLinkProps) {
  return (
    <Link className={`arrow-link ${className}`} href={href}>
      <span>{children}</span>
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}

