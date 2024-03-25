import Link from 'next/link';

import config from '@/config';
import { constructMetadata } from '@/lib/utils/seo';

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = constructMetadata({
  title: `Privacy Policy | ${config.appName}`,
  // canonicalUrlRelative: "/privacy-policy",
});

const PrivacyPolicy = () => {
  return (
    <main className="max-w-xl mx-auto">
      <div className="p-5">
        <Link href="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M15 10a.75.75 0 01-.75.75H7.612l2.158 1.96a.75.75 0 11-1.04 1.08l-3.5-3.25a.75.75 0 010-1.08l3.5-3.25a.75.75 0 111.04 1.08L7.612 9.25h6.638A.75.75 0 0115 10z"
              clipRule="evenodd"
            />
          </svg>{" "}
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Privacy Policy for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: March 8, 2024

Welcome to LinkTap! This Privacy Policy outlines how we collect, use, and safeguard your personal information when you use our website.

1. Information We Collect:

We collect the following user data:

Name
Email
Payment Information
Additionally, non-personal data may be collected through web cookies.

2. Purpose of Data Collection:

The primary purpose of collecting user data is for order processing related to our Link in Bio Tool with advanced analytics.

3. Data Sharing:

We do not share any user data with third parties. Your information is kept confidential and is solely used for the purposes mentioned above.

4. Children's Privacy:

We do not collect any data from children. Our services are intended for users who are 18 years of age or older.

5. Non-personal Data Collection:

Non-personal data may be collected through the use of web cookies to enhance user experience and improve our services.

6. Updates to the Privacy Policy:

Users will be notified of any updates to the Privacy Policy via email. Please make sure your contact information is up-to-date.

7. Contact Information:

If you have any questions or concerns regarding our Privacy Policy, please contact us at info@linktap.xyz.

Thank you for choosing LinkTap!`}
        </pre>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
