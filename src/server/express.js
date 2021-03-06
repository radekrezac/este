import React from 'react'
import compression from 'compression'
import config from './config'
import express from 'express'
import favicon from 'serve-favicon'
import render from './render'

export default function() {

  let app = express()

  app.use(compression())
  // TODO: Add favicon.
  // app.use(favicon('assets/img/favicon.ico'))
  // TODO: Move to CDN.
  app.use('/build', express.static('build'))
  app.use('/assets', express.static('assets'))

  app.get('*', (req, res) => {
    let acceptsLanguages = req.acceptsLanguages(config.appLocales)
    render(req.path, acceptsLanguages || config.defaultLocale)
      .then((result) => {
        res.status(result.status).send(result.html)
      })
      .catch((error) => {
        let msg = error.stack || error
        console.log(msg)
        res.status(500).send('500: ' + msg)
      })
  })

  app.listen(config.port)

  console.log(`App started on port ${config.port}`)

}
