import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from "@vercel/kv";

import { readFileSync } from "fs"
import path from "path"

export default async function handler(req: VercelRequest, res: VercelResponse) {
	const { name } = req.query

	if(Array.isArray(name))
		return res.status(400).json({})

	if(name === "")
		return res.setHeader("Content-Type", "text/html").send(readFileSync(path.join(process.cwd(), "static", "index.html")))
	
	const redirectString = await kv.get<string>(name)

	if(redirectString === null)
		return res.setHeader("Content-Type", "text/html").send(readFileSync(path.join(process.cwd(), "static", "404.html")))

	return res.redirect("https://" + redirectString)
}