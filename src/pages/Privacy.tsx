import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#111] border border-white/10 rounded-2xl p-8 md:p-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 text-white">
            Privacy Policy for ApporLeader Club
          </h1>
          <p className="text-gray-400 mb-8">
            <strong>Effective Date: March 10, 2026</strong>
          </p>

          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p>
              ApporLeader (“we”, “us”, or “the Club”) is a fully virtual and remote club. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you register as a member or participate in our virtual activities.
            </p>
            <p>
              By joining ApporLeader or using our services, you consent to the practices described in this Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">1. Information We Collect</h2>
            <p>We collect the following personal information when you register or participate:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Identifiers:</strong> Full name, date of birth, class/year/level (Class 8 to Class 12 or equivalent)</li>
              <li><strong>Contact Information:</strong> WhatsApp mobile number</li>
              <li><strong>Social Media Information:</strong> Instagram profile link and LinkedIn profile link (optional)</li>
              <li><strong>Profile Image:</strong> A photo you upload (we may use it on social media for club promotions)</li>
              <li><strong>Interest Information:</strong> Your main area of interest (e.g., Abroad Study, Chess, AI, etc.)</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our virtual events, workshops, and communications (e.g., attendance in Zoom sessions, participation in chats)</li>
            </ul>
            <p>We do not collect any sensitive information beyond what is necessary for club operations.</p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">2. How We Use Your Information</h2>
            <p>We use your personal information only for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To process your membership registration</li>
              <li>To communicate with you via WhatsApp, email, or our virtual platforms</li>
              <li>To organize and manage virtual workshops, competitions, chess tournaments, AI challenges, and other club activities</li>
              <li>To provide abroad study help, magazines, articles, and resources</li>
              <li>To feature you (with your profile image) in member spotlights or event promotions on our social media</li>
              <li>To improve our virtual club experience</li>
              <li>To send important updates and reminders</li>
            </ul>
            <p>We will never use your data for any purpose outside of club-related virtual activities.</p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">3. How We Share Your Information</h2>
            <p>We may share your information only in these limited cases:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With third-party virtual tools we use (Zoom, Google Meet, Discord, WhatsApp, Google Workspace, etc.) strictly to run our events</li>
              <li>Your profile image may be uploaded on our social media for promotional purposes (as you agreed during registration)</li>
              <li>If required by law (we will only comply with valid legal requests)</li>
            </ul>
            <p>We do not sell, rent, or trade your personal information to any third parties or marketers.</p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">4. Data Storage and Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All data is stored securely on cloud servers.</li>
              <li>We use reasonable security measures to protect your information.</li>
              <li>As a fully virtual club, we do not store any physical records.</li>
              <li>Your data will be kept only as long as you remain a member. Once you leave, we will delete your information upon request (except where we need to keep it for legal reasons).</li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">5. Your Rights</h2>
            <p>As a member, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data (subject to any ongoing club obligations)</li>
              <li>Withdraw consent for your image to be used on social media</li>
              <li>Opt out of any non-essential communications</li>
            </ul>
            <p>To exercise these rights, simply email us at apporleader.learn@gmail.com</p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">6. Children’s Privacy (Age 13+)</h2>
            <p>
              Our club is open only to members aged 13 years and above (Class 8 to Class 12). We do not knowingly collect data from anyone younger than 13. If we discover we have collected information from a child under 13, we will delete it immediately.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">7. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on our website and notified through our virtual channels (WhatsApp/email). Continued membership after changes means you accept the updated policy.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-10 mb-4">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us:</p>
            <p><strong>Email:</strong> apporleader.learn@gmail.com</p>

            <p className="mt-8 italic text-gray-400">
              Thank you for trusting ApporLeader with your information.<br />
              We are committed to keeping your data safe while you enjoy our virtual community.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
