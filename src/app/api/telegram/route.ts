import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    
    let order: any = null;
    let files: { fieldName: string; label: string; file: File }[] = [];

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken.includes('your_telegram_bot_token')) {
      console.warn('Telegram credentials not configured in environment variables.');
      return NextResponse.json({ 
        success: false, 
        message: 'Telegram credentials missing or not configured in environment' 
      }, { status: 200 });
    }

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const orderJson = formData.get('order') as string;
      if (orderJson) {
        order = JSON.parse(orderJson);
      }

      // Collect all uploaded verification document files and payment receipt
      const possibleFileKeys: { key: string; label: string }[] = [
        { key: 'cnicFront', label: '🪪 CNIC Front Side' },
        { key: 'cnicBack', label: '🪪 CNIC Back Side' },
        { key: 'utilityBill', label: '⚡ Paid Utility Bill' },
        { key: 'balanceProof', label: '🏦 Balance / Statement Proof' },
        { key: 'familyCnic', label: '👨‍👩‍👦 Family Member CNIC' },
        { key: 'paymentProof', label: '💳 Advance / Down Payment Receipt' },
      ];

      for (const item of possibleFileKeys) {
        const f = formData.get(item.key) as File | null;
        if (f && typeof f === 'object' && f.size > 0) {
          files.push({ fieldName: item.key, label: item.label, file: f });
        }
      }
    } else {
      const body = await request.json();
      order = body.order || body;
    }

    if (!order || !order.orderId) {
      return NextResponse.json({ success: false, message: 'No valid order data provided' }, { status: 400 });
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
      payment,
      documents
    } = order;

    // 1. Format Rich HTML Telegram Message with full order details
    let messageText = `👑 <b>INSTALMENT MOBILE LIMITED (IML)</b> 👑\n`;
    messageText += `🎉 <b>NEW OFFICIAL INSTALLMENT APPLICATION (#${orderId})</b>\n`;
    messageText += `🕒 <b>Submitted At:</b> ${createdAt || new Date().toLocaleString('en-PK')}\n`;
    messageText += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    messageText += `📱 <b>SELECTED DEVICE & PLAN:</b>\n`;
    messageText += ` ├ 🏷️ <b>Model:</b> ${model?.name || 'iPhone'}\n`;
    messageText += ` ├ 🛡️ <b>Variant:</b> ${model?.variantType || 'PTA Approved'}\n`;
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
    messageText += ` └ 💳 <b>Channel Choice:</b> ${(payment?.channel || customer?.paymentMethod || 'easypaisa').toUpperCase()}\n\n`;

    messageText += `💳 <b>PAYMENT DETAILS:</b>\n`;
    messageText += ` ├ 🏛️ <b>Channel:</b> ${(payment?.channel || 'easypaisa').toUpperCase()}\n`;
    messageText += ` ├ 🔢 <b>Sender Account:</b> <code>${payment?.senderAccount || 'N/A'}</code>\n`;
    messageText += ` ├ 🔖 <b>Transaction ID:</b> <code>${payment?.transactionId || 'N/A'}</code>\n`;
    messageText += ` └ 📸 <b>Payment Receipt:</b> ${files.some(f => f.fieldName === 'paymentProof') ? 'Attached Below' : (payment?.proofPreviewUrl ? 'Attached' : 'Pending Upload')}\n\n`;

    messageText += `📁 <b>ATTACHED VERIFICATION DOCUMENTS:</b>\n`;
    messageText += ` ├ 🪪 CNIC Front: ${documents?.cnicFrontName || (files.some(f => f.fieldName === 'cnicFront') ? 'Attached' : 'None')}\n`;
    messageText += ` ├ 🪪 CNIC Back: ${documents?.cnicBackName || (files.some(f => f.fieldName === 'cnicBack') ? 'Attached' : 'None')}\n`;
    messageText += ` ├ ⚡ Utility Bill: ${documents?.utilityBillName || (files.some(f => f.fieldName === 'utilityBill') ? 'Attached' : 'None')}\n`;
    messageText += ` ├ 🏦 Statement / Proof: ${documents?.balanceProofName || (files.some(f => f.fieldName === 'balanceProof') ? 'Attached' : 'None')}\n`;
    messageText += ` └ 👨‍👩‍👦 Family CNIC: ${documents?.familyCnicName || (files.some(f => f.fieldName === 'familyCnic') ? 'Attached' : 'N/A')}\n\n`;

    messageText += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    messageText += `⏳ <i>Status: Awaiting Verification & Dispatch</i>`;

    // 2. Send Primary Text Notification
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const textRes = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML'
      })
    });

    const textData = await textRes.json();
    let textMessageId = textData.ok ? textData.result.message_id : null;

    // 3. Send all uploaded images/documents to Telegram (sendPhoto or sendDocument)
    const uploadedImagesResults = [];
    for (const item of files) {
      try {
        const fileFormData = new FormData();
        fileFormData.append('chat_id', chatId);
        fileFormData.append('parse_mode', 'HTML');
        if (textMessageId) {
          fileFormData.append('reply_to_message_id', String(textMessageId));
        }

        const isImage = item.file.type.startsWith('image/');
        const caption = `${item.label} for Order <b>#${orderId}</b> (${customer?.fullName || 'Customer'})`;
        fileFormData.append('caption', caption);

        let endpoint = isImage ? 'sendPhoto' : 'sendDocument';
        fileFormData.append(isImage ? 'photo' : 'document', item.file, item.file.name);

        const uploadRes = await fetch(`https://api.telegram.org/bot${botToken}/${endpoint}`, {
          method: 'POST',
          body: fileFormData
        });

        const uploadData = await uploadRes.json();
        uploadedImagesResults.push({
          fieldName: item.fieldName,
          success: uploadData.ok,
          messageId: uploadData.ok ? uploadData.result.message_id : null
        });
      } catch (err: any) {
        console.error(`Error uploading ${item.fieldName} to Telegram:`, err);
        uploadedImagesResults.push({ fieldName: item.fieldName, success: false, error: err.message });
      }
    }

    return NextResponse.json({ 
      success: textData.ok, 
      textMessageId, 
      uploadedImagesCount: uploadedImagesResults.filter(r => r.success).length,
      uploadedImagesResults 
    });
  } catch (error: any) {
    console.error('Server Telegram route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
