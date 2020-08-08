const webPush = require('web-push');

const vapidKeys = {
    "publicKey": "BM_Six9s8cIKoAPNsWZcNoqXBKF4GzdDpgFiHhqHC_8kXgtdvjVzVJLUNHTXHBEiO-Fw_q1ww30TR4Hjr6P-294",
    "privateKey": "B7BZH6Nfn2rApuYgH2sGix3-6E_W1UBEQw4p_keCeEY"
};

webPush.setVapidDetails(
    'mailto:dewapalguna900@gmail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
)

const pushSubscription = {
    "endpoint": "https://fcm.googleapis.com/fcm/send/crUEheHDI_U:APA91bFWrZlkQGxSsynR24SI7EiOcNwryVrAolflss-EzTW7-SSLnfxWP78h_a_FWDRX6glmE5mZi_5-LM6fa-P0fGcWHIAHvRMu1BVviJJQQ8X_5nCLu27FvoXRPzF8fBB7nilRbSCy",
    "keys": {
        "p256dh": "BM0YJjUZysuY9lEH0z+3AuJC50gYAfQ6FDNtjywbC63HRga5p2fwTnAETwctZAMnhsjvE/sTeu5DeYEsCFoPt+E=",
        "auth": "NfTJOlicWeYwgsLS9jeMmA=="
    }
};
const payload = "Selamat!\nAplikasi Anda sudah dapat menerima push notifikasi!";

const options = {
    gcmAPIKey: '67031578492',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);