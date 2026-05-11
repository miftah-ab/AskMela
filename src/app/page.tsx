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
            <a href="#how" className={styles.navLink}>እንዴት እንደሚሰራ / How it works</a>
            <a href="#integrations" className={styles.navLink}>ማገናኛዎች / Integrations</a>
            <a href="#pricing" className={styles.navLink}>ዋጋ / Pricing</a>
            <a href="/docs" className={styles.navLink}>መመሪያ / Docs</a>
            <Link href="/dashboard" className={styles.navLoginBtn}>ይግቡ / Login</Link>
            <a href="https://t.me/AskMelaBot" className={styles.navCta}>በነፃ ይጀምሩ / Get Started Free</a>
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
            አሁን በኢትዮጵያ ለሚገኙ ንግዶች ይገኛል / Now in Ethiopia
          </div>
          <h1 className={styles.heroTitle}>ንግድዎ ሁልጊዜ<br/>ምላሽ እንዲሰጥ ያድርጉ።</h1>
          <p className={styles.heroSub}>
            ለኢትዮጵያ ንግዶች የተሰራ የAI ረዳት። በቴሌግራም፣ በድረ-ገጽዎ ወይም በማንኛውም ቦታ ለደንበኞችዎ በአማርኛ እና በእንግሊዝኛ ፈጣን ምላሽ ይሰጣል።
          </p>
          <div className={styles.heroCtas}>
            <a href="https://t.me/AskMelaBot" className={styles.heroCtaPrimary}>በነፃ ይጀምሩ</a>
            <a href="#how" className={styles.heroCtaSecondary}>እንዴት እንደሚሰራ ይመልከቱ →</a>
          </div>
          <div className={styles.heroTrust}>
            በነፃ ይጀምሩ <span>·</span> ክሬዲት ካርድ አያስፈልግም <span>·</span> በ2 ደቂቃ ውስጥ ዝግጁ
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
          <div className={styles.sectionLabel}>እንዴት እንደሚሰራ / HOW IT WORKS</div>
          <h2 className={styles.sectionTitle}>ለእርስዎ ቀላል። ለደንበኞችዎ አስደናቂ።</h2>
          <div className={styles.stepsRow}>
            <div className={styles.step}>
              <div className={styles.stepNumBig}>01</div>
              <div className={styles.stepIcon}>🏢</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>ንግድዎን ይመዝግቡ</h3>
                <p className={styles.stepDesc}>የንግድዎን ስም እና ስለሚሰጡት አገልግሎት ጥቂት ቃላት ያስገቡ። የAI ረዳትዎ በ60 ሰከንድ ውስጥ ዝግጁ ይሆናል።</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumBig}>02</div>
              <div className={styles.stepIcon}>🧠</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>መረጃ ያስገቡ</h3>
                <p className={styles.stepDesc}>ረዳትዎ ስለ ምርቶችዎ እና ዋጋዎ እንዲያውቅ በድምፅ፣ በጽሁፍ ወይም በፎቶ መረጃ ይላኩለት።</p>
              </div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumBig}>03</div>
              <div className={styles.stepIcon}>🔗</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>ለደንበኞች ያጋሩ</h3>
                <p className={styles.stepDesc}>የራስዎን ሊንክ ለደንበኞች ይስጡ ወይም በድረ-ገጽዎ ላይ ይለጥፉ። ደንበኞች ይጠይቃሉ፣ መላ ወዲያውኑ ይመልሳል።</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className={styles.integrations} id="integrations">
        <div className="container-lg">
          <div className={styles.sectionLabel}>ማገናኛዎች / INTEGRATIONS</div>
          <h2 className={styles.sectionTitle}>ደንበኞችዎ ባሉበት ቦታ ሁሉ ይስሩ።</h2>
          <p className={styles.sectionSub}>Ask Melaን እንዴት መጠቀም እንደሚፈልጉ ይምረጡ። አንዱን ወይም ሶስቱንም መጠቀም ይችላሉ።</p>
          
          <div className={styles.integrationCards}>
            <div className={styles.integrationCard}>
              <div className={styles.integrationCardTop}>
                <div className={styles.integrationIconWrap} style={{background: '#E0F2FE', color: '#2CA5E0'}}>T</div>
                <span className="badge-green">በብዛት ጥቅም ላይ የዋለ</span>
              </div>
              <h3 className={styles.integrationTitle}>የቴሌግራም ቦት (Telegram Bot)</h3>
              <p className={styles.integrationDesc}>የራስዎን ልዩ ሊንክ ያጋሩ። ደንበኞች ቴሌግራምን በመጠቀም ወዲያውኑ ምላሽ ያገኛሉ። ምንም አይነት አፕሊኬሽን ማውረድ አያስፈልጋቸውም።</p>
              <div className={styles.integrationFeatures}>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> በማንኛውም ስልክ ላይ ይሰራል</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> የድምፅ መልዕክት ይቀበላል</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> በአማርኛ እና በእንግሊዝኛ</div>
              </div>
              <div className={styles.integrationCode}>
                t.me/AskMelaBot?start=biz_abc123
              </div>
              <a href="#" className={styles.integrationCta}>ሊንክዎን ያግኙ →</a>
            </div>

            <div className={styles.integrationCard}>
              <div className={styles.integrationCardTop}>
                <div className={styles.integrationIconWrap} style={{background: '#DCFCE7', color: '#0F172A'}}>&lt;/&gt;</div>
                <span className="badge-blue">ተለዋዋጭ</span>
              </div>
              <h3 className={styles.integrationTitle}>የድረ-ገጽ ዊጅት (Website Widget)</h3>
              <p className={styles.integrationDesc}>አንድ መስመር ኮድ በድረ-ገጽዎ ላይ ይለጥፉ። የውይይት ሳጥን ይመጣል። በማንኛውም አይነት ድረ-ገጽ ላይ ይሰራል።</p>
              <div className={styles.integrationFeatures}>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> በቀላሉ የሚገጠም</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> ከድረ-ገጽዎ ቀለም ጋር የሚስማማ</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> በሞባይል ስልክ የሚመች</div>
              </div>
              <div className={styles.integrationCode}>
                <span className={styles.cBlue}>&lt;script</span> <span className={styles.cPink}>src=</span><span className={styles.cGreen}>&quot;https://askmela.xyz/widget.js&quot;</span>...
              </div>
              <a href="/docs" className={styles.integrationCta}>መመሪያውን ይመልከቱ →</a>
            </div>

            <div className={styles.integrationCard}>
              <div className={styles.integrationCardTop}>
                <div className={styles.integrationIconWrap} style={{background: '#F3E8FF', color: '#7C3AED'}}>{`{}`}</div>
                <span className="badge-purple">ኃይለኛ</span>
              </div>
              <h3 className={styles.integrationTitle}>REST API</h3>
              <p className={styles.integrationDesc}>Ask Melaን በቀጥታ በእራስዎ አፕሊኬሽን ውስጥ ያስገቡ። ሙሉ በሙሉ በእርስዎ ቁጥጥር ስር።</p>
              <div className={styles.integrationFeatures}>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> ቀላል የJSON API</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> ሁሉንም ቋንቋዎች ይደግፋል</div>
                <div className={styles.integrationFeature}><span className={styles.integrationFeatureCheck}>✓</span> የዌብሁክ (Webhook) ማሳወቂያዎች</div>
              </div>
              <div className={styles.integrationCode}>
                curl -X POST https://askmela.xyz/api/v1/ask ...
              </div>
              <a href="/docs" className={styles.integrationCta}>የAPI መመሪያ →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricing} id="pricing">
        <div className="container-lg">
          <div className={styles.sectionLabel}>ዋጋ / PRICING</div>
          <h2 className={styles.sectionTitle}>በነፃ ይጀምሩ። ንግድዎ ሲያድግ ያሳድጉ።</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.pricingPlanLabel}>ነፃ / FREE</div>
              <div className={styles.pricingPrice}>0 ብር<span className={styles.pricingPriceSub}>/በወር</span></div>
              <p className={styles.pricingDesc}>ለመጀመር ፍጹም ነው</p>
              <ul className={styles.pricingFeatures}>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> የቴሌግራም ቦት</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> 50 ጥያቄዎች በወር</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> በአማርኛ እና በእንግሊዝኛ</li>
              </ul>
              <button className="btn-secondary">በነፃ ይጀምሩ</button>
            </div>
            
            <div className={`${styles.pricingCard} ${styles.pricingCardPro}`}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div className={`${styles.pricingPlanLabel} ${styles.pricingPlanLabelPro}`}>ፕሮ / PRO</div>
                <span className="badge-green">ተመራጭ</span>
              </div>
              <div className={styles.pricingPrice}>200 ብር<span className={styles.pricingPriceSub}>/በወር</span></div>
              <p className={styles.pricingDesc}>ለሚንቀሳቀሱ ንግዶች</p>
              <ul className={styles.pricingFeatures}>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> ሁሉንም የነፃ አገልግሎቶች</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> ያልተገደበ ጥያቄዎች</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> የድረ-ገጽ ዊጅት</li>
              </ul>
              <button className="btn-primary">ፕሮ ይጀምሩ</button>
            </div>

            <div className={styles.pricingCard}>
              <div className={styles.pricingPlanLabel}>ቢዝነስ / BUSINESS</div>
              <div className={styles.pricingPrice}>500 ብር<span className={styles.pricingPriceSub}>/በወር</span></div>
              <p className={styles.pricingDesc}>ለትላልቅ ስራዎች</p>
              <ul className={styles.pricingFeatures}>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> ሁሉንም የፕሮ አገልግሎቶች</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> የREST API ተጠቃሚነት</li>
                <li className={styles.pricingFeature}><span className={styles.pricingCheck}>✓</span> የራስዎ ቦት ስም</li>
              </ul>
              <button className="btn-dark">ያግኙን</button>
            </div>
          </div>
          <p className={styles.pricingNote}>ሁሉም ዋጋዎች በኢትዮጵያ ብር ናቸው። በፈለጉት ጊዜ ማቆም ይችላሉ።</p>
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
