import express, { Request, Response } from 'express'
import { Application } from 'express'
import bodyParser from 'body-parser'
//@ts-ignore
import esi from 'nodesi'

const server: Application = express()

server.use(bodyParser.json())

server.set('view engine', 'ejs')

server.get('/', (req: Request, res: Response) => {
	res.send('Hello')
})
server.use(esi.middleware())

server.get('/nextapp*', function (req, res) {
	res.render('about')
})

server.listen(8080, '0.0.0.0', async () => {
	console.log('starting')
	console.log('ready to listen')
})
