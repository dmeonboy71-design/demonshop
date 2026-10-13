import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = body.order || body;

    if (!order || !order.orderId) {
      return NextResponse.json({ success: false, message: 'No valid order data provided' }, { status: 400 });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken.includes('your_telegram_bot_token')) {
      return NextResponse.json({ success: false, message: 'Telegram credentials not configured' }, { status: 200 });
    }

    const { 
      orderId, 
      createdAt, 
      model, 
      color, 
      storage, 
      months, 
      monthlyEmi, 
      totalPrice, 
      downPayment,
      balance,
      customer, 
      payment 
    } = order;

    let messageText = `👑 <b>INSTALMENT MOBILE LIMITED (IML)</b> 👑\n`;
    messageText += `🎉 <b>NEW OFFICIAL INSTALLMENT APPLICATION (#${orderId})</b>\n`;
    messageText += `🕒 <b>Submitted At:</b> ${createdAt}\n`;
    messageText += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    messageText += `📱 <b>SELECTED DEVICE & PLAN:</b>\n`;
    messageText += ` ├ 🏷️ <b>Model:</b> ${model?.name || 'iPhone'}\n`;
    messageText += ` ├ 🎨 <b>Color:</b> ${color?.name || 'Standard'}\n`;
    messageText += ` ├ 💾 <b>Storage:</b> ${storage?.size || 'Standard'}\n`;
    messageText += ` ├ 💵 <b>Total Price:</b> PKR ${(totalPrice || 0).toLocaleString('en-PK')}\n`;
    messageText += ` ├ 💳 <b>Down Payment:</b> PKR ${(downPayment || 0).toLocaleString('en-PK')}\n`;
    messageText += ` ├ ⚖️ <b>Remaining Balance:</b> PKR ${(balance || 0).toLocaleString('en-PK')}\n`;
    messageText += ` └ 📅 <b>Monthly EMI:</b> ${months || 12} Months @ PKR ${(monthlyEmi || 0).toLocaleString('en-PK')}/mo\n\n`;

    messageText += `👤 <b>CUSTOMER DETAILS:</b>\n`;
    messageText += ` ├ 📛 <b>Full Name:</b> ${customer?.fullName || 'N/A'}\n`;
    messageText += ` ├ 🪪 <b>CNIC:</b> <code>${customer?.cnic || 'N/A'}</code>\n`;
    messageText += ` ├ 📞 <b>Phone Number:</b> <code>${customer?.mobileNumber || 'N/A'}</code>\n`;
    messageText += ` ├ 🏠 <b>Delivery Address:</b> ${customer?.deliveryAddress || 'N/A'}\n`;
    messageText += ` ├ 🚚 <b>Delivery Type:</b> ${customer?.deliveryType === 'open_parcel' ? '🔍 Open Parcel TCS Inspection' : '📦 Insured Sealed'}\n`;
    messageText += ` └ 💳 <b>Channel:</b> ${(payment?.channel || customer?.paymentMethod || 'easypaisa').toUpperCase()}\n\n`;

    messageText += `💳 <b>PAYMENT DETAILS:</b>\n`;
    messageText += ` ├ 🏛️ <b>Channel:</b> ${(payment?.channel || 'easypaisa').toUpperCase()}\n`;
    messageText += ` ├ 🔢 <b>Sender Account:</b> <code>${payment?.senderAccount || 'N/A'}</code>\n`;
    messageText += ` ├ 🔖 <b>Transaction ID:</b> <code>${payment?.transactionId || 'N/A'}</code>\n`;
    messageText += ` └ 📸 <b>Payment Proof:</b> ${payment?.proofPreviewUrl ? 'Attached' : 'Pending'}\n\n`;

    messageText += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    messageText += `✅ <i>Status: Awaiting Verification & Dispatch</i>`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    return NextResponse.json({ success: data.ok, result: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
