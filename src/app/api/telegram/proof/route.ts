import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const customerName = formData.get('customerName') as string || 'Customer';
    const mobileNumber = formData.get('mobileNumber') as string || 'N/A';
    const walletType = formData.get('walletType') as string || 'Wallet';
    const walletAccountName = formData.get('walletAccountName') as string || 'N/A';

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken.includes('your_telegram_bot_token')) {
      return NextResponse.json({ success: false, message: 'Telegram credentials missing' }, { status: 200 });
    }

    if (!file) {
      return NextResponse.json({ success: false, message: 'No proof file provided' }, { status: 400 });
    }

    const caption = `
📸 <b>ATTACHED PAYMENT PROOF SCREENSHOT</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
 ├ 👤 <b>Customer Name:</b> ${customerName}
 ├ 📞 <b>Phone Number:</b> <code>${mobileNumber}</code>
 ├ 📲 <b>Wallet Service:</b> ${walletType.toUpperCase()}
 ├ 📝 <b>Account Title:</b> ${walletAccountName}
 └ ⏰ <b>Uploaded At:</b> ${new Date().toLocaleTimeString('en-PK')}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 <i>Alfa Mobiles Payment Verification Engine</i>
    `.trim();

    // Prepare FormData for Telegram sendPhoto API
    const telegramFormData = new FormData();
    telegramFormData.append('chat_id', chatId);
    telegramFormData.append('photo', file);
    telegramFormData.append('caption', caption);
    telegramFormData.append('parse_mode', 'HTML');

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

    const res = await fetch(telegramUrl, {
      method: 'POST',
      body: telegramFormData
    });

    const data = await res.json();

    if (!data.ok) {
      console.error('Telegram sendPhoto error:', data);
      return NextResponse.json({ success: false, error: data.description }, { status: 500 });
    }

    return NextResponse.json({ success: true, photoMessageId: data.result.message_id });
  } catch (error: any) {
    console.error('Proof photo error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
