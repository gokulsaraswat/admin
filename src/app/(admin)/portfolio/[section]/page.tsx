import { notFound } from "next/navigation";
import { EmptySection } from "@/components/placeholders";
import { getApp } from "@/lib/apps";

const portfolio = getApp("portfolio");

export function generateStaticParams() {
  return portfolio.sections.map((s) => ({ section: s.slug }));
}

export default async function PortfolioSection({ params }: PageProps<"/portfolio/[section]">) {
  const { section } = await params;
  const found = portfolio.sections.find((s) => s.slug === section);
  if (!found) notFound();
  return <EmptySection section={found} note="Arrives after the portfolio data moves to the new database." />;
}
