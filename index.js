const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// قم بإنشاء وربط العميل في واجهة واتساب ويب
const client = new Client();

// توليد رمز QR وطباعته في الواجهة النصية
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
    console.log('برجاء مسح الرمز QR من خلال هاتفك لتسجيل الدخول.');
});

// حالة تسجيل الدخول التلقائي عند الانتهاء من المسح
client.on('authenticated', session => {
    console.log('تم تسجيل الدخول!');
    fs.writeFileSync('session.json', JSON.stringify(session));
});
  
// استعادة جلسة العميل إذا تم تسجيل الدخول سابقًا
if (fs.existsSync('session.json')) {
    const sessionData = require('./session.json');
    client.options.session = sessionData;
}

// قم بتشغيل العميل
client.initialize();

// إضافة فحص للرسائل الواردة والرد عليها تلقائيًا
client.on('message', async message => {
    if (message.body.toLowerCase() === 'مرحبًا') {
        await message.reply('أهلاً بك!');
    }
    // يمكنك إضافة مزيد من الشروط لمعالجة المزيد من الرسائل
});
