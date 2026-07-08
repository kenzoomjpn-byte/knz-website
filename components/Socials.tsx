const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/knzooooooooom/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "SoundCloud",
    href: "https://soundcloud.com/knzooooooooom",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M2.5 16.5v-3.2h1v3.2h-1Zm2.2 0v-4.6h1v4.6h-1Zm2.2 0V10h1v6.5h-1Zm2.2 0V9.2h1v7.3h-1Zm2.2 0V8.5h1v8h-1Zm2.3 0V7.6c.4-.3.9-.5 1.5-.6 2.2-.4 4.2 1 4.6 3.1a3 3 0 0 1 1.3-.2 2.9 2.9 0 0 1 .3 5.8l-.3.1h-7.4V16.5Z" />
      </svg>
    ),
  },
  {
    name: "Bandcamp",
    href: "https://knzooooooooom.bandcamp.com/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M0 18.75 7.44 5.25H24l-7.44 13.5H0Z" />
      </svg>
    ),
  },
];

export default function Socials({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <ul className="flex items-center gap-4">
      {SOCIALS.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.name}
            className={`flex items-center justify-center border border-line text-muted transition-colors hover:border-accent hover:text-accent ${
              size === "lg" ? "h-14 w-14" : "h-11 w-11"
            }`}
          >
            {s.icon}
          </a>
        </li>
      ))}
    </ul>
  );
}
