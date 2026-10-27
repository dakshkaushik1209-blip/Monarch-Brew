import type { Metadata } from "next";
import { cafeConfig } from "@/config/cafe";
import { teamMembers } from "@/data/team";
import { Photo } from "@/components/Photo";
import { BotanicalSprig } from "@/components/LineIllustrations";
import { AnimatedButton } from "@/components/AnimatedButton";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${cafeConfig.name}, an artisanal vegetarian cafe at ${cafeConfig.address.display}. Specialty single-origin filter roasts, hand-laminated bakes, and community gatherings.`,
  openGraph: {
    title: `About | ${cafeConfig.name}`,
    description: `Learn about ${cafeConfig.name}, an artisanal vegetarian cafe at ${cafeConfig.address.display}. Specialty single-origin filter roasts, hand-laminated bakes, and community gatherings.`,
    url: `${cafeConfig.siteUrl}/about`,
    siteName: cafeConfig.name,
    locale: "en_US",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-16">
      <div className="mx-auto flex max-w-site flex-col gap-16 px-4 sm:gap-24 sm:px-6 lg:px-8">
        {/* 1. Header */}
        <header className="flex flex-col items-start gap-4">
          <Reveal className="flex flex-col items-start gap-3" isHero={true}>
            <div className="flex items-center gap-2 text-xs font-medium text-cafe-olive">
              <BotanicalSprig className="h-5 w-5 text-cafe-olive" />
              <span>About us</span>
            </div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-cafe-espresso text-balance sm:text-6xl">
              About {cafeConfig.name}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-cafe-espresso/85 sm:text-lg">
              {cafeConfig.aboutSentence}
            </p>
          </Reveal>
        </header>

        {/* 2. Plain Sentences: Two column editorial layout */}
        <section aria-labelledby="story-heading">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column: Plain sentences */}
            <Reveal className="flex flex-col gap-5 text-sm leading-relaxed text-cafe-espresso/85 sm:text-base lg:col-span-7">
              <h2 id="story-heading" className="sr-only">
                About our cafe
              </h2>
              {cafeConfig.about.map((sentence, index) => (
                <p key={index}>{sentence}</p>
              ))}
            </Reveal>

            {/* Right Column: Tall photo slot */}
            <div className="lg:col-span-5">
              <Reveal delay={0.2} reverseDelay={0.1}>
                <Photo
                  src="/images/about/about-main.png"
                  alt="Coffee brewing and bake counter"
                  aspectRatio="3/4"
                  label="Daily coffee and bakes"
                  priority
                  illustration="sprig"
                  className="w-full"
                />
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3. How we make it: Definition list of concrete facts */}
        {cafeConfig.facts && cafeConfig.facts.length > 0 && (
          <section aria-labelledby="facts-heading">
            <Reveal className="flex flex-col gap-6 border-t border-cafe-border pt-12 sm:pt-16">
              <div>
                <span className="text-xs font-medium text-cafe-olive">
                  Sourcing and methods
                </span>
                <h2
                  id="facts-heading"
                  className="mt-1 font-heading text-3xl font-semibold tracking-tight text-cafe-espresso text-balance sm:text-4xl"
                >
                  How we make it
                </h2>
                <p className="mt-2 text-sm text-cafe-espresso/80">
                  Concrete standards behind our daily coffee bar and bakehouse.
                </p>
              </div>

              <dl className="divide-y divide-cafe-border/80 border-y border-cafe-border/80">
                {cafeConfig.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:gap-6 sm:py-5"
                  >
                    <dt className="font-heading text-base font-semibold text-cafe-espresso sm:col-span-3">
                      {fact.label}
                    </dt>
                    <dd className="text-sm leading-relaxed text-cafe-espresso/85 sm:col-span-9">
                      {fact.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </section>
        )}

        {/* 4. The people: Rendered only if entries exist */}
        {teamMembers && teamMembers.length > 0 && (
          <section aria-labelledby="team-heading">
            <Reveal className="flex flex-col gap-6 border-t border-cafe-border pt-12 sm:pt-16">
              <div>
                <span className="text-xs font-medium text-cafe-olive">
                  The team
                </span>
                <h2
                  id="team-heading"
                  className="mt-1 font-heading text-3xl font-semibold tracking-tight text-cafe-espresso text-balance sm:text-4xl"
                >
                  The craft team
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member) => (
                  <article
                    key={member.id}
                    className="flex flex-col gap-3 rounded-[2px] border border-cafe-border bg-cafe-cream-deep/40 p-5"
                  >
                    {member.photo && (
                      <Photo
                        src={member.photo}
                        alt={member.name}
                        aspectRatio="1/1"
                        label={member.name}
                      />
                    )}
                    <h3 className="font-heading text-lg font-semibold text-cafe-espresso">
                      {member.name}
                    </h3>
                    <p className="text-xs uppercase tracking-wider text-cafe-olive">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-xs text-cafe-espresso/80">{member.bio}</p>
                    )}
                  </article>
                ))}
              </div>
            </Reveal>
          </section>
        )}

        {/* 5. Closing block */}
        <section
          aria-labelledby="visit-closing-heading"
          className="rounded-[2px] border border-cafe-border bg-cafe-cream-deep/70 p-6 sm:p-10"
        >
          <Reveal className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="flex flex-col gap-3 max-w-xl">
              <span className="text-xs font-medium text-cafe-olive">
                Join us
              </span>
              <h2
                id="visit-closing-heading"
                className="font-heading text-2xl font-semibold tracking-tight text-cafe-espresso text-balance sm:text-3xl"
              >
                Visit {cafeConfig.name}
              </h2>
              <p className="text-sm leading-relaxed text-cafe-espresso/85">
                {cafeConfig.address.display}. {cafeConfig.hours.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <AnimatedButton
                href="/visit#reserve"
                variant="primary"
              >
                Reserve a table
              </AnimatedButton>

              <AnimatedButton
                href="/menu"
                variant="secondary"
              >
                View our menu
              </AnimatedButton>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
