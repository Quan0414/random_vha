import { useState, useRef } from 'react';
import { DATABASE, CategoryData } from './data/options';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Wand2 } from 'lucide-react';

interface HistoryEntry {
  item: string;
  timestamp: number;
  category: string;
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryData>(DATABASE[0]);
  const [secretWish, setSecretWish] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showSecretInput, setShowSecretInput] = useState(false);
  
  // Streak system - Theo dõi số lần "lỡ" liên tiếp
  const [missStreak, setMissStreak] = useState(0);
  
  // History và Confirmed items
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [confirmedItem, setConfirmedItem] = useState<string | null>(null);

  // Animation ref
  const intervalRef = useRef<any>(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setResult(null);

    let counter = 0;
    const items = selectedCategory.items;
    
    // Hieu ung random gia tao
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      setResult(items[randomIndex]);
      counter++;
    }, 100);

    // Ket thuc random
    setTimeout(() => {
      clearInterval(intervalRef.current);
      
      // ===== HYBRID SUPER SMART ALGORITHM =====
      let finalChoice = '';
      
      if (secretWish.trim()) {
        // Kiểm tra xem nguyện vọng có trong danh sách không
        const wishLower = secretWish.trim().toLowerCase();
        const matchedItem = items.find(item => 
          item.toLowerCase().includes(wishLower) || 
          wishLower.includes(item.toLowerCase())
        );
        
        if (matchedItem) {
          // === Tính Score từ nhiều yếu tố ===
          
          // 1. Base Rate (35%) - Giảm xuống để không quá dễ
          let successRate = 0.35;
          
          // 2. Streak Bonus (0-20%)
          const streakBonus = Math.min(missStreak * 0.08, 0.20);
          successRate += streakBonus;
          
          // 3. Time of Day Bonus (0-10%)
          const hour = new Date().getHours();
          let timeBonus = 0;
          if (hour >= 6 && hour < 12) timeBonus = 0.03; // Sáng: +3%
          else if (hour >= 12 && hour < 17) timeBonus = 0.06; // Chiều: +6%
          else if (hour >= 17 && hour < 24) timeBonus = 0.10; // Tối: +10%
          successRate += timeBonus;
          
          // 4. Frequency Bonus (0-8%) - Món được chọn nhiều gần đây
          const recentHistory = history.filter(h => 
            h.category === selectedCategory.id && 
            Date.now() - h.timestamp < 7 * 24 * 60 * 60 * 1000 // 7 ngày
          );
          const itemFrequency = recentHistory.filter(h => 
            h.item.toLowerCase() === matchedItem.toLowerCase()
          ).length;
          const frequencyBonus = Math.min(itemFrequency * 0.02, 0.08);
          successRate += frequencyBonus;
          
          // 5. Random Noise (-8% to +8%) - Tạo sự bất ngờ lớn hơn
          const noise = (Math.random() - 0.5) * 0.16;
          successRate += noise;
          
          // 6. Psychological Twist - Lần 4 đột nhiên giảm xuống
          if (missStreak === 3) {
            successRate = 0.25; // Drama!
          }
          
          // 7. Cap giới hạn (tối đa 75%, tối thiểu 15%)
          successRate = Math.max(0.15, Math.min(0.75, successRate));
          
          // === Roll the dice ===
          const luck = Math.random();
          if (luck < successRate) {
            finalChoice = matchedItem; // Trúng!
            setMissStreak(0);
          } else {
            // "Lỡ mất" - random item khác
            const otherItems = items.filter(item => item !== matchedItem);
            finalChoice = otherItems[Math.floor(Math.random() * otherItems.length)];
            setMissStreak(prev => prev + 1);
          }
        } else {
          // Không có trong list: Cũng random với xác suất 60%
          const customWishRate = 0.60;
          const luck = Math.random();
          
          if (luck < customWishRate) {
            finalChoice = secretWish.trim(); // Lấy nguyện vọng tự do
            setMissStreak(0);
          } else {
            // Random món khác trong list
            finalChoice = items[Math.floor(Math.random() * items.length)];
            setMissStreak(prev => prev + 1);
          }
        }
      } else {
        // Không có nguyện vọng: Weighted Random dựa trên lịch sử
        const recentHistory = history.filter(h => 
          h.category === selectedCategory.id &&
          Date.now() - h.timestamp < 14 * 24 * 60 * 60 * 1000 // 14 ngày
        );
        
        // Tạo weight map
        const weights = new Map<string, number>();
        items.forEach(item => weights.set(item, 1)); // Base weight
        
        // Giảm weight cho món đã ăn gần đây
        recentHistory.forEach(h => {
          const currentWeight = weights.get(h.item) || 1;
          weights.set(h.item, Math.max(0.3, currentWeight - 0.15));
        });
        
        // Weighted random selection
        const totalWeight = Array.from(weights.values()).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;
        
        for (const [item, weight] of weights.entries()) {
          random -= weight;
          if (random <= 0) {
            finalChoice = item;
            break;
          }
        }
        
        if (!finalChoice) finalChoice = items[0]; // Fallback
        setMissStreak(0);
      }
      
      // Lưu vào history
      setHistory(prev => [...prev, {
        item: finalChoice,
        timestamp: Date.now(),
        category: selectedCategory.id
      }]);

      setResult(finalChoice);
      setIsSpinning(false);
      setConfirmedItem(null); // Reset confirmed khi random mới
      
      // Ban phao hoa chuc mung
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
    }, 2000); // Quay trong 2 giay
  };

  const handleConfirm = () => {
    if (result) {
      setConfirmedItem(result);
      // Có thể lưu vào localStorage nếu muốn persistent
      localStorage.setItem('lastConfirmed', JSON.stringify({
        item: result,
        timestamp: Date.now(),
        category: selectedCategory.id
      }));
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <h1 className="header-title">
        <Sparkles className="icon-heart" size={32} />
        Bạn muốn gì hôm nay?
        <Sparkles className="icon-heart" size={32} />
      </h1>
      <p className="header-subtitle">
        "Để vũ trụ chọn giúp bạn, đảm bảo đúng ý!"
      </p>

      {/* Category Tabs */}
      <div className="tabs-container">
        {DATABASE.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat);
              setResult(null);
              setSecretWish('');
            }}
            className={`tab-button ${selectedCategory.id === cat.id ? 'tab-active' : 'tab-inactive'}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div className="card">
        
        {/* Secret Toggle (Hidden in plain sight) */}
        <div className="secret-toggle">
          <button 
            onClick={() => setShowSecretInput(!showSecretInput)}
            className="secret-toggle-btn"
          >
            <Sparkles size={16} />
          </button>
        </div>

        {/* Input Area */}
        <div className="input-area">
           {/* Public Text */}
           <div className="info-box">
              <p>Danh sách trong kho: <span className="info-highlight">{selectedCategory.items.length} lựa chọn</span></p>
              <p className="info-note">(Thuật toán thông minh tự động phân tích)</p>
           </div>

           {/* The "Secret" Wish Input */}
           <div className={`secret-input-container ${showSecretInput ? 'visible' : 'hidden'}`}>
              <label className="input-label">
                Lựa chọn ưu tiên (Vũ trụ sẽ tôn trọng):
              </label>
              <input
                type="text"
                value={secretWish}
                onChange={(e) => setSecretWish(e.target.value)}
                placeholder="Ví dụ: Phở bò..."
                className="text-input"
              />
           </div>
           
           {/* Fallback trigger if logic hidden */}
           {!showSecretInput && (
             <button 
              onClick={() => setShowSecretInput(true)}
              className="fallback-btn"
             >
               + Thêm trọng số tâm linh
             </button>
           )}
        </div>

        {/* The Result Display */}
        <div className="result-display">
          {result ? (
            <span className={`result-text ${isSpinning ? 'blur' : 'animate'}`}>
              {result}
            </span>
          ) : (
            <span className="result-placeholder">?</span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: result && !confirmedItem ? '12px' : '0' }}>
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`action-btn ${isSpinning ? 'disabled' : 'primary'}`}
            style={{ flex: 1 }}
          >
            {isSpinning ? (
              <>Đang kết nối vũ trụ...</>
            ) : (
              <>
                <Wand2 size={24} />
                RANDOM!
              </>
            )}
          </button>
        </div>
        
        {/* Confirm Button - Chỉ hiện khi có kết quả */}
        {result && !confirmedItem && !isSpinning && (
          <button
            onClick={handleConfirm}
            className="action-btn"
            style={{
              background: 'linear-gradient(to right, #10b981, #059669)',
              marginTop: '0'
            }}
          >
            <Heart size={20} />
            CHỐT ĐƠN: {result}
          </button>
        )}
        
        {/* Confirmed State */}
        {confirmedItem && (
          <div style={{
            marginTop: '12px',
            padding: '16px',
            background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
            borderRadius: '12px',
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#065f46'
          }}>
            ✅ Đã chốt: {confirmedItem}
          </div>
        )}

      </div>

      <footer className="footer">
        Made with ❤️<br/>
        (Powered by "Smart Choice Algorithm" v2.0)
      </footer>
    </div>
  )
}

export default App
