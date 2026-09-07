import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, ArrowRight } from 'lucide-react';

const QUICK_REPLIES = [
  { label: 'Browse Listings', key: 'browse' },
  { label: 'Schedule a Tour', key: 'tour' },
  { label: 'Contact an Advisor', key: 'advisor' },
  { label: 'About Us', key: 'about' },
];

const BOT_RESPONSES = {
  browse: {
    text: "I'd be happy to help you explore our available residences. Click below to view our full collection of curated Washington DC properties.",
    link: { label: 'View All Residences', href: '/apartments' },
  },
  tour: {
    text: "Our advisors are available Monday–Saturday, 9am–6pm for in-person and virtual viewings. Click below to reach our contact team and schedule your preferred time.",
    link: { label: 'Schedule a Viewing', href: '/contact' },
  },
  advisor: {
    text: "You can reach our team directly at (202) 555-0180 or hello@rotexonerealty.com. We respond within one business day. Would you like to send us a message?",
    link: { label: 'Send a Message', href: '/contact' },
  },
  about: {
    text: "Rotex One Realty has served Washington DC's rental market for over 15 years with integrity, expertise, and a personal approach that sets us apart.",
    link: { label: 'Learn About Us', href: '/about' },
  },
};

const GREETING = {
  id: 'greeting',
  from: 'bot',
  text: "Hello! I'm your Rotex One Realty assistant. How can I help you today?",
  timestamp: new Date(),
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [inputVal, setInputVal] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now() + Math.random(), timestamp: new Date() }]);
  };

  const handleQuickReply = (key, label) => {
    setShowQuickReplies(false);
    addMessage({ from: 'user', text: label });
    setTimeout(() => {
      const response = BOT_RESPONSES[key];
      addMessage({ from: 'bot', text: response.text, link: response.link });
    }, 600);
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = inputVal.trim();
    if (!text) return;
    setInputVal('');
    setShowQuickReplies(false);
    addMessage({ from: 'user', text });
    setTimeout(() => {
      addMessage({
        from: 'bot',
        text: "Thank you for your message. An advisor will follow up shortly. You can also reach us directly at (202) 555-0180.",
        link: { label: 'Contact Our Team', href: '/contact' },
      });
    }, 800);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 2000,
          width: 360, maxWidth: 'calc(100vw - 32px)',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          border: '1px solid #E8EEE9',
          maxHeight: '520px',
          animation: 'chatSlideUp 0.25s ease forwards',
        }}>
          {/* Header */}
          <div style={{
            background: '#059669',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                  <path d="M8 32V18L20 10L32 18V32H25V24H15V32H8Z" fill="white" fillOpacity="0.95"/>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'white', lineHeight: 1 }}>Rotex Assistant</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, background: '#34D399', borderRadius: '50%', marginRight: '5px', verticalAlign: 'middle' }}></span>
                  Online now
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', opacity: 0.8, display: 'flex', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#F7FAF8' }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display: 'flex',
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                flexDirection: 'column',
                alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start',
                gap: '4px',
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: msg.from === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: msg.from === 'user' ? '#059669' : 'white',
                  color: msg.from === 'user' ? 'white' : '#0B1A12',
                  fontSize: '0.875rem',
                  lineHeight: 1.55,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  border: msg.from === 'bot' ? '1px solid #E8EEE9' : 'none',
                }}>
                  {msg.text}
                </div>
                {msg.link && (
                  <Link
                    to={msg.link.href}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '7px 14px',
                      background: '#D1FAE5',
                      border: '1px solid #059669',
                      borderRadius: '12px',
                      fontSize: '0.8125rem', fontWeight: 600,
                      color: '#047857',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                      marginTop: '2px',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#D1FAE5'; e.currentTarget.style.color = '#047857'; }}
                  >
                    {msg.link.label} <ArrowRight size={12} />
                  </Link>
                )}
                <div style={{ fontSize: '0.6875rem', color: '#9DB3A2', paddingLeft: msg.from === 'bot' ? '4px' : 0 }}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}

            {/* Quick Replies */}
            {showQuickReplies && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <div style={{ fontSize: '0.75rem', color: '#9DB3A2', fontWeight: 500 }}>Quick options:</div>
                {QUICK_REPLIES.map(qr => (
                  <button
                    key={qr.key}
                    onClick={() => handleQuickReply(qr.key, qr.label)}
                    style={{
                      padding: '9px 14px',
                      background: 'white',
                      border: '1.5px solid #D0DBD3',
                      borderRadius: '12px',
                      fontSize: '0.875rem', fontWeight: 500,
                      color: '#0B1A12',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#059669'; e.currentTarget.style.color = '#059669'; e.currentTarget.style.background = '#D1FAE5'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#D0DBD3'; e.currentTarget.style.color = '#0B1A12'; e.currentTarget.style.background = 'white'; }}
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{
            padding: '12px 16px',
            background: 'white',
            borderTop: '1px solid #E8EEE9',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                border: '1px solid #D0DBD3',
                borderRadius: '12px',
                padding: '9px 14px',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                color: '#0B1A12',
                outline: 'none',
                background: '#F7FAF8',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = '#059669'}
              onBlur={e => e.target.style.borderColor = '#D0DBD3'}
            />
            <button
              type="submit"
              style={{
                width: 38, height: 38,
                background: inputVal.trim() ? '#059669' : '#D0DBD3',
                border: 'none',
                borderRadius: '50%',
                color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: inputVal.trim() ? 'pointer' : 'default',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 2000,
          width: 56, height: 56,
          background: '#059669',
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(5,150,105,0.4)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(5,150,105,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 32px rgba(5,150,105,0.4)'; }}
        aria-label="Open chat assistant"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
