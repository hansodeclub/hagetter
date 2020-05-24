import head from '~/utils/head'

export default (req, res) => {
  const id = head(req.query.hid)
  res.status(200).json({ message: id })
}
