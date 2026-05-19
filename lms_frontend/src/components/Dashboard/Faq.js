import React from "react";

function Faq() {
  const faqItems = [
    {
      question: "1. What is this platform about?",
      answer:
        "This platform helps users manage their profile, change password, and access learning materials securely.",
    },
    {
      question: "2. How do I change my password?",
      answer:
        'Go to the "Change Password" section from the menu and fill in the current and new passwords to update it.',
    },
    {
      question: "3. How can I update my profile?",
      answer:
        "Navigate to the Profile section, click on the Edit button, update the details, and click Update to save changes.",
    },
    {
      question: "4. What should I do if I forget my password?",
      answer:
        'Click on the "Forgot Password" link on the login page and follow the instructions to reset your password.',
    },
    {
      question: "5. Is my personal data secure?",
      answer:
        "Yes, we prioritize user privacy and implement encryption and secure storage mechanisms for all personal data.",
    },
    {
      question: "6. Can I enroll in multiple courses?",
      answer:
        "Yes, users can enroll in as many courses as they are interested in by selecting them from the course catalog.",
    },
    {
      question: "7. How do I contact support?",
      answer:
        "You can contact our support team via the Contact Us page or by emailing support@example.com.",
    },
    {
      question: "8. Can I delete my account?",
      answer:
        "Currently, account deletion requests can be made through support. We are working on enabling this feature soon.",
    },
    {
      question: "9. Are the courses free?",
      answer:
        "Some courses are free, while others may require a subscription. Each course page provides pricing information.",
    },
    {
      question: "10. What browsers are supported?",
      answer:
        "Our platform works best on the latest versions of Chrome, Firefox, Edge, and Safari.",
    },
  ];

  return (
    <div className="container mt-5">
      <h4 className="mb-4 text-center">Frequently Asked Questions (FAQ)</h4>
      <div className="accordion" id="faqAccordion">
        {faqItems.map((item, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={`heading${index}`}>
              <button
                className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse${index}`}
                aria-expanded={index === 0 ? "true" : "false"}
                aria-controls={`collapse${index}`}
              >
                {item.question}
              </button>
            </h2>
            <div
              id={`collapse${index}`}
              className={`accordion-collapse collapse ${
                index === 0 ? "show" : ""
              }`}
              aria-labelledby={`heading${index}`}
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Faq;
