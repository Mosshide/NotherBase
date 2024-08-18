import NotherBaseFS from "notherbase-fs";
import nkjvBible from "./globals/NKJV.js";
import { fileURLToPath } from "url";

const notherBaseFS = new NotherBaseFS({ nkjvBible }, {
    notherbase: {
        title: 'NotherBase',
        directory: fileURLToPath(new URL('./world', import.meta.url)),
        icon: '/public/img/the-front/logo.png'
    },
    pebblewireless: {
        title: 'Pebble Wireless',
        directory: fileURLToPath(new URL('./pebblebase', import.meta.url)),
        icon: '/public/img/drum.png'
    },
    loveincoflewiscounty: {
        title: 'Love INC of Lewis County',
        directory: fileURLToPath(new URL('./loveinclcbase', import.meta.url)),
        icon: '/public/img/favicon.ico'
    }
});