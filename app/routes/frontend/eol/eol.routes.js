const path = require('path');
const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../../../middleware/jwt.middleware');
const accountService = require('../../../service/eol/account.service');
const elearningService = require('../../../service/eol/elearning.service');
const eolTestMiddleware = require('../../../middleware/eol.test.middleware');

async function requireMaster(req, res, next) {
    try {
        const account = await accountService.resolveAccount(req.user.memberId);
        if (account.type !== 'master') {
            return res.redirect('/eol/eoltest');
        }
        req.account = account;
        return next();
    } catch (err) {
        return res.redirect('/eol/eoltest');
    }
}

async function requireMasterOrCorporate(req, res, next) {
    try {
        const account = await accountService.resolveAccount(req.user.memberId);
        if (account.type !== 'master' && !account.corporate) {
            return res.redirect('/eol/eoltest');
        }
        req.account = account;
        return next();
    } catch (err) {
        return res.redirect('/eol/eoltest');
    }
}

// Redirect old PHP eolcontest query params
router.get('/eoltest', jwtMiddleware.verifyToken, (req, res, next) => {
    const section = req.query.section;
    const action = req.query.action;
    if (section === 'business' && action === 'eolcontest') {
        return res.redirect('/eol/eoltest/eolcontest');
    }
    return next();
});

// System home
router.get('/eoltest', jwtMiddleware.verifyToken, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/index.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'EOL System',
        script: '/assets/js/pages/eol/eoltest/index.js',
    });
});

// Admin placeholder (no view yet)
router.get('/eoltest/manage_admin', jwtMiddleware.verifyToken, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/index.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'EOL System',
        script: '/assets/js/pages/eol/eoltest/index.js',
    });
});

// Profile
router.get('/eoltest/edit_profile', jwtMiddleware.verifyToken, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/profile.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Edit Profile | EOL System',
        script: '/assets/js/pages/eol/eoltest/profile.js',
    });
});

// Refill
router.get('/eoltest/refill', jwtMiddleware.verifyToken, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/refill.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Refill | EOL System',
        script: '/assets/js/pages/eol/eoltest/refill.js',
    });
});

// Statistics (master only). Sub-view is controlled by ?view= query.
router.get('/eoltest/statistics', jwtMiddleware.verifyToken, requireMaster, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/statistics.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Statistics | EOL System',
        script: '/assets/js/pages/eol/eoltest/statistics.js',
    });
});

// E-Test management (master or corporate)
router.get('/eoltest/e-test', jwtMiddleware.verifyToken, requireMasterOrCorporate, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/etest.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'E-Test | EOL System',
        script: '/assets/js/pages/eol/eoltest/etest.js',
    });
});

// Academic selector
router.get('/eoltest/academic', jwtMiddleware.verifyToken, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/academic.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Academic | EOL System',
        script: '/assets/js/pages/eol/eoltest/academic.js',
    });
});

// Report hub (sections/filters still use query string)
router.get('/eoltest/report', jwtMiddleware.verifyToken, (req, res) => {
    const memberIdParam = req.query.member_id ? `&member_id=${encodeURIComponent(req.query.member_id)}` : '';
    const memberIdQuery = req.query.member_id ? `?member_id=${encodeURIComponent(req.query.member_id)}` : '';
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/report/index.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        memberIdParam,
        memberIdQuery,
        script: '/assets/js/pages/eol/eoltest/report/index.js',
    })
})
router.get('/eoltest/report/academic', jwtMiddleware.verifyToken, (req, res) => {
    const memberIdParam = req.query.member_id ? `&member_id=${encodeURIComponent(req.query.member_id)}` : '';
    const memberIdQuery = req.query.member_id ? `?member_id=${encodeURIComponent(req.query.member_id)}` : '';
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/report/academic.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        memberIdParam,
        memberIdQuery,
        script: '/assets/js/pages/eol/eoltest/report/academic.js',
    })
})
router.get('/eoltest/report/standard', jwtMiddleware.verifyToken, (req, res) => {
    const memberIdParam = req.query.member_id ? `&member_id=${encodeURIComponent(req.query.member_id)}` : '';
    const memberIdQuery = req.query.member_id ? `?member_id=${encodeURIComponent(req.query.member_id)}` : '';
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/report/standard.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        memberIdParam,
        memberIdQuery,
        script: '/assets/js/pages/eol/eoltest/report/standard.js',
    })
})
router.get('/eoltest/report/contest', jwtMiddleware.verifyToken, (req, res) => {
    const memberIdParam = req.query.member_id ? `&member_id=${encodeURIComponent(req.query.member_id)}` : '';
    const memberIdQuery = req.query.member_id ? `?member_id=${encodeURIComponent(req.query.member_id)}` : '';
    res.render(path.join(__dirname, '../../../../views/page/eol/eoltest/report/contest.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        memberIdParam,
        memberIdQuery,
        script: '/assets/js/pages/eol/eoltest/report/contest.js',
    })
})
// E-learning topic switcher (legacy elearning_switch.php migration)
router.get('/elearning_switch', jwtMiddleware.verifyToken, async (req, res) => {
    try {
        const target = await elearningService.resolveElearningSwitch(req.query.skill_id, req.query.reason_id);
        return res.redirect(target);
    } catch (err) {
        return res.redirect('/lessons/elearning?section=elearning');
    }
});

router.get('/systemtest', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/systemtest/set_test.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Test & Evaluation | EOL System',
        script: '/assets/js/pages/eol/systemtest/set_test.js',
    });
});

router.get('/systemtest/set_test', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/systemtest/set_test.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Test & Evaluation | EOL System',
        script: '/assets/js/pages/eol/systemtest/set_test.js',
    });
});

router.get('/systemtest/test', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/systemtest/test.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Test & Evaluation | EOL System',
        script: '/assets/js/pages/eol/systemtest/test.js',
    });
});

router.get('/systemtest/result', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/systemtest/result.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Test & Evaluation | EOL System',
    });
});

router.get('/systemtest/:action', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, (req, res) => res.redirect('/eol/systemtest/set_test'));

router.get('/standardtest', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/standardtest/index.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Standard Test | EOL System',
        script: '/assets/js/pages/eol/standardtest/index.js',
    });
});

router.get('/standardtest/set_test', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/standardtest/set_test.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Standard Test | EOL System',
        script: '/assets/js/pages/eol/standardtest/set_test.js',
    });
});

router.get('/standardtest/test', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, (req, res) => {
    res.render(path.join(__dirname, '../../../../views/page/eol/standardtest/test.ejs'), {
        layout: path.join(__dirname, '../../../../views/layouts/system.layout.ejs'),
        title: 'Standard Test | EOL System',
        script: '/assets/js/pages/eol/standardtest/test.js',
    });
});

router.use('/eoltest/eolcontest', require('./eolcontest.routes'));

router.get('/standardtest/:action', jwtMiddleware.verifyToken, eolTestMiddleware.requireActiveTime, (req, res) => res.redirect('/eol/standardtest'));

module.exports = router;