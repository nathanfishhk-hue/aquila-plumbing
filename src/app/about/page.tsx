import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Punctual Plumbers',
  description: 'Learn about Punctual Plumbers — your trusted commercial and industrial plumbing experts.',
}

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-plumb-green-600 to-plumb-blue-600 bg-clip-text text-transparent">
            About Punctual Plumbers
          </h1>

          <p className="text-xl text-muted-foreground">
            Punctual Plumbers specialise in medium to large commercial and industrial projects,
            residential blocks, office parks, shopping malls and warehouses. Dedicated supervision
            is provided on all sites.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Specialisation</h2>
            <p className="text-muted-foreground">
              We specialise in medium to large commercial and industrial projects, residential blocks,
              office parks, shopping malls and warehouses. Quality control and assurance is of utmost
              importance to our clients. We comply with all SABS and SANS regulations and issue
              certificates of compliance for all our installations.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Why Choose Us</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Licensed and insured plumbers with years of experience</li>
              <li>24/7 emergency response for urgent plumbing issues</li>
              <li>Upfront pricing with no hidden fees</li>
              <li>Fully stocked service vehicles for fast resolution</li>
              <li>Satisfaction guaranteed on every job</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Services</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-card rounded-xl border">
                <h3 className="text-lg font-semibold text-plumb-green-600">Construction Services</h3>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Hot and cold water reticulation (copper, galvanised, uPVC, HDPE, PPR)</li>
                  <li>• Soil drainage above and below ground (PVC, cast iron, HDPE)</li>
                  <li>• Storm water and rain water disposal</li>
                  <li>• Sanitary and brassware installations</li>
                  <li>• Heat pumps and hot water ring mains</li>
                  <li>• Fire reticulation systems</li>
                </ul>
              </div>
              <div className="p-6 bg-card rounded-xl border">
                <h3 className="text-lg font-semibold text-plumb-blue-600">Maintenance Services</h3>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Leaking / faulty WC</li>
                  <li>• Pressure valves</li>
                  <li>• Leaking taps</li>
                  <li>• Geyser replacements</li>
                  <li>• Drain cleaning</li>
                  <li>• Tenant installations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
