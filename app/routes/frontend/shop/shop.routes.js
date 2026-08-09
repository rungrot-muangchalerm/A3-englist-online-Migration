const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/payment', (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/shop/payment.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
        title: 'วิธีการสั่งซื้อ | Shop',
    });
});

router.get('/policy-change-product', (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/shop/policy-change-product.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
        title: 'นโยบายการเปลี่ยนสินค้า | Shop',
    });
});

router.get('/product-1year', (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/shop/product-1year.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
        title: 'EOL 1 Year Course | Shop',
        script: '/assets/js/pages/shop/product-1year.js',
    });
});

router.get('/product-corporate', (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/shop/product-corporate.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
        title: 'EOL Corporate Package | Shop',
        script: '/assets/js/pages/shop/product-corporate.js',
    });
});

router.get('/product-eol-member-club', (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/shop/product-eol-member-club.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
        title: 'EOL Member Club | Shop',
    });
});

router.get('/product-eol-platform', (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/shop/product-eol-platform.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
        title: 'EOL Corporate Platform | Shop',
    });
});

router.get('/product-gepot', (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/shop/product-gepot.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
        title: 'GEPOT Card | Shop',
    });
});

router.get('/product-intelligence', (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/shop/product-intelligence.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
        title: 'EOL Intelligence Course | Shop',
    });
});

router.get('/product-personal', (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/shop/product-personal.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
        title: 'EOL Personal Package | Shop',
        script: '/assets/js/pages/shop/product-personal.js',
    });
});

router.get('/warranty', (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/shop/warranty.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/main.layout.ejs'),
        title: 'การรับประกันสินค้า | Shop',
    });
});

module.exports = router;
