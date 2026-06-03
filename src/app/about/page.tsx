import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Aquila Plumbing',
  description: 'Learn about Aquila Plumbing — your trusted local plumbing experts.',
}

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl font-black bg-gradient-to-r from-plumb-green-600 to-plumb-blue-600 bg-clip-text text-transparent">
            About Aquila Plumbing
          </h1>

          <p className="text-xl text-muted-foreground">
            Aquila Plumbing is a professional plumbing service dedicated to delivering
            reliable, high-quality work for residential and commercial properties.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">
              We aim to make plumbing services accessible, transparent, and stress-free.
              From emergency repairs to full bathroom renovations, our licensed team
              handles every job with care and expertise.
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
            <h2 className="text-2xl font-bold">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-card rounded-xl border">
                <h3 className="text-lg font-semibold text-plumb-green-600">Quality First</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Every repair and installation meets rigorous standards
                </p>
              </div>
              <div className="p-6 bg-card rounded-xl border">
                <h3 className="text-lg font-semibold text-plumb-blue-600">Customer Focused</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Your needs drive our schedule, pricing, and communication
                </p>
              </div>
              <div className="p-6 bg-card rounded-xl border">
                <h3 className="text-lg font-semibold text-plumb-green-600">Reliability</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  We show up on time and get the job done right the first time
                </p>
              </div>
              <div className="p-6 bg-card rounded-xl border">
                <h3 className="text-lg font-semibold text-plumb-blue-600">Transparency</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Clear quotes, honest communication, no surprises
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
