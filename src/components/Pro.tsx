import React, { useState, useEffect } from "react";
import { UserProfile, ChatMessage } from "../types";

interface ProProps {
  userProfile: UserProfile;
  onChangeProfile: (updated: Partial<UserProfile>) => void;
}

export default function Pro({ userProfile, onChangeProfile }: ProProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-1",
      sender: "coach",
      content: "Welcome to your Pulse Pro AI Coaching Vault! What sort of performance goals are we aiming for today? Run pacing, hybrid strength, or custom dynamic routines?",
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Checkout Interactive Experience States
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0); // integer percent
  const [couponMsg, setCouponMsg] = useState("");
  const [couponError, setCouponError] = useState("");
  
  const [checkoutStatus, setCheckoutStatus] = useState<"form" | "processing" | "success">("form");
  const [processingStep, setProcessingStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const originalPrice = 9.99;
  const currentPrice = originalPrice * (1 - couponDiscount / 100);

  // Chat message submission
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    if (!customPrompt) setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMsgs.map((m) => ({ role: m.sender === "user" ? "user" : "model", content: m.content })),
          userProfile,
        }),
      });

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: "coach",
          content: data.text || "Keep standard targets active! You are doing solid.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `reply-err-${Date.now()}`,
          sender: "coach",
          content: "Pulse Coach is syncing with satellite trackers right now. Keep your hydration peak and let's run!",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Generate custom run routine",
    "How do I improve my avg run pace?",
    "Build quick 20-min gym circuit",
    "Nutrition advice for recovery",
  ];

  // Auto-formatting Card Number: XXXX XXXX XXXX XXXX
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces every 4 characters
    const formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }));
    }
  };

  // Auto-formatting Expiration: MM/YY
  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
    if (errors.cardExpiry) {
      setErrors((prev) => ({ ...prev, cardExpiry: "" }));
    }
  };

  // Safe formatting CVC: max 4 digits
  const handleCardCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardCvc(value);
    if (errors.cardCvc) {
      setErrors((prev) => ({ ...prev, cardCvc: "" }));
    }
  };

  // Apply discount coupon code
  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponMsg("");
    const cleaned = couponCode.trim().toUpperCase();

    if (!cleaned) return;

    if (cleaned === "PULSEFREE" || cleaned === "FREE") {
      setCouponApplied(true);
      setCouponDiscount(100);
      setCouponMsg("Promo FREE applied: lifetime access is 100% complimentary!");
    } else if (cleaned === "PULSE50" || cleaned === "HALF") {
      setCouponApplied(true);
      setCouponDiscount(50);
      setCouponMsg("Promo PULSE50 applied: 50% discount locked!");
    } else if (cleaned === "COACH30") {
      setCouponApplied(true);
      setCouponDiscount(30);
      setCouponMsg("Promo COACH30 applied: 30% discount locked!");
    } else {
      setCouponError("Invalid or expired coupon code.");
      setCouponApplied(false);
      setCouponDiscount(0);
    }
  };

  // Simulate payment processing
  const handleInitiatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate if Credit Card method and price > 0
    if (paymentMethod === "card" && currentPrice > 0) {
      const validationErrors: { [key: string]: string } = {};
      
      const cleanCard = cardNumber.replace(/\s+/g, "");
      if (cleanCard.length !== 16) {
        validationErrors.cardNumber = "Card must be exactly 16 digits";
      }
      
      if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        validationErrors.cardExpiry = "Expiry must be MM/YY";
      } else {
        const [month, year] = cardExpiry.split("/").map(Number);
        if (month < 1 || month > 12) {
          validationErrors.cardExpiry = "Invalid month";
        }
      }

      if (cardCvc.length < 3) {
        validationErrors.cardCvc = "CVC must be 3 or 4 digits";
      }

      if (!cardName.trim()) {
        validationErrors.cardName = "Cardholder name is required";
      }

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    // Trigger processing console
    setCheckoutStatus("processing");
    setProcessingStep(0);
  };

  // Effect handles timer states for simulation of transaction processing stages
  useEffect(() => {
    if (checkoutStatus !== "processing") return;

    const interval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev >= 4) {
          clearInterval(interval);
          // Provision in profile
          onChangeProfile({ isPro: true });
          setCheckoutStatus("success");
          return 4;
        }
        return prev + 1;
      });
    }, 850);

    return () => clearInterval(interval);
  }, [checkoutStatus]);

  // Detected Bank Card Typology for visual card view
  const getCardBrand = () => {
    const rawNum = cardNumber.replace(/\D/g, "");
    if (rawNum.startsWith("4")) return { name: "Visa", color: "from-blue-750 to-indigo-850", icon: "credit_card" };
    if (rawNum.startsWith("5")) return { name: "Mastercard", color: "from-amber-700 to-red-800", icon: "credit_card" };
    if (rawNum.startsWith("3")) return { name: "Amex", color: "from-cyan-800 to-teal-900", icon: "contactless" };
    return { name: "Pulse Debit", color: "from-slate-800 to-slate-910", icon: "workspace_premium" };
  };

  const cardBrand = getCardBrand();

  // STAGE A: IF NOT PRO AND IN CHECKOUT FLOW
  if (!userProfile.isPro && showCheckout) {
    return (
      <div className="flex flex-col gap-5 animate-fade-in relative max-w-md mx-auto w-full pb-8 z-10 text-left">
        {/* Navigation back helper */}
        <button 
          onClick={() => {
            setShowCheckout(false);
            setCheckoutStatus("form");
            setProcessingStep(0);
          }}
          className="self-start flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-mono font-bold uppercase tracking-widest cursor-pointer active:scale-95 duration-100 mb-1"
        >
          <span className="material-symbols-outlined text-[15px]">arrow_back</span>
          Back to pricing
        </button>

        {/* 1. TRANSACTION FILLING FORM STAGE */}
        {checkoutStatus === "form" && (
          <form onSubmit={handleInitiatePayment} className="flex flex-col gap-5">
            {/* Header info */}
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Complete Upgrade</h2>
              <p className="text-xs text-slate-400">Activate Lifetime Pulse Pro Access</p>
            </div>

            {/* Price invoice block */}
            <div className="glass rounded-2xl p-4 flex flex-col gap-2 border border-white/5 bg-white/3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Pulse Pro Lifetime License</span>
                <span className="text-slate-200 line-through font-mono font-medium">${originalPrice}</span>
              </div>
              
              {couponApplied && (
                <div className="flex justify-between items-center text-xs text-emerald-400">
                  <span>Coupon discount applied ({couponDiscount}%)</span>
                  <span className="font-mono font-medium">-${(originalPrice * couponDiscount / 100).toFixed(2)}</span>
                </div>
              )}

              <div className="h-[1px] bg-white/10 my-1"></div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">Total Charge</span>
                <span className="text-2xl font-black text-blue-400 font-sans tracking-tight">
                  ${currentPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo coupon input widget */}
            <div className="glass border border-white/5 rounded-2xl p-3 flex flex-col gap-2">
              <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-wider">
                Have a promo code? (Try "PULSEFREE" or "PULSE50")
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. PULSEFREE"
                  className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white uppercase font-mono tracking-wider placeholder:text-slate-600 outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-slate-800 hover:bg-slate-700 text-xs text-white font-bold px-4 py-2 rounded-xl border border-white/5 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className="text-[10px] text-emerald-400 font-medium leading-tight flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[12px]">done</span>
                  {couponMsg}
                </p>
              )}
              {couponError && (
                <p className="text-[10px] text-pink-400 font-medium leading-tight flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[12px]">warning</span>
                  {couponError}
                </p>
              )}
            </div>

            {/* Pay methods tabs */}
            {currentPrice > 0 && (
              <div className="flex gap-2 bg-slate-900/80 p-1 border border-white/5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-mono text-[10px] uppercase font-bold transition-all cursor-pointer ${
                    paymentMethod === "card"
                      ? "bg-blue-500 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">credit_card</span>
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("paypal");
                    setErrors({});
                  }}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-mono text-[10px] uppercase font-bold transition-all cursor-pointer ${
                    paymentMethod === "paypal"
                      ? "bg-amber-500 text-white shadow-lg"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
                  PayPal / GPay
                </button>
              </div>
            )}

            {/* Payment fields conditional layout */}
            {currentPrice === 0 ? (
              <div className="glass border border-emerald-500/25 bg-emerald-500/5 rounded-3xl p-5 text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-3xl animate-bounce">
                  workspace_premium
                </span>
                <span className="text-xs font-bold text-white uppercase">Complimentary Access Active</span>
                <p className="text-[11px] text-slate-400 max-w-[245px]">
                  Hit complete down below to activate your Pulse Pro subscription instantly without entering payment credentials.
                </p>
              </div>
            ) : paymentMethod === "card" ? (
              <div className="flex flex-col gap-4">
                {/* Visual Debit Card preview element */}
                <div className={`w-full rounded-2xl p-4 bg-gradient-to-br ${cardBrand.color} text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-40 border border-white/10 transition-all duration-500`}>
                  {/* Decorative background grid vector lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex flex-col text-left">
                      <span className="text-[8px] font-mono tracking-widest uppercase opacity-75">Pulse Performance Suite</span>
                      <span className="text-[10px] font-bold tracking-tight uppercase gold">Pro License</span>
                    </div>
                    <span className="material-symbols-outlined text-white text-xl">{cardBrand.icon}</span>
                  </div>

                  {/* Micro chip gold ornament */}
                  <div className="w-8 h-6 rounded-md bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 opacity-80 border border-yellow-200/50 flex-shrink-0 relative z-10 shadow-md">
                    <div className="absolute inset-x-0.5 top-2.5 h-[1px] bg-slate-950/20" />
                    <div className="absolute inset-x-2 top-0.5 bottom-0.5 w-[1px] bg-slate-950/20" />
                  </div>

                  {/* Card number representation */}
                  <div className="text-lg font-mono tracking-[0.16em] text-white relative z-10 select-all font-semibold my-1 text-center">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>

                  <div className="flex justify-between items-end relative z-10">
                    <div className="flex flex-col text-left">
                      <span className="text-[7px] font-mono uppercase opacity-60">Cardholder</span>
                      <span className="text-xs font-bold tracking-wide uppercase font-mono max-w-[170px] truncate">
                        {cardName || "ALEX RIVERA"}
                      </span>
                    </div>
                    
                    <div className="flex items-end gap-3 font-mono">
                      <div className="flex flex-col items-center">
                        <span className="text-[7px] uppercase opacity-60 leading-none">Expires</span>
                        <span className="text-[10px] font-bold">{cardExpiry || "MM/YY"}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[7px] uppercase opacity-60 leading-none">CVC</span>
                        <span className="text-[10px] font-bold">{cardCvc || "•••"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Input Fields details grid */}
                <div className="glass border border-white/5 bg-white/3 rounded-3xl p-4 flex flex-col gap-3">
                  {/* Cardholder name input */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value);
                        if (errors.cardName) {
                          setErrors((prev) => ({ ...prev, cardName: "" }));
                        }
                      }}
                      placeholder="e.g. Alex Rivera"
                      className={`glass border rounded-xl text-white text-xs px-3 py-2 outline-none focus:border-blue-500 ${
                        errors.cardName ? "border-pink-500" : "border-white/10"
                      }`}
                    />
                    {errors.cardName && <span className="text-[9px] text-pink-400 font-mono mt-0.5">{errors.cardName}</span>}
                  </div>

                  {/* Card Number input */}
                  <div className="flex flex-col gap-1 text-left">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4111 2222 3333 4444"
                        className={`w-full glass border rounded-xl text-white text-xs pl-3 pr-8 py-2 font-mono outline-none focus:border-blue-500 ${
                          errors.cardNumber ? "border-pink-500" : "border-white/10"
                        }`}
                      />
                      <span className="absolute right-3 top-2.5 font-mono text-[9px] text-slate-500 font-bold uppercase">
                        {cardBrand.name}
                      </span>
                    </div>
                    {errors.cardNumber && <span className="text-[9px] text-pink-400 font-mono mt-0.5">{errors.cardNumber}</span>}
                  </div>

                  {/* Expiration + CVC row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleCardExpiryChange}
                        placeholder="MM/YY"
                        className={`glass border rounded-xl text-white text-xs px-3 py-2 font-mono outline-none focus:border-blue-500 ${
                          errors.cardExpiry ? "border-pink-500" : "border-white/10"
                        }`}
                      />
                      {errors.cardExpiry && <span className="text-[9px] text-pink-400 font-mono mt-0.5">{errors.cardExpiry}</span>}
                    </div>

                    <div className="flex flex-col gap-1 text-left">
                      <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                        Security Code (CVC)
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={handleCardCvcChange}
                        placeholder="123"
                        className={`glass border rounded-xl text-white text-xs px-3 py-2 font-mono outline-none focus:border-blue-500 ${
                          errors.cardCvc ? "border-pink-500" : "border-white/10"
                        }`}
                      />
                      {errors.cardCvc && <span className="text-[9px] text-pink-400 font-mono mt-0.5">{errors.cardCvc}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Express payment display details */
              <div className="glass border border-white/5 bg-slate-900/50 rounded-3xl p-5 text-center flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500">
                  <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                </div>
                <div className="flex flex-col gap-1.5 align-center max-w-[260px]">
                  <span className="text-xs font-bold text-white uppercase">Instant Wallet Token Provision</span>
                  <p className="text-[11px] text-slate-400">
                    Your active Google Pay or PayPal account details will be secure-polled from your sandboxed sandbox keychain when completing activation.
                  </p>
                </div>
              </div>
            )}

            {/* Core trigger purchase submit */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-4 rounded-3xl shadow-[0_4px_15px_rgba(59,130,246,0.25)] active:scale-[0.98] transition-all text-sm uppercase cursor-pointer text-center mt-1 outline-none border border-blue-400/10"
              id="btn-complete-billing-payment"
            >
              PAY ${currentPrice.toFixed(2)} & LOCK IN PRO LITE
            </button>
          </form>
        )}

        {/* 2. LIVE SIMULATION TERMINAL SECURE TRANSACTION STAGE */}
        {checkoutStatus === "processing" && (
          <div className="glass border border-white/5 rounded-3xl p-6 flex flex-col gap-5 text-center items-center my-6">
            <div className="relative w-16 h-16 mb-2">
              <div className="absolute inset-0 border-4 border-blue-550/10 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-blue-400 text-2xl">
                key
              </span>
            </div>

            <div className="flex flex-col gap-1 text-center">
              <h3 className="text-sm font-bold text-white">Authorizing Sandbox Transaction</h3>
              <p className="text-xs text-slate-400 font-mono font-medium">Processing payment details live...</p>
            </div>

            {/* Simulated Live Action Terminal Board */}
            <div className="w-full bg-[#05070f] rounded-2xl p-4 border border-white/5 text-left font-mono text-[10px] text-green-400 leading-relaxed min-h-[140px] flex flex-col gap-1.5 shadow-inner">
              <span className="text-white/30 text-[8px] font-bold block pb-1 border-b border-white/5 uppercase tracking-wider">
                Console Sandbox Log Feed
              </span>
              <div className={`transition-opacity duration-300 ${processingStep >= 0 ? "opacity-100" : "opacity-0"}`}>
                <span className="text-blue-400">⚡ CLIENT:</span> Secure SSL handshake connected.
              </div>
              <div className={`transition-opacity duration-200 ${processingStep >= 1 ? "opacity-100" : "opacity-0"}`}>
                <span className="text-purple-400">🔒 SECURE:</span> Encrypting payload metadata...
              </div>
              <div className={`transition-opacity duration-200 ${processingStep >= 2 ? "opacity-100" : "opacity-0"}`}>
                <span className="text-amber-400">💳 NETW:</span> Querying certified endpoint authorize...
              </div>
              <div className={`transition-opacity duration-200 ${processingStep >= 3 ? "opacity-100" : "opacity-0"}`}>
                <span className="text-emerald-400">💰 LEDG:</span> Committing capture logs. Auth code 200.
              </div>
              <div className={`transition-opacity duration-200 ${processingStep >= 4 ? "opacity-100" : "opacity-0"}`}>
                <span className="text-emerald-400 font-bold">🎉 ALLS:</span> Subscription active! Sync complete.
              </div>
            </div>
          </div>
        )}

        {/* 3. TRANSACTION COGNITIVE SUCCESS CONGRATULATE SCREEN */}
        {checkoutStatus === "success" && (
          <div className="glass border border-emerald-500/25 bg-emerald-500/5 rounded-3xl p-6 flex flex-col items-center gap-5 text-center my-4 animate-fade-in shadow-xl">
            {/* Bounce check circle */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-400/30 text-emerald-400 relative">
              <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping" />
              <span className="material-symbols-outlined text-3xl font-bold">done</span>
            </div>

            <div className="flex flex-col gap-2 max-w-[280px]">
              <h3 className="text-lg font-black tracking-tight text-white uppercase font-sans">
                WELCOME TO PRO AT LAST
              </h3>
              <p className="text-xs text-slate-300">
                Hi <span className="text-emerald-400 font-bold">{userProfile.name}</span>, your subscription transfer succeeded! Lifetime membership unlocked.
              </p>
            </div>

            <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 font-mono text-[10px] text-slate-400 uppercase text-left">
              <div className="flex justify-between">
                <span>Plan Status</span>
                <span className="text-emerald-400 font-bold">ACTIVE FOREVER</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Core Method</span>
                <span>{paymentMethod === "card" && currentPrice > 0 ? "Credit Card ending " + cardNumber.slice(-4) : currentPrice === 0 ? "Complimentary Pass" : "GPay Wallet"}</span>
              </div>
              <div className="flex justify-between">
                <span>Account Tier</span>
                <span className="text-blue-400 font-bold">PULSE PREMIUM MEMBER</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowCheckout(false);
                setCheckoutStatus("form");
                setProcessingStep(0);
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer border border-emerald-400/20"
              id="btn-close-checkout-success"
            >
              LAUNCH AI COACH LAB NOW
            </button>
          </div>
        )}
      </div>
    );
  }

  // STAGE B: STANDARD PREDEPARTURE PAYWALL OVERVIEW (IF NOT PRO YET)
  if (!userProfile.isPro) {
    return (
      <div className="flex flex-col gap-6 animate-fade-in relative max-w-md mx-auto w-full pb-6 z-10">
        {/* Ambient Top Glow effect */}
        <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>

        {/* Hero layout */}
        <section className="text-center flex flex-col items-center gap-3 mt-4 relative z-10">
          <div className="inline-flex justify-center mb-2 relative animate-bounce duration-1000">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl scale-125"></div>
            <span className="material-symbols-outlined text-blue-400 text-5xl fill-current drop-shadow-[0_0_8px_rgba(59,130,246,0.50)]">
              workspace_premium
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Unlock Your Full Potential
          </h2>
          <p className="text-sm text-slate-400 max-w-[280px]">
            Elevate your performance with pro-tier tools designed for elite athletes.
          </p>
        </section>

        {/* Pricing Card */}
        <section className="glass rounded-3xl p-5 flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Shimmer vector shine effect */}
          <div className="absolute inset-x-0 top-0 h-full w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]" />
          <span className="font-mono text-[10px] font-bold tracking-widest text-slate-400 mb-2 uppercase">
            One-time Payment
          </span>
          <div className="text-4xl font-extrabold text-blue-400 tracking-tight relative drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]">
            $9.99
          </div>
          <div className="mt-3.5 w-[85%] h-[1px] bg-white/10"></div>
        </section>

        {/* Bento Features List */}
        <section className="grid grid-cols-1 gap-3 relative z-10">
          <div className="glass-card rounded-2xl p-4 flex items-start gap-4">
            <div className="glass p-2.5 rounded-xl text-blue-400">
              <span className="material-symbols-outlined text-[20px] fill-current">monitoring</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-0.5">Advanced Progress Analytics</h4>
              <p className="text-xs text-slate-400">Deep dive into biometrics and performance trends over time.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-start gap-4">
            <div className="glass p-2.5 rounded-xl text-blue-400">
              <span className="material-symbols-outlined text-[20px] fill-current">psychology</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-0.5">Custom AI-Powered Plans</h4>
              <p className="text-xs text-slate-400">Dynamic workouts that adapt to your daily recovery and goals.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-start gap-4">
            <div className="glass p-2.5 rounded-xl text-blue-400">
              <span className="material-symbols-outlined text-[20px] fill-current">block</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-0.5">No Ads. Ever.</h4>
              <p className="text-xs text-slate-400">Pure focus. Zero distractions during your training sessions.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 flex items-start gap-4">
            <div className="glass p-2.5 rounded-xl text-blue-400">
              <span className="material-symbols-outlined text-[20px] fill-current">workspace_premium</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-0.5">Exclusive Pro Badges</h4>
              <p className="text-xs text-slate-400">Unlock elite achievement markers to showcase your dedication.</p>
            </div>
          </div>
        </section>

        {/* Purchase core call to action */}
        <section className="flex flex-col items-center w-full gap-4 mt-2">
          <button
            onClick={() => setShowCheckout(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-4 rounded-3xl shadow-[0_4px_15px_rgba(59,130,246,0.35)] active:scale-[0.98] transition-all relative overflow-hidden text-base uppercase cursor-pointer"
            id="btn-buy-pro"
          >
            GET PULSE PRO
          </button>
          
          <button
            onClick={() => {
              onChangeProfile({ isPro: true });
            }}
            className="font-mono text-[10px] tracking-widest text-slate-400 hover:text-white underline underline-offset-4 decoration-white/10 uppercase cursor-pointer"
          >
            Restore Purchase
          </button>
        </section>
      </div>
    );
  }

  // STAGE C: IF USER IS ALREADY PRO: UNLOCK DYNAMIC AI COACH AND WORKOUT GENERATOR
  return (
    <div className="flex flex-col h-[calc(100vh-170px)] min-h-[500px] gap-4 animate-fade-in relative z-10 w-full text-left">
      {/* AI Pro Banner */}
      <div className="glass border border-blue-500/20 rounded-3xl p-4 flex items-center justify-between shadow-lg text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 glass rounded-full flex items-center justify-center text-blue-400 animate-pulse border border-blue-500/20">
            <span className="material-symbols-outlined text-lg">psychology</span>
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-extrabold text-white">Pulse AI Workout Lab</h4>
            <p className="text-[10px] font-mono font-bold text-blue-400 tracking-wide uppercase">
              PRO COACH ACTIVE
            </p>
          </div>
        </div>
        <button
          onClick={() => onChangeProfile({ isPro: false })}
          className="text-[10px] font-mono text-pink-400 border border-pink-400/20 hover:border-pink-400/50 py-1 px-2.5 rounded-xl cursor-pointer"
          id="btn-demote-pro"
        >
          Reset Subscription
        </button>
      </div>

      {/* Chat logs feed */}
      <div className="flex-1 glass rounded-3xl p-4 flex flex-col gap-3 overflow-y-auto no-scrollbar shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.sender === "user"
                ? "bg-blue-500 text-white font-medium ml-auto rounded-tr-none shadow-lg shadow-blue-500/10"
                : "glass text-slate-100 border border-white/5 rounded-tl-none text-left"
            }`}
          >
            <div className="whitespace-pre-line">{msg.content}</div>
            <div
              className={`text-[9px] mt-1.5 text-right font-mono ${
                msg.sender === "user" ? "text-white/80" : "text-slate-400"
              }`}
            >
              {msg.timestamp}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="glass text-slate-100 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2 max-w-[120px]">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
          </div>
        )}
      </div>

      {/* Dynamic quick-planner suggestions */}
      <div className="flex gap-2 overflow-x-auto pb-1 select-none scrollbar-none">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="flex-shrink-0 text-[11px] font-medium glass-card hover:bg-white/10 text-white py-1.5 px-3 rounded-full active:scale-95 transition-all cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* User input controller formulation */}
      <div className="glass border border-white/5 p-2 rounded-3xl flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          placeholder="Ask AI Coach for a workout plan..."
          className="flex-1 bg-transparent border-none text-white text-sm outline-none px-3 py-1 placeholder:text-slate-500 focus:ring-0"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="w-10 h-10 bg-blue-500 text-white hover:bg-blue-600 rounded-xl flex items-center justify-center active:scale-95 transition-all disabled:opacity-40 disabled:active:scale-100 cursor-pointer disabled:cursor-not-allowed"
          id="btn-send-message"
        >
          <span className="material-symbols-outlined text-lg font-bold">arrow_upward</span>
        </button>
      </div>
    </div>
  );
}
