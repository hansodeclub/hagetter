require('dotenv').config()

module.exports = {
  poweredByHeader: false,
  experimental: {
    runtime: 'nodejs',
  },
  webpack: (config, { webpack, buildId, isServer }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_BUILD_ID': JSON.stringify(buildId),
      })
    )

    return config
  },
}
