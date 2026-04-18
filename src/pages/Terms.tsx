import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <Helmet>
        <title>Terms of Service | ApporLeader</title>
        <meta name="description" content="Read the Terms of Service for ApporLeader. Understand the rules and guidelines for using our platform and community." />
        <link rel="canonical" href="https://apporleader.vercel.app/terms" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Terms of Service | ApporLeader" />
        <meta property="og:url" content="https://apporleader.vercel.app/terms" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#111] border border-white/10 rounded-2xl p-8 md:p-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-white">
            Terms and Conditions for ApporLeader Club
          </h1>
          <p className="text-gray-400 mb-8">
            <strong>Effective Date: March 10, 2026</strong>
          </p>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p>
              Welcome to ApporLeader ("the Club"), a virtual community dedicated to decoding logic, mastering AI, and winning the game through educational and competitive activities. By joining, accessing, or participating in any Club activities, you ("Member" or "You") agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, please do not join or participate.
            </p>
            <p>
              ApporLeader is a fully remote and virtual club. All operations, including workshops, competitions, consultations, discussions, and interactions, are conducted online through digital platforms such as websites, video conferencing tools (e.g., Zoom, Google Meet), social media, email, and other virtual channels. No physical meetings or in-person events are organized or required.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">1. Membership Eligibility and Registration</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Eligibility</strong>: Membership is open to individuals aged 13 years or older who are currently in class 8 through class 12 (or equivalent educational levels). You must provide accurate information during registration, including name, WhatsApp mobile number, social media links, interests, date of birth, class/year/level, and a profile image.</li>
              <li><strong>Virtual Nature</strong>: As a remote club, all benefits (e.g., abroad study help, chess learning and competitions, access to magazines/articles, workshops, business cases, AI prompting and learning) are delivered virtually. You are responsible for having reliable internet access and compatible devices.</li>
              <li><strong>Profile Image Consent</strong>: By uploading a profile image during registration, you grant ApporLeader a non-exclusive, royalty-free license to use, display, and upload the image on our social media platforms, website, or promotional materials for Club-related purposes (e.g., member spotlights, event promotions). You confirm that the image is yours or you have rights to it, and it does not infringe on third-party rights.</li>
              <li><strong>Membership Fees</strong>: Currently, membership is free. We reserve the right to introduce fees in the future with prior notice.</li>
              <li><strong>Account Security</strong>: You are responsible for maintaining the confidentiality of your login credentials (if applicable) and any virtual access links.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">2. Club Activities and Participation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Virtual Operations</strong>: All Club activities are conducted remotely. This includes:
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li>Online workshops, webinars, and business case discussions.</li>
                  <li>Virtual chess competitions and AI prompting challenges.</li>
                  <li>Digital access to magazines, articles, and resources.</li>
                  <li>Remote consultations for abroad study help.</li>
                  <li>Community interactions via forums, chat groups, or social media.</li>
                </ul>
              </li>
              <li><strong>Compliance with Laws and Government Guidelines</strong>: The Club will not provide any suggestions, advice, or guidance that goes outside of government suggestions, laws, or regulations. Any such unauthorized suggestions given by members or admins will not be accepted or endorsed by the Club in any way.</li>
              <li><strong>Participation Rules</strong>: Members must participate respectfully. You agree not to disrupt activities, share inappropriate content, or engage in harassment, discrimination, or illegal behavior.</li>
              <li><strong>Recordings</strong>: Virtual sessions may be recorded for internal use, quality improvement, or sharing with absent members. By participating, you consent to being recorded (audio/video) and waive any claims related to such recordings.</li>
              <li><strong>Third-Party Platforms</strong>: We use external tools (e.g., Discord, WhatsApp groups, Google Workspace) for virtual interactions. You agree to comply with their terms and understand that ApporLeader is not responsible for their privacy practices or downtime.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">3. User Conduct and Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Code of Conduct</strong>: As a remote community, maintain professionalism in all virtual interactions. Prohibited actions include:
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li>Spamming, trolling, or unsolicited promotions.</li>
                  <li>Sharing confidential Club materials without permission.</li>
                  <li>Impersonating others or providing false information.</li>
                  <li>Engaging in activities that violate laws, including intellectual property infringement.</li>
                  <li>Performing any extra or unauthorized work outside of approved Club activities.</li>
                  <li>Exhibiting any bad behavior, such as disrespect, bullying, or non-compliance with Club rules.</li>
                </ul>
              </li>
              <li><strong>Consequences for Violations</strong>: If a member engages in any extra unauthorized activities, bad behavior, or violations of these Terms, they will be removed from the Club immediately, without warning or appeal.</li>
              <li><strong>Content Sharing</strong>: Any content you submit (e.g., comments, AI prompts, chess strategies) becomes Club property, and you grant us a license to use it virtually within the Club.</li>
              <li><strong>Technical Requirements</strong>: You are responsible for your own hardware, software, and internet connection. ApporLeader is not liable for technical issues on your end.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">4. Intellectual Property</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All Club materials (e.g., articles, workshop content, AI guides, business cases) are owned by ApporLeader or its licensors. You may access them virtually for personal, non-commercial use but cannot reproduce, distribute, or sell them without written permission.</li>
              <li>Trademarks like "ApporLeader" and our logo are protected and may not be used without consent.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">5. Privacy and Data Protection</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We collect personal data (e.g., name, contact info, image) as provided during registration. This data is used for virtual Club management, communications, and promotions.</li>
              <li>As a remote club, data is stored securely on cloud servers.</li>
              <li>Your information may be shared with third-party virtual tools, but we do not sell it to marketers.</li>
              <li>For details, refer to our Privacy Policy (available on the website).</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">6. Liability and Disclaimers</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>No Warranties</strong>: The Club provides resources "as is" without warranties. Advice on abroad study, AI, or business is for informational purposes only and not professional advice.</li>
              <li><strong>Limitation of Liability</strong>: ApporLeader, its founders, admins, or affiliates are not liable for any direct, indirect, or consequential damages arising from virtual participation, including data loss, technical failures, or reliance on Club content.</li>
              <li><strong>Indemnification</strong>: You agree to indemnify us against claims arising from your misuse of the Club or violation of these Terms.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">7. Termination and Suspension</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We may suspend or terminate your membership at any time for violations, with or without notice.</li>
              <li>Upon termination, your access to virtual resources ends, but these Terms' survival clauses (e.g., IP, liability) remain.</li>
              <li>You may cancel your membership by contacting us via email.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">8. Changes to Terms</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We may update these Terms at any time. Changes will be posted on the website or notified via virtual channels (e.g., email, WhatsApp). Continued participation constitutes acceptance.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">9. Contact Us</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>For questions, contact us at apporleader.learn@gmail.com or via the website's contact form.</li>
            </ul>

            <p className="mt-8 italic text-gray-400">
              By registering or participating, you acknowledge that ApporLeader is a fully virtual club, and you accept these Terms in full. Thank you for joining our community!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
