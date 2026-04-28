import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="section-container py-16 md:py-24 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Privacy Policy</h1>
        <p className="text-sm text-brand-gray mb-12">Last updated: October 24, 2023</p>

        <div className="prose prose-headings:font-bold prose-headings:text-brand-dark prose-p:text-brand-gray prose-p:leading-relaxed prose-a:text-brand-blue space-y-8">
          <section>
            <h2 className="text-xl mt-4">1. Data Collection</h2>
            <p>We respect your privacy. When you use our contact form or subscribe to our newsletter, we collect only the information you explicitly provide (e.g., name, email address). We do not use tracking cookies that violate your privacy, nor do we sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl mt-4">2. Cookies</h2>
            <p>Our website uses strictly necessary cookies to ensure the basic functionality of the site (such as remembering your layout preferences). We do not use invasive advertising trackers or third-party analytics cookies without your explicit consent.</p>
          </section>

          <section>
            <h2 className="text-xl mt-4">3. User Rights</h2>
            <p>You have the right to access, correct, or delete any personal data we hold about you at any time. If you wish to exercise these rights, please contact us via our contact page, and we will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl mt-4">4. Contact Information</h2>
            <p>If you have any questions about this Privacy Policy, please reach out to us through our <a href="/contact">Contact Page</a>. We are committed to transparency and will address any concerns promptly.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
