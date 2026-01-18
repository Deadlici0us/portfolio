import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./ContactForm.css"; // We'll use this for the styles
import { useTranslation } from "react-i18next";
import useOnScreen from "./useOnScreen.tsx";
import githubIcon from "../assets/github2.png";
import linkedinIcon from "../assets/linkedin.png";
import emailIcon from "../assets/email.png";

function ContactForm() {
  const { isIntersecting, ref } = useOnScreen(0.1);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // For green check animation
  const [error, setError] = useState(""); // Track error during email sending

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const sanitizeInput = (input: string) => {
    return input.replace(/<\/?[^>]+(>|$)/g, ""); // Remove HTML tags to prevent XSS
  };

  const validateForm = () => {
    let formErrors = { name: "", email: "", message: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      formErrors.name = t("formErrors.name");
      isValid = false;
    }

    if (!emailRegex.test(formData.email)) {
      formErrors.email = t("formErrors.email");
      isValid = false;
    }

    if (!formData.message.trim()) {
      formErrors.message = t("formErrors.message");
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: sanitizeInput(value), // Sanitize inputs
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setError(""); // Clear previous errors

      emailjs
        .send(
          "service_9lvvbw9",
          "template_ghdqd2s",
          formData,
          "8S3eOkBsPkZMZxvgU"
        )
        .then((response) => {
          console.log(
            "Email sent successfully",
            response.status,
            response.text
          );
          setIsSubmitting(false); // Hide spinner
          setIsSuccess(true); // Show green check animation
          setTimeout(() => setIsSuccess(false), 3000); // Hide checkmark after 3 seconds
          setFormData({ name: "", email: "", message: "" }); // Reset form
        })
        .catch((err) => {
          console.error("Failed to send email", err);
          setIsSubmitting(false); // Hide spinner after failure
          setError(t("formErrors.sending")); // Show error message in red
        });
    }
  };

  return (
    <div
      id='contact'
      ref={ref}
      className={`contact ${isIntersecting ? "show" : ""}`}>
      {isSubmitting && !isSuccess && (
        <div className='overlay'>
          <div className='spinner'></div> {/* Spinner before email sent */}
        </div>
      )}
      {isSuccess && (
        <div className='overlay'>
          <div className='checkmark'></div> {/* Green check animation */}
        </div>
      )}
      <div className='contact_info'>
        <h1 className='h1'>{t("contact.header")}</h1>
        <p>{t("contact.text")}</p>
        <p>
          <a className='contact-links' href={"mailto:" + t("contact.email")}>
            {t("contact.email")}
          </a>
        </p>
        <p>
          <div>
            <a
              href='https://www.linkedin.com/in/anibal-f/'
              title='Linkedin'
              target='_blank'
              rel='noopener noreferrer'>
              <img src={linkedinIcon} alt='linkedin' className='icons' />
            </a>
            <a
              href='https://github.com/Deadlici0us'
              title='Github'
              target='_blank'
              rel='noopener noreferrer'>
              <img src={githubIcon} alt='github' className='icons' />
            </a>
            <a href='#contact' title='Send me an email'>
              <img src={emailIcon} alt='email' className='icons' />
            </a>
          </div>
        </p>
      </div>
      <form onSubmit={handleSubmit} className='contact_form'>
        <div className='name-container'>
          <input
            type='text'
            id='name'
            name='name'
            placeholder={t("form.name")}
            className={errors.name ? "input-error" : "name"}
            value={formData.name}
            onChange={handleChange}
          />
          <p className='error-p'>
            {errors.name ? (
              <span className='error-message'>{errors.name}</span>
            ) : (
              <span className='error-placeholder'>&nbsp;</span>
            )}
          </p>
        </div>

        <div className='email-container'>
          <input
            type='email'
            id='email'
            name='email'
            placeholder={t("form.email")}
            className={errors.email ? "input-error" : "email"}
            value={formData.email}
            onChange={handleChange}
          />
          <p className='error-p'>
            {errors.email ? (
              <span className='error-message'>{errors.email}</span>
            ) : (
              <span className='error-placeholder'>&nbsp;</span>
            )}
          </p>
        </div>

        <div className='message-container'>
          <textarea
            id='message'
            name='message'
            placeholder={t("form.message")}
            className={errors.message ? "input-error-msg" : "message"}
            value={formData.message}
            onChange={handleChange}
          />
          <p className='error-p'>
            {errors.message ? (
              <span className='error-message'>{errors.message}</span>
            ) : (
              <span className='error-placeholder'>&nbsp;</span>
            )}
          </p>
        </div>

        <div className='button-container'>
          <button type='submit' className='send_button'>
            {t("form.send")}
          </button>
          <p className='error-p'>
            &nbsp;
            {error && <span className='error-message'>{error}</span>}
          </p>
        </div>
      </form>
    </div>
  );
}

export default ContactForm;
