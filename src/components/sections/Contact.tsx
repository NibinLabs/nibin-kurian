'use client';

import { useEffect, useState, useRef, type FormEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import styles from './Contact.module.scss';
import Logo from '../ui/Logo';

// Mail Icon
const MailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

// LinkedIn Icon
const LinkedinIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

// GitHub Icon
const GithubIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
);



const SOCIAL_LINKS = [
    { label: 'Email', icon: <MailIcon />, href: 'mailto:nibinlabs@gmail.com' },
    { label: 'LinkedIn', icon: <LinkedinIcon />, href: 'https://linkedin.com/in/nibin-kurian' },
    { label: 'GitHub', icon: <GithubIcon />, href: 'https://github.com/NibinLabs' },
];

const CONTACT_METHODS = [
    {
        id: 'email',
        label: 'Email',
        inputLabel: 'Enter your email address',
        placeholder: 'you@domain.com',
        type: 'email' as const,
        inputMode: 'email' as const,
    },
    {
        id: 'whatsapp',
        label: 'WhatsApp',
        inputLabel: 'Enter your WhatsApp number',
        placeholder: '+91 98765 43210',
        type: 'tel' as const,
        inputMode: 'tel' as const,
    },
    {
        id: 'telegram',
        label: 'Telegram',
        inputLabel: 'Enter your Telegram handle',
        placeholder: '@username',
        type: 'text' as const,
        inputMode: 'text' as const,
    },
    {
        id: 'phone',
        label: 'Phone',
        inputLabel: 'Enter your phone number',
        placeholder: '+91 98765 43210',
        type: 'tel' as const,
        inputMode: 'tel' as const,
    },
    {
        id: 'other',
        label: 'Other',
        inputLabel: 'How should I reach you?',
        placeholder: 'Signal / Discord / anything',
        type: 'text' as const,
        inputMode: 'text' as const,
    },
];

const INDIAN_MOBILE_REGEX = /^(?:\+91|91|0)?[6-9]\d{9}$/;

