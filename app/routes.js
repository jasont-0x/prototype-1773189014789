const express = require('express')
const router = express.Router()

function generateReference(prefix) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let ref = prefix + '-'
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)]
  }
  return ref
}

// Start page
router.get('/', function (req, res) {
  res.render('start')
})

// Do you have an existing written agreement about child arrangements?
router.get('/have-existing-agreement', function (req, res) {
  res.render('have-existing-agreement', { errors: null, data: req.session.data })
})

router.post('/have-existing-agreement', function (req, res) {
  const answer = req.session.data['have-existing-agreement']
  if (!answer || answer.trim() === '') {
    return res.render('have-existing-agreement', {
      errors: { 'have-existing-agreement': 'Select yes if you have an existing written agreement, or no if you do not' },
      data: req.session.data
    })
  }

  if (answer === "No") {
    return res.redirect('/ineligible-have-existing-agreement')
  }
  res.redirect('/both-parents-agree')
})

// Ineligible — have-existing-agreement
router.get('/ineligible-have-existing-agreement', function (req, res) {
  res.render('ineligible-have-existing-agreement')
})

// Do both parents agree to make this arrangement legally binding?
router.get('/both-parents-agree', function (req, res) {
  res.render('both-parents-agree', { errors: null, data: req.session.data })
})

router.post('/both-parents-agree', function (req, res) {
  const answer = req.session.data['both-parents-agree']
  if (!answer || answer.trim() === '') {
    return res.render('both-parents-agree', {
      errors: { 'both-parents-agree': 'Select yes if both parents agree, or no if they do not' },
      data: req.session.data
    })
  }

  if (answer === "No") {
    return res.redirect('/ineligible-both-parents-agree')
  }
  res.redirect('/applicant-name')
})

// Ineligible — both-parents-agree
router.get('/ineligible-both-parents-agree', function (req, res) {
  res.render('ineligible-both-parents-agree')
})

// What is your full name?
router.get('/applicant-name', function (req, res) {
  res.render('applicant-name', { errors: null, data: req.session.data })
})

router.post('/applicant-name', function (req, res) {
  const answer = req.session.data['applicant-name']
  if (!answer || answer.trim() === '') {
    return res.render('applicant-name', {
      errors: { 'applicant-name': 'Enter your full name' },
      data: req.session.data
    })
  }

  res.redirect('/other-parent-name')
})

// What is the other parent's full name?
router.get('/other-parent-name', function (req, res) {
  res.render('other-parent-name', { errors: null, data: req.session.data })
})

router.post('/other-parent-name', function (req, res) {
  const answer = req.session.data['other-parent-name']
  if (!answer || answer.trim() === '') {
    return res.render('other-parent-name', {
      errors: { 'other-parent-name': 'Enter the other parent's full name' },
      data: req.session.data
    })
  }

  res.redirect('/children-details')
})

// Give details of the children this arrangement covers
router.get('/children-details', function (req, res) {
  res.render('children-details', { errors: null, data: req.session.data })
})

router.post('/children-details', function (req, res) {
  const answer = req.session.data['children-details']
  if (!answer || answer.trim() === '') {
    return res.render('children-details', {
      errors: { 'children-details': 'Enter details of the children' },
      data: req.session.data
    })
  }

  res.redirect('/check-answers')
})

// Check answers
router.get('/check-answers', function (req, res) {
  res.render('check-answers', { data: req.session.data })
})

router.post('/check-answers', function (req, res) {
  if (!req.session.data['reference']) {
    req.session.data['reference'] = generateReference('CA')
  }
  res.redirect('/confirmation')
})

// Confirmation
router.get('/confirmation', function (req, res) {
  res.render('confirmation', { data: req.session.data })
})

module.exports = router
