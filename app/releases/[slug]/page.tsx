import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ReleaseDetail from "@/components/ReleaseDetail";
import { RELEASES, findRelease } from "@/lib/releases";

export function generateStaticParams() {
  return RELEASES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const release = findRelease(slug);
  if (!release) return {};
  return {
    title: `${release.title} — KNZ`,
    description: release.description.ja,
  };
}

export default async function ReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const release = findRelease(slug);
  if (!release) notFound();
  return (
    <>
      <Nav />
      <ReleaseDetail release={release} />
    </>
  );
}
