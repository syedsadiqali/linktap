import Link from "next/link";
// import { getSEOTags } from "@/libs/seo";
import config from "@/config";

export const runtime = "edge";

function TOS() {
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
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-extrabold pb-6">
          Terms and Conditions for {config.appName}
        </h1>

        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: March 8, 2024

Welcome to LinkTap! These Terms of Service outline the terms and conditions for using our Link in Bio Tool with advanced analytics. By accessing or using our services, you agree to comply with these terms.

1. Ownership and Usage:

When purchasing a package, users gain the right to create public link pages for use in their bio. However, users do not own any intellectual property associated with the LinkTap tool.

2. User Data Collection:

We collect the following user data:

Name
Email
Payment Information
This information is used for order processing and can be found in more detail in our Privacy Policy.

3. Non-personal Data Collection:

We may collect non-personal data through web cookies to enhance user experience and improve our services.

4. Governing Law:

These terms are governed by the laws of India. Any disputes arising under or in connection with these terms will be subject to the exclusive jurisdiction of the Indian courts.

5. Updates to the Terms:

Users will be notified of any updates to these Terms of Service via email. It is your responsibility to review these terms periodically for changes.

6. Contact Information:

If you have any questions or concerns regarding these Terms of Service, please contact us at info@linktap.xyz.

Thank you for choosing LinkTap!`}
        </pre>
      </div>
    </main>
  );
}

export default TOS;