export default function Contact() {
    const sectionRef = useRef<HTMLElement>(null);
    const formCardRef = useRef<HTMLDivElement>(null);
    const dashboardRef = useRef<HTMLDivElement>(null);
    const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [contactMethod, setContactMethod] = useState(CONTACT_METHODS[0].id);
    const [values, setValues] = useState({ name: '', contactValue: '', message: '' });
    const [touched, setTouched] = useState({ name: false, contactValue: false, message: false });
    const [errors, setErrors] = useState<{
        name?: string;
        contactMethod?: string;
        contactValue?: string;
        message?: string;
    }>({});

    useEffect(() => {
        const initGsap = async () => {
            const { gsap } = await import('gsap');
            const { ScrollTrigger } = await import('gsap/ScrollTrigger');
            gsap.registerPlugin(ScrollTrigger);

            const ctx = gsap.context(() => {
                gsap.from('[data-contact-reveal]', {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    },
                });

                // Mesh Orbs Floating
                gsap.to('[data-contact-orb]', {
                    y: 'random(-30, 30)',
                    x: 'random(-30, 30)',
                    duration: 'random(4, 6)',
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    stagger: 0.5
                });

                // 3D Tilt Logic Helper
                const createTilt = (element: HTMLElement | null) => {
                    if (!element) return;

                    const handleMouseMove = (e: MouseEvent) => {
                        const rect = element.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;

                        const rotateX = ((y - centerY) / centerY) * -8;
                        const rotateY = ((x - centerX) / centerX) * 8;

                        gsap.to(element, {
                            rotateX,
                            rotateY,
                            duration: 0.5,
                            ease: 'power2.out',
                            overwrite: 'auto'
                        });

                        // Spotlight CSS Vars
                        element.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                        element.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
                    };

                    const handleMouseLeave = () => {
                        gsap.to(element, {
                            rotateX: 0,
                            rotateY: 0,
                            duration: 1,
                            ease: 'elastic.out(1, 0.5)'
                        });
                    };

                    element.addEventListener('mousemove', handleMouseMove);
                    element.addEventListener('mouseleave', handleMouseLeave);
                };

                createTilt(formCardRef.current);
                createTilt(dashboardRef.current);

            }, sectionRef);

            return () => ctx.revert();
        };

        initGsap();
    }, []);

    // Live Clock Logic
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            };
            setTime(new Intl.DateTimeFormat('en-US', options).format(now));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const currentYear = new Date().getFullYear();
    const activeMethod = CONTACT_METHODS.find((method) => method.id === contactMethod) ?? CONTACT_METHODS[0];
    const isPhoneMethod = activeMethod.id === 'whatsapp' || activeMethod.id === 'phone';
    const normalizedContact = values.contactValue.replace(/[^\d+]/g, '');
    const nameValid = values.name.trim().length > 0;
    const contactValueValid =
        values.contactValue.trim().length > 0 &&
        (!isPhoneMethod || INDIAN_MOBILE_REGEX.test(normalizedContact));
    const messageValid = values.message.trim().length > 0;

    const clearError = (field: 'name' | 'contactMethod' | 'contactValue' | 'message') => {
        setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = String(formData.get('name') ?? '').trim();
        const contactValue = String(formData.get('contactValue') ?? '').trim();
        const message = String(formData.get('message') ?? '').trim();

        setValues({ name, contactValue, message });

        const nextErrors: typeof errors = {};
        if (!name) nextErrors.name = 'Name is required.';
        if (!contactMethod) nextErrors.contactMethod = 'Select a contact method.';
        if (!contactValue) {
            nextErrors.contactValue = `${activeMethod.label} is required.`;
        } else if (activeMethod.id === 'whatsapp' || activeMethod.id === 'phone') {
            const normalized = contactValue.replace(/[^\d+]/g, '');
            if (!INDIAN_MOBILE_REGEX.test(normalized)) {
                nextErrors.contactValue = 'Enter a valid Indian number (e.g., +91 98765 43210).';
            }
        }
        if (!message) nextErrors.message = 'Message is required.';
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            return;
        }

        setErrors({});
        setFormStatus('sending');
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    access_key: '7f41e245-175c-40d4-ac58-b44ebd1c86af',
                    name,
                    subject: name ? `Portfolio message from ${name}` : 'New portfolio message',
                    message: `Preferred contact: ${activeMethod.label} - ${contactValue}\n\n${message}`,
                }),
            });

            let payload: { success?: boolean } | null = null;
            try {
                payload = await response.json();
            } catch {
                payload = null;
            }

            if (!response.ok || payload?.success !== true) {
                throw new Error('Failed to send message');
            }

            setFormStatus('sent');
            form.reset();
            setContactMethod(CONTACT_METHODS[0].id);
            setValues({ name: '', contactValue: '', message: '' });
            setTouched({ name: false, contactValue: false, message: false });
            toast.success('Message sent successfully.');
            window.setTimeout(() => setFormStatus('idle'), 2000);
        } catch {
            setFormStatus('error');
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <section id="contact" className={styles.contact} ref={sectionRef}>
            <div className={styles.meshContainer} aria-hidden="true">
                <div className={`${styles.orb} ${styles.orb1}`} data-contact-orb />
                <div className={`${styles.orb} ${styles.orb2}`} data-contact-orb />
            </div>

            <div className={styles.container}>
                <div className="section-label" data-contact-reveal>Contact</div>
                <h2 className="section-title" data-contact-reveal>
                    Let&apos;s build the <span className={styles.accent}>next interface</span> together.
                </h2>
                <p className="section-subtitle" data-contact-reveal>
                    Currently open to new opportunities and collaborations. Whether you have a question or just want to say hi, my inbox is always open.
                </p>
                <div className={styles.contactSplit}>
                    <div className={styles.formColumn} data-contact-reveal>
                        <div className={styles.formCard} ref={formCardRef}>
                            <div className={styles.spotlight} />
                            <div className={styles.formHeader}>
                                <h3 className={styles.formTitle}>Drop a quick message</h3>
                                <p className={styles.formSubtitle}>
                                    No Gmail or LinkedIn needed &mdash; just share your best contact method and I&apos;ll follow up.
                                </p>
                            </div>
                            <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
                                <div className={styles.formGrid}>
                                    <div className={styles.field}>
                                        <label className={styles.label} htmlFor="contact-name">Name *</label>
                                        <input
                                            className={`${styles.input} ${errors.name ? styles.inputError : nameValid && touched.name ? styles.inputSuccess : ''}`}
                                            id="contact-name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Your name"
                                            aria-required="true"
                                            aria-describedby={errors.name ? 'contact-name-error' : undefined}
                                            onChange={(event) => {
                                                setValues((prev) => ({ ...prev, name: event.target.value }));
                                                clearError('name');
                                            }}
                                            onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                                        />
                                        {errors.name && (
                                            <span id="contact-name-error" className={styles.errorText}>{errors.name}</span>
                                        )}
                                    </div>
                                    <div className={styles.field}>
                                        <label className={styles.label}>Best way to reach you *</label>
                                        <div
                                            className={`${styles.methodGroup} ${errors.contactMethod ? styles.methodError : ''}`}
                                            role="radiogroup"
                                            aria-label="Preferred contact method"
                                            aria-required="true"
                                            aria-describedby={errors.contactMethod ? 'contact-method-error' : undefined}
                                        >
                                            {CONTACT_METHODS.map((method) => (
                                                <label key={method.id} className={styles.methodOption}>
                                                    <input
                                                        className={styles.methodInput}
                                                        type="radio"
                                                        name="contactMethod"
                                                        value={method.id}
                                                        checked={contactMethod === method.id}
                                                        onChange={() => {
                                                            setContactMethod(method.id);
                                                            setValues((prev) => ({ ...prev, contactValue: '' }));
                                                            setTouched((prev) => ({ ...prev, contactValue: false }));
                                                            clearError('contactMethod');
                                                            clearError('contactValue');
                                                        }}
                                                    />
                                                    <span className={styles.methodLabel}>{method.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.contactMethod && (
                                            <span id="contact-method-error" className={styles.errorText}>{errors.contactMethod}</span>
                                        )}
                                    </div>
                                    <div className={`${styles.field} ${styles.fieldFull}`}>
                                        <label className={styles.label} htmlFor="contact-value">
                                            {activeMethod.inputLabel}
                                        </label>
                                        <input
                                            key={activeMethod.id}
                                            className={`${styles.input} ${errors.contactValue ? styles.inputError : contactValueValid && touched.contactValue ? styles.inputSuccess : ''}`}
                                            id="contact-value"
                                            name="contactValue"
                                            type={activeMethod.type}
                                            inputMode={activeMethod.inputMode}
                                            placeholder={activeMethod.placeholder}
                                            aria-required="true"
                                            aria-describedby={errors.contactValue ? 'contact-value-error' : undefined}
                                            onChange={(event) => {
                                                setValues((prev) => ({ ...prev, contactValue: event.target.value }));
                                                clearError('contactValue');
                                            }}
                                            onBlur={() => setTouched((prev) => ({ ...prev, contactValue: true }))}
                                        />
                                        {errors.contactValue && (
                                            <span id="contact-value-error" className={styles.errorText}>{errors.contactValue}</span>
                                        )}
                                    </div>
                                    <div className={`${styles.field} ${styles.fieldFull}`}>
                                        <label className={styles.label} htmlFor="contact-message">Message *</label>
                                        <textarea
                                            className={`${styles.textarea} ${errors.message ? styles.inputError : messageValid && touched.message ? styles.inputSuccess : ''}`}
                                            id="contact-message"
                                            name="message"
                                            placeholder="Tell me about your project or say hello."
                                            rows={5}
                                            aria-required="true"
                                            aria-describedby={errors.message ? 'contact-message-error' : undefined}
                                            onChange={(event) => {
                                                setValues((prev) => ({ ...prev, message: event.target.value }));
                                                clearError('message');
                                            }}
                                            onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
                                        />
                                        {errors.message && (
                                            <span id="contact-message-error" className={styles.errorText}>{errors.message}</span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.submitRow}>
                                    <button className={styles.submitButton} type="submit" disabled={formStatus === 'sending'}>
                                        {formStatus === 'sending' ? 'Sending...' : formStatus === 'sent' ? 'Sent!' : 'Send message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className={styles.visualSide} data-contact-reveal>
                        <div className={styles.dashboard} ref={dashboardRef}>
                            <div className={styles.spotlight} />
                            <div className={styles.dashboardHeader}>
                                <div className={styles.dashboardTitle}>Connection Dashboard</div>
                                <div className={styles.liveIndicator}>
                                    <span className={styles.pulse} />
                                    LIVE
                                </div>
                            </div>

                            <div className={styles.vizContainer}>
                                <div className={styles.radarContainer}>
                                    <div className={styles.radarSweep} />
                                    <div className={styles.signalWaves}>
                                        <div className={styles.wave} />
                                        <div className={styles.wave} />
                                    </div>
                                    <div className={styles.dataNode} />
                                    <div className={styles.dataNode} />
                                    <div className={styles.dataNode} />
                                </div>
                                <div className={styles.signalIcon}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                                        <path d="M12 6v6l4 2" />
                                    </svg>
                                </div>
                            </div>

                            <div className={styles.metrics}>
                                <div className={styles.metricCard}>
                                    <span className={styles.metricCardLabel}>Response Time</span>
                                    <span className={styles.metricCardValue}>&lt; 24 Hours</span>
                                </div>
                                <div className={styles.metricCard}>
                                    <span className={styles.metricCardLabel}>Global Reach</span>
                                    <span className={styles.metricCardValue}>Active</span>
                                </div>
                                <div className={styles.metricCard}>
                                    <span className={styles.metricCardLabel}>Project Status</span>
                                    <span className={styles.metricCardValue}>Open</span>
                                </div>
                                <div className={styles.metricCard}>
                                    <span className={styles.metricCardLabel}>Local Time</span>
                                    <span className={styles.metricCardValue}>{time.split(' ')[0]} IST</span>
                                </div>
                            </div>

                            <p className={styles.connectionText}>
                                Always wired for new challenges. Let&apos;s sync up and bridge the gap between idea and interface.
                            </p>
                        </div>
                    </div>
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3500}
                    newestOnTop
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />

                <footer className={styles.footer}>
                    <div className={styles.footerGrid}>
                        <div className={styles.brandColumn}>
                            <Logo size="sm" className={styles.footerLogo} />
                            <p className={styles.brandTagline}>
                                Crafting technical excellence <br />
                                and visual sophistication.
                            </p>
                        </div>

                        <div className={styles.linksColumn}>
                            <div className={styles.linkGroup}>
                                <h3 className={styles.groupLabel}>Navigation</h3>
                                <nav className={styles.navLinks}>
                                    <a href="#about" className={styles.footerLink}>About</a>
                                    <a href="#skills" className={styles.footerLink}>Skills</a>
                                    <a href="#experience" className={styles.footerLink}>Experience</a>
                                </nav>
                            </div>
                            <div className={styles.linkGroup}>
                                <h3 className={styles.groupLabel}>Social</h3>
                                <nav className={styles.socialIcons}>
                                    {SOCIAL_LINKS.map(link => (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            className={styles.socialIconLink}
                                            target={link.label !== 'Email' ? "_blank" : undefined}
                                            rel={link.label !== 'Email' ? "noopener noreferrer" : undefined}
                                            aria-label={link.label}
                                            title={link.label}
                                        >
                                            {link.icon}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        <div className={styles.footerStatus}>
                            <div className={styles.availabilityBadge}>
                                <span className={styles.availabilityDot}></span>
                                Available for collaboration
                            </div>
                            <p className={styles.footerSignature}>
                                Handcrafted with passion & precision. <br />
                                Based in Kerala, India.
                            </p>
                        </div>
                    </div>

                    <div className={styles.footerBottom}>
                        <p className={styles.copyright}>&copy; {currentYear} Nibin Kurian. All rights reserved.</p>
                        <p className={styles.techStack}>Built with Next.js, TypeScript & GSAP</p>
                    </div>
                </footer>
            </div>
        </section>
    );
}
