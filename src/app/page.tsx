'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import styles from './page.module.css'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={styles.page}>
      {/* Navigation */}
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>
            <div className={styles.navLogoMark}>M</div>
            <span>AskMela</span>
          </Link>
          
          <div className={styles.navLinks}>
            <a href="#how" className={styles.navLink}>How it works</a>
            <a href="#integrations" className={styles.navLink}>Integrations</a>
            <a href="#pricing" className={styles.navLink}>Pricing</a>
            <a href="/docs" className={styles.navLink}>Docs</a>
            <Link href="/dashboard" className={styles.navLoginBtn}>Login</Link>
            <a href="https://t.me/AskMelaBot" className={styles.navCta}>Get Started Free</a>
          </div>

          <button className={styles.hamburger} onClick={() => setMobileMenuOpen(true)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <button className={styles.mobileMenuClose} onClick={() => setMobileMenuOpen(false)}>✕</button>
        <a href="#how" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>How it works</a>
        <a href="#integrations" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Integrations</a>
        <a href="#pricing" className={styles.mobileNavLink} onClick={() => setMobileMenuOpen(false)}>Pricing</a>
        <a href="/docs" className={styles.mobileNavLink}>Docs</a>
        <Link href="/dashboard" className={styles.mobileNavLink}>Login</Link>
        <a href="https://t.me/AskMelaBot" className={styles.btnPrimary}>Get Started Free</a>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container-lg">
          <div className={styles.heroPill}>
            <span className={styles.heroPillDot}></span>
            Now available for Ethiopian businesses
          </div>
          <h1 className={styles.heroTitle}>Your business.<br/>Always answering.</h1>
          <p className={styles.heroSub}>
            AI assistant for Ethiopian businesses. Answers your customers instantly in Amharic and English — on Telegram, your website, or anywhere you need it.
          </p>
          <div className={styles.heroCtas}>
            <a href="https://t.me/AskMelaBot" className={styles.heroCtaPrimary}>Start Free</a>
            <a href="#how" className={styles.heroCtaSecondary}>See how it works →</a>
          </div>
          <div className={styles.heroTrust}>
            Free to start <span>·</span> No credit card <span>·</span> Setup in 2 minutes
          </div>

          {/* Hero Mockup */}
          <div className={styles.heroMockup}>
            <div className={styles.mockCard}>
              <div className={styles.mockCardHeader}>
                <div className={styles.mockCardIcon} style={{background: '#2CA5E0', color: 'white'}}>T</div>
                <div>
                  <div className={styles.mockCardTitle}>Telegram Bot</div>
                  <div className={styles.mockCardSub}>Customer Chat</div>
                </div>
              </div>
              <div className={styles.mockCardBody}>
                <div className={`${styles.mockMsg} ${styles.mockMsgUser}`}>ቡና ዋጋው ስንት ነው?</div>
                <div className={`${styles.mockMsg} ${styles.mockMsgBot}`}>ቡና 50 ብር ነው።</div>
              </div>
            </div>
            <div className={styles.mockCard}>
              <div className={styles.mockCardHeader}>
                <div className={styles.mockCardIcon} style={{background: '#00FF88', color: '#0F172A'}}>&lt;/&gt;</div>
                <div>
                  <div className={styles.mockCardTitle}>Web Widget</div>
                  <div className={styles.mockCardSub}>On your site</div>
                </div>
              </div>
              <div className={styles.mockCardBody}>
                <div className={styles.typingIndicator}>
                  <div className={styles.typingDot}></div>
                  <div className={styles.typingDot}></div>
                  <div className={styles.typingDot}></div>
                </div>
              </div>
            </div>
            <div className={styles.mockCard}>
              <div className={styles.mockCardHeader}>
                <div className={styles.mockCardIcon} style={{background: '#C4B5FD', color: '#5B21B6'}}>{`{}`}</div>
                <div>
                  <div className={styles.mockCardTitle}>REST API</div>
                  <div className={styles.mockCardSub}>JSON Response</div>
                </div>
              </div>
              <div className={styles.mockCardBody}>
                <div className={styles.mockJsonResponse}>
                  {`{ "answer": "ቡና 50 ብር ነው።" }`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className={styles.proofStrip}>
        <div className="container-lg">
          <div className={styles.proofStripLabel}>Trusted by businesses across Ethiopia</div>
          <div className={styles.proofPills}>
            <div className={styles.proofPill}>2 min setup</div>
            <div className={styles.proofPill}>Amharic + English</div>
            <div className={styles.proofPill}>24/7 answers</div>
            <div className={styles.proofPill}>3 ways to integrate</div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className={styles.how} id="how">
        <div className="container-lg">
          <div className={styles.sectionLabel}>HOW IT WORKS</div>
          <h2 className={styles.sectionTitle}>Simple for you. Magic for your customers.</h2>
          <div className={styles.stepsRow}>
            <div className={styles.step}>
              <div className={styles.stepNumBig}>01</div>
              <div className={styles.stepIcon}>🏢</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Register your business</h3>
                <p className={styles.stepDesc}>Enter your business name and one line about what you do. Your AI assistant is live in 60 seconds.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumBig}>02</div>
              <div className={styles.stepIcon}>🧠</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Add your knowledge</h3>
                <p className={styles.stepDesc}>Send voice messages, text, or photos to teach your assistant about your products and prices.</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumBig}>03</div>
              <div className={styles.stepIcon}>🔗</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Share with customers</h3>
                <p className={styles.stepDesc}>Give customers your unique link or embed the widget. They ask. Mela answers. Instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className={styles.integrations} id="integrations">
        <div className="container-lg">
          <div className={styles.sectionLabel}>INTEGRATIONS</div>
          <h2 className={styles.sectionTitle}>Works wherever your customers are.</h2>
          <p className={styles.sectionSub}>Choose how you want to deploy Ask Mela. Use one or all three.</p>
          
          <div className={styles.integrationCards}>
            <div className={styles.integrationCard}>
              <div className={styles.integrationCardTop}>
                <div className={styles.integrationIconWrap} style={{background: '#E0F2FE', color: '#2CA5E0'}}>T</div>
                <span className="badge-green">Most popular</span>
              </div>
              <h3 className={styles.integrationTitle}>Telegram Bot</h3>
              <p className={styles.integrationDesc}>Share your unique link. They open Telegram and get instant answers. No app download.</p>
              <div className={styles.integrationFeatures}>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> Works on any phone</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> Voice messages supported</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> Amharic and English</div>
              </div>
              <div className={styles.integrationCode}>
                t.me/AskMelaBot?start=biz_abc123
              </div>
              <a href="#" className={styles.integrationCta}>Get your link →</a>
            </div>

            <div className={styles.integrationCard}>
              <div className={styles.integrationCardTop}>
                <div className={styles.integrationIconWrap} style={{background: '#DCFCE7', color: '#0F172A'}}>&lt;/&gt;</div>
                <span className="badge-blue">Most flexible</span>
              </div>
              <h3 className={styles.integrationTitle}>Website Widget</h3>
              <p className={styles.integrationDesc}>Paste one line of code on your website. A chat bubble appears. Works on any platform.</p>
              <div className={styles.integrationFeatures}>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> One line to install</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> Matches your brand</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> Mobile responsive</div>
              </div>
              <div className={styles.integrationCode}>
                <span className={styles.cBlue}>&lt;script</span> <span className={styles.cPink}>src=</span><span className={styles.cGreen}>&quot;https://askmela.xyz/widget.js&quot;</span>...
              </div>
              <a href="/docs" className={styles.integrationCta}>View widget docs →</a>
            </div>

            <div className={styles.integrationCard}>
              <div className={styles.integrationCardTop}>
                <div className={styles.integrationIconWrap} style={{background: '#F3E8FF', color: '#7C3AED'}}>{`{}`}</div>
                <span className="badge-purple">Most powerful</span>
              </div>
              <h3 className={styles.integrationTitle}>REST API</h3>
              <p className={styles.integrationDesc}>Integrate Ask Mela directly into your own app or workflow. Full control over the UI.</p>
              <div className={styles.integrationFeatures}>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> Simple JSON API</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> All languages supported</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> Webhook notifications</div>
              </div>
              <div className={styles.integrationCode}>
                curl -X POST https://askmela.xyz/api/v1/ask ...
              </div>
              <a href="/docs" className={styles.integrationCta}>View API docs →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing} id="pricing">
        <div className="container-lg">
          <div className={styles.sectionLabel}>PRICING</div>
          <h2 className={styles.sectionTitle}>Start free. Grow as you go.</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingPlanLabel}>FREE</div>
              <div className={styles.pricingPrice}>0 ETB<span className={styles.pricingPriceSub}>/mo</span></div>
              <p className={styles.pricingDesc}>Perfect to get started</p>
              <ul className={styles.pricingFeatures}>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> Telegram bot</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> 50 questions/month</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> Amharic + English</li>
              </ul>
              <button className="btn-secondary">Start Free</button>
            </div>
            
            <div className={`${styles.pricingCard} ${styles.pricingCardPro}`}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div className={`${styles.pricingPlanLabel} ${styles.pricingPlanLabelPro}`}>PRO</div>
                <span className="badge-green">Most popular</span>
              </div>
              <div className={styles.pricingPrice}>200 ETB<span className={styles.pricingPriceSub}>/mo</span></div>
              <p className={styles.pricingDesc}>For active businesses</p>
              <ul className={styles.pricingFeatures}>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> Everything in Free</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> Unlimited questions</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> Website widget</li>
              </ul>
              <button className="btn-primary">Start Pro</button>
            </div>

            <div className={styles.pricingCard}>
              <div className={styles.pricingPlanLabel}>BUSINESS</div>
              <div className={styles.pricingPrice}>500 ETB<span className={styles.pricingPriceSub}>/mo</span></div>
              <p className={styles.pricingDesc}>For serious operations</p>
              <ul className={styles.pricingFeatures}>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> Everything in Pro</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> REST API access</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> Custom bot username</li>
              </ul>
              <button className="btn-dark">Contact Us</button>
            </div>
          </div>
          <p className={styles.pricingNote}>All prices in Ethiopian Birr. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container-lg">
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>AskMela</div>
              <p className={styles.footerTagline}>AI assistant for Ethiopian businesses. Instant answers in Amharic and English.</p>
            </div>
            <div>
              <h4 className={styles.footerColTitle}>Product</h4>
              <div className={styles.footerLinks}>
                <a href="#how" className={styles.footerLink}>How it works</a>
                <a href="#integrations" className={styles.footerLink}>Integrations</a>
                <a href="#pricing" className={styles.footerLink}>Pricing</a>
              </div>
            </div>
            <div>
              <h4 className={styles.footerColTitle}>Developers</h4>
              <div className={styles.footerLinks}>
                <a href="/docs" className={styles.footerLink}>Documentation</a>
                <a href="/docs/api" className={styles.footerLink}>REST API</a>
              </div>
            </div>
            <div>
              <h4 className={styles.footerColTitle}>Company</h4>
              <div className={styles.footerLinks}>
                <a href="#" className={styles.footerLink}>About</a>
                <a href="#" className={styles.footerLink}>Contact</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            © 2026 AskMela by Addus · Built in Ethiopia 🇪🇹
          </div>
        </div>
      </footer>

      {/* AskMela Widget - Self Demo */}
      <Script 
        src="/widget.js" 
        data-business="00000000-0000-0000-0000-000000000000"
        data-color="#00FF88"
        data-position="bottom-right"
        strategy="afterInteractive"
      />
    </div>
  )
}
