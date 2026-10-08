import { useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

const waitlistUrl = import.meta.env.VITE_WAITLIST_URL

const people = [
  { name: 'Linh', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
  { name: 'Minh', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
  { name: 'An', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
  { name: 'Khoa', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
]

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Orange - về đầu trang">
      <span className="logo-mark">o</span>
      <span>orange</span>
    </a>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [liked, setLiked] = useState(false)

  const joinWaitlist = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || isSubmitting) return

    if (!waitlistUrl) {
      setSubmitError('Form đăng ký chưa được cấu hình. Vui lòng thử lại sau.')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    const submission = fetch(waitlistUrl, {
        method: 'POST',
        keepalive: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email: normalizedEmail }),
      }).catch(() => undefined)

    void submission
    await new Promise((resolve) => window.setTimeout(resolve, 1000))

    setJoined(true)
    setEmail('')
    setIsSubmitting(false)
  }

  return (
    <main id="top">
      <nav className="nav shell" aria-label="Điều hướng chính">
        <Logo />
        <button
          className="menu-button"
          type="button"
          aria-label="Mở menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
          <a href="#inside" onClick={() => setMenuOpen(false)}>Bên trong Orange</a>
          <a href="#values" onClick={() => setMenuOpen(false)}>Giá trị</a>
          <a href="#community" onClick={() => setMenuOpen(false)}>Cộng đồng</a>
          <a className="button button-small button-dark" href="#join" onClick={() => setMenuOpen(false)}>Tham gia sớm</a>
        </div>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span /> Mạng xã hội cho người thật</div>
          <h1>Nơi mọi kết nối đều <em>có vị.</em></h1>
          <p className="hero-description">
            Orange đưa bạn trở lại với những cuộc trò chuyện chân thật, những khoảnh khắc đáng nhớ và những người khiến ngày thường bỗng thú vị hơn.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#join">Giữ chỗ của bạn <span aria-hidden="true">→</span></a>
            <a className="text-link" href="#inside">Khám phá Orange <span aria-hidden="true">↓</span></a>
          </div>
          <div className="people-row">
            <div className="avatar-stack">
              {people.map((person) => <img key={person.name} src={person.avatar} alt={`Thành viên ${person.name}`} />)}
            </div>
            <p><strong>12.000+</strong><br />người đang chờ gặp bạn</p>
          </div>
        </div>

        <div className="hero-visual" aria-label="Xem trước bảng tin Orange">
          <div className="sun-disc" />
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="phone">
            <div className="phone-top">
              <span className="mini-logo">o</span>
              <span className="feed-title">dành cho bạn</span>
              <span className="profile-dot" />
            </div>
            <article className="feed-post">
              <div className="post-author">
                <img src={people[0].avatar} alt="Linh Nguyễn" />
                <div><strong>Linh Nguyễn</strong><span>Đà Lạt · 12 phút</span></div>
                <button type="button" aria-label="Xem thêm">•••</button>
              </div>
              <p>Một sáng không vội, một ly cam thật chậm.</p>
              <img className="post-image" src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=85" alt="Bữa sáng với nước cam và trái cây" />
              <div className="post-actions">
                <button className={liked ? 'liked' : ''} type="button" onClick={() => setLiked((value) => !value)}>
                  {liked ? 'Đã thích' : 'Thích'} · {liked ? '2.5k' : '2.4k'}
                </button>
                <button type="button">86 bình luận</button>
              </div>
            </article>
            <div className="home-indicator" />
          </div>
          <div className="floating-note note-top"><strong>Không quảng cáo.</strong><span>Chỉ điều bạn quan tâm.</span></div>
          <div className="floating-note note-bottom"><span className="pulse" /><strong>Đang có 428 cuộc trò chuyện</strong></div>
        </div>
      </section>

      <section className="ticker" aria-label="Giá trị Orange">
        <div>
          <span>Ít lướt hơn</span><b>✳</b><span>Sống nhiều hơn</span><b>✳</b><span>Kết nối thật hơn</span><b>✳</b><span>Ít lướt hơn</span><b>✳</b><span>Sống nhiều hơn</span>
        </div>
      </section>

      <section className="inside shell section" id="inside">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <p className="kicker">Bên trong Orange</p>
            <h2>Một mạng xã hội<br />biết <em>dừng đúng lúc.</em></h2>
          </div>
        </div>
        <div className="feature-layout">
          <div className="feature-image-wrap">
            <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=85" alt="Nhóm bạn đang vui vẻ trò chuyện cùng nhau" />
            <span>made for<br />real life</span>
          </div>
          <div className="feature-list">
            <article>
              <span>01</span>
              <div><h3>Bảng tin có điểm dừng</h3><p>Không cuộn vô tận. Orange nhắc bạn quay lại cuộc sống sau khi đã xem những điều đáng xem.</p></div>
            </article>
            <article>
              <span>02</span>
              <div><h3>Nhóm nhỏ, chuyện lớn</h3><p>Tạo vòng tròn riêng cho từng nhóm bạn. Chia sẻ tự nhiên mà không cần diễn trước đám đông.</p></div>
            </article>
            <article>
              <span>03</span>
              <div><h3>Không bán sự chú ý</h3><p>Không quảng cáo bám đuổi, không thuật toán gây nghiện. Dữ liệu và thời gian luôn thuộc về bạn.</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="values section" id="values">
        <div className="shell values-grid">
          <div className="values-copy">
            <p className="kicker">Tụi mình tin rằng</p>
            <h2>Mạng xã hội nên làm bạn thấy <em>gần nhau hơn,</em> không nhỏ bé hơn.</h2>
            <p>Vì thế Orange được thiết kế từ đầu với một câu hỏi: điều gì thực sự tốt cho con người?</p>
          </div>
          <div className="quote-card">
            <div className="quote-mark">“</div>
            <blockquote>Mình vào Orange để xem bạn bè đang sống thế nào — và rời đi với một cuộc hẹn cuối tuần.</blockquote>
            <div className="quote-person">
              <img src={people[2].avatar} alt="An Mai" />
              <div><strong>An Mai</strong><span>Thành viên thử nghiệm từ 2025</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="community shell section" id="community">
        <div className="community-copy">
          <span className="section-number">02</span>
          <p className="kicker">Cộng đồng đang lớn lên</p>
          <h2>Những người thú vị<br />đã có mặt.</h2>
          <p>Từ người làm gốm ở Hội An đến nhóm chạy bộ sáng Chủ nhật — Orange đang được tạo nên bởi những cộng đồng nhỏ nhưng đầy sức sống.</p>
          <a className="text-link" href="#join">Gia nhập cùng họ <span aria-hidden="true">→</span></a>
        </div>
        <div className="portrait-grid">
          <img className="portrait-tall" src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=85" alt="Nhóm bạn ngoài trời" />
          <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=85" alt="Thành viên Orange mỉm cười" />
          <div className="stat-tile"><strong>68</strong><span>thành phố<br />đã có Orange</span></div>
        </div>
      </section>

      <section className="join" id="join">
        <div className="join-shape shape-left" />
        <div className="join-shape shape-right" />
        <div className="join-content">
          <p className="kicker">Orange sắp chín</p>
          <h2>Gặp nhau<br /><em>trên Orange nhé?</em></h2>
          <p>Để lại email. Tụi mình sẽ gửi lời mời ngay khi Orange mở cửa tại thành phố của bạn.</p>
          {joined ? (
            <div className="success-message" role="status">Bạn đã có tên trong danh sách. Hẹn gặp trên Orange!</div>
          ) : (
            <form onSubmit={joinWaitlist}>
              <label className="sr-only" htmlFor="email">Email của bạn</label>
              <input id="email" name="email" type="email" inputMode="email" autoComplete="email" required placeholder="ban@email.com" value={email} readOnly={isSubmitting} onChange={(event) => setEmail(event.target.value)} />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi…' : 'Giữ chỗ'} {!isSubmitting && <span aria-hidden="true">→</span>}
              </button>
            </form>
          )}
          {submitError && <p className="form-error" role="alert">{submitError}</p>}
          <small>Không spam. Chỉ một lời mời thật ngon.</small>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-main">
          <div><Logo /><p>Mạng xã hội cho người thật.</p></div>
          <div className="footer-links">
            <div><span>Orange</span><a href="#inside">Về chúng tôi</a><a href="#community">Cộng đồng</a><a href="#join">Chờ Orange</a></div>
            <div><span>Theo dõi</span><a href="#top">Instagram</a><a href="#top">TikTok</a><a href="#top">Threads</a></div>
            <div><span>Thông tin</span><a href="#top">Quyền riêng tư</a><a href="#top">Điều khoản</a><a href="mailto:hello@orange.social">Liên hệ</a></div>
          </div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 Orange Social</span><span>Made with vitamin C in Việt Nam</span></div>
      </footer>
    </main>
  )
}

export default App
