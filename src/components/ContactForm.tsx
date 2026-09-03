import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './ContactForm.css';
import { useTranslation } from 'react-i18next';
import useOnScreen from './useOnScreen.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedinIn, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

function ContactForm() {
  const { isIntersecting, ref } = useOnScreen(0.1);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const sanitizeInput = (input: string) => {
    return input.replace(/<\/?[^>]+(>|$)/g, '');
  };

  const validateForm = () => {
    let formErrors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      formErrors.name = t('formErrors.name');
      isValid = false;
    }

    if (!emailRegex.test(formData.email)) {
      formErrors.email = t('formErrors.email');
      isValid = false;
    }

    if (!formData.message.trim()) {
      formErrors.message = t('formErrors.message');
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
      [name]: sanitizeInput(value),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      setError('');

      emailjs
        .send(
          'service_9lvvbw9',
          'template_ghdqd2s',
          formData,
          '8S3eOkBsPkZMZxvgU'
        )
        .then((response) => {
          console.log(
            'Email sent successfully',
            response.status,
            response.text
          );
          setIsSubmitting(false);
          setIsSuccess(true);
          setTimeout(() => setIsSuccess(false), 3000);
          setFormData({ name: '', email: '', message: '' });
        })
        .catch((err) => {
          console.error('Failed to send email', err);
          setIsSubmitting(false);
          setError(t('formErrors.sending'));
        });
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className={`contact ${isIntersecting ? 'show' : ''}`}
      aria-labelledby="contact-heading"
    >
      {isSubmitting && !isSuccess && (
        <div className="overlay" role="status" aria-live="polite">
          <div className="spinner"></div>
        </div>
      )}
      {isSuccess && (
        <div className="overlay" role="status" aria-live="polite">
          <div className="checkmark"></div>
        </div>
      )}
      <div className="contact-info">
        <h2 id="contact-heading" className="section-heading">
          {t('contact.header')}
        </h2>
        <p className="contact-text">{t('contact.text')}</p>
        <p>
          <a className="text-link" href={'mailto:' + t('contact.email')}>
            {t('contact.email')}
          </a>
        </p>
        <ul className="contact-socials" aria-label={t('contact.header')}>
          <li>
            <a
              href="https://www.linkedin.com/in/anibal-f/"
              title="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="contact-social"
            >
              <FontAwesomeIcon icon={faLinkedinIn} />
            </a>
          </li>
          <li>
            <a
              href="https://github.com/Deadlici0us"
              title="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="contact-social"
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </li>
          <li>
            <a
              href={'mailto:' + t('contact.email')}
              title={t('contact.email')}
              aria-label={t('contact.email')}
              className="contact-social"
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="field-container">
          <label htmlFor="name" className="visually-hidden">
            {t('form.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder={t('form.name')}
            className={errors.name ? 'input-error' : 'form-input'}
            value={formData.name}
            onChange={handleChange}
            required
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby="name-error"
          />
          <p id="name-error" className="error-p">
            {errors.name ? (
              <span className="error-message" role="alert">
                {errors.name}
              </span>
            ) : (
              <span className="error-placeholder">&nbsp;</span>
            )}
          </p>
        </div>

        <div className="field-container">
          <label htmlFor="email" className="visually-hidden">
            {t('form.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder={t('form.email')}
            className={errors.email ? 'input-error' : 'form-input'}
            value={formData.email}
            onChange={handleChange}
            required
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby="email-error"
          />
          <p id="email-error" className="error-p">
            {errors.email ? (
              <span className="error-message" role="alert">
                {errors.email}
              </span>
            ) : (
              <span className="error-placeholder">&nbsp;</span>
            )}
          </p>
        </div>

        <div className="field-container">
          <label htmlFor="message" className="visually-hidden">
            {t('form.message')}
          </label>
          <textarea
            id="message"
            name="message"
            placeholder={t('form.message')}
            className={errors.message ? 'input-error-msg' : 'form-textarea'}
            value={formData.message}
            onChange={handleChange}
            required
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby="message-error"
          />
          <p id="message-error" className="error-p">
            {errors.message ? (
              <span className="error-message" role="alert">
                {errors.message}
              </span>
            ) : (
              <span className="error-placeholder">&nbsp;</span>
            )}
          </p>
        </div>

        <div className="button-container">
          <button type="submit" className="btn btn-primary send-button">
            {t('form.send')}
          </button>
          <p className="error-p" aria-live="polite">
            {error && <span className="error-message">{error}</span>}
          </p>
        </div>
      </form>
    </section>
  );
}

export default ContactForm;
